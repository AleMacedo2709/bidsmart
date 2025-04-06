
import React from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import PropertyManager from '@/components/properties/PropertyManager';

const Properties: React.FC = () => {
  return (
    <SidebarLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-8">Imóveis</h1>
        <PropertyManager />
      </div>
    </SidebarLayout>
  );
};

export default Properties;
