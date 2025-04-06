
import React from 'react';

interface Auction {
  id: string;
  date: string;
  name: string;
  availableProperties: number;
  day: number;
  month: string;
}

const AuctionList: React.FC = () => {
  // Example data - in a real application, this would come from an API
  const auctions: Auction[] = [
    {
      id: '1',
      date: '04/25',
      name: 'Leilão Caixa SP',
      availableProperties: 24,
      day: 15,
      month: '04/25'
    },
    {
      id: '2',
      date: '04/25',
      name: 'Leilão BB MG',
      availableProperties: 12,
      day: 22,
      month: '04/25'
    },
    {
      id: '3',
      date: '04/25',
      name: 'Leilão Judicial RJ',
      availableProperties: 8,
      day: 28,
      month: '04/25'
    }
  ];

  return (
    <div className="space-y-4">
      {auctions.map((auction) => (
        <div key={auction.id} className="flex items-center py-2">
          <div className="mr-4 text-center">
            <div className="text-lg font-semibold">{auction.day}</div>
            <div className="text-sm text-gray-500">{auction.month}</div>
          </div>
          
          <div className="flex-grow">
            <div className="font-medium">{auction.name}</div>
            <div className="text-sm text-gray-500">{auction.availableProperties} imóveis disponíveis</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuctionList;
