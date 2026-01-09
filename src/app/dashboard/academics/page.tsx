'use client';

import { CgpaCalculatorCard } from '@/components/academics/cgpa-calculator-card';
import { AttendanceManager } from '@/components/academics/attendance-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/context/AppContext';

export default function AcademicsPage() {
  const { 
    subjects, 
    loading,
    updateSubjectAttendance,
    resetSubject,
    deleteSubject,
  } = useAppContext();

  const targetAttendance = 75;

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tighter">
        Academic Health
      </h1>
      <Tabs defaultValue="attendance">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="cgpa">CGPA Calculator</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance">
          <AttendanceManager
            subjects={subjects}
            loading={loading}
            onManualUpdate={updateSubjectAttendance}
            onReset={resetSubject}
            onDelete={deleteSubject}
            targetAttendance={targetAttendance}
          />
        </TabsContent>
        <TabsContent value="cgpa">
          <CgpaCalculatorCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
