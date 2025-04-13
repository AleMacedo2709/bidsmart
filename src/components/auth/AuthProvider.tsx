
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

// Create a context with undefined as the default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the hook to get authentication state and methods
  const auth = useAuthProvider();
  
  // Provide the auth object to all child components
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
