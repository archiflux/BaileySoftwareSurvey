import React, { useState, useEffect } from 'react';
import { Card } from '../UI/Card';
import { Radio, StarRating, Textarea } from '../UI';
import { Container } from '../Layout/Container';
import { NavigationButtons } from '../Layout/NavigationButtons';
import { useSurveyState } from '../../hooks/useSurveyState';
import { frequencyLabels, trainingLevelLabels, type Frequency, type TrainingLevel, type Satisfaction } from '../../types/survey.types';

export const StepCurrentlyUsing: React.FC = () => {
  const { surveyResponse, addOrUpdateCurrentlyUsing, nextStep, previousStep, getSoftwareByUsageStatus } = useSurveyState();
  const currentlyUsingSoftware = getSoftwareByUsageStatus('currently-using');

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSoftware = currentlyUsingSoftware[currentIndex];

  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [trainingLevel, setTrainingLevel] = useState<TrainingLevel>('very-confident');
  const [satisfaction, setSatisfaction] = useState<Satisfaction | null>(null);
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');

  // Load existing response if available
  useEffect(() => {
    if (currentSoftware) {
      const existing = surveyResponse.currentlyUsingResponses?.find(
        r => r.softwareId === currentSoftware.softwareId
      );

      if (existing) {
        setFrequency(existing.frequency);
        setTrainingLevel(existing.trainingLevel);
        setSatisfaction(existing.satisfaction);
        setComments(existing.comments || '');
      } else {
        // Reset to defaults for new software
        setFrequency('daily');
        setTrainingLevel('very-confident');
        setSatisfaction(null);
        setComments('');
      }
    }
  }, [currentIndex, currentSoftware]);

  const handleSave = () => {
    if (!satisfaction) {
      setError('Please provide a satisfaction rating');
      return;
    }

    setError('');
    addOrUpdateCurrentlyUsing({
      softwareId: currentSoftware.softwareId,
      frequency,
      trainingLevel,
      satisfaction,
      comments: comments.trim() || undefined
    });
  };

  const handleNext = () => {
    handleSave();
    if (currentIndex < currentlyUsingSoftware.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      nextStep();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      handleSave();
      setCurrentIndex(currentIndex - 1);
    } else {
      previousStep();
    }
  };

  const handleSkip = () => {
    nextStep();
  };

  if (currentlyUsingSoftware.length === 0) {
    // Skip this step if no software selected
    useEffect(() => {
      nextStep();
    }, []);
    return null;
  }

  const softwareName = currentSoftware.customName || currentSoftware.softwareName;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <Container maxWidth="2xl">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Software You Currently Use</h2>
            <span className="text-sm font-medium text-gray-600">
              {currentIndex + 1} of {currentlyUsingSoftware.length}
            </span>
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
            <p className="text-lg font-semibold text-primary">
              {softwareName}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How frequently do you use this software? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {Object.entries(frequencyLabels).map(([value, label]) => (
                  <Radio
                    key={value}
                    name="frequency"
                    label={label}
                    value={value}
                    checked={frequency === value}
                    onChange={() => setFrequency(value as Frequency)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How would you rate your training level? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {Object.entries(trainingLevelLabels).map(([value, label]) => (
                  <Radio
                    key={value}
                    name="trainingLevel"
                    label={label}
                    value={value}
                    checked={trainingLevel === value}
                    onChange={() => setTrainingLevel(value as TrainingLevel)}
                  />
                ))}
              </div>
            </div>

            <StarRating
              label="How satisfied are you with this software?"
              required
              value={satisfaction}
              onChange={setSatisfaction}
              error={error}
            />

            <Textarea
              label="Additional comments (optional)"
              placeholder="Share any specific feedback, challenges, or suggestions..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>

          <div className="mt-8 flex justify-between items-center">
            <NavigationButtons
              onBack={handlePrevious}
              onNext={handleNext}
              nextLabel={currentIndex < currentlyUsingSoftware.length - 1 ? 'Next Software' : 'Continue'}
              backLabel={currentIndex > 0 ? 'Previous Software' : 'Back'}
            />
            {currentIndex === 0 && (
              <button
                type="button"
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Skip all follow-up questions
              </button>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
};
