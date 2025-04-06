
import React from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import FinancialMetrics from '@/components/finances/FinancialMetrics';
import InvestmentChart from '@/components/finances/InvestmentChart';
import PortfolioPieChart from '@/components/finances/PortfolioPieChart';
import ROIBarChart from '@/components/finances/ROIBarChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Finances: React.FC = () => {
  return (
    <SidebarLayout>
      <div className="container mx-auto px-4 py-6 min-h-screen">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Finanças</h1>
          <p className="text-gray-500 mt-2">
            Análise financeira dos seus investimentos em imóveis
          </p>
        </div>

        <FinancialMetrics />
        
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="roi">ROI</TabsTrigger>
            <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <InvestmentChart className="mb-6" />
          </TabsContent>
          
          <TabsContent value="roi" className="mt-4">
            <ROIBarChart />
          </TabsContent>
          
          <TabsContent value="portfolio" className="mt-4">
            <PortfolioPieChart />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default Finances;
