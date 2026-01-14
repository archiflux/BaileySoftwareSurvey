import React from 'react';
import { STEP_TITLES } from '../../utils/constants';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  // Calculate progress percentage (excluding welcome and thank you screens)
  const progressPercentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  // Get current step title
  const currentStepTitle = STEP_TITLES[currentStep] || '';

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm border-b border-border/50 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/Icon-colour.png" alt="BP" className="w-8 h-8 rounded-lg" />
              <h2 className="text-sm font-semibold text-foreground hidden sm:block">
                Software Survey
              </h2>
            </div>
            {currentStep > 0 && currentStep < totalSteps && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#0052FF]/10 text-[#0052FF]">
                Step {currentStep} of {totalSteps - 1}
              </span>
            )}
          </div>
          {currentStepTitle && currentStep > 0 && currentStep < totalSteps && (
            <span className="text-sm font-medium text-foreground hidden md:block">
              {currentStepTitle}
            </span>
          )}
        </div>

        {currentStep > 0 && currentStep < totalSteps && (
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Survey progress: ${Math.round(progressPercentage)}%`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
