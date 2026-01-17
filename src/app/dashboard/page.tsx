'use client';

import { useState } from 'react';
import WelcomeHeader from "@/components/dashboard/welcome-header";
import Timetable from "@/components/dashboard/timetable";
import TodoList from "@/components/dashboard/todo-list";
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
        addTask(taskName);
        toast({
            title: 'Task Added!',
            description: `"${taskName}" has been added to your todo list.`,
        });
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

    const handleAttendanceChangeFromTimetable = (subjectName: string, action: 'attend' | 'miss' | 'cancel', entryId: number) => {
        updateTimetableEntryStatus(selectedDay, subjectName, action, entryId);

        if (subjectName !== 'Free Slot' && action === 'attend') {
            let toastHandle: { dismiss: () => void } | null = null;

            toastHandle = toast({
                className:
                    'border-[#d6c9ff] bg-gradient-to-br from-[#f1e9ff] to-[#ded3ff] text-[#4b3a7a] shadow-[0_10px_30px_rgba(124,92,255,0.2)]',
                title: (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">AI Suggestion</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff4d6d]/10 text-[#ff4d6d]">
                            HIGH PRIORITY
                        </span>
                    </div>
                ),
                description: (
                    <div className="mt-1 space-y-3">
                        <p className="text-sm text-[#5a4a86]">
                            Marked present, would you like to add work from ToDo?
                        </p>
                        <div className="flex items-center justify-between pt-1">
                            <button
                                type="button"
                                className="text-sm text-[#6b5aa0] hover:text-[#5a4a86]"
                                onClick={() => toastHandle?.dismiss()}
                            >
                                Dismiss
                            </button>
                            <button
                                type="button"
                                className="text-sm font-semibold px-4 py-2 rounded-full bg-[#5b3df5] text-white shadow-sm hover:bg-[#4c33d8]"
                                onClick={() => {
                                    const secondTask = tasks[1];
                                    if (secondTask) {
                                        moveTaskToScheduleById(secondTask.id, selectedDay);
                                    }
                                    toastHandle?.dismiss();
                                }}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                ),
            });
            return;
        }

        if (subjectName !== 'Free Slot') {
            const entry = (weeklyTimetable[selectedDay] || []).find((e) => e.id === entryId);
            const startTime = entry?.startTime ?? '02:00 PM';
            const endTime = entry?.endTime ?? '03:30 PM';
            const subject = entry?.subject ?? subjectName;

            const parseTime = (value: string) => {
                const [hRaw, mRaw] = value.split(':');
                const hours = Number(hRaw);
                const minutes = Number(mRaw);
                return Number.isFinite(hours) && Number.isFinite(minutes) ? hours * 60 + minutes : null;
            };

            const formatTime = (value: string) => {
                const [hRaw, mRaw] = value.split(':');
                const hours = Number(hRaw);
                const minutes = Number(mRaw);
                if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return value;
                const period = hours >= 12 ? 'PM' : 'AM';
                const hour12 = ((hours + 11) % 12) + 1;
                const minuteText = minutes.toString().padStart(2, '0');
                return `${hour12}:${minuteText} ${period}`;
            };

            const startMinutes = parseTime(startTime);
            const endMinutes = parseTime(endTime);
            const duration = startMinutes !== null && endMinutes !== null && endMinutes > startMinutes
                ? endMinutes - startMinutes
                : 90;

            const displayStartTime = formatTime(startTime);
            const displayEndTime = formatTime(endTime);

            let toastHandle: { dismiss: () => void } | null = null;

            toastHandle = toast({
                className:
                    'border-[#d6c9ff] bg-gradient-to-br from-[#f1e9ff] to-[#ded3ff] text-[#4b3a7a] shadow-[0_10px_30px_rgba(124,92,255,0.2)]',
                title: (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">AI Suggestion</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff4d6d]/10 text-[#ff4d6d]">
                            HIGH PRIORITY
                        </span>
                    </div>
                ),
                description: (
                    <div className="mt-1 space-y-3">
                        <p className="text-sm text-[#5a4a86]">
                            You have a {duration}-minute free slot from {displayStartTime} to {displayEndTime}. Perfect time to work on your {subject} project which is due in 3 days.
                        </p>
                        <div className="flex items-center justify-between pt-1">
                            <button
                                type="button"
                                className="text-sm text-[#6b5aa0] hover:text-[#5a4a86]"
                                onClick={() => toastHandle?.dismiss()}
                            >
                                Dismiss
                            </button>
                            <button
                                type="button"
                                className="text-sm font-semibold px-4 py-2 rounded-full bg-[#5b3df5] text-white shadow-sm hover:bg-[#4c33d8]"
                                onClick={() => toastHandle?.dismiss()}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                ),
            });
        }
    };
    
    return (
        <div className="space-y-6">
            <WelcomeHeader />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
