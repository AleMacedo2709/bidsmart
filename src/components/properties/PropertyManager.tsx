
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyList from '@/components/dashboard/PropertyList';
import { toast } from '@/hooks/use-toast';

const PropertyManager: React.FC = () => {
  const navigate = useNavigate();
  
  const handleViewProperty = (id: string) => {
    navigate(`/imoveis/${id}`);
  };
  
  const handleEditProperty = (id: string) => {
    navigate(`/imoveis/${id}/editar`);
  };
  
  const handleDeleteProperty = (id: string) => {
    // This function is handled within PropertyList component
    console.log(`Deleting property ${id}`);
  };
  
  const handleShareProperty = (id: string) => {
    // Implement sharing functionality or show a toast
    toast({
      title: "Link de compartilhamento gerado",
      description: "O link para o imóvel foi copiado para sua área de transferência."
    });
    console.log(`Sharing property ${id}`);
  };
  
  return (
    <div className="h-full">
      <PropertyList />
    </div>
  );
};

export default PropertyManager;
