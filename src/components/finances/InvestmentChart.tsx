
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { mockFinancialData } from '@/data/mockData';

interface InvestmentChartProps {
  className?: string;
}

const InvestmentChart: React.FC<InvestmentChartProps> = ({ className }) => {
  const chartConfig = {
    investment: {
      label: 'Investimento',
      color: '#7E69AB',
    },
    value: {
      label: 'Valor Estimado',
      color: '#8B5CF6',
    },
  };

  // Format currency for labels
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Custom label for data points
  const renderCustomizedLabel = (props: any) => {
    const { x, y, value, index } = props;
    // Show labels only for first, middle and last points to avoid cluttering
    if (index === 0 || index === Math.floor(mockFinancialData.monthlyData.length / 2) || index === mockFinancialData.monthlyData.length - 1) {
      return (
        <text x={x} y={y - 10} fill="#666" fontSize={9} textAnchor="middle">
          {formatCurrency(value)}
        </text>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Evolução do Investimento</h3>
        <p className="text-sm text-muted-foreground">
          Comparação entre o valor investido e o valor estimado dos imóveis ao longo do tempo
        </p>
      </div>
      <div className="w-full h-[250px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={mockFinancialData.monthlyData}
              margin={{ top: 30, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 9 }}
                height={30}
                tickMargin={5}
              >
                <Label value="Mês" position="insideBottom" offset={-10} style={{ fontSize: 10 }} />
              </XAxis>
              <YAxis 
                tick={{ fontSize: 9 }}
                tickFormatter={formatCurrency}
                width={50}
                tickMargin={3}
              >
                <Label value="Valor (R$)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: 10 }} />
              </YAxis>
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Area
                type="monotone"
                dataKey="investment"
                stroke="#7E69AB"
                fill="#7E69AB"
                fillOpacity={0.3}
                strokeWidth={2}
                name="Investimento"
                label={renderCustomizedLabel}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.3}
                strokeWidth={2}
                name="Valor Estimado"
                label={renderCustomizedLabel}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default InvestmentChart;
