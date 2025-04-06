
import React from 'react';
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
import { Home, Building2, Calculator, DollarSign, Settings, LogOut, Info } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const { signOut } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar>
          <SidebarHeader>
            <div className="px-4 py-6">
              <h2 className="text-xl font-bold text-white">Arremate Lucro</h2>
            </div>
          </SidebarHeader>
          <SidebarContent className="bg-blue-600 text-white h-full flex flex-col">
            <SidebarGroup className="flex-grow">
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-blue-100">Menu</p>
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/dashboard')}>
                      <Link to="/dashboard" className="flex items-center gap-2 text-white">
                        <Home className="h-5 w-5" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/imoveis')}>
                      <Link to="/imoveis" className="flex items-center gap-2 text-white">
                        <Building2 className="h-5 w-5" />
                        <span>Imóveis</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/calculator')}>
                      <Link to="/calculator" className="flex items-center gap-2 text-white">
                        <Calculator className="h-5 w-5" />
                        <span>Calculadora</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/financas')}>
                      <Link to="/financas" className="flex items-center gap-2 text-white">
                        <DollarSign className="h-5 w-5" />
                        <span>Finanças</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/about')}>
                      <Link to="/about" className="flex items-center gap-2 text-white">
                        <Info className="h-5 w-5" />
                        <span>Sobre</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/settings')}>
                      <Link to="/settings" className="flex items-center gap-2 text-white">
                        <Settings className="h-5 w-5" />
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
                className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </div>
          </SidebarContent>
        </Sidebar>
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SidebarLayout;
