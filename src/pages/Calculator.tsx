
import React from 'react';
import CalculatorWizard from '@/components/calculator/CalculatorWizard';
import AppLayout from '@/components/layout/AppLayout';

const Calculator = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Profit & Tax Calculator</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Calculate potential profits and tax implications for your auction property investments.
            Complete each step to generate a comprehensive analysis.
          </p>
        </div>
        
        <div className="bg-card shadow-md rounded-xl border border-border/40 overflow-hidden">
          <CalculatorWizard />
        </div>
      </div>
    </AppLayout>
  );
};

export default Calculator;
