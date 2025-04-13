
import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
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
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
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
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Distribuição do Portfólio</h3>
        <p className="text-sm text-muted-foreground">
          Distribuição dos imóveis por status
        </p>
      </div>
      <div className="w-full h-[300px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}  // Aumentei de 80 para 120
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
                wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default PortfolioPieChart;
