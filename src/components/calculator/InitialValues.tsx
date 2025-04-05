
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InitialValues as InitialValuesType } from '@/lib/calculations';
import { DollarSign } from 'lucide-react';

interface InitialValuesProps {
  values: InitialValuesType;
  onChange: (values: InitialValuesType) => void;
}

const InitialValues: React.FC<InitialValuesProps> = ({ values, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value === '' ? 0 : parseFloat(value);
    
    onChange({
      ...values,
      [name]: numericValue
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="pt-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="auctionPrice">Auction Purchase Price (R$)</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <DollarSign className="h-4 w-4" />
              </div>
              <Input
                id="auctionPrice"
                name="auctionPrice"
                type="number"
                placeholder="0.00"
                value={values.auctionPrice || ''}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assessedValue">Government-Assessed Value (R$)</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <DollarSign className="h-4 w-4" />
              </div>
              <Input
                id="assessedValue"
                name="assessedValue"
                type="number"
                placeholder="0.00"
                value={values.assessedValue || ''}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resalePrice">Expected Resale Price (R$)</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <DollarSign className="h-4 w-4" />
              </div>
              <Input
                id="resalePrice"
                name="resalePrice"
                type="number"
                placeholder="0.00"
                value={values.resalePrice || ''}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InitialValues;
