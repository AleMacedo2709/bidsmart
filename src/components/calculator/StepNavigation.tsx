
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  onComplete?: () => void;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  canGoNext,
  onComplete,
}) => {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-between items-center mt-6">
      {currentStep > 1 ? (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      ) : (
        <div></div>
      )}

      <div className="flex items-center">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full mx-1 ${
              i + 1 === currentStep
                ? 'bg-primary'
                : i + 1 < currentStep
                ? 'bg-primary/40'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {isLastStep ? (
        <Button
          type="button"
          variant="default"
          onClick={onComplete}
          disabled={!canGoNext}
          className="flex items-center"
        >
          <Check className="mr-2 h-4 w-4" />
          Concluir
        </Button>
      ) : (
        <Button
          type="button"
          variant="default"
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center"
        >
          Avançar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default StepNavigation;
