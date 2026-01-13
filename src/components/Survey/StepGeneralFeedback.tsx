import React, { useState } from 'react';
import { Card } from '../UI/Card';
import { Radio, StarRating, Textarea } from '../UI';
import { Container } from '../Layout/Container';
import { NavigationButtons } from '../Layout/NavigationButtons';
import { useSurveyState } from '../../hooks/useSurveyState';
import { agreementScaleLabels, type AgreementScale, type Satisfaction } from '../../types/survey.types';

export const StepGeneralFeedback: React.FC = () => {
  const { surveyResponse, updateGeneralFeedback, nextStep, previousStep } = useSurveyState();
  const feedback = surveyResponse.generalFeedback!;

  const [overallSatisfaction, setOverallSatisfaction] = useState<Satisfaction | null>(
    feedback.overallSatisfaction || null
  );
  const [trainingResources, setTrainingResources] = useState<AgreementScale>(
    feedback.trainingResources || 'neutral'
  );
  const [itSupport, setItSupport] = useState<AgreementScale>(
    feedback.itSupport || 'neutral'
  );
  const [softwareIntegration, setSoftwareIntegration] = useState<AgreementScale>(
    feedback.softwareIntegration || 'neutral'
  );
  const [improvementSuggestions, setImprovementSuggestions] = useState(
    feedback.improvementSuggestions || ''
  );
  const [personalLicenses, setPersonalLicenses] = useState(
    feedback.personalLicenses || ''
  );
  const [additionalComments, setAdditionalComments] = useState(
    feedback.additionalComments || ''
  );
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!overallSatisfaction) {
      setError('Please provide an overall satisfaction rating');
      return;
    }

    setError('');
    updateGeneralFeedback({
      overallSatisfaction,
      trainingResources,
      itSupport,
      softwareIntegration,
      improvementSuggestions: improvementSuggestions.trim() || undefined,
      personalLicenses: personalLicenses.trim() || undefined,
      additionalComments: additionalComments.trim() || undefined
    });
    nextStep();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <Container maxWidth="2xl">
        <Card>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">General Feedback</h2>
          <p className="text-gray-600 mb-8">
            Share your overall thoughts on software usage, training, and IT support at Bailey Partnership.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-8">
            <StarRating
              label="Overall satisfaction with software tools and resources"
              required
              value={overallSatisfaction}
              onChange={setOverallSatisfaction}
              error={error}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I have access to adequate training resources for the software I use
              </label>
              <div className="space-y-2">
                {Object.entries(agreementScaleLabels).map(([value, label]) => (
                  <Radio
                    key={value}
                    name="trainingResources"
                    label={label}
                    value={value}
                    checked={trainingResources === value}
                    onChange={() => setTrainingResources(value as AgreementScale)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                IT support is responsive and helpful with software issues
              </label>
              <div className="space-y-2">
                {Object.entries(agreementScaleLabels).map(([value, label]) => (
                  <Radio
                    key={value}
                    name="itSupport"
                    label={label}
                    value={value}
                    checked={itSupport === value}
                    onChange={() => setItSupport(value as AgreementScale)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Software tools integrate well with each other and our workflows
              </label>
              <div className="space-y-2">
                {Object.entries(agreementScaleLabels).map(([value, label]) => (
                  <Radio
                    key={value}
                    name="softwareIntegration"
                    label={label}
                    value={value}
                    checked={softwareIntegration === value}
                    onChange={() => setSoftwareIntegration(value as AgreementScale)}
                  />
                ))}
              </div>
            </div>

            <Textarea
              label="What improvements would you suggest for software provisioning or training?"
              placeholder="Share any suggestions for improving software availability, training programs, or support..."
              value={improvementSuggestions}
              onChange={(e) => setImprovementSuggestions(e.target.value)}
              rows={4}
            />

            <Textarea
              label="Do you use any personal software licenses for work? If so, which ones?"
              placeholder="e.g., Personal Adobe Creative Cloud subscription, purchased SketchUp license..."
              value={personalLicenses}
              onChange={(e) => setPersonalLicenses(e.target.value)}
              rows={3}
            />

            <Textarea
              label="Any additional comments or feedback?"
              placeholder="Share any other thoughts, concerns, or suggestions..."
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              rows={4}
            />
          </div>

          <div className="mt-8">
            <NavigationButtons
              onBack={previousStep}
              onNext={handleNext}
              nextLabel="Review Responses"
            />
          </div>
        </Card>
      </Container>
    </div>
  );
};
