
import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
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

  // Custom renderer for the pie chart labels
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, value } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={10}
      >
        {`${value} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>Distribuição do Portfólio</CardTitle>
        <CardDescription>
          Distribuição dos imóveis por status
        </CardDescription>
      </CardHeader>
      <CardContent className="p-1 sm:p-2">
        <div className="h-[220px] w-full flex items-center justify-center">
          <ChartContainer config={chartConfig}>
            <PieChart width={250} height={200} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={50}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
              />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioPieChart;
