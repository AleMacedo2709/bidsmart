
import React, { useState, useEffect } from 'react';
import { mockProperties } from '@/data/mockData';

const FeaturedProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    // Sort properties by profit percentage and take top 3
    const sortedProperties = mockProperties
      .sort((a, b) => calculateProfitPercentage(b) - calculateProfitPercentage(a))
      .slice(0, 3);
    
    setProperties(sortedProperties);
  }, []);

  const calculateCompletionPercentage = (property: Property): number => {
    let completedSteps = 0;
    const totalSteps = 5; // Total number of major steps in the property lifecycle

    // Step 1: Basic property information
    if (property.type && property.address && property.city) {
      completedSteps++;
    }

    // Step 2: Purchase information
    if (property.purchasePrice > 0) {
      completedSteps++;
    }

    // Step 3: Estimated value
    if (property.estimatedValue > 0) {
      completedSteps++;
    }

    // Additional steps could be added based on other property details
    completedSteps += 2; // Assuming some other steps are completed

    return (completedSteps / totalSteps) * 100;
  };

  const calculateProfitPercentage = (property: Property): number => {
    if (!property.purchasePrice) return 0;
    
    const totalInvestment = property.purchasePrice;
    const potentialReturn = property.estimatedValue;

    if (totalInvestment <= 0) return 0;
    
    return ((potentialReturn - totalInvestment) / totalInvestment) * 100;
  };

  return (
    <div className="space-y-6">
      {properties.map((property) => {
        const completionPercentage = calculateCompletionPercentage(property);
        const profitPercentage = calculateProfitPercentage(property);
        
        return (
          <div key={property.id} className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{property.type} - {property.address}</div>
                <div className="text-sm text-gray-500">
                  Compra: R$ {property.purchasePrice.toLocaleString('pt-BR')} • 
                  Estim. Venda: R$ {property.estimatedValue.toLocaleString('pt-BR')}
                </div>
              </div>
              <div className={`font-medium ${profitPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {profitPercentage >= 0 ? '+' : ''}{profitPercentage.toFixed(1)}%
              </div>
            </div>
            
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            
            <div className="text-sm text-gray-500 text-right">
              {completionPercentage.toFixed(0)}% do processo concluído
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturedProperties;

// Define the Property type to match the mock data structure
interface Property {
  id: string;
  type: string;
  address: string;
  city: string;
  purchasePrice: number;
  estimatedValue: number;
  status: string;
}

