
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalculationResults, CalculatorInput } from '@/types/calculator';
import { Separator } from '@/components/ui/separator';

interface ResultsSummaryProps {
  results: CalculationResults;
  formData: CalculatorInput;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ results, formData }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resultado da Simulação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Investimento Total</h3>
              <p className="text-2xl font-semibold">
                {formatCurrency(results.valorArremate + results.custasAquisicao + results.custasManutencao)}
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Lucro Bruto</h3>
              <p className={`text-2xl font-semibold ${results.lucro.bruto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(results.lucro.bruto)}
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">ROI</h3>
              <p className={`text-2xl font-semibold ${results.lucro.porcentagem >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(results.lucro.porcentagem)}
              </p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Custas de Aquisição</h3>
              <p className="text-xl font-semibold text-red-600">
                {formatCurrency(results.custasAquisicao)}
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Custas de Manutenção</h3>
              <p className="text-xl font-semibold text-red-600">
                {formatCurrency(results.custasManutencao)}
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Custas de Venda</h3>
              <p className="text-xl font-semibold text-red-600">
                {formatCurrency(results.custasVenda)}
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full"
            >
              {showDetails ? "Ocultar Detalhes" : "Mostrar Detalhes"}
            </Button>
            
            {showDetails && (
              <div className="mt-4 border rounded-lg divide-y">
                {results.detalhes.map((item, index) => (
                  <div key={index} className="flex justify-between p-3">
                    <span>{item.label}</span>
                    <span className={`font-medium ${item.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between p-3 font-bold">
                  <span>Saldo Final</span>
                  <span className={`${results.lucro.bruto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(results.lucro.bruto)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsSummary;
