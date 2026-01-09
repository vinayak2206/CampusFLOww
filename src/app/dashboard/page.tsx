'use client';

import { useState } from 'react';
import WelcomeHeader from "@/components/dashboard/welcome-header";
import QuickStats from "@/components/dashboard/quick-stats";
import Timetable from "@/components/dashboard/timetable";
import TodoList from "@/components/dashboard/todo-list";
import { mockUser, mockWeeklyTimetable } from "@/lib/data";
import type { TimetableEntry, Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CollegeTimetable } from '@/components/dashboard/college-timetable';
import { LiveStudyCard } from '@/components/dashboard/live-study-card';
import { LeaderboardCard } from '@/components/dashboard/leaderboard-card';


const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const getCurrentDay = () => {
    const today = new Date().getDay();
    return weekDays[today];
}

export default function DashboardPage() {
    const [weeklyTimetable, setWeeklyTimetable] = useState<{ [key: string]: TimetableEntry[] }>(mockWeeklyTimetable);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedDay, setSelectedDay] = useState<string>(getCurrentDay());

    const handleAddTask = (taskName: string) => {
        const newTask: Task = {
            id: Date.now(),
            suggestion: taskName,
            type: 'study', // default type
            duration: 'Flexible',
            completed: false,
        };

        let taskAddedToTimetable = false;
        
        setWeeklyTimetable(prev => {
            const newWeeklyTimetable = { ...prev };
            const daySchedule = newWeeklyTimetable[selectedDay];

            const newDaySchedule = daySchedule.map(entry => {
                if (!taskAddedToTimetable && entry.subject === 'Free Slot') {
                    taskAddedToTimetable = true;
                    return {
                        ...entry,
                        subject: taskName,
                        type: 'task',
                    };
                }
                return entry;
            });
            
            newWeeklyTimetable[selectedDay] = newDaySchedule;
            return newWeeklyTimetable;
        });


        if (!taskAddedToTimetable) {
            setTasks(prevTasks => [...prevTasks, newTask]);
        }
    };
    
    const handleReplaceTask = (day: string, timetableId: number) => {
        if (tasks.length > 0) {
            const nextTask = tasks[0];
            setTasks(prev => prev.slice(1));
            setWeeklyTimetable(prev => {
                const newWeeklyTimetable = {...prev};
                const daySchedule = newWeeklyTimetable[day];
                const newDaySchedule = daySchedule.map(entry => {
                    if (entry.id === timetableId) {
                        return {
                            ...entry,
                            subject: nextTask.suggestion,
                            type: 'task',
                            status: 'scheduled',
                        }
                    }
                    return entry;
                })
                newWeeklyTimetable[day] = newDaySchedule;
                return newWeeklyTimetable;
            })
        }
    };

    const toggleTimetableStatus = (day: string, id: number) => {
        setWeeklyTimetable(prev => {
            const newWeeklyTimetable = {...prev};
            const daySchedule = newWeeklyTimetable[day];
            const originalDaySchedule = mockWeeklyTimetable[day];

            const newDaySchedule = daySchedule.map(entry => {
                if (entry.id === id) {
                    if (entry.status === 'scheduled') {
                        return { ...entry, status: 'cancelled' };
                    } else {
                        const originalEntry = originalDaySchedule.find(e => e.id === id);
                        return { ...entry, status: 'scheduled', subject: originalEntry?.subject || 'Free Slot', type: originalEntry?.type || 'break' };
                    }
                }
                return entry;
            })

            newWeeklyTimetable[day] = newDaySchedule;
            return newWeeklyTimetable;
        });
    };
    
    return (
        <div className="space-y-6">
            <WelcomeHeader name={mockUser.name} />
            <QuickStats 
                productivityScore={mockUser.productivityScore} 
                cgpa={mockUser.cgpa} 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex gap-2 items-center flex-wrap">
                        {weekDays.map(day => (
                            <Button 
                                key={day}
                                variant={selectedDay === day ? 'default' : 'outline'}
                                onClick={() => setSelectedDay(day)}
                            >
                                {day}
                            </Button>
                        ))}
                    </div>
                    <Timetable 
                        timetable={weeklyTimetable[selectedDay]} 
                        toggleStatus={toggleTimetableStatus}
                        tasks={tasks}
                        replaceTask={handleReplaceTask}
                        selectedDay={selectedDay}
                    />
                    <CollegeTimetable />
                </div>
                <div className="space-y-6">
                    <LiveStudyCard />
                    <LeaderboardCard />
                    <TodoList tasks={tasks} onAddTask={handleAddTask} />
                </div>
            </div>
        </div>
    )
}
