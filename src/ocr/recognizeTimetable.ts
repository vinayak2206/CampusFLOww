// src/ocr/recognizeTimetable.ts
'use client';

import Tesseract from 'tesseract.js';

export async function recognizeTimetable(file: File): Promise<string> {
  if (!file) throw new Error('No file provided');

  const result = await Tesseract.recognize(
    file,
    'eng',
    {
      logger: (m) => console.log('[OCR]', m),
    }
  );

  return result.data.text;
}
