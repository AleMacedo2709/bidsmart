
/**
 * Core authentication provider hook
 */
import { useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { 
  deriveKey, 
  generateTempKey, 
  calculatePasswordStrength 
} from '@/lib/encryption';
import { 
  storeSettings, 
  retrieveSettings, 
  trackAuthAttempt,
  checkSecurityStatus,
  verifyDatabaseIntegrity,
  rotateEncryptionKey
} from '@/lib/storage';
import { toast } from '@/hooks/use-toast';
import {
  getFirebaseAuth,
  isFirebaseConfigured,
  signIn as firebaseSignIn,
  signUp as firebaseSignUp,
  signInWithGoogle as firebaseSignInWithGoogle,
  signInWithGithub as firebaseSignInWithGithub,
  signInWithFacebook as firebaseSignInWithFacebook,
  signInAnonymously as firebaseSignInAnonymously,
  signOut as firebaseSignOut
} from '../services/firebase';

export const useAuthProvider = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const [isLocalPasswordSet, setIsLocalPasswordSet] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<{ 
    locked: boolean; 
    reason?: string;
    unlockTime?: number;
  }>({ locked: false });

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

    const auth = getFirebaseAuth();
    if (!auth) {
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
      if (!isFirebaseConfigured) {
        toast({
          title: "Firebase Not Configured",
          description: "Firebase credentials are missing. Switching to demo mode.",
        });
        await simulateDemoMode();
        return;
      }
      
      await firebaseSignIn(email, password);
      
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
    try {
      setIsLoading(true);
      if (!isFirebaseConfigured) {
        toast({
          title: "Firebase Not Configured",
          description: "Firebase credentials are missing. Switching to demo mode.",
        });
        await simulateDemoMode();
        return;
      }
      
      await firebaseSignUp(email, password);
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
      await firebaseSignInWithGoogle();
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
      await firebaseSignInWithGithub();
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
      await firebaseSignInWithFacebook();
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
    try {
      setIsLoading(true);
      await firebaseSignInAnonymously();
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

  const handleSignOut = async () => {
    try {
      if (isFirebaseConfigured && user) {
        await firebaseSignOut();
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

  return {
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
    signOut: handleSignOut,
    setLocalPassword: async (password: string) => {
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
    },
    rotateKey: async (currentPassword: string, newPassword: string) => {
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
    },
    verifyDataIntegrity: async () => {
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
    },
    calculatePasswordStrength
  };
};
