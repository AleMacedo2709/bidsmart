
import React, { useState, useEffect } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import FinancialMetrics from '@/components/finances/FinancialMetrics';
import InvestmentChart from '@/components/finances/InvestmentChart';
import PortfolioPieChart from '@/components/finances/PortfolioPieChart';
import ROIBarChart from '@/components/finances/ROIBarChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/components/auth/AuthProvider';
import { retrieveData } from '@/lib/storage/crud';
import { initializeWithMockData, isFirstTimeUser } from '@/lib/storage/initialization';
import { mockFinancialData } from '@/data/mockData';
import { Loader2 } from 'lucide-react';

const Finances: React.FC = () => {
  const isMobile = useIsMobile();
  const { encryptionKey } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [financialData, setFinancialData] = useState(mockFinancialData);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Check if first time user and initialize with mock data if needed
        const firstTime = await isFirstTimeUser();
        if (firstTime) {
          await initializeWithMockData();
        }
        
        // Only try to load data if we have an encryption key
        if (encryptionKey) {
          try {
            const data = await retrieveData('settings', 'financial-settings', encryptionKey);
            if (data) {
              setFinancialData(data);
            }
          } catch (error) {
            console.error("Error retrieving financial data:", error);
            // Fallback to mock data if retrieval fails
            setFinancialData(mockFinancialData);
          }
        }
      } catch (error) {
        console.error("Error loading financial data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [encryptionKey]);
  
  return (
    <SidebarLayout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 min-h-screen">
        <div className="mb-4 sm:mb-6">
          <h1 className="page-title">Finanças</h1>
          <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
            Análise financeira dos seus investimentos em imóveis
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-primary">Carregando dados financeiros...</span>
          </div>
        ) : (
          <>
            <FinancialMetrics data={financialData} />
            
            <Tabs defaultValue="overview" className="mt-4 sm:mt-6">
              <TabsList className="w-full max-w-md grid grid-cols-3">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">Visão Geral</TabsTrigger>
                <TabsTrigger value="roi" className="text-xs sm:text-sm">ROI</TabsTrigger>
                <TabsTrigger value="portfolio" className="text-xs sm:text-sm">Portfólio</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-3 sm:mt-4">
                <div className="w-full bg-card rounded-md p-4">
                  <InvestmentChart data={financialData.monthlyData} />
                </div>
              </TabsContent>
              
              <TabsContent value="roi" className="mt-3 sm:mt-4">
                <div className="w-full bg-card rounded-md p-4">
                  <ROIBarChart data={financialData} />
                </div>
              </TabsContent>
              
              <TabsContent value="portfolio" className="mt-3 sm:mt-4">
                <div className="w-full bg-card rounded-md p-4">
                  <PortfolioPieChart data={financialData} />
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </SidebarLayout>
  );
};

export default Finances;
