import React, { useState, useEffect } from 'react';
import { Card } from '../UI/Card';
import { Radio, Input, Textarea } from '../UI';
import { Container } from '../Layout/Container';
import { NavigationButtons } from '../Layout/NavigationButtons';
import { useSurveyState } from '../../hooks/useSurveyState';
import { benefitLabels, type Benefit } from '../../types/survey.types';

export const StepWouldLikeToUse: React.FC = () => {
  const { surveyResponse, addOrUpdateWouldLikeToUse, goToNextValidStep, goToPreviousValidStep, getSoftwareByUsageStatus } = useSurveyState();
  const wouldLikeToUseSoftware = getSoftwareByUsageStatus('would-like-to-use');

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSoftware = wouldLikeToUseSoftware[currentIndex];

  const [benefit, setBenefit] = useState<Benefit | null>(null);
  const [wouldReplace, setWouldReplace] = useState('');
  const [interest, setInterest] = useState('');
  const [error, setError] = useState('');

  // Scroll to top when software changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIndex]);

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
      goToNextValidStep();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      goToPreviousValidStep();
    }
  };

  const handleSkip = () => {
    setError('');
    if (currentIndex < wouldLikeToUseSoftware.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      goToNextValidStep();
    }
  };

  // This step should never render if no software - navigation will skip it
  if (wouldLikeToUseSoftware.length === 0) {
    return null;
  }

  const softwareName = currentSoftware.customName || currentSoftware.softwareName;

  return (
    <div className="min-h-screen pt-28 pb-12">
      <Container maxWidth="2xl">
        <Card>
          <div className="flex justify-between items-center gap-3 mb-6">
            <h2 className="text-2xl md:text-3xl font-sans font-bold tracking-wide uppercase text-foreground flex-1 min-w-0">Software You Would Like to Use</h2>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#1e6c93]/10 text-[#1e6c93] whitespace-nowrap flex-shrink-0">
              {currentIndex + 1} of {wouldLikeToUseSoftware.length}
            </span>
          </div>

          <div className="bg-gradient-to-r from-[#1e6c93]/10 to-[#2a8ab8]/10 border border-[#1e6c93]/30 rounded-xl p-4 mb-6">
            <p className="text-lg font-semibold text-[#1e6c93]">
              {softwareName}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wide mb-3 text-[#1e6c93]">
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
              onSkip={handleSkip}
              showSkip={true}
              skipLabel="Skip this software"
              nextLabel={currentIndex < wouldLikeToUseSoftware.length - 1 ? 'Next Software' : 'Continue'}
              backLabel={currentIndex > 0 ? 'Previous Software' : 'Back'}
            />
          </div>
        </Card>
      </Container>
    </div>
  );
};
