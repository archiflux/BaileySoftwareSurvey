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
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
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
    <div className="min-h-screen bg-[#F5F5F5]">
      {currentStep > 0 && currentStep < 8 && (
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      )}
      {renderStep()}
    </div>
  );
}

export default App;
