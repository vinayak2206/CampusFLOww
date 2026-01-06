'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { TimetableEntry, Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, Book, FlaskConical, Coffee, Sparkles } from 'lucide-react';

const typeIconMapping = {
  lecture: Book,
  lab: FlaskConical,
  break: Coffee,
  task: Sparkles,
};

type TimetableProps = {
  timetable: TimetableEntry[];
  toggleStatus: (id: number) => void;
  tasks: Task[];
  replaceTask: (id: number) => void;
};

export default function Timetable({ timetable, toggleStatus, tasks, replaceTask }: TimetableProps) {

  const isFreeSlot = (entry: TimetableEntry) => {
    return entry.type === 'break' && entry.subject === 'Free Slot';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Today's Schedule</CardTitle>
        <CardDescription>
          Here is your schedule for today. Mark classes as cancelled to find free slots.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {timetable.map((entry) => {
            const Icon = typeIconMapping[entry.type as keyof typeof typeIconmapping] || Clock;
            const isFree = isFreeSlot(entry);
            const isCancelled = entry.status === 'cancelled';

            return (
              <li
                key={entry.id}
                className={cn(
                  'flex items-center space-x-4 rounded-lg border p-4 transition-all',
                   isFree ? 'bg-accent/10 border-accent/20' : 'bg-card',
                   isCancelled ? 'bg-muted/50 border-dashed' : ''
                )}
              >
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", isFree || entry.type === 'task' ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary")}>
                    {isFree ? <Sparkles className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>

                <div className="flex-1">
                  <p className={cn("font-semibold", isCancelled && "line-through")}>{entry.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.startTime} - {entry.endTime}
                  </p>
                </div>

                {entry.type !== 'break' && (
                  <div className="flex gap-2">
                    {isCancelled ? (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleStatus(entry.id)}
                                >
                                Restore
                            </Button>
                            {tasks.length > 0 && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => replaceTask(entry.id)}
                                >
                                    Replace
                                </Button>
                            )}
                        </>
                    ) : (
                        <Button
                            variant={'outline'}
                            size="sm"
                            onClick={() => toggleStatus(entry.id)}
                        >
                            Cancel
                        </Button>
                    )}
                   </div>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
