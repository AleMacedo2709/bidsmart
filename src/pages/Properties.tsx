
import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import SidebarLayout from '@/components/layout/SidebarLayout';
import PropertyManager from '@/components/properties/PropertyManager';
import PropertyForm from '@/components/properties/PropertyForm';
import PropertyDetail from '@/components/properties/PropertyDetail';
import { initializeWithMockData, isFirstTimeUser } from '@/lib/storage/initialization';

const Properties: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const isAddRoute = location.pathname === '/imoveis/adicionar';
  const isDetailRoute = location.pathname.match(/^\/imoveis\/[^/]+$/);
  const propertyId = params.id;

  useEffect(() => {
    // Initialize data if needed
    const checkAndInitialize = async () => {
      const firstTime = await isFirstTimeUser();
      if (firstTime) {
        await initializeWithMockData();
      }
    };
    
    checkAndInitialize().catch(console.error);
  }, []);

  return (
    <SidebarLayout>
      <div className="container mx-auto px-4 py-6 min-h-screen">
        {!isAddRoute && !isDetailRoute && (
          <>
            <div className="mb-8">
              <h1 className="page-title">Imóveis</h1>
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

        {isDetailRoute && propertyId && (
          <PropertyDetail propertyId={propertyId} />
        )}
      </div>
    </SidebarLayout>
  );
};

export default Properties;
