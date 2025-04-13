
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Evolução do Investimento</CardTitle>
        <CardDescription>
          Comparação entre o valor investido e o valor estimado dos imóveis ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ChartContainer config={chartConfig}>
            <AreaChart 
              data={mockFinancialData.monthlyData}
              margin={{ top: 20, right: 20, left: 5, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 11 }}
                height={30}
              >
                <Label value="Mês" position="insideBottom" offset={-10} style={{ fontSize: 12 }} />
              </XAxis>
              <YAxis 
                tick={{ fontSize: 11 }}
                tickFormatter={formatCurrency}
                width={60}
              >
                <Label value="Valor (R$)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: 12 }} />
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
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.3}
                strokeWidth={2}
                name="Valor Estimado"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentChart;
