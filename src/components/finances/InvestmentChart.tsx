
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Evolução do Investimento</CardTitle>
        <CardDescription>
          Comparação entre o valor investido e o valor estimado dos imóveis ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={chartConfig}>
            <AreaChart 
              data={mockFinancialData.monthlyData}
              margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="investment"
                stroke="#7E69AB"
                fill="#7E69AB"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentChart;
