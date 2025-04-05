
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatPercentage } from '@/lib/calculations';

interface PropertyCardProps {
  id: string;
  name: string;
  date: string;
  netProfit: number;
  roi: number;
  notes?: string;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  name,
  date,
  netProfit,
  roi,
  notes,
  onView,
  onDelete
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription>
          Created on {new Date(date).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Net Profit:</span>
            <span className={`font-medium ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netProfit)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">ROI:</span>
            <span className={`font-medium ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(roi)}
            </span>
          </div>
          {notes && (
            <div className="mt-3 pt-3 border-t text-sm text-gray-500">
              <p className="line-clamp-3">{notes}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-gray-50 px-6 py-3">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onView(id)}
        >
          View Details
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onDelete(id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
