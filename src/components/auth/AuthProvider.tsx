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
import { trackAuthAttempt, checkSecurityStatus, verifyDatabaseIntegrity, rotateEncryptionKey } from '@/lib/storage';
import { calculatePasswordStrength } from '@/lib/encryption';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isFirebaseConfigured = !!firebaseConfig.apiKey && 
  !firebaseConfig.apiKey.includes('demo-mode') && 
  !!firebaseConfig.authDomain &&
  !!firebaseConfig.projectId;

let auth;
let app;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

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
  rotateKey: (currentPassword: string, newPassword: string) => Promise<void>;
  verifyDataIntegrity: () => Promise<{ valid: boolean; issues: any[] }>;
  calculatePasswordStrength: (password: string) => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const [isLocalPasswordSet, setIsLocalPasswordSet] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<{ locked: boolean; reason?: string }>({ locked: false });

  useEffect(() => {
    const checkSecurity = async () => {
      const status = await checkSecurityStatus();
      setSecurityStatus(status);
      
      if (status.locked) {
        toast({
          title: "Account Temporarily Locked",
          description: `Too many failed attempts. Try again in ${Math.round((status.unlockTime || 0 - Date.now()) / 60000)} minutes.`,
          variant: "destructive",
        });
      }
    };
    
    checkSecurity();
    
    const interval = setInterval(checkSecurity, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (!currentUser) {
        setEncryptionKey(null);
        setIsLocalPasswordSet(false);
        setIsLoading(false);
        return;
      }
      
      try {
        if (currentUser.isAnonymous) {
          const tempKey = await generateTempKey();
          setEncryptionKey(tempKey);
          setIsLocalPasswordSet(true);
        } else {
          const settings = await retrieveSettings(await deriveKey(currentUser.uid, 'temporary'));
          setIsLocalPasswordSet(!!settings.passwordSet);
          
          if (settings._keyRotationRecommended) {
            toast({
              title: "Security Recommendation",
              description: "For enhanced security, consider updating your encryption password.",
              duration: 10000,
            });
          }
        }
      } catch (error) {
        setIsLocalPasswordSet(false);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      simulateDemoMode();
      return;
    }

    const status = await checkSecurityStatus();
    if (status.locked) {
      toast({
        title: "Account Temporarily Locked",
        description: `Too many failed attempts. Try again in ${Math.round((status.unlockTime || 0 - Date.now()) / 60000)} minutes.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      
      await trackAuthAttempt(true);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      await trackAuthAttempt(false);
      
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
    if (!isFirebaseConfigured) {
      simulateDemoMode();
      return;
    }

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
    if (!isFirebaseConfigured) {
      simulateDemoMode();
      return;
    }

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
    if (!isFirebaseConfigured) {
      simulateDemoMode();
      return;
    }

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
    if (!isFirebaseConfigured) {
      simulateDemoMode();
      return;
    }

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

  const simulateDemoMode = async () => {
    try {
      setIsLoading(true);
      const demoUser = {
        uid: 'demo-user-' + Date.now(),
        isAnonymous: true,
        email: null,
        displayName: 'Demo User'
      } as unknown as FirebaseUser;
      
      setUser(demoUser);
      
      const tempKey = await generateTempKey();
      setEncryptionKey(tempKey);
      setIsLocalPasswordSet(true);
      
      toast({
        title: "Demo Mode Activated",
        description: "You're now using the app in demo mode. Your data will only be stored on this device.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start demo mode",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInAnonymously = async () => {
    if (!isFirebaseConfigured) {
      simulateDemoMode();
      return;
    }

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
      if (isFirebaseConfigured && user) {
        await firebaseSignOut(auth);
      } else {
        setUser(null);
      }
      
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

    const strengthScore = calculatePasswordStrength(password);
    if (strengthScore < 50) {
      toast({
        title: "Weak Password",
        description: "Please use a stronger password with a mix of uppercase, lowercase, numbers and special characters.",
        variant: "destructive",
      });
      throw new Error('Password is too weak');
    }

    try {
      const key = await deriveKey(user.uid, password);
      setEncryptionKey(key);
      setIsLocalPasswordSet(true);

      await storeSettings({ 
        passwordSet: true,
        passwordStrength: strengthScore,
        passwordSetAt: Date.now() 
      }, key);

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

  const rotateKey = async (currentPassword: string, newPassword: string) => {
    if (!user) {
      throw new Error('No user is signed in');
    }

    try {
      setIsLoading(true);
      
      const currentKey = await deriveKey(user.uid, currentPassword);
      
      try {
        await retrieveSettings(currentKey);
      } catch (error) {
        toast({
          title: "Incorrect Password",
          description: "Your current password is incorrect",
          variant: "destructive",
        });
        throw new Error('Current password verification failed');
      }
      
      const strengthScore = calculatePasswordStrength(newPassword);
      if (strengthScore < 70) {
        toast({
          title: "Weak New Password",
          description: "Please use a stronger password. Your new password should be at least as strong as your previous one.",
          variant: "destructive",
        });
        throw new Error('New password is too weak');
      }
      
      const newKey = await deriveKey(user.uid, newPassword);
      
      await rotateEncryptionKey(currentKey, newKey);
      
      setEncryptionKey(newKey);
      
      toast({
        title: "Key Rotation Complete",
        description: "Your encryption key has been updated successfully. All data has been re-encrypted.",
      });
    } catch (error) {
      if ((error as Error).message !== 'Current password verification failed' && 
          (error as Error).message !== 'New password is too weak') {
        toast({
          title: "Key Rotation Failed",
          description: "An error occurred while updating your encryption key.",
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyDataIntegrity = async () => {
    if (!encryptionKey) {
      throw new Error('No encryption key available');
    }
    
    try {
      setIsLoading(true);
      const result = await verifyDatabaseIntegrity(encryptionKey);
      
      if (result.valid) {
        toast({
          title: "Data Integrity Verified",
          description: "All your data is intact and has not been tampered with.",
        });
      } else {
        toast({
          title: "Data Integrity Issues Found",
          description: `${result.issues.length} integrity issues detected. Please restore from backup.`,
          variant: "destructive",
        });
      }
      
      return result;
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Could not complete data integrity verification.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
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
    setLocalPassword,
    rotateKey,
    verifyDataIntegrity,
    calculatePasswordStrength
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
