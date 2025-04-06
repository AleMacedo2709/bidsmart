
import React from 'react';
import { mockAuctions } from '@/data/mockData';

const AuctionList: React.FC = () => {
  return (
    <div className="space-y-4">
      {mockAuctions.map((auction) => {
        // Extract day and month from date string (format: DD/MM/YYYY)
        const [day, month] = auction.date.split('/');
        
        return (
          <div key={auction.id} className="flex items-center py-2">
            <div className="mr-4 text-center">
              <div className="text-lg font-semibold">{day}</div>
              <div className="text-sm text-gray-500">{month}/24</div>
            </div>
            
            <div className="flex-grow">
              <div className="font-medium">{auction.name}</div>
              <div className="text-sm text-gray-500">{auction.properties} imóveis disponíveis</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AuctionList;
