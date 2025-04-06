
import React from 'react';
import PropertyList from '@/components/dashboard/PropertyList';
import AppLayout from '@/components/layout/AppLayout';

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="h-full">
        <h1 className="text-4xl font-bold mb-6 px-8 pt-6">Imóveis</h1>
        <PropertyList />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
