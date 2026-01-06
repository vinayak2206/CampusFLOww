'use client';

import { useState } from 'react';
import WelcomeHeader from "@/components/dashboard/welcome-header";
import QuickStats from "@/components/dashboard/quick-stats";
import Timetable from "@/components/dashboard/timetable";
import TodoList from "@/components/dashboard/todo-list";
import { mockUser, mockTimetable } from "@/lib/data";
import type { TimetableEntry, Task } from '@/lib/types';

export default function DashboardPage() {
    const [timetable, setTimetable] = useState<TimetableEntry[]>(mockTimetable);
    const [tasks, setTasks] = useState<Task[]>([]);

    const handleAddTask = (taskName: string) => {
        const newTask: Task = {
            id: Date.now(),
            suggestion: taskName,
            type: 'study', // default type
            duration: 'Flexible',
            completed: false,
        };

        let taskAddedToTimetable = false;
        const newTimetable = timetable.map(entry => {
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

        if (taskAddedToTimetable) {
            setTimetable(newTimetable);
        } else {
            // If no free slot, just add to tasks list
            setTasks(prevTasks => [...prevTasks, newTask]);
        }
    };
    
    const handleReplaceTask = (timetableId: number) => {
        if (tasks.length > 0) {
            const nextTask = tasks[0];
            setTasks(prev => prev.slice(1));
            setTimetable(prevTimetable => {
                return prevTimetable.map(entry => {
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
            })
        }
    };

    const toggleTimetableStatus = (id: number) => {
        setTimetable(prev =>
            prev.map(entry => {
                if (entry.id === id) {
                    const originalEntry = mockTimetable.find(e => e.id === id);
                    if (entry.status === 'scheduled') {
                        return { ...entry, status: 'cancelled' };
                    } else {
                        // If it was cancelled, revert it back. If it was a task, it will become a free slot.
                         return { ...entry, status: 'scheduled', subject: originalEntry?.subject || 'Free Slot', type: originalEntry?.type || 'break' };
                    }
                }
                return entry;
            })
        );
    };
    
    return (
        <div className="space-y-6">
            <WelcomeHeader name={mockUser.name} />
            <QuickStats 
                productivityScore={mockUser.productivityScore} 
                academicRisk={mockUser.academicRisk} 
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Timetable 
                    timetable={timetable} 
                    toggleStatus={toggleTimetableStatus}
                    tasks={tasks}
                    replaceTask={handleReplaceTask}
                />
                <TodoList tasks={tasks} onAddTask={handleAddTask} />
            </div>
        </div>
    )
}
