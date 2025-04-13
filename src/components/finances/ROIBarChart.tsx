
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { mockProperties } from '@/data/mockData';
import { useIsMobile } from '@/hooks/use-mobile';

interface ROIBarChartProps {
  className?: string;
}

const ROIBarChart: React.FC<ROIBarChartProps> = ({ className }) => {
  const isMobile = useIsMobile();
  
  // Calcular o ROI para cada propriedade
  const data = mockProperties
    .filter(property => property.purchasePrice > 0)
    .map(property => {
      const investmentGain = property.estimatedValue - property.purchasePrice;
      const roi = (investmentGain / property.purchasePrice) * 100;
      
      return {
        name: isMobile ? property.name.substring(0, 4) + '...' : property.name.substring(0, 6) + (property.name.length > 6 ? '...' : ''),
        fullName: property.name,
        roi: parseFloat(roi.toFixed(1)),
        gain: investmentGain
      };
    })
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 4); // Reduced to 4 properties for better display

  const chartConfig = {
    roi: {
      label: 'ROI (%)',
      color: '#F43F5E',
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow text-sm">
          <p className="font-medium">{payload[0].payload.fullName || payload[0].payload.name}</p>
          <p>ROI: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">ROI por Imóvel</h3>
        <p className="text-sm text-muted-foreground">
          Retorno sobre o investimento (%) para cada imóvel
        </p>
      </div>
      <div className="w-full h-[250px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              layout="vertical" 
              margin={{ top: 20, right: 45, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                tick={{ fontSize: 9 }}
                domain={[0, 'dataMax']}
                tickMargin={5}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={40}
                tick={{ fontSize: 9 }}
                tickMargin={5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="roi" fill="#F43F5E" radius={[0, 4, 4, 0]}>
                <LabelList 
                  dataKey="roi" 
                  position="right" 
                  formatter={(value: number) => `${value}%`}
                  style={{ fontSize: 9, fill: '#666' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default ROIBarChart;
