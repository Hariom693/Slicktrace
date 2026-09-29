import { initializeApp, getApps } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import type { AppUser, EvidenceItem, UserRole } from './data'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseConfigured = Object.values(config).every(Boolean)
const app = firebaseConfigured ? (getApps()[0] ?? initializeApp(config)) : undefined
export const auth = app ? getAuth(app) : undefined
export const db = app ? getFirestore(app) : undefined
export const storage = app ? getStorage(app) : undefined

export const subscribeToAuth = (callback: (user: User | null) => void) =>
  auth ? onAuthStateChanged(auth, callback) : () => undefined

export async function profileFor(user: User): Promise<AppUser> {
  if (!db) {
    return { uid: user.uid, name: user.displayName ?? 'Authorized Analyst', email: user.email ?? '', role: 'viewer', organization: 'SlickTrace' }
  }
  const profileRef = doc(db, 'users', user.uid)
  const profile = await getDoc(profileRef)
  if (!profile.exists()) {
    const newProfile = {
      uid: user.uid,
      name: user.displayName ?? user.email?.split('@')[0] ?? 'User',
      email: user.email ?? '',
      role: 'viewer' as UserRole,
      organization: 'Unassigned',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      status: 'active',
    }
    await setDoc(profileRef, newProfile)
    return { ...newProfile, role: 'viewer' }
  }
  await updateDoc(profileRef, { lastLogin: serverTimestamp() })
  const data = profile.data()
  const role: UserRole = data.role === 'admin' || data.role === 'analyst' ? data.role : 'viewer'
  return {
    uid: user.uid,
    name: typeof data.name === 'string' ? data.name : user.displayName ?? 'User',
    email: typeof data.email === 'string' ? data.email : user.email ?? '',
    role,
    organization: typeof data.organization === 'string' ? data.organization : 'Unassigned',
  }
}

export async function login(email: string, password: string): Promise<User> {
  if (!auth) throw new Error('Firebase is not configured. Use the explicit DEMO access option or add Firebase settings in .env.local.')
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function register(name: string, email: string, password: string): Promise<User> {
  if (!auth || !db) throw new Error('Firebase Authentication must be configured before creating an account.')
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName: name })
  await setDoc(doc(db, 'users', credential.user.uid), {
    uid: credential.user.uid,
    name,
    email,
    role: 'viewer',
    organization: 'Unassigned',
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
    status: 'active',
  })
  return credential.user
}

export async function resetPassword(email: string): Promise<void> {
  if (!auth) throw new Error('Firebase Authentication is not configured.')
  await sendPasswordResetEmail(auth, email)
}

export async function logout(): Promise<void> {
  if (auth) await signOut(auth)
}

export async function saveEvidence(file: File, incidentId: string, uploadedBy: string): Promise<EvidenceItem> {
  const id = `EV-${Date.now()}`
  let storageUrl: string | undefined
  if (storage && db) {
    const path = `incidents/${incidentId}/evidence/${id}/${file.name}`
    const uploaded = await uploadBytes(ref(storage, path), file, { contentType: file.type || 'application/octet-stream' })
    storageUrl = await getDownloadURL(uploaded.ref)
  }
  const item: EvidenceItem = {
    id,
    type: file.type.startsWith('image/') ? 'Satellite Image / Evidence' : 'Evidence File',
    source: storageUrl ? 'Firebase Storage' : 'Local prototype metadata (file not uploaded)',
    timestamp: new Date().toISOString(),
    location: 'Incident ST-2026-091',
    hash: 'Pending cryptographic hashing',
    uploadedBy,
    createdAt: new Date().toISOString(),
    storageUrl,
  }
  if (db) {
    await setDoc(doc(db, 'evidence', id), {
      evidenceId: id,
      incidentId,
      type: item.type,
      source: item.source,
      storageUrl: storageUrl ?? null,
      timestamp: item.timestamp,
      location: item.location,
      hash: item.hash,
      uploadedBy,
      createdAt: serverTimestamp(),
    })
  } else {
    const saved = JSON.parse(localStorage.getItem('slicktrace:evidence') ?? '[]') as EvidenceItem[]
    localStorage.setItem('slicktrace:evidence', JSON.stringify([item, ...saved]))
  }
  return item
}

export async function loadEvidence(): Promise<EvidenceItem[]> {
  if (!db) return JSON.parse(localStorage.getItem('slicktrace:evidence') ?? '[]') as EvidenceItem[]
  const result = await getDocs(query(collection(db, 'evidence'), orderBy('createdAt', 'desc'), limit(50)))
  return result.docs.map((entry) => {
    const data = entry.data()
    return {
      id: String(data.evidenceId ?? entry.id),
      type: String(data.type ?? 'Evidence'),
      source: String(data.source ?? 'Unknown'),
      timestamp: String(data.timestamp ?? ''),
      location: String(data.location ?? 'Not specified'),
      hash: String(data.hash ?? 'Pending cryptographic hashing'),
      uploadedBy: String(data.uploadedBy ?? 'Unknown'),
      createdAt: String(data.createdAt ?? ''),
      storageUrl: typeof data.storageUrl === 'string' ? data.storageUrl : undefined,
    }
  })
}

export async function persistRecord(kind: 'reports' | 'notifications', id: string, data: Record<string, unknown>): Promise<void> {
  if (db) {
    await setDoc(doc(db, kind, id), { ...data, createdAt: serverTimestamp() })
    return
  }
  const key = `slicktrace:${kind}`
  const records = JSON.parse(localStorage.getItem(key) ?? '[]') as Record<string, unknown>[]
  localStorage.setItem(key, JSON.stringify([{ ...data, id }, ...records]))
}

export async function loadRecords(kind: 'reports' | 'notifications'): Promise<Record<string, unknown>[]> {
  if (!db) return JSON.parse(localStorage.getItem(`slicktrace:${kind}`) ?? '[]') as Record<string, unknown>[]
  const result = await getDocs(query(collection(db, kind), orderBy('createdAt', 'desc'), limit(30)))
  return result.docs.map((entry) => ({ id: entry.id, ...entry.data() }))
}

export const AUTH_PROFILE_FIELDS = ['uid', 'name', 'email', 'role', 'organization', 'createdAt', 'lastLogin', 'status'] as const
