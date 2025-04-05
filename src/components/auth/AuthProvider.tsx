
import React, { createContext, useState, useEffect, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  signInAnonymously as firebaseSignInAnonymously,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { deriveKey, generateTempKey } from '@/lib/encryption';
import { storeSettings, retrieveSettings } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-mode-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-mode",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-mode",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-mode"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Auth context type
interface AuthContextType {
  user: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  encryptionKey: CryptoKey | null;
  isLocalPasswordSet: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  setLocalPassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const [isLocalPasswordSet, setIsLocalPasswordSet] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      // If user signs out, clear encryption key
      if (!currentUser) {
        setEncryptionKey(null);
        setIsLocalPasswordSet(false);
        setIsLoading(false);
        return;
      }
      
      try {
        // Check if there are any settings (to determine if local password is set)
        if (currentUser.isAnonymous) {
          // For anonymous users, generate a temporary key
          const tempKey = await generateTempKey();
          setEncryptionKey(tempKey);
          setIsLocalPasswordSet(true);
        } else {
          // For regular users, try to retrieve settings to see if a local password is set
          const settings = await retrieveSettings(await deriveKey(currentUser.uid, 'temporary'));
          setIsLocalPasswordSet(!!settings.passwordSet);
        }
      } catch (error) {
        setIsLocalPasswordSet(false);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      let message = "Failed to sign in";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = "Invalid email or password";
      }
      toast({
        title: "Authentication Error",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "Account created",
        description: "Your account has been created successfully",
      });
    } catch (error: any) {
      let message = "Failed to create account";
      if (error.code === 'auth/email-already-in-use') {
        message = "Email already in use";
      }
      toast({
        title: "Authentication Error",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({
        title: "Google Sign in successful",
        description: "Welcome!",
      });
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Failed to sign in with Google",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGithub = async () => {
    try {
      setIsLoading(true);
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      toast({
        title: "GitHub Sign in successful",
        description: "Welcome!",
      });
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Failed to sign in with GitHub",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setIsLoading(true);
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      toast({
        title: "Facebook Sign in successful",
        description: "Welcome!",
      });
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Failed to sign in with Facebook",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInAnonymously = async () => {
    try {
      setIsLoading(true);
      await firebaseSignInAnonymously(auth);
      const tempKey = await generateTempKey();
      setEncryptionKey(tempKey);
      setIsLocalPasswordSet(true);
      toast({
        title: "Demo Mode Activated",
        description: "You're now using the app in demo mode. Your data will only be stored on this device.",
      });
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Failed to start demo mode",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setEncryptionKey(null);
      setIsLocalPasswordSet(false);
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
      throw error;
    }
  };

  const setLocalPassword = async (password: string) => {
    if (!user) {
      throw new Error('No user is signed in');
    }

    try {
      // Generate a key using the user's UID and the provided password
      const key = await deriveKey(user.uid, password);
      setEncryptionKey(key);
      setIsLocalPasswordSet(true);

      // Store a flag indicating that the user has set a password
      await storeSettings({ passwordSet: true }, key);

      toast({
        title: "Security Setup Complete",
        description: "Your local encryption password has been set successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set local password",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    encryptionKey,
    isLocalPasswordSet,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGithub,
    signInWithFacebook,
    signInAnonymously,
    signOut,
    setLocalPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
