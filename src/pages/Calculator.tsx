
import React from 'react';
import CalculatorWizard from '@/components/calculator/CalculatorWizard';
import AppLayout from '@/components/layout/AppLayout';

const Calculator = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profit & Tax Calculator</h1>
        <p className="text-gray-500 mb-8">
          Calculate potential profits and tax implications for your auction property investments.
          Complete each step to generate a comprehensive analysis.
        </p>
        
        <CalculatorWizard />
      </div>
    </AppLayout>
  );
};

export default Calculator;
