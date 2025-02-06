import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { UserDocument } from '@/types/user';

export async function createUserDocument(uid: string, userData: Partial<UserDocument>) {
  await setDoc(doc(db, 'users', uid), {
    ...userData,
    createdAt: new Date(),
    lastLogin: new Date(),
    status: 'active',
    role: userData.role ?? 'user'
  });
}