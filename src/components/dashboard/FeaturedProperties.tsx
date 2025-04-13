
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { retrieveAllData } from '@/lib/storage';

interface Property {
  id: string;
  type: string;
  address: string;
  city: string;
  purchasePrice: number;
  estimatedValue: number;
  status: string;
  finances?: {
    acquisitionCosts?: number;
    monthlyCosts?: number;
    income?: number;
    saleCosts?: number;
  };
}

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

  // Step 3: Financial setup
  if (property.finances) {
    if (property.finances.acquisitionCosts && property.finances.acquisitionCosts > 0) {
      completedSteps++;
    }
    if (property.finances.monthlyCosts !== undefined || property.finances.income !== undefined) {
      completedSteps++;
    }
  }

  // Step 4: Sale preparation
  if (property.estimatedValue > 0) {
    completedSteps++;
  }

  return (completedSteps / totalSteps) * 100;
};

const calculateProfitPercentage = (property: Property): number => {
  if (!property.purchasePrice) return 0;
  
  const totalInvestment = property.purchasePrice + 
    (property.finances?.acquisitionCosts || 0) + 
    (property.finances?.monthlyCosts || 0);
    
  const potentialReturn = property.estimatedValue + 
    (property.finances?.income || 0) - 
    (property.finances?.saleCosts || 0);

  if (totalInvestment <= 0) return 0;
  
  return ((potentialReturn - totalInvestment) / totalInvestment) * 100;
};

const FeaturedProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const { encryptionKey } = useAuth();

  useEffect(() => {
    const loadProperties = async () => {
      if (!encryptionKey) return;
      
      try {
        const allProperties = await retrieveAllData<Property>('properties', encryptionKey);
        const sortedProperties = allProperties
          .sort((a, b) => calculateProfitPercentage(b) - calculateProfitPercentage(a))
          .slice(0, 3); // Get top 3 properties by profit percentage
        setProperties(sortedProperties);
      } catch (error) {
        console.error('Erro ao carregar imóveis:', error);
      }
    };

    loadProperties();
  }, [encryptionKey]);

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
        ))}
    </div>
  );
};

export default FeaturedProperties;
