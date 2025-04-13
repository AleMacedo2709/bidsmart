
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface StepNavigationProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ activeStep, setActiveStep }) => {
  const steps = [
    { id: 1, label: 'Valores Iniciais' },
    { id: 2, label: 'Custos de Aquisição' },
    { id: 3, label: 'Custos de Manutenção' },
    { id: 4, label: 'Resultados' }
  ];

  return (
    <div className="border-b">
      <Tabs value={activeStep.toString()} className="w-full">
        <TabsList className="flex w-full">
          {steps.map((step) => (
            <TabsTrigger
              key={step.id}
              value={step.id.toString()}
              onClick={() => setActiveStep(step.id)}
              className={cn(
                "flex-1 text-xs sm:text-sm",
                step.id > activeStep && "text-gray-400 pointer-events-none"
              )}
              disabled={step.id > activeStep}
            >
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.id}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default StepNavigation;
