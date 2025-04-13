
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PropertyManager from '@/components/properties/PropertyManager';
import PropertyForm from '@/components/properties/PropertyForm';
import PropertyDetail from '@/components/properties/PropertyDetail';

const Properties: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const isAddRoute = location.pathname === '/imoveis/adicionar';
  const isDetailRoute = location.pathname.match(/^\/imoveis\/[^/]+$/);
  const propertyId = params.id;

  return (
    <div className="w-full h-full overflow-auto">
      <div className="container mx-auto px-4 py-6">
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

        {isDetailRoute && propertyId && (
          <PropertyDetail propertyId={propertyId} />
        )}
      </div>
    </div>
  );
};

export default Properties;
