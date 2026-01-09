import type { User, TimetableEntry, SubjectAttendance } from './types';

export const mockUser: User = {
  name: 'Alex Doe',
  year: '3rd Year',
  branch: 'Computer Science',
  hostel: 'Galaxy Hostel',
  productivityScore: 78,
  cgpa: 8.5,
  avatarUrl: 'https://picsum.photos/seed/1/100/100',
};

export const mockTimetable: TimetableEntry[] = [
  {
    id: 1,
    day: 'Monday',
    subject: 'Data Structures',
    startTime: '09:00',
    endTime: '10:00',
    status: 'scheduled',
    type: 'lecture',
  },
  {
    id: 2,
    day: 'Monday',
    subject: 'Algorithms',
    startTime: '10:00',
    endTime: '11:00',
    status: 'scheduled',
    type: 'lecture',
  },
  {
    id: 3,
    day: 'Monday',
    subject: 'Free Slot',
    startTime: '11:00',
    endTime: '12:00',
    status: 'scheduled',
    type: 'break',
  },
  {
    id: 4,
    day: 'Monday',
    subject: 'Operating Systems Lab',
    startTime: '12:00',
    endTime: '14:00',
    status: 'scheduled',
    type: 'lab',
  },
  {
    id: 5,
    day: 'Monday',
    subject: 'Lunch Break',
    startTime: '14:00',
    endTime: '15:00',
    status: 'scheduled',
    type: 'break',
  },
  {
    id: 6,
    day: 'Monday',
    subject: 'Mathematics-3',
    startTime: '15:00',
    endTime: '16:00',
    status: 'scheduled',
    type: 'lecture',
  },
];


const baseSchedule: Omit<TimetableEntry, 'id' | 'day'>[] = [
  { subject: 'Data Structures', startTime: '09:00', endTime: '10:00', status: 'scheduled', type: 'lecture' },
  { subject: 'Algorithms', startTime: '10:00', endTime: '11:00', status: 'scheduled', type: 'lecture' },
  { subject: 'Operating Systems Lab', startTime: '12:00', endTime: '14:00', status: 'scheduled', type: 'lab' },
  { subject: 'Lunch Break', startTime: '14:00', endTime: '15:00', status: 'scheduled', type: 'break' },
  { subject: 'Mathematics-3', startTime: '15:00', endTime: '16:00', status: 'scheduled', type: 'lecture' },
  { subject: 'Compiler Design', startTime: '16:00', endTime: '17:00', status: 'scheduled', type: 'lecture' },
  { subject: 'Free Slot', startTime: '17:00', endTime: '18:00', status: 'scheduled', type: 'break' },
];

const generateFullWeek = (): { [key: string]: TimetableEntry[] } => {
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weeklyTimetable: { [key: string]: TimetableEntry[] } = {};
  let idCounter = 1;

  weekDays.forEach(day => {
    if (day === 'Sunday' || day === 'Saturday') {
      weeklyTimetable[day] = [];
    } else {
        const daySchedule = [...baseSchedule];
        if (day === 'Tuesday' || day === 'Thursday') {
            daySchedule[2] = { subject: 'DBMS Lab', startTime: '12:00', endTime: '14:00', status: 'scheduled', type: 'lab' };
        }
         if (day === 'Friday') {
            daySchedule[4] = { subject: 'Data Structures', startTime: '15:00', endTime: '16:00', status: 'scheduled', type: 'lecture' };
        }
      weeklyTimetable[day] = daySchedule.map(entry => ({
        ...entry,
        id: idCounter++,
        day: day,
      }));
    }
  });

  return weeklyTimetable;
};

export const mockWeeklyTimetable = generateFullWeek();

export const collegeTimetableData = [
    { time: '09:00 - 10:00', mon: 'Data Structures', tue: 'Algorithms', wed: 'Data Structures', thu: 'Algorithms', fri: 'Data Structures' },
    { time: '10:00 - 11:00', mon: 'Algorithms', tue: 'Data Structures', wed: 'Algorithms', thu: 'Data Structures', fri: 'Algorithms' },
    { time: '11:00 - 12:00', mon: 'Break', tue: 'Break', wed: 'Break', thu: 'Break', fri: 'Break' },
    { time: '12:00 - 14:00', mon: 'OS Lab', tue: 'DBMS Lab', wed: 'OS Lab', thu: 'DBMS Lab', fri: 'OS Lab' },
    { time: '14:00 - 15:00', mon: 'Lunch', tue: 'Lunch', wed: 'Lunch', thu: 'Lunch', fri: 'Lunch' },
    { time: '15:00 - 16:00', mon: 'Maths-3', tue: 'Compiler Design', wed: 'Maths-3', thu: 'Compiler Design', fri: 'Maths-3' },
];

export const getInitialAttendance = (): SubjectAttendance[] => {
    const subjects = new Set<string>();
    collegeTimetableData.forEach(row => {
        Object.values(row).forEach(value => {
            if (value !== row.time && value !== 'Break' && value !== 'Lunch' && !value.includes('Lab')) {
                subjects.add(value);
            }
        });
    });

    return Array.from(subjects).map(subject => ({
        name: subject,
        attended: Math.floor(Math.random() * 10) + 15, // Random number between 15 and 24
        total: Math.floor(Math.random() * 5) + 25, // Random number between 25 and 29
    }));
};
