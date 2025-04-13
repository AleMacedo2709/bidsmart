
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
        name: isMobile ? property.name.substring(0, 10) + (property.name.length > 10 ? '...' : '') : property.name,
        fullName: property.name,
        roi: parseFloat(roi.toFixed(2)),
        gain: investmentGain
      };
    })
    .sort((a, b) => b.roi - a.roi);

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
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl">ROI por Imóvel</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Retorno sobre o investimento (%) para cada imóvel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[300px] w-full">
          <ChartContainer config={chartConfig}>
            <BarChart 
              data={data} 
              layout="vertical" 
              margin={{ 
                top: 5, 
                right: isMobile ? 20 : 30, 
                left: isMobile ? 60 : 80, 
                bottom: 5 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={isMobile ? 55 : 75}
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="roi" fill="#F43F5E" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ROIBarChart;
