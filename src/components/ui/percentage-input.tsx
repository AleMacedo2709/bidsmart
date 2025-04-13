
import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PercentageInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const PercentageInput: React.FC<PercentageInputProps> = ({ 
  value, 
  onChange, 
  className = "",
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove qualquer caractere que não seja dígito
    const cleanValue = e.target.value.replace(/\D/g, '');
    
    // Converte para número
    const numValue = parseInt(cleanValue, 10) || 0;
    
    // Atualiza o componente pai com o valor numérico
    onChange(numValue);
  };
  
  return (
    <div className="relative">
      <Input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value.toString()}
        onChange={handleChange}
        className={cn("pr-10", className)}
        {...props}
      />
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
        <span className="text-sm font-medium">%</span>
      </div>
    </div>
  );
};

export default PercentageInput;
