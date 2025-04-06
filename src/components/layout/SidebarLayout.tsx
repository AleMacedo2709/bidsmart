
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
  Menu, 
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
            {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}
        
        {/* Sidebar - conditionally shown on mobile */}
        <div className={`${isMobile ? (mobileSidebarOpen ? 'block' : 'hidden') : 'block'} h-full`}>
          <Sidebar className="h-screen">
            <SidebarHeader>
              <div className="px-4 py-4 sm:py-6">
                <h2 className="text-lg sm:text-xl font-bold text-white">Arremate Lucro</h2>
              </div>
            </SidebarHeader>
            <SidebarContent className="bg-blue-600 text-white h-full flex flex-col">
              <SidebarGroup className="flex-grow">
                <div className="px-4 py-2">
                  <p className="text-xs sm:text-sm font-medium text-blue-100">Menu</p>
                </div>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/dashboard')} onClick={() => isMobile && setMobileSidebarOpen(false)}>
                        <Link to="/dashboard" className="flex items-center gap-2 text-white text-sm sm:text-base">
                          <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/imoveis')} onClick={() => isMobile && setMobileSidebarOpen(false)}>
                        <Link to="/imoveis" className="flex items-center gap-2 text-white text-sm sm:text-base">
                          <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>Imóveis</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/calculator')} onClick={() => isMobile && setMobileSidebarOpen(false)}>
                        <Link to="/calculator" className="flex items-center gap-2 text-white text-sm sm:text-base">
                          <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>Calculadora</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/financas')} onClick={() => isMobile && setMobileSidebarOpen(false)}>
                        <Link to="/financas" className="flex items-center gap-2 text-white text-sm sm:text-base">
                          <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>Finanças</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/about')} onClick={() => isMobile && setMobileSidebarOpen(false)}>
                        <Link to="/about" className="flex items-center gap-2 text-white text-sm sm:text-base">
                          <Info className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>Sobre</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/settings')} onClick={() => isMobile && setMobileSidebarOpen(false)}>
                        <Link to="/settings" className="flex items-center gap-2 text-white text-sm sm:text-base">
                          <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>Configurações</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              
              <div className="p-4 mt-auto">
                <button 
                  onClick={signOut}
                  className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors text-sm sm:text-base"
                >
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Sair</span>
                </button>
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
