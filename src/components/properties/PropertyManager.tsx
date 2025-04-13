
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyList from '@/components/dashboard/PropertyList';

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
  };
  
  const handleShareProperty = (id: string) => {
    // Implement sharing functionality or show a toast
    console.log(`Sharing property ${id}`);
  };
  
  return (
    <PropertyList 
      onView={handleViewProperty}
      onEdit={handleEditProperty}
      onDelete={handleDeleteProperty}
      onShare={handleShareProperty}
    />
  );
};

export default PropertyManager;
