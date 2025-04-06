
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { mockFinancialData } from '@/data/mockData';

interface PortfolioPieChartProps {
  className?: string;
}

const PortfolioPieChart: React.FC<PortfolioPieChartProps> = ({ className }) => {
  const data = [
    { name: 'Ativos', value: mockFinancialData.properties.active, color: '#10B981' },
    { name: 'Em Processo', value: mockFinancialData.properties.inProcess, color: '#F59E0B' },
    { name: 'Vendidos', value: mockFinancialData.properties.sold, color: '#6366F1' }
  ];

  const chartConfig = {
    Ativos: {
      label: 'Ativos',
      color: '#10B981',
    },
    'Em Processo': {
      label: 'Em Processo',
      color: '#F59E0B',
    },
    Vendidos: {
      label: 'Vendidos',
      color: '#6366F1',
    },
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Distribuição do Portfólio</CardTitle>
        <CardDescription>
          Distribuição dos imóveis por status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioPieChart;
