
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

// Formatador de moeda para Real Brasileiro
const formatToBRL = (value: number | string): string => {
  if (!value && value !== 0) return 'R$ 0,00';
  
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/\D/g, '')) / 100 : value;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
};

const CurrencyInput: React.FC<CurrencyInputProps> = ({ 
  value, 
  onChange, 
  className = "",
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState(formatToBRL(value));
  
  // Quando o valor externo muda, atualiza o valor de exibição
  useEffect(() => {
    setDisplayValue(formatToBRL(value));
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    
    // Mantém apenas números
    const numbers = input.replace(/\D/g, '');
    
    // Converte para centavos
    const cents = parseInt(numbers) || 0;
    
    // Formata para valor de exibição
    setDisplayValue(formatToBRL(cents / 100));
    
    // Atualiza o componente pai com o valor numérico
    onChange(cents / 100);
  };
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };
  
  const handleBlur = () => {
    // Garante formatação adequada ao perder o foco
    setDisplayValue(formatToBRL(value));
  };
  
  return (
    <Input
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={cn(className)}
      {...props}
    />
  );
};

export default CurrencyInput;
