export const TIME_SLOTS = [
  { start: '08:30', end: '09:20' },
  { start: '09:20', end: '10:10' },
  { start: '10:20', end: '11:10' },
  { start: '11:10', end: '12:00' },
  { start: '12:00', end: '12:50' },
  { start: '12:50', end: '13:40' },
  { start: '13:40', end: '14:20' },
  { start: '14:20', end: '15:10' },
];

export type RawTimetable = Record<string, (string | null)[]>;

export type StructuredSlot = {
  day: string;
  start: string; // HH:mm
  end: string; // HH:mm
  subject: string | null;
  type: 'class' | 'free';
};

export function normalizeTimetable(raw: RawTimetable): StructuredSlot[] {
  const result: StructuredSlot[] = [];

  for (const dayKey of Object.keys(raw)) {
    const row = raw[dayKey] || [];

    row.forEach((cell, idx) => {
      const time = TIME_SLOTS[idx];
      if (!time) return; // skip unknown columns

      // Normalize cell: trim and upper-case if string
      const subject = typeof cell === 'string' ? cell.trim() : null;

      // Ignore lunch entirely
      if (subject && subject.toUpperCase() === 'LUNCH') return;

      result.push({
        day: dayKey,
        start: time.start,
        end: time.end,
        subject: subject === '' ? null : subject,
        type: subject ? 'class' : 'free',
      });
    });
  }

  return result;
}

// quick test helper (not used in production)
export function example() {
  const rawTimetable: RawTimetable = {
    MON: ['MI', 'DBMS', 'SS-II', 'SS-II', 'LUNCH', 'SA', 'TOC', null],
    TUE: ['SA', 'IWT', 'OS', 'MI', 'LUNCH', 'IWT', 'DBMS', null],
    WED: ['OS', 'AJP', 'TOC', 'AJP', 'LUNCH', 'SA', 'OS', null],
    THU: ['TOC', 'DBMS', 'MI', 'AJP', 'LUNCH', 'OS', 'MI', null],
    FRI: ['DBMS', 'OS', 'OS', 'DBMS', 'LUNCH', 'MI', 'AJP', null],
  };

  const structured = normalizeTimetable(rawTimetable);
  console.log(structured.slice(-5));
}
