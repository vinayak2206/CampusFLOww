'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockTimetable } from '@/lib/data';
import type { TimetableEntry } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, Book, FlaskConical, Coffee, Sparkles } from 'lucide-react';

const typeIconMapping = {
  lecture: Book,
  lab: FlaskConical,
  break: Coffee,
};

export default function Timetable() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>(mockTimetable);

  const toggleStatus = (id: number) => {
    setTimetable((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              status: entry.status === 'scheduled' ? 'cancelled' : 'scheduled',
            }
          : entry
      )
    );
  };

  const isFreeSlot = (entry: TimetableEntry) => {
    return entry.type === 'break' || entry.status === 'cancelled';
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
            const Icon = typeIconMapping[entry.type as keyof typeof typeIconMapping] || Clock;
            const isFree = isFreeSlot(entry);

            return (
              <li
                key={entry.id}
                className={cn(
                  'flex items-center space-x-4 rounded-lg border p-4 transition-all',
                   isFree ? 'bg-accent/10 border-accent/20' : 'bg-card'
                )}
              >
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", isFree ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary")}>
                    {isFree ? <Sparkles className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>

                <div className="flex-1">
                  <p className="font-semibold">{entry.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.startTime} - {entry.endTime}
                  </p>
                </div>

                {entry.type !== 'break' && (
                  <Button
                    variant={entry.status === 'scheduled' ? 'outline' : 'destructive'}
                    size="sm"
                    onClick={() => toggleStatus(entry.id)}
                  >
                    {entry.status === 'scheduled' ? 'Cancel' : 'Cancelled'}
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
