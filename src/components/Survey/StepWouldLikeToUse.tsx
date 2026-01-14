import React, { useState, useEffect } from 'react';
import { Card } from '../UI/Card';
import { Radio, Input, Textarea } from '../UI';
import { Container } from '../Layout/Container';
import { NavigationButtons } from '../Layout/NavigationButtons';
import { useSurveyState } from '../../hooks/useSurveyState';
import { benefitLabels, type Benefit } from '../../types/survey.types';

export const StepWouldLikeToUse: React.FC = () => {
  const { surveyResponse, addOrUpdateWouldLikeToUse, nextStep, previousStep, getSoftwareByUsageStatus } = useSurveyState();
  const wouldLikeToUseSoftware = getSoftwareByUsageStatus('would-like-to-use');

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSoftware = wouldLikeToUseSoftware[currentIndex];

  const [benefit, setBenefit] = useState<Benefit | null>(null);
  const [wouldReplace, setWouldReplace] = useState('');
  const [interest, setInterest] = useState('');
  const [error, setError] = useState('');

  // Load existing response if available
  useEffect(() => {
    if (currentSoftware) {
      const existing = surveyResponse.wouldLikeToUseResponses?.find(
        r => r.softwareId === currentSoftware.softwareId
      );

      if (existing) {
        setBenefit(existing.benefit);
        setWouldReplace(existing.wouldReplace || '');
        setInterest(existing.interest);
      } else {
        setBenefit(null);
        setWouldReplace('');
        setInterest('');
      }
    }
  }, [currentIndex, currentSoftware]);

  const handleSave = (): boolean => {
    if (!benefit) {
      setError('Please select the level of benefit');
      return false;
    }

    if (!interest.trim()) {
      setError('Please describe why you are interested in this software');
      return false;
    }

    setError('');
    addOrUpdateWouldLikeToUse({
      softwareId: currentSoftware.softwareId,
      benefit,
      wouldReplace: wouldReplace.trim() || undefined,
      interest: interest.trim()
    });
    return true;
  };

  const handleNext = () => {
    if (!handleSave()) return;

    if (currentIndex < wouldLikeToUseSoftware.length - 1) {
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

  if (wouldLikeToUseSoftware.length === 0) {
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
            <h2 className="text-3xl font-bold uppercase tracking-wide" style={{ color: '#212121' }}>Software You Would Like to Use</h2>
            <span className="text-sm font-medium" style={{ color: '#424242' }}>
              {currentIndex + 1} of {wouldLikeToUseSoftware.length}
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
                What level of benefit would this software provide to your work? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {Object.entries(benefitLabels).map(([value, label]) => (
                  <Radio
                    key={value}
                    name="benefit"
                    label={label}
                    value={value}
                    checked={benefit === value}
                    onChange={() => setBenefit(value as Benefit)}
                  />
                ))}
              </div>
            </div>

            <Input
              label="Would this replace any software you currently use? (optional)"
              placeholder="e.g., Would replace AutoCAD for certain tasks"
              value={wouldReplace}
              onChange={(e) => setWouldReplace(e.target.value)}
            />

            <Textarea
              label="Why are you interested in using this software?"
              required
              placeholder="Describe the benefits, features, or capabilities that interest you..."
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              rows={4}
              error={error}
            />
          </div>

          <div className="mt-8">
            <NavigationButtons
              onBack={handlePrevious}
              onNext={handleNext}
              nextLabel={currentIndex < wouldLikeToUseSoftware.length - 1 ? 'Next Software' : 'Continue'}
              backLabel={currentIndex > 0 ? 'Previous Software' : 'Back'}
            />
          </div>
        </Card>
      </Container>
    </div>
  );
};
