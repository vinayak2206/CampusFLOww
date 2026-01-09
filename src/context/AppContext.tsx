
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { TimetableEntry, Task, SubjectAttendance } from '@/lib/types';
import { mockWeeklyTimetable } from '@/lib/data';

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
    updateTimetableEntryStatus: (day: string, subjectName: string, action: 'attend' | 'miss' | 'cancel') => void;
    handleAttendanceChange: (subjectName: string, action: 'attend' | 'miss') => void;
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
        name: name,
        attended: Math.floor(Math.random() * 10) + 15,
        total: Math.floor(Math.random() * 5) + 25,
    }));
};

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
    const [weeklyTimetable, setWeeklyTimetable] = useState<{ [key: string]: TimetableEntry[] }>(mockWeeklyTimetable);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [subjects, setSubjects] = useState<SubjectAttendance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setSubjects(getSubjectsFromTimetable(mockWeeklyTimetable));
        const initialTasks: Task[] = [
            { id: 1, suggestion: 'Review DSA Lecture 5', type: 'study', duration: '30m', completed: false },
            { id: 2, suggestion: 'Finish Compiler Design assignment', type: 'coding', duration: '1h', completed: false },
        ];
        setTasks(initialTasks);
        setLoading(false);
    }, []);

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
    
    const updateTimetableEntryStatus = (day: string, subjectName: string, action: 'attend' | 'miss' | 'cancel') => {
        setWeeklyTimetable(prev => {
            const newWeeklyTimetable = { ...prev };
            const daySchedule = newWeeklyTimetable[day];
    
            const newDaySchedule = daySchedule.map(entry => {
                if (entry.subject === subjectName && entry.status === 'scheduled') { // Only update if not already marked
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
                        handleAttendanceChange(subjectName, action as 'attend' | 'miss');
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
