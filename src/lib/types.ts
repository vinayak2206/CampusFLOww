export type User = {
  name: string;
  year: string;
  branch: string;
  hostel: string;
  productivityScore: number;
  academicRisk: 'Low' | 'Medium' | 'High';
  avatarUrl: string;
};

export type TimetableEntry = {
  id: number;
  day: string;
  subject: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'cancelled';
  type: 'lecture' | 'lab' | 'break';
};

export type AcademicMetrics = {
  attendance: number;
  assignmentsMissed: number;
  stressLevel: number;
};

export type Task = {
  id: number;
  type: 'study' | 'coding' | 'wellness' | 'group-study' | 'refresh';
  suggestion: string;
  duration: string;
  completed: boolean;
};
