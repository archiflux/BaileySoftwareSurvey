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

  const [frequency, setFrequency] = useState<Frequency | null>(null);
  const [trainingLevel, setTrainingLevel] = useState<TrainingLevel | null>(null);
  const [enjoyment, setEnjoyment] = useState<Satisfaction | null>(null);
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
        setEnjoyment(existing.satisfaction);
        setComments(existing.comments || '');
      } else {
        // Reset to no selection for new software
        setFrequency(null);
        setTrainingLevel(null);
        setEnjoyment(null);
        setComments('');
      }
    }
  }, [currentIndex, currentSoftware]);

  const handleSave = (): boolean => {
    if (!frequency) {
      setError('Please select how frequently you use this software');
      return false;
    }

    if (!trainingLevel) {
      setError('Please select your training level');
      return false;
    }

    if (!enjoyment) {
      setError('Please indicate how much you enjoy using this software');
      return false;
    }

    setError('');
    addOrUpdateCurrentlyUsing({
      softwareId: currentSoftware.softwareId,
      frequency,
      trainingLevel,
      satisfaction: enjoyment,
      comments: comments.trim() || undefined
    });
    return true;
  };

  const handleNext = () => {
    if (!handleSave()) return;

    if (currentIndex < currentlyUsingSoftware.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      nextStep();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      previousStep();
    }
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
    <div className="min-h-screen bg-[#F5F5F5] pt-32 pb-12">
      <Container maxWidth="2xl">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold uppercase tracking-wide" style={{ color: '#212121' }}>Software You Currently Use</h2>
            <span className="text-sm font-medium" style={{ color: '#424242' }}>
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
              <label className="block text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: '#006064' }}>
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
              <label className="block text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: '#006064' }}>
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
              label="Do you enjoy using this software?"
              required
              value={enjoyment}
              onChange={setEnjoyment}
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

          <div className="mt-8">
            <NavigationButtons
              onBack={handlePrevious}
              onNext={handleNext}
              nextLabel={currentIndex < currentlyUsingSoftware.length - 1 ? 'Next Software' : 'Continue'}
              backLabel={currentIndex > 0 ? 'Previous Software' : 'Back'}
            />
          </div>
        </Card>
      </Container>
    </div>
  );
};
