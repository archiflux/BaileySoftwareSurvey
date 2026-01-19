import React, { useState, useEffect } from 'react';
import { Card } from '../UI/Card';
import { Checkbox, Input } from '../UI';
import { Container } from '../Layout/Container';
import { NavigationButtons } from '../Layout/NavigationButtons';
import { useSurveyState } from '../../hooks/useSurveyState';
import { usageLocationLabels, stoppedReasonLabels, type UsageLocation, type StoppedReason } from '../../types/survey.types';

export const StepPreviouslyUsed: React.FC = () => {
  const { surveyResponse, addOrUpdatePreviouslyUsed, goToNextValidStep, goToPreviousValidStep, getSoftwareByUsageStatus } = useSurveyState();
  const previouslyUsedSoftware = getSoftwareByUsageStatus('used-previously');

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSoftware = previouslyUsedSoftware[currentIndex];

  const [usedWhere, setUsedWhere] = useState<Set<UsageLocation>>(new Set());
  const [stoppedReasons, setStoppedReasons] = useState<Set<StoppedReason>>(new Set());
  const [otherReason, setOtherReason] = useState('');
  const [supersededBy, setSupersededBy] = useState('');
  const [error, setError] = useState('');

  // Load existing response if available
  useEffect(() => {
    if (currentSoftware) {
      const existing = surveyResponse.previouslyUsedResponses?.find(
        r => r.softwareId === currentSoftware.softwareId
      );

      if (existing) {
        setUsedWhere(new Set(existing.usedWhere));
        setStoppedReasons(new Set(existing.stoppedReasons));
        setOtherReason(existing.otherReason || '');
        setSupersededBy(existing.supersededBy || '');
      } else {
        setUsedWhere(new Set());
        setStoppedReasons(new Set());
        setOtherReason('');
        setSupersededBy('');
      }
    }
  }, [currentIndex, currentSoftware]);

  const handleSave = (): boolean => {
    if (usedWhere.size === 0) {
      setError('Please select where you used this software');
      return false;
    }

    if (stoppedReasons.size === 0) {
      setError('Please select at least one reason for stopping');
      return false;
    }

    if (stoppedReasons.has('other') && !otherReason.trim()) {
      setError('Please specify the other reason');
      return false;
    }

    if (stoppedReasons.has('superseded') && !supersededBy.trim()) {
      setError('Please specify which software replaced this one');
      return false;
    }

    setError('');
    addOrUpdatePreviouslyUsed({
      softwareId: currentSoftware.softwareId,
      usedWhere: Array.from(usedWhere),
      stoppedReasons: Array.from(stoppedReasons),
      otherReason: stoppedReasons.has('other') ? otherReason.trim() : undefined,
      supersededBy: stoppedReasons.has('superseded') ? supersededBy.trim() : undefined
    });
    return true;
  };

  const handleNext = () => {
    if (!handleSave()) return;

    if (currentIndex < previouslyUsedSoftware.length - 1) {
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
    if (currentIndex < previouslyUsedSoftware.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      goToNextValidStep();
    }
  };

  // This step should never render if no software - navigation will skip it
  if (previouslyUsedSoftware.length === 0) {
    return null;
  }

  const toggleUsedWhere = (location: UsageLocation) => {
    const newSet = new Set(usedWhere);
    if (newSet.has(location)) {
      newSet.delete(location);
    } else {
      newSet.add(location);
    }
    setUsedWhere(newSet);
  };

  const toggleStoppedReason = (reason: StoppedReason) => {
    const newSet = new Set(stoppedReasons);
    if (newSet.has(reason)) {
      newSet.delete(reason);
    } else {
      newSet.add(reason);
    }
    setStoppedReasons(newSet);
  };

  const softwareName = currentSoftware.customName || currentSoftware.softwareName;

  return (
    <div className="min-h-screen pt-32 pb-12">
      <Container maxWidth="2xl">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold uppercase tracking-wide" style={{ color: '#212121' }}>Software You Previously Used</h2>
            <span className="text-sm font-medium" style={{ color: '#424242' }}>
              {currentIndex + 1} of {previouslyUsedSoftware.length}
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
              <label className="block text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: '#1e6c93' }}>
                Where did you use this software? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {Object.entries(usageLocationLabels).map(([value, label]) => (
                  <Checkbox
                    key={value}
                    label={label}
                    checked={usedWhere.has(value as UsageLocation)}
                    onChange={() => toggleUsedWhere(value as UsageLocation)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: '#1e6c93' }}>
                Why did you stop using this software? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {Object.entries(stoppedReasonLabels).map(([value, label]) => (
                  <Checkbox
                    key={value}
                    label={label}
                    checked={stoppedReasons.has(value as StoppedReason)}
                    onChange={() => toggleStoppedReason(value as StoppedReason)}
                  />
                ))}
              </div>

              {stoppedReasons.has('superseded') && (
                <div className="mt-3">
                  <Input
                    label="What software replaced it?"
                    placeholder="e.g., AutoCAD was replaced by Revit"
                    value={supersededBy}
                    onChange={(e) => setSupersededBy(e.target.value)}
                    required
                  />
                </div>
              )}

              {stoppedReasons.has('other') && (
                <div className="mt-3">
                  <Input
                    label="Please specify the reason"
                    placeholder="Please specify the reason"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <NavigationButtons
              onBack={handlePrevious}
              onNext={handleNext}
              onSkip={handleSkip}
              showSkip={true}
              skipLabel="Skip this software"
              nextLabel={currentIndex < previouslyUsedSoftware.length - 1 ? 'Next Software' : 'Continue'}
              backLabel={currentIndex > 0 ? 'Previous Software' : 'Back'}
            />
          </div>
        </Card>
      </Container>
    </div>
  );
};
