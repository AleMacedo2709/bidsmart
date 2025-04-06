
import React from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import PropertyManager from '@/components/properties/PropertyManager';

const Properties: React.FC = () => {
  return (
    <SidebarLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Imóveis</h1>
          <p className="text-gray-500 mt-2">
            Gerencie sua carteira de imóveis e acompanhe o desempenho dos seus investimentos.
          </p>
        </div>
        <PropertyManager />
      </div>
    </SidebarLayout>
  );
};

export default Properties;
