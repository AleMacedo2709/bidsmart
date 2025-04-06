
import React, { ReactNode } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: ReactNode;
  iconBg: string;
  isPositive?: boolean;
  subTextColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtext, 
  icon, 
  iconBg,
  isPositive,
  subTextColor
}) => {
  return (
    <div className="bg-white border rounded-lg p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-700 font-medium">{title}</h3>
        <div className={`p-2 rounded-full ${iconBg}`}>
          {icon}
        </div>
      </div>
      
      <div className="mt-1">
        <div className="text-3xl font-bold">{value}</div>
        
        <div className={`mt-1 flex items-center ${
          subTextColor ? subTextColor : 
          isPositive === true ? 'text-green-600' : 
          isPositive === false ? 'text-red-500' : 
          'text-gray-500'
        }`}>
          {isPositive === true && <ArrowUp className="h-4 w-4 mr-1" />}
          {isPositive === false && <ArrowDown className="h-4 w-4 mr-1" />}
          <span className="text-sm">{subtext}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
