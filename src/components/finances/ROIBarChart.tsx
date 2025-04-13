
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';
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
        name: isMobile ? property.name.substring(0, 6) + (property.name.length > 6 ? '...' : '') : property.name.substring(0, 8) + (property.name.length > 8 ? '...' : ''),
        fullName: property.name,
        roi: parseFloat(roi.toFixed(1)),
        gain: investmentGain
      };
    })
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 4); // Reduced from 5 to 4 properties for better display

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
        <CardTitle className="text-lg">ROI por Imóvel</CardTitle>
        <CardDescription className="text-xs">
          Retorno sobre o investimento (%) para cada imóvel
        </CardDescription>
      </CardHeader>
      <CardContent className="p-1 sm:p-2">
        <div className="h-[220px] w-full flex items-center justify-center">
          <ChartContainer config={chartConfig}>
            <BarChart 
              width={300}
              height={200}
              data={data} 
              layout="vertical" 
              margin={{ 
                top: 5, 
                right: 30, 
                left: 5, 
                bottom: 5 
              }}
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
                width={50}
                tick={{ fontSize: 9 }}
                tickMargin={5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="roi" fill="#F43F5E" radius={[0, 4, 4, 0]}>
                <LabelList 
                  dataKey="roi" 
                  position="right" 
                  formatter={(value: number) => `${value}%`}
                  style={{ fontSize: 9 }}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ROIBarChart;
