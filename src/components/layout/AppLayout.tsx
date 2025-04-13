
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SidebarLayout from './SidebarLayout';
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
      alert('Senhas não coincidem');
      return;
    }

    if (localPassword.length < 8) {
      alert('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    try {
      await setLocalPassword(localPassword);
      setPasswordDialogOpen(false);
    } catch (error) {
      console.error('Falha ao definir senha local:', error);
      alert('Falha ao definir senha local. Por favor, tente novamente.');
    }
  };

  // Use the index page path condition to determine whether to show sidebar
  const isIndexPage = location.pathname === '/';

  if (isIndexPage) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {children}
        
        {/* Local Password Dialog */}
        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Definir Senha de Criptografia</DialogTitle>
              <DialogDescription>
                Esta senha será usada para criptografar seus dados localmente. É importante para sua privacidade e segurança.
                Esta senha nunca é enviada para nossos servidores e não podemos recuperá-la se você esquecer.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="local-password">Senha de Criptografia</Label>
                <Input
                  id="local-password"
                  type="password"
                  placeholder="Digite uma senha forte"
                  value={localPassword}
                  onChange={(e) => setLocalPasswordValue(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSetPassword}>Definir Senha</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // For other pages, use the SidebarLayout
  return (
    <SidebarLayout>
      {children}
      
      {/* Local Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Definir Senha de Criptografia</DialogTitle>
            <DialogDescription>
              Esta senha será usada para criptografar seus dados localmente. É importante para sua privacidade e segurança.
              Esta senha nunca é enviada para nossos servidores e não podemos recuperá-la se você esquecer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="local-password">Senha de Criptografia</Label>
              <Input
                id="local-password"
                type="password"
                placeholder="Digite uma senha forte"
                value={localPassword}
                onChange={(e) => setLocalPasswordValue(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSetPassword}>Definir Senha</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  );
};

export default AppLayout;
