
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLocalPasswordSet, setLocalPassword } = useAuth();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [localPassword, setLocalPasswordValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !location.pathname.includes('/auth') && !location.pathname.includes('/institutional')) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate, location.pathname]);

  // Show password dialog if authenticated but no local password set
  useEffect(() => {
    if (isAuthenticated && !isLocalPasswordSet && !passwordDialogOpen) {
      setPasswordDialogOpen(true);
    }
  }, [isAuthenticated, isLocalPasswordSet, passwordDialogOpen]);

  const handleSetPassword = async () => {
    if (localPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (localPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    try {
      await setLocalPassword(localPassword);
      setPasswordDialogOpen(false);
    } catch (error) {
      console.error('Failed to set local password:', error);
      alert('Failed to set local password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-6 px-4">
        {children}
      </main>

      {/* Local Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Encryption Password</DialogTitle>
            <DialogDescription>
              This password will be used to encrypt your data locally. It's important for your privacy and security. 
              This password is never sent to our servers and we cannot recover it for you if you forget it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="local-password">Encryption Password</Label>
              <Input
                id="local-password"
                type="password"
                placeholder="Enter a strong password"
                value={localPassword}
                onChange={(e) => setLocalPasswordValue(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSetPassword}>Set Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppLayout;
