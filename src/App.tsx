import { useEffect, useState } from 'react';
import { useSurveyState } from './hooks/useSurveyState';
import { ProgressBar } from './components/Survey/ProgressBar';
import { WelcomeScreen } from './components/Survey/WelcomeScreen';
import { StepBasicInfo } from './components/Survey/StepBasicInfo';
import { StepSoftwareSelection } from './components/Survey/StepSoftwareSelection';
import { StepCurrentlyUsing } from './components/Survey/StepCurrentlyUsing';
import { StepPreviouslyUsed } from './components/Survey/StepPreviouslyUsed';
import { StepWouldLikeToUse } from './components/Survey/StepWouldLikeToUse';
import { StepGeneralFeedback } from './components/Survey/StepGeneralFeedback';
import { StepReview } from './components/Survey/StepReview';
import { ThankYouScreen } from './components/Survey/ThankYouScreen';
import { Alert } from './components/UI/Alert';
import { Button } from './components/UI/Button';

function App() {
  const {
    currentStep,
    initializeSurvey,
    loadFromLocalStorage,
    saveToLocalStorage,
    getSoftwareByUsageStatus
  } = useSurveyState();

  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [hasCheckedLocalStorage, setHasCheckedLocalStorage] = useState(false);

  // Check for saved progress on mount
  useEffect(() => {
    if (!hasCheckedLocalStorage) {
      const hasSavedData = loadFromLocalStorage();
      if (hasSavedData) {
        setShowRestorePrompt(true);
      } else {
        initializeSurvey();
      }
      setHasCheckedLocalStorage(true);
    }
  }, []);

  // Auto-save progress
  useEffect(() => {
    if (hasCheckedLocalStorage && currentStep > 0 && currentStep < 8) {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [currentStep, hasCheckedLocalStorage]);

  const handleRestoreYes = () => {
    setShowRestorePrompt(false);
  };

  const handleRestoreNo = () => {
    initializeSurvey();
    setShowRestorePrompt(false);
  };

  // Calculate total steps dynamically based on selections
  const calculateTotalSteps = () => {
    let total = 7; // Welcome, Basic, Selection, Feedback, Review, Thank You = 6 base steps

    const hasCurrentlyUsing = getSoftwareByUsageStatus('currently-using').length > 0;
    const hasPreviouslyUsed = getSoftwareByUsageStatus('used-previously').length > 0;
    const hasWouldLike = getSoftwareByUsageStatus('would-like-to-use').length > 0;

    if (hasCurrentlyUsing) total++;
    if (hasPreviouslyUsed) total++;
    if (hasWouldLike) total++;

    return total;
  };

  const totalSteps = calculateTotalSteps();

  // Restore prompt modal
  if (showRestorePrompt) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 relative">
        <div className="-translate-y-1/4 pointer-events-none fixed top-0 right-0 z-0 h-[600px] w-[600px] translate-x-1/4 rounded-full bg-[var(--accent)] opacity-[0.03] blur-[120px]" />
        <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 relative z-10">
          <Alert
            type="info"
            title="Resume Previous Session?"
            message="We found a saved draft of your survey. Would you like to continue where you left off?"
          />
          <div className="mt-6 flex gap-3">
            <Button
              onClick={handleRestoreYes}
              className="flex-1"
            >
              Resume Survey
            </Button>
            <Button
              onClick={handleRestoreNo}
              variant="outline"
              className="flex-1"
            >
              Start Fresh
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeScreen onBegin={() => useSurveyState.getState().nextStep()} />;
      case 1:
        return <StepBasicInfo />;
      case 2:
        return <StepSoftwareSelection />;
      case 3:
        return <StepCurrentlyUsing />;
      case 4:
        return <StepPreviouslyUsed />;
      case 5:
        return <StepWouldLikeToUse />;
      case 6:
        return <StepGeneralFeedback />;
      case 7:
        return <StepReview />;
      case 8:
        return <ThankYouScreen />;
      default:
        return <WelcomeScreen onBegin={() => useSurveyState.getState().nextStep()} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden">
      {/* Animated blob background - persists across all pages */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 -left-0 w-[34rem] h-[34rem] bg-[#1e6c93] rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob1"></div>
        <div className="absolute top-0 -right-96 w-[34rem] h-[34rem] bg-[#1e6c93] rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob2"></div>
        <div className="absolute -bottom-0 left-20 w-[34rem] h-[34rem] bg-[#1e6c93] rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob3"></div>
      </div>

      {/* Top bar with logo - shown on ALL pages */}
      {(currentStep === 0 || currentStep === 8) && (
        <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm border-b border-border/50 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/Icon-colour.png" alt="BP" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex-shrink-0" />
              <h2 className="text-sm font-semibold text-foreground">
                Software Survey
              </h2>
            </div>
          </div>
        </div>
      )}

      {currentStep > 0 && currentStep < 8 && (
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      )}
      <div key={currentStep} className="page-transition relative z-10">
        {renderStep()}
      </div>
    </div>
  );
}

export default App;
