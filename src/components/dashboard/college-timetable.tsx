'use client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { useAppContext } from '@/context/AppContext';

  export function CollegeTimetable() {
    const { weeklyTimetable } = useAppContext();

    const weekdays = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

    const hasAny = weekdays.some(day => (weeklyTimetable[day] || []).length > 0);

    if (!hasAny) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">College Timetable</CardTitle>
            <CardDescription>
              Your complete weekly college schedule.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">No timetable available. Upload your timetable to populate this view.</div>
          </CardContent>
        </Card>
      );
    }

    // collect unique time ranges across weekdays
    const timeSet = new Set<string>();
    weekdays.forEach(day => {
      (weeklyTimetable[day] || []).forEach(entry => {
        const timeRange = `${entry.startTime} - ${entry.endTime}`;
        timeSet.add(timeRange);
      });
    });

    const timeRanges = Array.from(timeSet).sort();

    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">College Timetable</CardTitle>
          <CardDescription>
            Your complete weekly college schedule.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Monday</TableHead>
                <TableHead>Tuesday</TableHead>
                <TableHead>Wednesday</TableHead>
                <TableHead>Thursday</TableHead>
                <TableHead>Friday</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeRanges.map(time => (
                <TableRow key={time}>
                  <TableCell className="font-medium">{time}</TableCell>
                  {weekdays.map(day => {
                    const entry = (weeklyTimetable[day] || []).find(e => `${e.startTime} - ${e.endTime}` === time);
                    return <TableCell key={day}>{entry ? entry.subject : ''}</TableCell>;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }
  