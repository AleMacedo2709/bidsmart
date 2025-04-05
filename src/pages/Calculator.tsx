
import React from 'react';
import ModernCalculator from '@/components/calculator/ModernCalculator';
import AppLayout from '@/components/layout/AppLayout';

const Calculator = () => {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Simulador de Leilão de Imóveis
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Calcule potenciais lucros, custos e implicações tributárias para seus investimentos em leilões imobiliários.
          </p>
        </div>
        
        <ModernCalculator />
      </div>
    </AppLayout>
  );
};

export default Calculator;
