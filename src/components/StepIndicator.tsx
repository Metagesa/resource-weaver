import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowStep } from "@/types/resource";

interface StepIndicatorProps {
  currentStep: WorkflowStep;
}

const steps: { key: WorkflowStep; label: string; number: number }[] = [
  { key: 'upload', label: 'Upload Resource', number: 1 },
  { key: 'ideas', label: 'Select Ideas', number: 2 },
  { key: 'resources', label: 'View Resources', number: 3 },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = steps.findIndex(s => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.key} className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300",
                  isCompleted && "bg-success text-success-foreground",
                  isCurrent && "bg-primary text-primary-foreground shadow-glow",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4 md:h-5 md:w-5" /> : step.number}
              </div>
              <span
                className={cn(
                  "hidden md:block text-sm font-medium transition-colors duration-300",
                  isCurrent && "text-foreground",
                  !isCurrent && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 md:w-16 rounded-full transition-colors duration-300",
                  index < currentIndex ? "bg-success" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
