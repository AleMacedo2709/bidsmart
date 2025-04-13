
import React, { useState, useEffect } from 'react';
import CalculatorWizard from './CalculatorWizard';
import InitialValues from './InitialValues';
import StepNavigation from './StepNavigation';
import { InitialValuesType } from './InitialValues';

const defaultValues: InitialValuesType = {
  purchasePrice: 500000,
  renovationCosts: 50000,
  sellingPrice: 650000,
  sellingCosts: 20000,
  mortgageAmount: 400000,
  interestRate: 5.5,
  monthsHeld: 12,
  // Default tax information
  taxRate: 15,
  deductions: 10000,
  // Additional required properties
  auctionPrice: 450000,
  assessedValue: 550000,
  resalePrice: 650000,
};

const ModernCalculator = () => {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<InitialValuesType>(defaultValues);
  const [calculatedResults, setCalculatedResults] = useState<any>(null);
  const [canGoNext, setCanGoNext] = useState(true);
  
  useEffect(() => {
    // Initialize with default values
    setValues(defaultValues);
  }, []);

  const handleCalculate = () => {
    // Perform calculations based on the input values
    const purchasePrice = parseFloat(String(values.purchasePrice)) || 0;
    const renovationCosts = parseFloat(String(values.renovationCosts)) || 0;
    const sellingPrice = parseFloat(String(values.sellingPrice)) || 0;
    const sellingCosts = parseFloat(String(values.sellingCosts)) || 0;
    const mortgageAmount = parseFloat(String(values.mortgageAmount)) || 0;
    const interestRate = parseFloat(String(values.interestRate)) || 0;
    const monthsHeld = parseFloat(String(values.monthsHeld)) || 0;
    const taxRate = parseFloat(String(values.taxRate)) || 0;
    const deductions = parseFloat(String(values.deductions)) || 0;

    // Calculate total investment
    const totalInvestment = purchasePrice + renovationCosts;

    // Calculate gross profit
    const grossProfit = sellingPrice - sellingCosts - totalInvestment;

    // Calculate interest paid
    const monthlyInterestRate = interestRate / 100 / 12;
    const interestPaid = mortgageAmount * monthlyInterestRate * monthsHeld;

    // Calculate taxable profit
    const taxableProfit = grossProfit - interestPaid - deductions;

    // Calculate tax amount
    const taxAmount = taxableProfit * (taxRate / 100);

    // Calculate net profit
    const netProfit = grossProfit - taxAmount;

    // Calculate ROI
    const roi = (netProfit / totalInvestment) * 100;

    // Set the calculated results
    setCalculatedResults({
      totalInvestment,
      grossProfit,
      interestPaid,
      taxableProfit,
      taxAmount,
      netProfit,
      roi,
    });
  };
  
  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    handleCalculate();
    // Additional completion logic can be added here
  };
  
  const handleValuesChange = (newValues: InitialValuesType) => {
    setValues(newValues);
  };
  
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="border-b p-6">
        <h2 className="text-2xl font-semibold">Calculadora de Investimento em Leilões</h2>
        <p className="text-gray-500 mt-2">
          Calcule o potencial retorno do seu investimento em leilões imobiliários
        </p>
      </div>
      
      <div className="p-6">
        {step === 1 && (
          <InitialValues 
            values={values} 
            onChange={handleValuesChange} 
          />
        )}
        
        {step > 1 && (
          <CalculatorWizard />
        )}
      </div>
      
      <div className="border-t p-4 flex justify-between">
        <StepNavigation 
          currentStep={step}
          totalSteps={3}
          onNext={handleNextStep}
          onPrevious={handlePreviousStep}
          canGoNext={canGoNext}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
};

export default ModernCalculator;
