
import React from 'react';
import ModernCalculator from '@/components/calculator/ModernCalculator';
import AppLayout from '@/components/layout/AppLayout';

const Calculator = () => {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Calculadora de Lucro</h1>
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
