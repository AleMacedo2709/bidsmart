
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface PercentageOption {
  value: number;
  label: string;
}

interface PercentageSelectProps {
  value: number;
  onChange: (value: number) => void;
  options: PercentageOption[];
  label: string;
}

const PercentageSelect: React.FC<PercentageSelectProps> = ({
  value,
  onChange,
  options,
  label
}) => {
  const handleValueChange = (newValue: string) => {
    onChange(parseFloat(newValue));
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={value.toString()}
        onValueChange={handleValueChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma porcentagem" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PercentageSelect;
