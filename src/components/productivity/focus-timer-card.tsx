'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { Progress } from '@/components/ui/progress-ring';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';


export function FocusTimerCard() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [subject, setSubject] = useState('');
  const [taskType, setTaskType] = useState('');
  
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const totalSeconds = minutes * 60 + seconds;
  const progress = (totalSeconds / initialTime) * 100;

  const liveSessionRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, `liveStudySessions/${user.uid}`);
  }, [user, firestore]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((s) => s - 1);
        } else if (minutes > 0) {
          setMinutes((m) => m - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsActive(false);
          toast({
            title: 'Session Complete!',
            description: `Great job focusing for ${initialTime / 60} minutes.`,
          });
          if (user && firestore) {
            const focusSession = {
                userId: user.uid,
                subject,
                taskType,
                startTime: serverTimestamp(),
                endTime: serverTimestamp(),
                duration: initialTime / 60,
                interrupted: false,
            };
            const sessionsRef = collection(firestore, `users/${user.uid}/focusSessions`);
            addDocumentNonBlocking(sessionsRef, focusSession);
            
            const userRef = doc(firestore, `users/${user.uid}`);
            updateDocumentNonBlocking(userRef, { productivityScore: increment(5) });

            if (liveSessionRef) {
                deleteDocumentNonBlocking(liveSessionRef);
            }
          }
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, isPaused, minutes, seconds, initialTime, toast, user, firestore, subject, taskType, liveSessionRef]);
  
  const setTime = useCallback((newMinutes: number) => {
    if (isActive) return;
    const clampedMinutes = Math.max(5, Math.min(120, newMinutes));
    setMinutes(clampedMinutes);
    setSeconds(0);
    setInitialTime(clampedMinutes * 60);
  }, [isActive]);


  const handleStart = () => {
    if ((minutes === 0 && seconds === 0) || !subject || !taskType) {
        toast({
            variant: 'destructive',
            title: 'Missing information',
            description: 'Please select a subject and task type before starting.',
        })
        return;
    }
    const calculatedInitialTime = minutes * 60 + seconds;
    setInitialTime(calculatedInitialTime);
    setIsActive(true);
    setIsPaused(false);
    
    if (liveSessionRef) {
        const endTime = new Date();
        endTime.setSeconds(endTime.getSeconds() + calculatedInitialTime);
        addDocumentNonBlocking(liveSessionRef, {
            subject: subject,
            remainingTime: minutes,
            endTime: endTime.toISOString(),
            userId: user?.uid,
            id: user?.uid,
        });
    }
  };
  
  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    if (user && firestore) {
        const focusSession = {
            userId: user.uid,
            subject,
            taskType,
            startTime: serverTimestamp(),
            endTime: serverTimestamp(),
            duration: Math.round((initialTime - totalSeconds) / 60),
            interrupted: true,
        };
        const sessionsRef = collection(firestore, `users/${user.uid}/focusSessions`);
        addDocumentNonBlocking(sessionsRef, focusSession);
        
        const userRef = doc(firestore, `users/${user.uid}`);
        updateDocumentNonBlocking(userRef, { productivityScore: increment(-1) });
    }

    setIsActive(false);
    setIsPaused(false);
    setTime(25);
    setSubject('');
    setTaskType('');

    if (liveSessionRef) {
        deleteDocumentNonBlocking(liveSessionRef);
    }
  };

  const timePresets = [15, 25, 50, 60];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Timer />
            Focus Zone
        </CardTitle>
        <CardDescription>
          Select a subject and task, then start a timed session.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-6">
        <div className="relative">
            <Progress 
                value={progress}
                size={200}
                strokeWidth={10}
                className={cn(isActive && !isPaused ? "text-primary" : "text-muted")}
            />
            <div className="absolute inset-0 flex items-center justify-center font-mono text-5xl font-bold">
                <span>{String(minutes).padStart(2, '0')}</span>
                <span>:</span>
                <span>{String(seconds).padStart(2, '0')}</span>
            </div>
        </div>
        <div className="w-full space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Select value={subject} onValueChange={setSubject} disabled={isActive}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Data Structures">Data Structures</SelectItem>
                        <SelectItem value="Algorithms">Algorithms</SelectItem>
                        <SelectItem value="Operating Systems">Operating Systems</SelectItem>
                        <SelectItem value="Compiler Design">Compiler Design</SelectItem>
                        <SelectItem value="Mathematics-3">Mathematics-3</SelectItem>
                    </SelectContent>
                </Select>
                 <Select value={taskType} onValueChange={setTaskType} disabled={isActive}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Task Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Study">Study</SelectItem>
                        <SelectItem value="Coding">Coding</SelectItem>
                        <SelectItem value="Assignment">Assignment</SelectItem>
                        <SelectItem value="Revision">Revision</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center justify-center gap-2">
                 <Button variant="outline" size="icon" onClick={() => setTime(minutes - 5)} disabled={isActive}>
                    <Minus className="h-4 w-4" />
                </Button>
                <Input 
                    type="number"
                    className="w-24 text-center text-lg"
                    value={minutes}
                    onChange={(e) => setTime(parseInt(e.target.value, 10))}
                    disabled={isActive}
                />
                 <Button variant="outline" size="icon" onClick={() => setTime(minutes + 5)} disabled={isActive}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
                {timePresets.map(preset => (
                    <Button key={preset} variant="outline" onClick={() => setTime(preset)} disabled={isActive}>
                        {preset}m
                    </Button>
                ))}
            </div>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-4">
        {!isActive ? (
            <Button onClick={handleStart} className="col-span-2" disabled={!user}>
                <Play className="mr-2 h-4 w-4" /> not working
            </Button>
        ) : (
            <>
                <Button onClick={handlePauseResume}>
                    {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                    {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button variant="destructive" onClick={handleReset}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Give Up
                </Button>
            </>
        )}
      </CardFooter>
    </Card>
  );
}
