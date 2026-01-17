
// src/firebase/timetable.ts
import { initializeFirebase } from "@/firebase";
import { saveTimetableDay } from './firestore';

// Save structured slots into per-day timetable documents expected by the app.
export async function saveTimetableSlots(uid: string, slots: any[]) {
  if (!uid) throw new Error('No uid provided to saveTimetableSlots');

  // group slots by day and convert to expected TimetableEntry shape
  const byDay: Record<string, any[]> = {};

  const DAY_MAP: Record<string, string> = {
    MON: 'Monday',
    TUE: 'Tuesday',
    WED: 'Wednesday',
    THU: 'Thursday',
    FRI: 'Friday',
    SAT: 'Saturday',
    SUN: 'Sunday',
    MONDAY: 'Monday',
    TUESDAY: 'Tuesday',
    WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thursday',
    FRIDAY: 'Friday',
    SATURDAY: 'Saturday',
    SUNDAY: 'Sunday'
  };

  for (const s of slots) {
    const rawDay = (s.day || '').toString().toUpperCase();
    const day = DAY_MAP[rawDay] ?? s.day;
    if (!byDay[day]) byDay[day] = [];

    // If slot has time in 'HH:MM-HH:MM' format, split
    let startTime = '';
    let endTime = '';
    if (typeof s.time === 'string' && s.time.includes('-')) {
      const parts = s.time.split('-').map((p: string) => p.trim());
      startTime = parts[0];
      endTime = parts[1];
    }

    const allowedStatus = new Set(['scheduled', 'cancelled', 'attended', 'missed']);
    const normalizedStatus = s.status === 'free'
      ? 'scheduled'
      : (allowedStatus.has(s.status) ? s.status : 'scheduled');

    byDay[day].push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      day,
      subject: s.subject ?? 'Free Slot',
      startTime,
      endTime,
      status: normalizedStatus,
      type: s.status === 'free' ? 'break' : 'lecture',
    });
  }

  // persist each day using helper saveTimetableDay
  for (const day of Object.keys(byDay)) {
    const entries = byDay[day];
    await saveTimetableDay(uid, day, entries);
  }
}
