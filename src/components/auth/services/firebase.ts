
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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-mode-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-mode.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-mode",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-mode-app-id"
};

// Alterado para sempre inicializar o Firebase, mesmo que em modo demo
// Isso evita erros de configuração e ainda permite o login anônimo e o modo demo
let app = initializeApp(firebaseConfig);
let auth = getAuth(app);

// Check if Firebase is fully configured with real credentials
export const isFirebaseConfigured = !!firebaseConfig.apiKey && 
  !firebaseConfig.apiKey.includes('demo-mode') && 
  !!firebaseConfig.authDomain &&
  !!firebaseConfig.projectId;

export const getFirebaseAuth = () => auth;

export const signIn = async (email: string, password: string) => {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured with real credentials');
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email: string, password: string) => {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured with real credentials');
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async () => {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured with real credentials');
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signInWithGithub = async () => {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured with real credentials');
  const provider = new GithubAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signInWithFacebook = async () => {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured with real credentials');
  const provider = new FacebookAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signInAnonymously = async () => {
  return firebaseSignInAnonymously(auth);
};

export const signOut = async () => {
  return firebaseSignOut(auth);
};
