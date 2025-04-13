
import React, { useState } from 'react';
import { Routes, Route, useLocation, useParams, useNavigate } from 'react-router-dom';
import PropertyManager from '@/components/properties/PropertyManager';
import PropertyForm from '@/components/properties/PropertyForm';
import PropertyDetail from '@/components/properties/PropertyDetail';
import PropertyEditForm from '@/components/properties/PropertyEditForm';
import { retrieveData, updateData } from '@/lib/storage';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { mockProperties } from '@/data/mockData';

const Properties: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { encryptionKey } = useAuth();
  const [property, setProperty] = useState<any>(null);
  
  const isAddRoute = location.pathname === '/imoveis/adicionar';
  const isEditRoute = location.pathname.includes('/editar');
  const isDetailRoute = location.pathname.match(/^\/imoveis\/[^/]+$/) && !isAddRoute && !isEditRoute;
  
  const propertyId = params.id || '';

  const handleCancelEdit = () => {
    navigate(`/imoveis/${propertyId}`);
  };

  const handleSavePropertyEdit = async (updatedProperty: any) => {
    try {
      if (encryptionKey) {
        await updateData('properties', propertyId, updatedProperty, encryptionKey);
      }
      
      localStorage.setItem('currentViewProperty', JSON.stringify(updatedProperty));
      
      setProperty(updatedProperty);
      
      toast({
        title: "Imóvel atualizado",
        description: "As informações do imóvel foram atualizadas com sucesso.",
      });
      
      navigate(`/imoveis/${propertyId}`);
    } catch (error) {
      console.error('Erro ao atualizar imóvel:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar as informações do imóvel.",
        variant: "destructive",
      });
    }
  };

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
          <Route path=":id" element={<PropertyDetail propertyId={propertyId} />} />
          <Route path=":id/editar" element={
            <PropertyEditForm 
              property={property || mockProperties.find(p => p.id === propertyId) || {}} 
              onSave={handleSavePropertyEdit}
              onCancel={handleCancelEdit}
            />
          } />
        </Routes>
      </div>
    </div>
  );
};

export default Properties;
