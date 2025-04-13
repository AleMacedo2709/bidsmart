
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';

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
              src="/lovable-uploads/08ed5091-1137-4b1f-845e-9821bdc77e69.png" 
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
              <Button asChild className="w-full sm:w-auto">
                <Link to="/dashboard">Ir para o Dashboard</Link>
              </Button>
            ) : (
              <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                <Button asChild variant="default">
                  <Link to="/auth?mode=signup">Começar Agora</Link>
                </Button>
                <Button variant="outline" onClick={handleTryDemo}>
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
              <h3 className="text-lg font-medium text-gray-900">Calculadora de Lucro</h3>
              <p className="mt-2 text-sm text-gray-500">
                Calcule lucros potenciais de seus investimentos em leilões imobiliários
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Simulador de Impostos</h3>
              <p className="mt-2 text-sm text-gray-500">
                Simule implicações de imposto de ganho de capital para suas vendas de imóveis
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Seguro e Privado</h3>
              <p className="mt-2 text-sm text-gray-500">
                Todos os seus dados são criptografados com AES-256 e armazenados apenas no seu dispositivo
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Funciona Offline</h3>
              <p className="mt-2 text-sm text-gray-500">
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
