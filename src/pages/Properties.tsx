
import React from 'react';
import { Routes, Route, useLocation, useParams } from 'react-router-dom';
import PropertyManager from '@/components/properties/PropertyManager';
import PropertyForm from '@/components/properties/PropertyForm';
import PropertyDetail from '@/components/properties/PropertyDetail';
import PropertyEditForm from '@/components/properties/PropertyEditForm';

const Properties: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  
  const isAddRoute = location.pathname === '/imoveis/adicionar';
  const isEditRoute = location.pathname.includes('/editar');
  const isDetailRoute = location.pathname.match(/^\/imoveis\/[^/]+$/) && !isAddRoute && !isEditRoute;
  
  const propertyId = params.id;

  return (
    <div className="h-full overflow-auto">
      <div className="container mx-auto px-4 py-6">
        {!isAddRoute && !isDetailRoute && !isEditRoute && (
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

        <Routes>
          <Route path="adicionar" element={<PropertyForm />} />
          <Route path=":id" element={<PropertyDetail propertyId={propertyId || ''} />} />
          <Route path=":id/editar" element={<PropertyEditForm propertyId={propertyId || ''} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Properties;
