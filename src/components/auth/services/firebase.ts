
/**
 * Firebase authentication service
 */
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  signInAnonymously as firebaseSignInAnonymously,
  signOut as firebaseSignOut
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const isFirebaseConfigured = !!firebaseConfig.apiKey && 
  !firebaseConfig.apiKey.includes('demo-mode') && 
  !!firebaseConfig.authDomain &&
  !!firebaseConfig.projectId;

let auth;
let app;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export const getFirebaseAuth = () => auth;

export const signIn = async (email: string, password: string) => {
  if (!auth) throw new Error('Firebase is not configured');
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email: string, password: string) => {
  if (!auth) throw new Error('Firebase is not configured');
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async () => {
  if (!auth) throw new Error('Firebase is not configured');
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signInWithGithub = async () => {
  if (!auth) throw new Error('Firebase is not configured');
  const provider = new GithubAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signInWithFacebook = async () => {
  if (!auth) throw new Error('Firebase is not configured');
  const provider = new FacebookAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signInAnonymously = async () => {
  if (!auth) throw new Error('Firebase is not configured');
  return firebaseSignInAnonymously(auth);
};

export const signOut = async () => {
  if (!auth) throw new Error('Firebase is not configured');
  return firebaseSignOut(auth);
};
