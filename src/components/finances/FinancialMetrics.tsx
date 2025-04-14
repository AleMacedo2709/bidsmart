
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { mockFinancialData } from '@/data/mockData';
import { DollarSign, TrendingUp, BarChart3, Percent } from 'lucide-react';

interface FinancialMetricsProps {
  className?: string;
}

const FinancialMetrics: React.FC<FinancialMetricsProps> = ({ className }) => {
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
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 ${className}`}>
      {metrics.map((metric, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-3 sm:p-4 md:pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">{metric.title}</p>
                <p className="text-lg sm:text-xl md:text-3xl font-bold">{metric.value}</p>
                <p className="text-xs text-muted-foreground mt-1 hidden sm:block">{metric.description}</p>
              </div>
              <div className={`p-1.5 sm:p-2 rounded-full ${metric.color}`}>
                <metric.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FinancialMetrics;
