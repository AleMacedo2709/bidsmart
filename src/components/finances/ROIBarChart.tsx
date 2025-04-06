
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { mockProperties } from '@/data/mockData';

interface ROIBarChartProps {
  className?: string;
}

const ROIBarChart: React.FC<ROIBarChartProps> = ({ className }) => {
  // Calcular o ROI para cada propriedade
  const data = mockProperties
    .filter(property => property.purchasePrice > 0)
    .map(property => {
      const investmentGain = property.estimatedValue - property.purchasePrice;
      const roi = (investmentGain / property.purchasePrice) * 100;
      
      return {
        name: property.name,
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>ROI por Imóvel</CardTitle>
        <CardDescription>
          Retorno sobre o investimento (%) para cada imóvel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={80} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="roi" fill="#F43F5E" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ROIBarChart;
