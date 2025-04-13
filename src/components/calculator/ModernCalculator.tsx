
import React, { useState, useEffect } from 'react';
import InitialValues from './InitialValues';
import StepNavigation from './StepNavigation';
import { InitialValuesType } from './InitialValues';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/calculations';

const defaultValues: InitialValuesType = {
  purchasePrice: 500000,
  renovationCosts: 50000,
  sellingPrice: 650000,
  sellingCosts: 20000,
  mortgageAmount: 400000,
  interestRate: 5.5,
  monthsHeld: 12,
  taxRate: 15,
  deductions: 10000,
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
    } else {
      handleCalculate();
      setStep(4); // Mostrar resultados
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    handleCalculate();
  };
  
  const handleValuesChange = (newValues: InitialValuesType) => {
    setValues(newValues);
  };
  
  // Renderizar os resultados
  const renderResults = () => {
    if (!calculatedResults) return null;
    
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Resultados</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Investimento Total</h3>
              <p className="text-xl font-semibold">{formatCurrency(calculatedResults.totalInvestment)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Lucro Bruto</h3>
              <p className={`text-xl font-semibold ${calculatedResults.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(calculatedResults.grossProfit)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Juros Pagos</h3>
              <p className="text-xl font-semibold text-red-600">
                {formatCurrency(calculatedResults.interestPaid)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Lucro Tributável</h3>
              <p className="text-xl font-semibold">
                {formatCurrency(calculatedResults.taxableProfit)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Impostos</h3>
              <p className="text-xl font-semibold text-red-600">
                {formatCurrency(calculatedResults.taxAmount)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Lucro Líquido</h3>
              <p className={`text-xl font-semibold ${calculatedResults.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(calculatedResults.netProfit)}
              </p>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 md:col-span-2">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-500">ROI (Retorno sobre Investimento)</h3>
              <p className={`text-2xl font-semibold ${calculatedResults.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculatedResults.roi.toFixed(2)}%
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-center mt-6">
          <button 
            onClick={() => setStep(1)} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Nova Simulação
          </button>
        </div>
      </div>
    );
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
        {step < 4 ? (
          <InitialValues 
            values={values} 
            onChange={handleValuesChange} 
          />
        ) : (
          renderResults()
        )}
      </div>
      
      {step < 4 && (
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
      )}
    </div>
  );
};

export default ModernCalculator;
