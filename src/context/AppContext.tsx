
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import type { TimetableEntry, Task, SubjectAttendance } from '@/lib/types';
import { auth } from '@/firebase/auth';
import { signInAnonymously } from 'firebase/auth';
import { saveTimetableDay, saveUserState, watchTimetable, watchUserState, watchUser } from '@/firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';

interface AppContextType {
    weeklyTimetable: { [key: string]: TimetableEntry[] };
    tasks: Task[];
    subjects: SubjectAttendance[];
    loading: boolean;
    moveTaskToSchedule: (task: Task, day: string) => boolean;
    addTask: (taskName: string) => void;
    moveTaskToScheduleById: (taskId: number, day: string) => boolean;
    completeTask: (taskId: number) => void;
    deleteTask: (taskId: number) => void;
    replaceTaskWithNext: (day: string, timetableId: number) => void;
    updateTimetableEntryStatus: (day: string, subjectName: string, action: 'attend' | 'miss' | 'cancel', entryId?: number) => void;
    handleAttendanceChange: (subjectName: string, action: 'attend' | 'miss') => void;
    markNextClassAttendance: (subjectName: string, action: 'attend' | 'miss' | 'cancel') => boolean;
    updateSubjectAttendance: (subjectName: string, attended: number, total: number) => void;
    addSubject: (newSubjectName: string) => void;
    resetSubject: (subjectName: string) => void;
    deleteSubject: (subjectName: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getSubjectsFromTimetable = (timetable: { [key: string]: TimetableEntry[] }): SubjectAttendance[] => {
    const subjectNames = new Set<string>();
    Object.values(timetable).flat().forEach(entry => {
        if (entry.type === 'lecture' || entry.type === 'lab') {
            subjectNames.add(entry.subject);
        }
    });

    return Array.from(subjectNames).map(name => ({
        name,
        attended: 0,
        total: 0,
    }));
};

const emptyWeeklyTimetable = (): { [key: string]: TimetableEntry[] } => ({
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
});

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();

    const [weeklyTimetable, setWeeklyTimetable] = useState<{ [key: string]: TimetableEntry[] }>(emptyWeeklyTimetable());
    const [tasks, setTasks] = useState<Task[]>([]);
    const [subjects, setSubjects] = useState<SubjectAttendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [uid, setUid] = useState<string | null>(null);
    const hydrationRef = useRef(true);
    const lastTimetableSync = useRef('');
    const lastTaskSync = useRef('');
    const guestAttemptedRef = useRef(false);

    const initialTasks: Task[] = [];

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUid(user?.uid ?? null);

            if (!user && !guestAttemptedRef.current) {
                guestAttemptedRef.current = true;
                signInAnonymously(auth).catch((error) => {
                    console.error('Anonymous sign-in failed', error);
                });
            }
        });

        return () => unsubscribe();
    }, []);

    // Redirect to onboarding if user exists but hasn't completed onboarding
    useEffect(() => {
        if (!uid) return;

        const unsub = watchUser(uid, (data) => {
            const onboarded = (data as any)?.onboarded === true;
            if (!onboarded && pathname !== '/onboarding') {
                router.push('/onboarding');
            }
        });

        return () => unsub();
    }, [uid, pathname, router]);

    useEffect(() => {
        if (!uid) {
            setWeeklyTimetable(emptyWeeklyTimetable());
            setTasks(initialTasks);
            setSubjects([]);
            setLoading(false);
            hydrationRef.current = true;
            return;
        }

        setLoading(true);

        const unsubTimetable = watchTimetable(uid, (data) => {
            if (data) {
                setWeeklyTimetable((prev) => ({ ...prev, ...(data as { [key: string]: TimetableEntry[] }) }));
            } else {
                setWeeklyTimetable(emptyWeeklyTimetable());
            }
        });

        const unsubState = watchUserState(uid, (data) => {
            const nextTasks = Array.isArray((data as { tasks?: Task[] } | null)?.tasks)
                ? ((data as { tasks?: Task[] }).tasks as Task[])
                : initialTasks;
            setTasks(nextTasks);
            setLoading(false);
            hydrationRef.current = false;
        });

        return () => {
            unsubTimetable();
            unsubState();
        };
    }, [uid]);

    // Recompute subjects whenever timetable changes
    useEffect(() => {
        setSubjects(getSubjectsFromTimetable(weeklyTimetable));
    }, [weeklyTimetable]);

    useEffect(() => {
        if (!uid || hydrationRef.current) {
            return;
        }

        const serialized = JSON.stringify(weeklyTimetable);
        if (serialized === lastTimetableSync.current) {
            return;
        }
        lastTimetableSync.current = serialized;

        Object.entries(weeklyTimetable).forEach(([day, entries]) => {
            saveTimetableDay(uid, day, entries);
        });
    }, [weeklyTimetable, uid]);

    useEffect(() => {
        if (!uid || hydrationRef.current) {
            return;
        }

        const serialized = JSON.stringify(tasks);
        if (serialized === lastTaskSync.current) {
            return;
        }
        lastTaskSync.current = serialized;

        saveUserState(uid, { tasks });
    }, [tasks, uid]);

    const moveTaskToSchedule = (task: Task, day: string) => {
        setWeeklyTimetable(prev => {
            const newWeeklyTimetable = { ...prev };
            const daySchedule = newWeeklyTimetable[day] ? [...newWeeklyTimetable[day]] : [];
            
            // Find an existing free slot first
            const freeSlotIndex = daySchedule.findIndex(entry => entry.subject === 'Free Slot');

            if (freeSlotIndex !== -1) {
                // Replace the first available free slot
                daySchedule[freeSlotIndex] = { 
                    ...daySchedule[freeSlotIndex], 
                    subject: task.suggestion, 
                    type: 'task' as const, 
                    status: 'scheduled' as const 
                };
            } else {
                // If no free slot, append the task to the end
                const lastEntry = daySchedule[daySchedule.length - 1];
                const newStartTime = lastEntry ? lastEntry.endTime : '17:00';
                const newEndTime = lastEntry ? `${parseInt(lastEntry.endTime.split(':')[0]) + 1}:00` : '18:00';

                daySchedule.push({
                    id: Date.now(),
                    day: day,
                    subject: task.suggestion,
                    startTime: newStartTime,
                    endTime: newEndTime,
                    status: 'scheduled',
                    type: 'task'
                });
            }
            
            newWeeklyTimetable[day] = daySchedule;
            return newWeeklyTimetable;
        });
        
        return true; // Assume the move is always successful now
    };

    const addTask = (taskName: string) => {
        const newTask: Task = {
            id: Date.now(),
            suggestion: taskName,
            type: 'study', // default type
            duration: 'Flexible',
            completed: false,
        };
        setTasks(prevTasks => [...prevTasks, newTask]);
    };
    
    const moveTaskToScheduleById = (taskId: number, day: string): boolean => {
        const taskToMove = tasks.find(t => t.id === taskId);
        if (taskToMove) {
            const moved = moveTaskToSchedule(taskToMove, day);
            if (moved) {
                setTasks(prev => prev.filter(t => t.id !== taskId));
                return true;
            }
        }
        return false;
    };

    const completeTask = (taskId: number) => {
        setTasks(prev => prev.map(t => t.id === taskId ? {...t, completed: !t.completed} : t));
    };

    const deleteTask = (taskId: number) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
    };

    const replaceTaskWithNext = (day: string, timetableId: number) => {
        if (tasks.length > 0) {
            const nextTask = tasks[0];
            setTasks(prev => prev.slice(1));
            setWeeklyTimetable(prev => {
                const newWeeklyTimetable = {...prev};
                const daySchedule = newWeeklyTimetable[day];
                const newDaySchedule = daySchedule.map(entry => {
                    if (entry.id === timetableId) {
                        return { ...entry, subject: nextTask.suggestion, type: 'task' as const, status: 'scheduled' as const };
                    }
                    return entry;
                })
                newWeeklyTimetable[day] = newDaySchedule;
                return newWeeklyTimetable;
            })
        }
    };
    
    const updateTimetableEntryStatus = (day: string, subjectName: string, action: 'attend' | 'miss' | 'cancel', entryId?: number) => {
        setWeeklyTimetable(prev => {
            const newWeeklyTimetable = { ...prev };
            const daySchedule = newWeeklyTimetable[day];
    
            const newDaySchedule = daySchedule.map(entry => {
                const isMatch = entryId ? entry.id === entryId : entry.subject === subjectName;
                if (isMatch && entry.status === 'scheduled') { // Only update if not already marked
                     if (entry.type === 'task') {
                         if(action === 'attend' || action === 'miss') {
                            return { ...entry, subject: 'Free Slot', type: 'break' as const, status: 'scheduled' as const };
                         }
                         return { ...entry, status: 'cancelled' as const };
                    }
                    if (action === 'cancel') {
                         return { ...entry, subject: 'Free Slot', type: 'break' as const, status: 'scheduled' as const };
                    }

                    // For lectures/labs, update attendance
                    if (entry.type === 'lecture' || entry.type === 'lab') {
                        handleAttendanceChange(entry.subject, action as 'attend' | 'miss');
                        return { ...entry, status: action === 'attend' ? 'attended' as const : 'missed' as const };
                    }
                }
                return entry;
            });
    
            newWeeklyTimetable[day] = newDaySchedule;
            return newWeeklyTimetable;
        });
    };
    
    const handleAttendanceChange = (subjectName: string, action: 'attend' | 'miss') => {
        setSubjects((prevSubjects) =>
          prevSubjects.map((subject) => {
            if (subject.name === subjectName) {
              const newAttended = action === 'attend' ? subject.attended + 1 : subject.attended;
              const newTotal = subject.total + 1;
              return { ...subject, attended: newAttended, total: newTotal };
            }
            return subject;
          })
        );
    };

        const markNextClassAttendance = (subjectName: string, action: 'attend' | 'miss' | 'cancel') => {
                const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const today = weekDays[new Date().getDay()];
                const daySchedule = weeklyTimetable[today] || [];
                const nextEntry = daySchedule.find(entry =>
                        entry.subject === subjectName &&
                        entry.status === 'scheduled' &&
                        (entry.type === 'lecture' || entry.type === 'lab')
                );

                if (!nextEntry) {
                        return false;
                }

                updateTimetableEntryStatus(today, subjectName, action, nextEntry.id);
                return true;
        };

    const updateSubjectAttendance = (subjectName: string, attended: number, total: number) => {
        setSubjects(prev => prev.map(s => s.name === subjectName ? { ...s, attended, total } : s));
    };

    const addSubject = (newSubjectName: string) => {
        if (newSubjectName.trim() === '' || subjects.some(s => s.name === newSubjectName)) return;
        setSubjects((prev) => [...prev, { name: newSubjectName, attended: 0, total: 0 }]);
    };

    const resetSubject = (subjectName: string) => {
        setSubjects((prev) => prev.map((s) => (s.name === subjectName ? { ...s, attended: 0, total: 0 } : s)));
    };

    const deleteSubject = (subjectName: string) => {
        setSubjects((prev) => prev.filter((s) => s.name !== subjectName));
    };


    const value = {
        weeklyTimetable,
        tasks,
        subjects,
        loading,
        moveTaskToSchedule,
        addTask,
        moveTaskToScheduleById,
        completeTask,
        deleteTask,
        replaceTaskWithNext,
        updateTimetableEntryStatus,
        handleAttendanceChange,
        markNextClassAttendance,
        updateSubjectAttendance,
        addSubject,
        resetSubject,
        deleteSubject
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppStateProvider');
    }
    return context;
};
