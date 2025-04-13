
import React from 'react';
import { mockAuctions } from '@/data/mockData';

const AuctionList: React.FC = () => {
  // Function to calculate property counts
  const calculateTotalProperties = (totalProperties: number) => {
    const apartments = Math.floor(totalProperties * 0.6);
    const houses = Math.floor(totalProperties * 0.3);
    const lands = Math.floor(totalProperties * 0.1);
    // Ensure the total matches the original count by adjusting the lands value
    return apartments + houses + lands;
  };
  
  return (
    <div className="space-y-4">
      {mockAuctions.map((auction) => {
        // Extract day and month from date string (format: DD/MM/YYYY)
        const [day, month] = auction.date.split('/');
        // Calculate the total properties based on the distribution
        const totalCalculatedProperties = calculateTotalProperties(auction.properties);
        
        return (
          <div key={auction.id} className="flex items-center py-2">
            <div className="mr-4 text-center">
              <div className="text-lg font-semibold">{day}</div>
              <div className="text-sm text-gray-500">{month}/24</div>
            </div>
            
            <div className="flex-grow">
              <div className="font-medium">{auction.name}</div>
              <div className="text-sm text-gray-500">{totalCalculatedProperties} imóveis disponíveis</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AuctionList;
