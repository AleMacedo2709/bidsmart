
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Currency } from 'lucide-react';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  name: string;
  required?: boolean;
  className?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ 
  value, 
  onChange, 
  name, 
  required = false, 
  className = '' 
}) => {
  const [displayValue, setDisplayValue] = useState('');

  // Formata o valor quando o componente é renderizado ou quando o valor muda
  useEffect(() => {
    if (value === 0) {
      setDisplayValue('');
    } else {
      setDisplayValue(formatToBRL(value));
    }
  }, [value]);

  // Converte string no formato BRL para número
  const parseBRLToNumber = (text: string): number => {
    // Remove todos os caracteres não numéricos exceto vírgula
    const cleaned = text.replace(/[^\d,]/g, '');
    // Substitui a vírgula por ponto para converter para float
    const numeric = cleaned.replace(',', '.');
    return numeric ? parseFloat(numeric) : 0;
  };

  // Formata número para o formato BRL (R$ 1.234,56)
  const formatToBRL = (num: number): string => {
    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Remove o formato durante a edição (mantém apenas números e vírgula)
    const cleaned = input.replace(/[^\d,]/g, '');
    
    // Atualiza o valor de exibição
    setDisplayValue(cleaned);
    
    // Converte e envia o valor numérico para o componente pai
    onChange(parseBRLToNumber(cleaned));
  };

  // Quando o campo perde o foco, formata o valor
  const handleBlur = () => {
    if (displayValue) {
      const numericValue = parseBRLToNumber(displayValue);
      setDisplayValue(formatToBRL(numericValue));
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
        <Currency className="h-4 w-4" />
      </div>
      <Input
        type="text"
        name={name}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="R$ 0,00"
        className={`pl-10 ${className}`}
        required={required}
      />
    </div>
  );
};

export default CurrencyInput;
