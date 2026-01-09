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
import { Progress } from '@/components/ui/progress-ring';
import type { SubjectAttendance } from '@/lib/types';
import { format } from 'date-fns';
import { Check, X, Pencil, Save, MoreVertical, RotateCcw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { Input } from '../ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { useAppContext } from '@/context/AppContext';

type AttendanceManagerProps = {
  subjects: SubjectAttendance[];
  loading: boolean;
  onManualUpdate: (
    subjectName: string,
    attended: number,
    total: number
  ) => void;
  onReset: (subjectName: string) => void;
  onDelete: (subjectName: string) => void;
  targetAttendance: number;
};

export function AttendanceManager({
  subjects,
  loading,
  onManualUpdate,
  onReset,
  onDelete,
  targetAttendance,
}: AttendanceManagerProps) {
  const [editing, setEditing] = useState<
    { subject: string; attended: string; total: string } | undefined
  >(undefined);

  const { handleAttendanceChange } = useAppContext();

  const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
  const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
  const overallAttendance =
    totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;

  const handleEdit = (subject: SubjectAttendance) => {
    setEditing({
      subject: subject.name,
      attended: String(subject.attended),
      total: String(subject.total),
    });
  };

  const handleSave = () => {
    if (editing) {
      const attended = parseInt(editing.attended, 10);
      const total = parseInt(editing.total, 10);
      if (!isNaN(attended) && !isNaN(total) && total >= attended) {
        onManualUpdate(editing.subject, attended, total);
        setEditing(undefined);
      }
    }
  };

  const getStatus = (attended: number, total: number) => {
    if (total === 0) {
        return {
            text: 'No classes yet',
            isOnTrack: true
        }
    }
    const currentPercentage = (attended / total) * 100;
    if (currentPercentage >= targetAttendance) {
      const canMiss = Math.floor(
        (attended - targetAttendance * 0.01 * total) /
          (targetAttendance * 0.01)
      );
      if (canMiss > 0) {
        return {
          text: `On Track, You may leave next ${canMiss} class${
            canMiss > 1 ? 'es' : ''
          }`,
          isOnTrack: true,
        };
      }
      return {
        text: "On Track, but can't miss the next class",
        isOnTrack: true,
      };
    } else {
      const needed = Math.ceil(
        (targetAttendance * 0.01 * total - attended) /
          (1 - targetAttendance * 0.01)
      );
      return {
        text: `You need to attend next ${needed} class${
          needed > 1 ? 'es' : ''
        }`,
        isOnTrack: false,
      };
    }
  };

  if (loading) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardDescription>Target: {targetAttendance}%</CardDescription>
              <Skeleton className="h-7 w-48 mt-1" />
              <div className="text-sm text-muted-foreground mt-1">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card
              key={i}
              className="bg-card-foreground/5 dark:bg-card-foreground/10"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <Skeleton className="w-1.5 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-[60px] w-[60px] rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardDescription>Target: {targetAttendance}%</CardDescription>
            <CardTitle className="font-bold text-lg">
              Total Attendance: {overallAttendance.toFixed(2)}%
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {format(new Date(), 'dd MMM, yyyy')}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {subjects.map((subject) => {
          const attendancePercentage =
            subject.total > 0 ? (subject.attended / subject.total) * 100 : 0;
          const status = getStatus(subject.attended, subject.total);
          const isEditingThis = editing?.subject === subject.name;

          return (
            <Card
              key={subject.name}
              className="bg-card-foreground/5 dark:bg-card-foreground/10"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={cn(
                    'w-1.5 h-12 rounded-full',
                    status.isOnTrack ? 'bg-green-500' : 'bg-red-500'
                  )}
                />
                <div className="flex-1">
                  <p className="font-bold text-lg">{subject.name}</p>
                  {isEditingThis ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="number"
                        value={editing.attended}
                        onChange={(e) =>
                          setEditing({ ...editing, attended: e.target.value })
                        }
                        className="h-8 w-20"
                      />
                      <span className="text-muted-foreground">/</span>
                      <Input
                        type="number"
                        value={editing.total}
                        onChange={(e) =>
                          setEditing({ ...editing, total: e.target.value })
                        }
                        className="h-8 w-20"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Attendance: {subject.attended}/{subject.total}
                    </p>
                  )}
                  <p
                    className={cn(
                      'text-sm',
                      status.isOnTrack ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    Status: {status.text}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Progress
                    value={attendancePercentage}
                    size={60}
                    strokeWidth={6}
                    className={cn(
                      status.isOnTrack ? 'text-green-500' : 'text-red-500'
                    )}
                  />
                  {!isEditingThis ? (
                  <>
                    <Button size="icon" className="h-8 w-8 bg-green-500/20 text-green-700 hover:bg-green-500/30" onClick={() => handleAttendanceChange(subject.name, 'attend')}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" className="h-8 w-8 bg-red-500/20 text-red-700 hover:bg-red-500/30" onClick={() => handleAttendanceChange(subject.name, 'miss')}>
                      <X className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => handleEdit(subject)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onReset(subject.name)}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Reset
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                         <DropdownMenuItem onSelect={() => onDelete(subject.name)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                  ) : (
                     <Button size="icon" className="h-8 w-8" onClick={handleSave}>
                       <Save className="h-4 w-4" />
                     </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
