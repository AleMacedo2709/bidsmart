
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  canAdvance: boolean;
  isLastStep: boolean;
  onSubmit: () => void;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  canAdvance,
  isLastStep,
  onSubmit
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="mt-8 space-y-6">
      {/* Step indicators */}
      <div className="flex justify-between">
        {steps.map((step) => (
          <div
            key={step}
            className={cn(
              "step relative",
              step <= currentStep ? "step-primary" : ""
            )}
          >
            <div className="absolute top-0 -ml-px h-0.5 w-full">
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  step <= currentStep ? "bg-primary" : "bg-gray-200"
                )}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        {isLastStep ? (
          <Button onClick={onSubmit} disabled={!canAdvance}>
            Calculate Results
          </Button>
        ) : (
          <Button onClick={onNext} disabled={!canAdvance}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepNavigation;
