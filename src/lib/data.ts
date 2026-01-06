import type { User, TimetableEntry, AcademicMetrics } from './types';

export const mockUser: User = {
  name: 'Alex Doe',
  year: '3rd Year',
  branch: 'Computer Science',
  hostel: 'Galaxy Hostel',
  productivityScore: 78,
  academicRisk: 'Low',
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

export const mockAcademicMetrics: AcademicMetrics = {
  attendance: 85,
  assignmentsMissed: 2,
  stressLevel: 3,
};
