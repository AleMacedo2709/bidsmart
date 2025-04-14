
import React from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import FinancialMetrics from '@/components/finances/FinancialMetrics';
import InvestmentChart from '@/components/finances/InvestmentChart';
import PortfolioPieChart from '@/components/finances/PortfolioPieChart';
import ROIBarChart from '@/components/finances/ROIBarChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

const Finances: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarLayout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 min-h-screen">
        <div className="mb-4 sm:mb-6">
          <h1 className="page-title">Finanças</h1>
          <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
            Análise financeira dos seus investimentos em imóveis
          </p>
        </div>

        <FinancialMetrics />
        
        <Tabs defaultValue="overview" className="mt-4 sm:mt-6">
          <TabsList className="w-full max-w-md grid grid-cols-3">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Visão Geral</TabsTrigger>
            <TabsTrigger value="roi" className="text-xs sm:text-sm">ROI</TabsTrigger>
            <TabsTrigger value="portfolio" className="text-xs sm:text-sm">Portfólio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-3 sm:mt-4">
            <div className="w-full bg-card rounded-md p-4">
              <InvestmentChart />
            </div>
          </TabsContent>
          
          <TabsContent value="roi" className="mt-3 sm:mt-4">
            <div className="w-full bg-card rounded-md p-4">
              <ROIBarChart />
            </div>
          </TabsContent>
          
          <TabsContent value="portfolio" className="mt-3 sm:mt-4">
            <div className="w-full bg-card rounded-md p-4">
              <PortfolioPieChart />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default Finances;
