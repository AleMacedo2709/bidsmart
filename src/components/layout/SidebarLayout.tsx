
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { 
  Home, 
  Building2, 
  Calculator, 
  DollarSign, 
  Settings, 
  LogOut, 
  Info, 
  Menu as MenuIcon, 
  X 
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const { signOut } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Mobile sidebar toggle */}
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="fixed top-2 left-2 z-50 lg:hidden"
            onClick={toggleMobileSidebar}
          >
            {mobileSidebarOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        )}
        
        {/* Sidebar - conditionally shown on mobile */}
        <div className={`${isMobile ? (mobileSidebarOpen ? 'block' : 'hidden') : 'block'} h-full`}>
          <Sidebar className="h-screen">
            <SidebarHeader className="p-0">
              <div className="py-3 px-4 bg-blue-700 text-white font-medium">
                <h3 className="text-md">Menu</h3>
              </div>
            </SidebarHeader>
            <SidebarContent className="bg-blue-600 text-white h-full flex flex-col">
              <SidebarGroup className="flex-grow">
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/dashboard')} onClick={() => isMobile && setMobileSidebarOpen(false)}>
                        <Link to="/dashboard" className="flex items-center gap-2 text-white">
                          <Home className="h-5 w-5" />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/imoveis')} onClick={() => isMobile && setMobileSidebarOpen(false)}>
                        <Link to="/imoveis" className="flex items-center gap-2 text-white">
                          <Building2 className="h-5 w-5" />
                          <span>Imóveis</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/calculator')} onClick={() => isMobile && setMobileSidebarOpen(false)}>
                        <Link to="/calculator" className="flex items-center gap-2 text-white">
                          <Calculator className="h-5 w-5" />
                          <span>Calculadora</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/financas')} onClick={() => isMobile && setMobileSidebarOpen(false)}>
                        <Link to="/financas" className="flex items-center gap-2 text-white">
                          <DollarSign className="h-5 w-5" />
                          <span>Finanças</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/settings')} onClick={() => isMobile && setMobileSidebarOpen(false)}>
                        <Link to="/settings" className="flex items-center gap-2 text-white">
                          <Settings className="h-5 w-5" />
                          <span>Configurações</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/about')} onClick={() => isMobile && setMobileSidebarOpen(false)}>
                        <Link to="/about" className="flex items-center gap-2 text-white">
                          <Info className="h-5 w-5" />
                          <span>Sobre</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              
              <div className="p-4 mt-auto">
                <button 
                  onClick={signOut}
                  className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sair</span>
                </button>
              </div>
              
              <div className="p-4 text-xs text-blue-100">
                © 2025 Arremate Lucro
              </div>
            </SidebarContent>
          </Sidebar>
        </div>
        
        <main className="flex-1 overflow-auto h-screen bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SidebarLayout;
