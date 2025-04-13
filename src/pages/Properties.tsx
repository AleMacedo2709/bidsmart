
import React from 'react';
import { useLocation } from 'react-router-dom';
import SidebarLayout from '@/components/layout/SidebarLayout';
import PropertyManager from '@/components/properties/PropertyManager';
import PropertyForm from '@/components/properties/PropertyForm';

const Properties: React.FC = () => {
  const location = useLocation();
  const isAddRoute = location.pathname === '/imoveis/adicionar';
  const isDetailRoute = location.pathname.match(/^\/imoveis\/[^/]+$/);

  return (
    <SidebarLayout>
      <div className="container mx-auto px-4 py-6 min-h-screen">
        {!isAddRoute && !isDetailRoute && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Imóveis</h1>
              <p className="text-gray-500 mt-2">
                Gerencie sua carteira de imóveis e acompanhe o desempenho dos seus investimentos.
              </p>
            </div>
            <PropertyManager />
          </>
        )}

        {isAddRoute && (
          <PropertyForm />
        )}

        {isDetailRoute && (
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-4">Detalhes do Imóvel</h2>
            <p className="text-gray-500">Esta página mostrará os detalhes do imóvel selecionado.</p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default Properties;
