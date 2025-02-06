'use client';

import { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { AuthContextType, User } from '@/types/user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Authenticate user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);

      const userData: User = {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        isAuthenticated: true,
        lastLogin: new Date(),
        role: 'user'
      };

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(userDocRef, {
          email: userData.email,
          role: userData.role,
          lastLogin: userData.lastLogin,
          createdAt: new Date()
        });
      } else {
        // Update existing user
        await updateDoc(userDocRef, {
          lastLogin: userData.lastLogin
        });
      }

      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, []);

  const value = useMemo(() => ({ 
    user, 
    login: (email: string, password: string) => login(email, password),
    logout: () => logout(),
    isLoading 
  }), [user, login, logout, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

