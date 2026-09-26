import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut, 
  onAuthStateChanged,
  FirebaseUser,
  db,
  doc,
  getDoc,
  setDoc
} from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginAsAdminWithPassword: (idOrPhone: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  toggleAdminRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ['satyamsing2580@gmail.com', 'admin@sunriseelectricals.com', 'owner@sunrise.com'];
const MASTER_ADMIN_PASSWORD = 'Sunrise1616';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Persist admin session in localStorage
  const [forceAdminMode, setForceAdminMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sunrise_is_admin') === 'true';
    } catch {
      return false;
    }
  });

  const syncUserProfile = async (user: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(userRef);
      const isOwnerEmail = ADMIN_EMAILS.includes((user.email || '').toLowerCase());
      
      if (snapshot.exists()) {
        const data = snapshot.data() as UserProfile;
        if (isOwnerEmail && data.role !== 'admin') {
          const updated = { ...data, role: 'admin' as const };
          await setDoc(userRef, updated, { merge: true });
          setUserProfile(updated);
        } else {
          setUserProfile(data);
        }
      } else {
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'Valued Customer'),
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber,
          role: isOwnerEmail ? 'admin' : 'customer',
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err: any) {
      console.warn('Firestore profile sync error:', err);
      const isOwnerEmail = ADMIN_EMAILS.includes((user.email || '').toLowerCase());
      setUserProfile({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Customer',
        role: isOwnerEmail ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncUserProfile(user);
      } else if (!forceAdminMode) {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [forceAdminMode]);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google Sign-in failed. Please try again.');
      }
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      let msg = 'Failed to sign in. Please verify your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      }
      setError(msg);
      throw err;
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    try {
      setError(null);
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const newProfile: UserProfile = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: name,
        role: ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      };
      try {
        await setDoc(doc(db, 'users', res.user.uid), newProfile);
      } catch (e) {
        console.warn('Profile write notice:', e);
      }
      setUserProfile(newProfile);
    } catch (err: any) {
      let msg = 'Account creation failed.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please log in.';
      }
      setError(msg);
      throw err;
    }
  };

  // Custom Super Admin login with password 'Sunrise1616'
  const loginAsAdminWithPassword = async (idOrPhone: string, pass: string): Promise<boolean> => {
    setError(null);
    const cleanPass = pass.trim();
    if (cleanPass !== MASTER_ADMIN_PASSWORD) {
      const errorMsg = 'Invalid Admin password. Please check your credentials and try again.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setForceAdminMode(true);
    try {
      localStorage.setItem('sunrise_is_admin', 'true');
    } catch {}

    setUserProfile({
      uid: 'super-admin-sunrise-001',
      email: 'satyamsing2580@gmail.com',
      displayName: `Super Admin (${idOrPhone.trim() || 'Owner'})`,
      role: 'admin',
      phoneNumber: idOrPhone.includes('+') || !isNaN(Number(idOrPhone)) ? idOrPhone : '+91 98765 43210',
      createdAt: new Date().toISOString()
    });

    return true;
  };

  const logout = async () => {
    try {
      setForceAdminMode(false);
      try {
        localStorage.removeItem('sunrise_is_admin');
      } catch {}
      setUserProfile(null);
      await firebaseSignOut(auth);
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  const toggleAdminRole = () => {
    setForceAdminMode((prev) => {
      const next = !prev;
      try {
        if (next) localStorage.setItem('sunrise_is_admin', 'true');
        else localStorage.removeItem('sunrise_is_admin');
      } catch {}
      return next;
    });
  };

  const isAdmin = forceAdminMode || userProfile?.role === 'admin' || ADMIN_EMAILS.includes((currentUser?.email || '').toLowerCase());

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        loading,
        error,
        signInWithGoogle,
        loginWithEmail,
        signupWithEmail,
        loginAsAdminWithPassword,
        logout,
        clearError: () => setError(null),
        toggleAdminRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
