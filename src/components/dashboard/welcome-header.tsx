'use client';

import { useState, useEffect } from 'react';
import { Hand, PencilLine, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut, updateProfile, User } from 'firebase/auth';
import { auth } from '@/firebase/auth';
import { saveUser, watchUser } from '@/firebase/firestore';

const normalizeName = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }
  const atIndex = trimmed.indexOf('@');
  return atIndex > 0 ? trimmed.slice(0, atIndex) : trimmed;
};

export default function WelcomeHeader() {
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState('');
  const router = useRouter();

  const handleGoToUpload = () => {
    router.push('/dashboard/academics?tab=timetable-upload&open=1');
  };

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting('Good morning');
    } else if (currentHour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setDisplayName('');
        return;
      }

      const storedName = localStorage.getItem(`cf_display_name_${currentUser.uid}`);
      if (storedName) {
        const normalized = normalizeName(storedName);
        setDisplayName(normalized);
        setDraftName(normalized);
        return;
      }

      const fallback = currentUser.isAnonymous
        ? 'Guest'
        : normalizeName(currentUser.displayName ?? currentUser.email ?? '') || 'Student';
      setDisplayName(fallback);
      setDraftName(fallback);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribe = watchUser(user.uid, (data) => {
      const storedName = typeof data?.displayName === 'string' ? normalizeName(data.displayName) : '';
      if (storedName) {
        setDisplayName(storedName);
        setDraftName(storedName);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      router.push('/');
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setEditing(true);
    setDraftName(displayName);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setDraftName(displayName);
  };

  const handleSaveName = async () => {
    const trimmed = normalizeName(draftName);
    if (!trimmed) {
      return;
    }

    setDisplayName(trimmed);
    setEditing(false);

    if (user) {
      localStorage.setItem(`cf_display_name_${user.uid}`, trimmed);
      await saveUser(user.uid, { displayName: trimmed });
      if (!user.isAnonymous) {
        try {
          await updateProfile(user, { displayName: trimmed });
        } catch (e) {
          console.error('Failed to update profile name', e);
        }
      }
    }
  };

  if (!greeting) {
    return (
      <div className="flex items-center gap-2">
        <h1 className="font-headline text-3xl font-bold tracking-tighter">
          Welcome, {displayName || 'Student'}!
        </h1>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 justify-between w-full">
      <div className="flex items-center gap-3">
        <h1 className="font-headline text-3xl font-bold tracking-tighter">
          {greeting}, {displayName || 'Student'}!
        </h1>
        <Hand className="h-8 w-8 text-yellow-400" />
        {!editing && (
          <button
            onClick={handleEditToggle}
            className="inline-flex items-center gap-1 rounded-md border border-white/70 bg-white/50 px-2 py-1 text-xs text-slate-600 hover:bg-white"
          >
            <PencilLine className="h-3 w-3" />
            Edit
          </button>
        )}
        {editing && (
          <div className="flex items-center gap-2">
            <input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="h-9 w-40 rounded-md border border-white/70 bg-white/70 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7c5cff]/30"
              placeholder="Your name"
            />
            <button
              onClick={handleSaveName}
              className="inline-flex items-center justify-center rounded-md bg-[#7c5cff] px-2 py-2 text-white hover:bg-[#6a4df7]"
              aria-label="Save name"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="inline-flex items-center justify-center rounded-md border border-white/70 bg-white/70 px-2 py-2 text-slate-600 hover:bg-white"
              aria-label="Cancel name edit"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleGoToUpload}
          className="px-3 py-2 rounded-md border border-white/70 bg-white/50 text-sm text-slate-700 hover:bg-white"
        >
          Upload Timetable
        </button>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="px-3 py-2 rounded-md border border-red-200 bg-red-50 text-sm text-red-600 hover:bg-red-100 disabled:opacity-60"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
