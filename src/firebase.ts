import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  getDocFromServer,
  Unsubscribe,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { MedicalCase, DonationRecord } from './types/carefund';
import { INITIAL_CASES, INITIAL_DONATIONS } from './data/mockCases';

// User's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyC10AYNpyj7-qiZtqwAZIzuKsTA8Qwyi6c",
  authDomain: "carefund-6a4ae.firebaseapp.com",
  projectId: "carefund-6a4ae",
  storageBucket: "carefund-6a4ae.firebasestorage.app",
  messagingSenderId: "520244716958",
  appId: "1:520244716958:web:86173fdee0799f2fc0228f",
  measurementId: "G-W7FTQKF20Q"
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Google Auth Provider setup
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, googleAuthProvider);
  return result.user;
}

/**
 * Sign out from Firebase
 */
export async function logOutFromFirebase(): Promise<void> {
  await signOut(auth);
}

/**
 * Listen to Auth State changes
 */
export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export { onAuthStateChanged };
export type { FirebaseUser };

export type CareFundRole = 'donor' | 'patient' | 'hospital' | 'hospital_desk' | 'reviewer' | 'auditor';

export interface UserProfile {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  role: CareFundRole;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fetch stored user profile from localStorage and Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const localCache = localStorage.getItem(`carefund_profile_${uid}`);
  if (localCache) {
    try {
      const parsed = JSON.parse(localCache);
      if (parsed && parsed.role) return parsed;
    } catch {
      // ignore
    }
  }

  try {
    const userRef = doc(db, 'users', uid);
    const snap = (await Promise.race([
      getDoc(userRef),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000)),
    ])) as any;
    if (snap && snap.exists()) {
      const data = snap.data() as UserProfile;
      localStorage.setItem(`carefund_profile_${uid}`, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Notice reading user profile from Firestore:', err);
  }

  return null;
}

/**
 * Save user profile and role persistently to both localStorage and Firestore (non-blocking)
 */
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  localStorage.setItem(`carefund_profile_${profile.uid}`, JSON.stringify(profile));
  localStorage.setItem('carefund_user_role', profile.role);
  if (profile.phoneNumber) {
    const cleanPhone = profile.phoneNumber.replace(/\D/g, '');
    localStorage.setItem(`carefund_phone_${cleanPhone}`, profile.role);
  }
  if (profile.email) {
    localStorage.setItem(`carefund_email_${profile.email.toLowerCase()}`, profile.role);
  }

  try {
    const userRef = doc(db, 'users', profile.uid);
    setDoc(userRef, {
      ...profile,
      updatedAt: new Date().toISOString(),
    }, { merge: true }).catch((err) => {
      console.warn('Background Firestore profile save notice:', err);
    });
    console.log(`User profile for ${profile.uid} saved with role: ${profile.role}`);
  } catch (err) {
    console.warn('Notice saving user profile to Firestore:', err);
  }
}

/**
 * Automatically identify an existing user's role:
 * Returns CareFundRole or null if first-time user who needs setup.
 */
export async function identifyUserAccountRole(
  uid: string,
  email?: string | null,
  phoneNumber?: string | null
): Promise<CareFundRole | null> {
  // 1. Direct profile check
  const profile = await getUserProfile(uid);
  if (profile && profile.role) {
    return profile.role;
  }

  // 2. Check phone registry
  if (phoneNumber) {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const savedRole = localStorage.getItem(`carefund_phone_${cleanPhone}`);
    if (savedRole && ['donor', 'patient', 'hospital', 'reviewer'].includes(savedRole)) {
      return savedRole as CareFundRole;
    }
    // Pre-registered clinical demo numbers
    if (cleanPhone.endsWith('00001')) return 'hospital';
    if (cleanPhone.endsWith('00002')) return 'reviewer';
    if (cleanPhone.endsWith('00003')) return 'patient';
    if (cleanPhone.endsWith('00004')) return 'donor';
  }

  // 3. Check email registry
  if (email) {
    const lowerEmail = email.toLowerCase();
    const savedRole = localStorage.getItem(`carefund_email_${lowerEmail}`);
    if (savedRole && ['donor', 'patient', 'hospital', 'reviewer'].includes(savedRole)) {
      return savedRole as CareFundRole;
    }
    // Pattern checks
    if (lowerEmail.includes('apollo') || lowerEmail.includes('hospital') || lowerEmail.includes('clinical')) {
      return 'hospital';
    }
    if (lowerEmail.includes('audit') || lowerEmail.includes('reviewer') || lowerEmail.includes('swaminathan')) {
      return 'reviewer';
    }
    if (lowerEmail.includes('patient') || lowerEmail.includes('revathi') || lowerEmail.includes('aarav')) {
      return 'patient';
    }
    if (lowerEmail.includes('donor') || lowerEmail.includes('karthik')) {
      return 'donor';
    }
  }

  return null;
}

// Initialize Analytics conditionally
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized for carefund-6a4ae');
    }
  }).catch(() => {
    // Analytics not supported in this runtime
  });
}

// Error handling conforming to Firebase skill guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
  return errInfo;
}

/**
 * Validate connection to Firestore as required by Firebase integration guidelines
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore: Client is offline or initializing.');
    }
    return false;
  }
}

/**
 * Real-time subscription to medical cases
 */
export function subscribeToCases(
  onUpdate: (cases: MedicalCase[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const casesCol = collection(db, 'cases');

  return onSnapshot(
    casesCol,
    (snapshot) => {
      if (!snapshot.empty) {
        const loadedCases = snapshot.docs.map((docSnap) => docSnap.data() as MedicalCase);
        onUpdate(loadedCases);
      } else {
        // If Firestore is empty, seed initial verified cases so the web portal is immediately usable
        seedInitialDataIfEmpty().then((seeded) => {
          if (seeded) {
            onUpdate(seeded);
          }
        });
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'cases');
      if (onError) onError(error);
      // Fallback to local cases on network restriction
      onUpdate(INITIAL_CASES);
    }
  );
}

/**
 * Real-time subscription to donations
 */
export function subscribeToDonations(
  onUpdate: (donations: DonationRecord[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const donationsCol = collection(db, 'donations');

  return onSnapshot(
    donationsCol,
    (snapshot) => {
      if (!snapshot.empty) {
        const loadedDonations = snapshot.docs.map((d) => d.data() as DonationRecord);
        onUpdate(loadedDonations);
      } else {
        // Use default initial donations
        onUpdate(INITIAL_DONATIONS);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'donations');
      if (onError) onError(error);
      onUpdate(INITIAL_DONATIONS);
    }
  );
}

/**
 * Save or update a case in Firestore
 */
export async function saveCaseToFirestore(medicalCase: MedicalCase): Promise<void> {
  try {
    const caseRef = doc(db, 'cases', medicalCase.id);
    await setDoc(caseRef, medicalCase, { merge: true });
    console.log(`Case ${medicalCase.id} synced to Firestore carefund-6a4ae`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `cases/${medicalCase.id}`);
  }
}

/**
 * Save donation to Firestore and update related case
 */
export async function saveDonationToFirestore(
  donation: DonationRecord,
  updatedCase?: MedicalCase
): Promise<void> {
  try {
    const donationRef = doc(db, 'donations', donation.receiptId);
    await setDoc(donationRef, donation);

    if (updatedCase) {
      await saveCaseToFirestore(updatedCase);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `donations/${donation.receiptId}`);
  }
}

/**
 * Seed initial mock cases to Firestore so the user's project has initial records
 */
async function seedInitialDataIfEmpty(): Promise<MedicalCase[] | null> {
  try {
    const casesCol = collection(db, 'cases');
    const existing = await getDocs(casesCol);
    if (existing.empty) {
      for (const c of INITIAL_CASES) {
        await setDoc(doc(db, 'cases', c.id), c);
      }
      return INITIAL_CASES;
    }
  } catch (err) {
    // If permission or network prevents seeding, keep mock data
    console.warn('Note on Firestore seeding:', err);
  }
  return null;
}

export interface PatientDocumentRecord {
  id: string;
  patientId: string;
  name: string;
  fileType: string;
  size: string;
  uploadDate: string;
  timestamp: number;
  dataUrl?: string;
  verificationStatus: string;
  uploadedBy: string;
  status: string;
  category: string;
  description?: string;
}

export async function savePatientDocument(docRecord: PatientDocumentRecord): Promise<void> {
  const cacheKey = `carefund_patient_docs_${docRecord.patientId}`;
  const existing = localStorage.getItem(cacheKey);
  let list: PatientDocumentRecord[] = [];
  if (existing) {
    try { list = JSON.parse(existing); } catch {}
  }
  list = [docRecord, ...list.filter(d => d.id !== docRecord.id)];
  localStorage.setItem(cacheKey, JSON.stringify(list));

  try {
    const docRef = doc(db, 'patient_documents', docRecord.id);
    setDoc(docRef, docRecord).catch((err) => {
      console.warn('Background Firestore patient document save notice:', err);
    });
  } catch (err) {
    console.warn('Notice saving patient document to Firestore:', err);
  }
}

export async function getPatientDocuments(patientId: string): Promise<PatientDocumentRecord[]> {
  const cacheKey = `carefund_patient_docs_${patientId}`;
  let list: PatientDocumentRecord[] = [];
  const existing = localStorage.getItem(cacheKey);
  if (existing) {
    try { list = JSON.parse(existing); } catch {}
  }

  try {
    const q = collection(db, 'patient_documents');
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const remoteList = snapshot.docs
        .map(d => d.data() as PatientDocumentRecord)
        .filter(d => d.patientId === patientId);
      if (remoteList.length > 0) {
        const map = new Map<string, PatientDocumentRecord>();
        [...remoteList, ...list].forEach(d => map.set(d.id, d));
        list = Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
        localStorage.setItem(cacheKey, JSON.stringify(list));
      }
    }
  } catch (err) {
    console.warn('Notice fetching patient documents from Firestore:', err);
  }

  return list;
}

export interface PatientCaseProfile {
  patientId: string;
  fullName: string;
  dob: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  
  diagnosis: string;
  conditionSummary: string;
  treatmentRequired: string;
  surgeryRequired: boolean;
  treatmentDescription: string;
  dateOfDiagnosis: string;
  expectedTreatmentDate: string;
  treatmentUrgency: string;
  treatmentStatus: string;
  previousTreatmentDetails: string;

  hospitalName: string;
  hospitalAddress: string;
  hospitalCity: string;
  hospitalState: string;
  department: string;
  treatingDoctor: string;
  doctorDesignation: string;
  doctorContact: string;
  admissionDate: string;
  expectedDischargeDate: string;

  totalTreatmentCost: number;
  familyContribution: number;
  insuranceCoverage: number;
  governmentAssistance: number;
  otherFinancialAssistance: number;
  carefundFundingRequired: number;

  hasGovernmentScheme: boolean;
  schemeName: string;
  beneficiaryId: string;
  approvedAmount: number;
  applicationStatus: string;
  assistanceReceived: number;
  remainingAssistance: number;

  caseStatus: string;
  hospitalVerificationStatus: string;
  rejectionReason?: string;
  createdAt: string;
}

export async function savePatientCaseProfile(profile: PatientCaseProfile): Promise<void> {
  const cacheKey = `carefund_patient_profile_${profile.patientId}`;
  localStorage.setItem(cacheKey, JSON.stringify(profile));

  try {
    const docRef = doc(db, 'patients', profile.patientId);
    setDoc(docRef, profile, { merge: true }).catch((err) => {
      console.warn('Background Firestore patient profile save notice:', err);
    });
  } catch (err) {
    console.warn('Notice saving patient profile to Firestore:', err);
  }
}

export async function getPatientCaseProfile(patientId: string): Promise<PatientCaseProfile | null> {
  const cacheKey = `carefund_patient_profile_${patientId}`;
  const local = localStorage.getItem(cacheKey);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (parsed && parsed.patientId) return parsed;
    } catch {}
  }

  try {
    const docRef = doc(db, 'patients', patientId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as PatientCaseProfile;
      localStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Notice reading patient profile from Firestore:', err);
  }

  return null;
}
