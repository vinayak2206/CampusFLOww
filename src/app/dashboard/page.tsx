'use client';

import { useState } from 'react';
import WelcomeHeader from "@/components/dashboard/welcome-header";
import Timetable from "@/components/dashboard/timetable";
import TodoList from "@/components/dashboard/todo-list";
import { mockUser } from "@/lib/data";
import { Button } from '@/components/ui/button';
import { CollegeTimetable } from '@/components/dashboard/college-timetable';
import { LiveStudyCard } from '@/components/dashboard/live-study-card';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';


const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const getCurrentDay = () => {
    const today = new Date().getDay();
    return weekDays[today];
}

export default function DashboardPage() {
    const {
        weeklyTimetable,
        tasks,
        moveTaskToSchedule,
        addTask,
        moveTaskToScheduleById,
        completeTask,
        deleteTask,
        replaceTaskWithNext,
        updateTimetableEntryStatus
    } = useAppContext();

    const [selectedDay, setSelectedDay] = useState<string>(getCurrentDay());
    const { toast } = useToast();
    
    const handleAddTask = (taskName: string) => {
        const moved = moveTaskToSchedule({
            id: Date.now(),
            suggestion: taskName,
            type: 'study',
            duration: 'Flexible',
            completed: false,
        }, selectedDay);

        if (!moved) {
            addTask(taskName);
        } else {
             toast({
                title: 'Task Scheduled!',
                description: `"${taskName}" has been added to your ${selectedDay} schedule.`,
            });
        }
    };

    const handleMoveTaskToSchedule = (taskId: number) => {
        const moved = moveTaskToScheduleById(taskId, selectedDay);
        if (!moved) {
             toast({
                variant: 'destructive',
                title: 'No Free Slots!',
                description: `There are no available free slots in your ${selectedDay} schedule.`,
            });
        } else {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                toast({
                    title: 'Task Scheduled!',
                    description: `"${task.suggestion}" has been added to your ${selectedDay} schedule.`,
                });
            }
        }
    };

    const handleReplaceTask = (day: string, timetableId: number) => {
        replaceTaskWithNext(day, timetableId);
    };

    const handleAttendanceChangeFromTimetable = (subjectName: string, action: 'attend' | 'miss' | 'cancel') => {
        updateTimetableEntryStatus(selectedDay, subjectName, action);
    };
    
    return (
        <div className="space-y-6">
            <WelcomeHeader name={mockUser.name} />
            
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
                        handleAttendanceChange={handleAttendanceChangeFromTimetable}
                        tasks={tasks}
                        replaceTask={handleReplaceTask}
                        selectedDay={selectedDay}
                    />
                    <CollegeTimetable />
                </div>
                <div className="space-y-6">
                    <TodoList 
                        tasks={tasks} 
                        onAddTask={handleAddTask}
                        onTaskComplete={completeTask}
                        onTaskDelete={deleteTask}
                        onMoveTask={handleMoveTaskToSchedule}
                    />
                    <LiveStudyCard />
                </div>
            </div>
        </div>
    )
}
