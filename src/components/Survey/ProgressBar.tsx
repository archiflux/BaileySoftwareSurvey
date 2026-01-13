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
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold text-gray-700">
              Bailey Partnership Software Survey
            </h2>
            {currentStep > 0 && currentStep < totalSteps && (
              <span className="text-sm text-gray-500">
                Step {currentStep} of {totalSteps - 1}
              </span>
            )}
          </div>
          {currentStepTitle && currentStep > 0 && currentStep < totalSteps && (
            <span className="text-sm font-medium text-gray-900 hidden sm:block">
              {currentStepTitle}
            </span>
          )}
        </div>

        {currentStep > 0 && currentStep < totalSteps && (
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300 ease-in-out"
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
