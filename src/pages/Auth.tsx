
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [activeTab, setActiveTab] = useState(initialMode);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      // Navigate to the path they tried to visit or dashboard
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-10">
      <div className="text-center mb-6 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Bem-vindo ao BidSmart
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Gestão de leilões imobiliários segura, privada e poderosa.
        </p>
      </div>

      <div className="w-full max-w-md">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="text-sm sm:text-base">Entrar</TabsTrigger>
            <TabsTrigger value="signup" className="text-sm sm:text-base">Criar Conta</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="animate-fade-in">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup" className="animate-fade-in">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-8">
        <Button variant="outline" asChild>
          <Link to="/">Voltar para página inicial</Link>
        </Button>
      </div>

      <div className="mt-12 bg-white rounded-xl p-6 max-w-md mx-auto shadow-sm border border-gray-100 animate-fade-in">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Seus Dados, Seu Controle</h2>
            <p className="text-gray-600 text-sm">
              Todos os seus dados são criptografados usando AES-256 e armazenados exclusivamente no seu dispositivo.
              Nós não podemos acessar ou ver qualquer informação que você inserir no aplicativo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
