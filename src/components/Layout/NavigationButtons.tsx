import React from 'react';
import { Button } from '../UI/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  backLabel?: string;
  skipLabel?: string;
  showBack?: boolean;
  showNext?: boolean;
  showSubmit?: boolean;
  showSkip?: boolean;
  isNextDisabled?: boolean;
  isSubmitDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onBack,
  onNext,
  onSubmit,
  onSkip,
  nextLabel = 'Next',
  backLabel = 'Back',
  skipLabel = 'Skip',
  showBack = true,
  showNext = true,
  showSubmit = false,
  showSkip = false,
  isNextDisabled = false,
  isSubmitDisabled = false,
  isLoading = false,
  className = ''
}) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          {showBack && onBack && (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="inline-flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {backLabel}
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          {showNext && onNext && (
            <Button
              type="button"
              variant="primary"
              onClick={onNext}
              disabled={isNextDisabled || isLoading}
              className="inline-flex items-center"
            >
              {nextLabel}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
          {showSubmit && onSubmit && (
            <Button
              type="button"
              variant="primary"
              onClick={onSubmit}
              disabled={isSubmitDisabled}
              isLoading={isLoading}
            >
              Submit Survey
            </Button>
          )}
        </div>
      </div>
      {showSkip && onSkip && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
          >
            {skipLabel}
          </button>
        </div>
      )}
    </div>
  );
};
