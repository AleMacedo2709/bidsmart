
import React from 'react';
import PropertyList from '@/components/dashboard/PropertyList';
import AppLayout from '@/components/layout/AppLayout';

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold mb-8">Imóveis</h1>
        <PropertyList />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
