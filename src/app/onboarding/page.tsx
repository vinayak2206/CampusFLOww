"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/auth';
import { saveUser } from '@/firebase/firestore';

export default function OnboardingPage() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUid(u?.uid ?? null);
    });
    return () => unsub();
  }, []);

  const handleUpload = () => {
    router.push('/dashboard/academics?tab=timetable-upload');
  };

  const handleSkip = async () => {
    try {
      if (uid) {
        await saveUser(uid, { onboarded: true });
      }
    } catch (e) {
      console.error('Failed to save onboarding flag', e);
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold">Welcome — one quick step</h1>
        <p className="text-muted-foreground">Upload your timetable now so CampusFlow can keep your schedule and attendance in sync. You can also skip and upload later.</p>
        <div className="flex gap-3">
          <button onClick={handleUpload} className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-white">Upload Timetable</button>
          <button onClick={handleSkip} className="flex-1 rounded-md border border-gray-200 px-4 py-2">Skip</button>
        </div>
      </div>
    </div>
  );
}
