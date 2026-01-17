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
  day: string; // e.g. 'MON'
  start: string; // 'HH:mm'
  end: string; // 'HH:mm'
  subject: string | null; // null means free slot
  type: 'class' | 'free';
};

function normalizeCell(cell: string | null | undefined): string | null {
  if (cell == null) return null;
  const v = cell.toString().trim();
  if (v === '' || v === '-' || v === '—' || v.toUpperCase() === 'NULL') return null;
  return v;
}

export function normalizeTimetable(raw: RawTimetable): StructuredSlot[] {
  const result: StructuredSlot[] = [];

  for (const dayKey of Object.keys(raw)) {
    const row = raw[dayKey] || [];

    row.forEach((cell, idx) => {
      const time = TIME_SLOTS[idx];
      if (!time) return; // skip columns beyond defined TIME_SLOTS

      const normalized = normalizeCell(cell);

      // Ignore lunch rows entirely
      if (normalized && normalized.toUpperCase() === 'LUNCH') return;

      result.push({
        day: dayKey,
        start: time.start,
        end: time.end,
        subject: normalized,
        type: normalized ? 'class' : 'free',
      });
    });
  }

  return result;
}

// Example helper for quick manual testing (not exported as default)
export function exampleRawToStructured() {
  const raw: RawTimetable = {
    MON: ['MI', 'DBMS', 'SS-II', 'SS-II', 'LUNCH', 'SA', 'TOC', null],
    TUE: ['SA', 'IWT', 'OS', 'MI', 'LUNCH', 'IWT', 'DBMS', null],
    WED: ['OS', 'AJP', 'TOC', 'AJP', 'LUNCH', 'SA', 'OS', null],
    THU: ['TOC', 'DBMS', 'MI', 'AJP', 'LUNCH', 'OS', 'MI', null],
    FRI: ['DBMS', 'OS', 'OS', 'DBMS', 'LUNCH', 'MI', 'AJP', null],
  };

  return normalizeTimetable(raw);
}
