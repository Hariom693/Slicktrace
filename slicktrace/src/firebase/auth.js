// src/firebase/auth.js
// Firebase Authentication helpers

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

// Demo mode flag — when true, bypasses real Firebase calls
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

// Register new user
export const registerUser = async ({ email, password, name, organization, role = 'viewer' }) => {
  if (DEMO_MODE) {
    // Demo mode: return a mock user object
    const mockUser = {
      uid: 'demo-uid-' + Date.now(),
      email,
      displayName: name,
    };
    return mockUser;
  }
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await updateProfile(user, { displayName: name });

  // Store user profile in Firestore users collection
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name,
    email,
    role,
    organization: organization || '',
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
    status: 'active',
  });

  return user;
};

// Login existing user
export const loginUser = async ({ email, password }) => {
  if (DEMO_MODE) {
    const demoAccounts = {
      'admin@slicktrace.demo': { uid: 'demo-admin', displayName: 'Demo Analyst', email, role: 'admin' },
      'viewer@slicktrace.demo': { uid: 'demo-viewer', displayName: 'Demo Viewer', email, role: 'viewer' },
    };
    if (demoAccounts[email] && password === 'demo1234') {
      return demoAccounts[email];
    }
    if (password === 'demo1234') {
      return { uid: 'demo-user', displayName: 'Demo User', email, role: 'admin' };
    }
    throw new Error('Demo mode: use any email with password "demo1234"');
  }
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update last login time
  await updateDoc(doc(db, 'users', user.uid), {
    lastLogin: serverTimestamp(),
  });

  return user;
};

// Logout
export const logoutUser = async () => {
  if (!DEMO_MODE) {
    await signOut(auth);
  }
};

// Send password reset email
export const resetPassword = async (email) => {
  if (DEMO_MODE) return;
  await sendPasswordResetEmail(auth, email);
};

// Get user profile from Firestore
export const getUserProfile = async (uid) => {
  if (DEMO_MODE) {
    return {
      uid,
      name: 'Demo Analyst',
      email: 'analyst@slicktrace.demo',
      role: 'admin',
      organization: 'INCOIS / Coast Guard',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      status: 'active',
    };
  }
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// Auth state listener
export const onAuthChange = (callback) => {
  if (DEMO_MODE) {
    // In demo mode, don't use real Firebase auth listener
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export { auth };
