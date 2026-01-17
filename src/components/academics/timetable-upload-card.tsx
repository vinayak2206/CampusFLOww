'use client';

import React, { useState } from 'react';
import { recognizeTimetable } from '@/ocr/recognizeTimetable';
import { normalizeOcrText } from '@/lib/timetable/normalizeOcrText';
import { toStructuredSlots } from '@/lib/timetable/toStructuredSlots';
import { saveTimetableSlots } from '@/firebase/timetable';
import { auth } from '@/firebase/auth';
import { TIME_SLOTS } from '@/utils/timetableParser';

export function TimetableUploadCard() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<any>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);

      // 1️⃣ OCR
      const rawText = await recognizeTimetable(file);
      console.log('OCR RAW:', rawText);

      // 2️⃣ Normalize text → day-wise subjects
      const normalized = normalizeOcrText(rawText);
      console.log('NORMALIZED:', normalized);

      // 3️⃣ Create a preview of structured slots (no userId yet)
      const preview: any[] = [];
      for (const dayEntry of normalized) {
        dayEntry.subjects.forEach((subject: string, index: number) => {
          const time = TIME_SLOTS[index];
          if (!time) return;
          preview.push({ day: dayEntry.day, time, subject: subject === 'FREE' ? null : subject, status: subject === 'FREE' ? 'free' : 'class' });
        });
      }

      setOutput({ normalized, preview });
    } catch (err) {
      console.error(err);
      alert('❌ Failed to process timetable');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!output?.normalized) return;
    const uid = auth.currentUser?.uid;
    if (!uid) {
      alert('You must be signed in to submit the timetable');
      return;
    }

    try {
      setLoading(true);
      const slots = toStructuredSlots(output.normalized, uid);
      await saveTimetableSlots(uid, slots);
      alert('✅ Timetable saved to your account');
      setOutput(null);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to save timetable');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 rounded-xl border space-y-4">
      <h2 className="text-xl font-bold">Upload Timetable</h2>

      <input type="file" accept="image/*" onChange={handleUpload} />

      {loading && <p>Processing timetable with AI…</p>}

      {output && (
        <div>
          <pre className="bg-black text-green-400 p-4 rounded text-sm overflow-auto max-h-96">{JSON.stringify(output, null, 2)}</pre>
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="rounded bg-indigo-600 text-white px-3 py-2">Submit Timetable</button>
            <button onClick={() => setOutput(null)} className="rounded border px-3 py-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
