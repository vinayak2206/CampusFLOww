'use client';

import { initializeFirebase } from '@/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '@/firebase/auth';

const { firebaseApp } = initializeFirebase();
export const storage = getStorage(firebaseApp);

export async function uploadTimetableImage(file: File, uid?: string): Promise<{ downloadURL: string; path: string }>{
  const userId = uid || auth.currentUser?.uid;
  if (!userId) throw new Error('No authenticated user');
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `users/${userId}/uploads/timetable/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file, { contentType: file.type || 'image/jpeg' });
  const downloadURL = await getDownloadURL(snapshot.ref);
  return { downloadURL, path };
}
