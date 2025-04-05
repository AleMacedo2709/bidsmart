
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Calculator } from 'lucide-react';

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
      <div className="relative flex justify-between">
        {steps.map((step) => (
          <div
            key={step}
            className={cn(
              "step relative z-10",
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
        {/* Progress bar underneath */}
        <div className="absolute top-[9px] left-0 right-0 h-0.5 bg-gray-200 -z-0"></div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4 gap-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 1}
          className="min-w-[100px]"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>

        {isLastStep ? (
          <Button 
            onClick={onSubmit} 
            disabled={!canAdvance}
            variant="gradient"
            className="min-w-[140px]"
          >
            <Calculator className="h-4 w-4 mr-1" /> Calculate
          </Button>
        ) : (
          <Button 
            onClick={onNext} 
            disabled={!canAdvance}
            variant="primary"
            className="min-w-[100px]"
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepNavigation;
