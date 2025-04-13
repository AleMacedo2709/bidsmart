
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CurrencyReal } from 'lucide-react';
import { formatCurrency } from '@/lib/calculations';

export interface InitialValuesType {
  purchasePrice: number;
  renovationCosts: number;
  sellingPrice: number;
  sellingCosts: number;
  mortgageAmount: number;
  interestRate: number;
  monthsHeld: number;
  taxRate: number;
  deductions: number;
  auctionPrice: number;
  assessedValue: number;
  resalePrice: number;
}

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

  // Format the input value for display
  const formatInput = (value: number) => {
    if (value === 0) return '';
    return value.toString();
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="pt-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="auctionPrice">Preço de Compra no Leilão (R$)</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <CurrencyReal className="h-4 w-4" />
              </div>
              <Input
                id="auctionPrice"
                name="auctionPrice"
                type="number"
                placeholder="0,00"
                value={formatInput(values.auctionPrice)}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assessedValue">Valor Avaliado pelo Governo (R$)</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <CurrencyReal className="h-4 w-4" />
              </div>
              <Input
                id="assessedValue"
                name="assessedValue"
                type="number"
                placeholder="0,00"
                value={formatInput(values.assessedValue)}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resalePrice">Preço de Revenda Esperado (R$)</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <CurrencyReal className="h-4 w-4" />
              </div>
              <Input
                id="resalePrice"
                name="resalePrice"
                type="number"
                placeholder="0,00"
                value={formatInput(values.resalePrice)}
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
