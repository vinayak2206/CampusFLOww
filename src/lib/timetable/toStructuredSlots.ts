const TIME_SLOTS = [
  "08:30-09:20",
  "09:20-10:10",
  "10:20-11:10",
  "11:10-12:00",
  "12:00-12:50",
  "12:50-01:40",
  "01:40-02:20",
  "02:20-03:10",
];

export function toStructuredSlots(
  normalized: { day: string; subjects: string[] }[],
  uid: string
) {
  const slots: any[] = [];

  for (const dayEntry of normalized) {
    dayEntry.subjects.forEach((subject, index) => {
      if (!TIME_SLOTS[index]) return;

      slots.push({
        userId: uid,
        day: dayEntry.day,
        time: TIME_SLOTS[index],
        subject: subject === "FREE" ? null : subject,
        status: subject === "FREE" ? "free" : "class",
        createdAt: Date.now(),
      });
    });
  }

  return slots;
}
