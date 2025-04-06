
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockFinancialData } from '@/data/mockData';
import { DollarSign, TrendingUp, BarChart3, Percent } from 'lucide-react';

const FinancialMetrics = () => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const metrics = [
    {
      title: 'Investimento Total',
      value: formatCurrency(mockFinancialData.totalInvestment),
      description: 'Valor total investido em imóveis',
      icon: DollarSign,
      color: 'bg-blue-50 text-blue-500',
    },
    {
      title: 'Valor Estimado',
      value: formatCurrency(mockFinancialData.totalEstimatedValue),
      description: 'Valor estimado atual da carteira',
      icon: TrendingUp,
      color: 'bg-green-50 text-green-500',
    },
    {
      title: 'Receita Total',
      value: formatCurrency(mockFinancialData.totalRevenue),
      description: 'Total de receitas geradas',
      icon: BarChart3,
      color: 'bg-purple-50 text-purple-500',
    },
    {
      title: 'ROI Médio',
      value: `${mockFinancialData.roi}%`,
      description: 'Retorno médio sobre investimento',
      icon: Percent,
      color: 'bg-pink-50 text-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{metric.title}</p>
                <p className="text-3xl font-bold">{metric.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
              </div>
              <div className={`p-2 rounded-full ${metric.color}`}>
                <metric.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FinancialMetrics;
