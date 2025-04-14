
import React, { useEffect } from 'react';
import ModernCalculator from '@/components/calculator/ModernCalculator';
import AppLayout from '@/components/layout/AppLayout';
import { initializeWithMockData, isFirstTimeUser } from '@/lib/storage/initialization';

const Calculator = () => {
  useEffect(() => {
    // Initialize data if needed
    const checkAndInitialize = async () => {
      const firstTime = await isFirstTimeUser();
      if (firstTime) {
        await initializeWithMockData();
      }
    };
    
    checkAndInitialize().catch(console.error);
  }, []);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="page-title">Calculadora de Lucro</h1>
          <p className="text-gray-500">
            Simule potenciais lucros, custos e implicações tributárias para seus investimentos em leilões imobiliários.
          </p>
        </div>
        
        <ModernCalculator />
      </div>
    </AppLayout>
  );
};

export default Calculator;
