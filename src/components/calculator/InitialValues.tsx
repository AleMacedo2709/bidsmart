
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InitialValues as InitialValuesType } from '@/lib/calculations';

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
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="auctionPrice">Auction Purchase Price (R$)</Label>
            <Input
              id="auctionPrice"
              name="auctionPrice"
              type="number"
              placeholder="0.00"
              value={values.auctionPrice || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assessedValue">Government-Assessed Value (R$)</Label>
            <Input
              id="assessedValue"
              name="assessedValue"
              type="number"
              placeholder="0.00"
              value={values.assessedValue || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resalePrice">Expected Resale Price (R$)</Label>
            <Input
              id="resalePrice"
              name="resalePrice"
              type="number"
              placeholder="0.00"
              value={values.resalePrice || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InitialValues;
