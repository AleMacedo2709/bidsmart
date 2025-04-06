
/**
 * Authentication provider component
 */
import React, { createContext, useContext } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { useAuthProvider } from './hooks/useAuthProvider';

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
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
