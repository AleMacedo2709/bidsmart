
import React from 'react';

interface Property {
  id: string;
  type: string;
  location: string;
  purchasePrice: number;
  estimatedSalePrice: number;
  completionPercentage: number;
  profitPercentage: number;
}

const FeaturedProperties: React.FC = () => {
  // Example data - in a real application, this would come from an API
  const properties: Property[] = [
    {
      id: '1',
      type: 'Apartamento',
      location: 'Centro, SP',
      purchasePrice: 280000,
      estimatedSalePrice: 380000,
      completionPercentage: 65,
      profitPercentage: 36
    },
    {
      id: '2',
      type: 'Casa',
      location: 'Botafogo, RJ',
      purchasePrice: 450000,
      estimatedSalePrice: 620000,
      completionPercentage: 40,
      profitPercentage: 38
    },
    {
      id: '3',
      type: 'Terreno',
      location: 'Alphaville, SP',
      purchasePrice: 320000,
      estimatedSalePrice: 390000,
      completionPercentage: 80,
      profitPercentage: 22
    }
  ];

  return (
    <div className="space-y-6">
      {properties.map((property) => (
        <div key={property.id} className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">{property.type} - {property.location}</div>
              <div className="text-sm text-gray-500">
                Compra: R$ {property.purchasePrice.toLocaleString('pt-BR')} • Estim. Venda: R$ {property.estimatedSalePrice.toLocaleString('pt-BR')}
              </div>
            </div>
            <div className="text-green-500 font-medium">+{property.profitPercentage}%</div>
          </div>
          
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${property.completionPercentage}%` }}
            ></div>
          </div>
          
          <div className="text-sm text-gray-500 text-right">
            {property.completionPercentage}% do processo concluído
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProperties;
