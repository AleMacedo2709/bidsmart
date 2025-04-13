import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { ArrowRight, PlayCircle, ShieldCheck, Calculator, LineChart } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, signInAnonymously } = useAuth();

  const handleTryDemo = async () => {
    await signInAnonymously();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/beb44d81-2944-4436-8fa1-4d4dc91797c3.png" 
              alt="BidSmart Logo" 
              className="h-24 w-auto sm:h-32"
            />
          </div>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Seu aliado inteligente em leilões. 
            Seguro, privado e poderoso. Todos os seus dados são criptografados e armazenados localmente.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            {isAuthenticated ? (
              <Button asChild variant="gradient" size="lg" className="gap-2">
                <Link to="/dashboard">
                  Ir para o Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                <Button asChild variant="gradient" size="lg" className="gap-2">
                  <Link to="/auth?mode=signup">
                    Começar Agora
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" onClick={handleTryDemo} className="gap-2">
                  <PlayCircle className="h-4 w-4" />
                  Experimentar Demo
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Principais Recursos
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Tudo o que você precisa para gerenciar seus investimentos em leilões imobiliários
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Calculator className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Calculadora de Lucro</h3>
              </div>
              <p className="text-sm text-gray-500">
                Calcule lucros potenciais de seus investimentos em leilões imobiliários
              </p>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <LineChart className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Simulador de Impostos</h3>
              </div>
              <p className="text-sm text-gray-500">
                Simule implicações de imposto de ganho de capital para suas vendas de imóveis
              </p>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Seguro e Privado</h3>
              </div>
              <p className="text-sm text-gray-500">
                Todos os seus dados são criptografados com AES-256 e armazenados apenas no seu dispositivo
              </p>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Funciona Offline</h3>
              </div>
              <p className="text-sm text-gray-500">
                Funcionalidade completa sem conexão com a internet
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Button asChild variant="outline">
              <Link to="/institutional">Saiba Mais</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} BidSmart. Todos os direitos reservados.
            <Link to="/privacy-policy" className="ml-2 text-primary hover:underline">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
