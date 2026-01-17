// src/lib/timetable/normalizeOcrText.ts

const DAY_NAMES = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];

const SUBJECT_ALIASES: Record<string, string> = {
  "SS-1L": "SS-II",
  "SS-11": "SS-II",
  "SS-IL": "SS-II",
  "SSII": "SS-II",
  "0S": "OS",
};

export function normalizeOcrText(rawText: string) {
  const lines = rawText
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const result: { day: string; subjects: string[] }[] = [];

  for (const line of lines) {
    const tokens = line
      .toUpperCase()
      .replace(/[^A-Z0-9\- ]/g, "")
      .split(/\s+/);

    const day = tokens[0];
    if (!DAY_NAMES.includes(day)) continue;

    const subjects = tokens.slice(1).map(token => {
      if (token === "-" || token === "--") return "FREE";
      if (token === "LUNCH") return "LUNCH";
      return SUBJECT_ALIASES[token] ?? token;
    });

    result.push({ day, subjects });
  }

  return result;
}
