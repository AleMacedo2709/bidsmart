
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FormField } from '@/components/ui/form';

interface InitialValuesProps {
  valorArremate: number;
  valorVenal: number;
  valorVenda: number;
  onValorArremateChange: (value: number) => void;
  onValorVenalChange: (value: number) => void;
  onValorVendaChange: (value: number) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const parseCurrencyInput = (value: string): number => {
  // Remove currency symbol, dots for thousands, and replace comma with dot for decimal
  const numericValue = value.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(numericValue) || 0;
};

const InitialValues: React.FC<InitialValuesProps> = ({
  valorArremate,
  valorVenal,
  valorVenda,
  onValorArremateChange,
  onValorVenalChange,
  onValorVendaChange,
}) => {
  const handleInputChange = (setter: (value: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseCurrencyInput(e.target.value);
    setter(value);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="valorArremate">Valor da Arrematação</Label>
            <Input
              id="valorArremate"
              type="text"
              placeholder="R$ 0,00"
              value={valorArremate ? formatCurrency(valorArremate) : ''}
              onChange={handleInputChange(onValorArremateChange)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorVenal">Valor Venal do Imóvel</Label>
            <Input
              id="valorVenal"
              type="text"
              placeholder="R$ 0,00"
              value={valorVenal ? formatCurrency(valorVenal) : ''}
              onChange={handleInputChange(onValorVenalChange)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorVenda">Valor Esperado de Venda</Label>
            <Input
              id="valorVenda"
              type="text"
              placeholder="R$ 0,00"
              value={valorVenda ? formatCurrency(valorVenda) : ''}
              onChange={handleInputChange(onValorVendaChange)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InitialValues;
