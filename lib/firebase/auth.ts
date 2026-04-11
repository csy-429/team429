import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

const googleProvider = new GoogleAuthProvider();

// Firestore에 유저 문서가 없으면 생성
async function ensureUserDoc(firebaseUser: FirebaseUser) {
  const ref = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid:          firebaseUser.uid,
      displayName:  firebaseUser.displayName ?? '플레이어',
      email:        firebaseUser.email ?? '',
      photoURL:     firebaseUser.photoURL ?? null,
      level:        1,
      exp:          0,
      createdAt:    serverTimestamp(),
      lastActiveAt: serverTimestamp(),
    });
  }
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  await ensureUserDoc(result.user);
  return result.user;
}

export async function signInWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserDoc(result.user);
  return result.user;
}

export async function signUpWithEmail(email: string, password: string, displayName: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  await ensureUserDoc(result.user);
  return result.user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export { onAuthStateChanged };
export { auth };
