
import React from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import PropertyManager from '@/components/properties/PropertyManager';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Properties: React.FC = () => {
  return (
    <SidebarLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Imóveis</h1>
          <Button className="rounded-md flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Imóvel
          </Button>
        </div>
        <PropertyManager />
      </div>
    </SidebarLayout>
  );
};

export default Properties;
