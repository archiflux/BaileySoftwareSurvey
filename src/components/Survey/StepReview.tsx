import React, { useState } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Container } from '../Layout/Container';
import { NavigationButtons } from '../Layout/NavigationButtons';
import { useSurveyState } from '../../hooks/useSurveyState';
import { submitToGoogleSheets } from '../../utils/exportData';
import { ChevronDown, ChevronUp, Edit, AlertCircle, RefreshCw } from 'lucide-react';
import {
  roleLevelLabels,
  disciplineLabels,
  frequencyLabels,
  trainingLevelLabels,
  usageLocationLabels,
  stoppedReasonLabels,
  benefitLabels,
  agreementScaleLabels
} from '../../types/survey.types';

export const StepReview: React.FC = () => {
  const { surveyResponse, submitSurvey, nextStep, previousStep, setCurrentStep } = useSurveyState();
  // All sections expanded by default
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['basic', 'selections', 'currently', 'previously', 'wouldlike', 'feedback'])
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // First, mark the survey as completed and update timestamp
      submitSurvey();

      // Get the updated survey response with completion status
      const completedResponse = {
        ...surveyResponse,
        completionStatus: 'completed' as const,
        timestamp: new Date().toISOString()
      };

      // Submit to Google Sheets
      const result = await submitToGoogleSheets(completedResponse);

      if (result.success) {
        // Success - proceed to thank you screen
        nextStep();
      } else {
        // Show error but keep the user on the review page
        setSubmitError(result.error || 'An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('A network error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const profile = surveyResponse.userProfile!;
  const feedback = surveyResponse.generalFeedback!;

  const SectionHeader: React.FC<{ id: string; title: string; count?: number }> = ({ id, title, count }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold uppercase tracking-wide" style={{ color: '#006064' }}>{title}</h3>
        {count !== undefined && (
          <span className="text-sm" style={{ color: '#424242' }}>({count})</span>
        )}
      </div>
      {expandedSections.has(id) ? (
        <ChevronUp className="w-5 h-5 text-primary" />
      ) : (
        <ChevronDown className="w-5 h-5 text-primary" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-32 pb-12">
      <Container maxWidth="2xl">
        <Card>
          <div className="mb-6">
            <h2 className="text-3xl font-bold uppercase tracking-wide mb-2" style={{ color: '#212121' }}>Review Your Responses</h2>
            <p style={{ color: '#424242' }}>
              Please review your responses before submitting. You can edit any section by clicking the Edit button.
            </p>
          </div>

          {/* Submission Error Alert */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-800 mb-1">Submission Failed</h4>
                  <p className="text-red-700 text-sm">{submitError}</p>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                    {isSubmitting ? 'Retrying...' : 'Try Again'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {isSubmitting && !submitError && (
            <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                <div>
                  <p className="font-medium" style={{ color: '#006064' }}>Submitting your survey...</p>
                  <p className="text-sm" style={{ color: '#424242' }}>Please wait while we save your responses.</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Basic Information */}
            <div>
              <SectionHeader id="basic" title="Basic Information" />
              {expandedSections.has('basic') && (
                <div className="p-4 border border-[#E0E0E0] rounded-b-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1" style={{ color: '#424242' }}>
                      <p><span className="font-medium">Email:</span> {profile.email}</p>
                      <p><span className="font-medium">Name:</span> {profile.fullName}</p>
                      <p><span className="font-medium">Role:</span> {roleLevelLabels[profile.roleLevel]}</p>
                      <p><span className="font-medium">Discipline:</span> {disciplineLabels[profile.discipline]}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Software Selections */}
            <div>
              <SectionHeader id="selections" title="Software Selections" count={surveyResponse.softwareSelections?.length || 0} />
              {expandedSections.has('selections') && (
                <div className="p-4 border border-[#E0E0E0] rounded-b-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-2 flex-1">
                      {surveyResponse.softwareSelections?.map((selection, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm" style={{ color: '#424242' }}>
                          <span className="font-medium">{selection.customName || selection.softwareName}:</span>
                          <span>{selection.usageStatus.replace(/-/g, ' ')}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(2)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Currently Using */}
            {surveyResponse.currentlyUsingResponses && surveyResponse.currentlyUsingResponses.length > 0 && (
              <div>
                <SectionHeader id="currently" title="Currently Using Details" count={surveyResponse.currentlyUsingResponses.length} />
                {expandedSections.has('currently') && (
                  <div className="p-4 border border-[#E0E0E0] rounded-b-lg space-y-4">
                    {surveyResponse.currentlyUsingResponses.map((response, idx) => {
                      const software = surveyResponse.softwareSelections?.find(s => s.softwareId === response.softwareId);
                      return (
                        <div key={idx} className="pb-4 border-b border-[#E0E0E0] last:border-0">
                          <p className="font-semibold mb-2" style={{ color: '#006064' }}>{software?.customName || software?.softwareName}</p>
                          <div className="text-sm space-y-1" style={{ color: '#424242' }}>
                            <p>Frequency: {frequencyLabels[response.frequency]}</p>
                            <p>Training: {trainingLevelLabels[response.trainingLevel]}</p>
                            <p>Enjoyment: {response.satisfaction}/5 stars</p>
                            {response.comments && <p>Comments: {response.comments}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Previously Used */}
            {surveyResponse.previouslyUsedResponses && surveyResponse.previouslyUsedResponses.length > 0 && (
              <div>
                <SectionHeader id="previously" title="Previously Used Details" count={surveyResponse.previouslyUsedResponses.length} />
                {expandedSections.has('previously') && (
                  <div className="p-4 border border-[#E0E0E0] rounded-b-lg space-y-4">
                    {surveyResponse.previouslyUsedResponses.map((response, idx) => {
                      const software = surveyResponse.softwareSelections?.find(s => s.softwareId === response.softwareId);
                      return (
                        <div key={idx} className="pb-4 border-b border-[#E0E0E0] last:border-0">
                          <p className="font-semibold mb-2" style={{ color: '#006064' }}>{software?.customName || software?.softwareName}</p>
                          <div className="text-sm space-y-1" style={{ color: '#424242' }}>
                            <p>Used at: {response.usedWhere.map(w => usageLocationLabels[w]).join(', ')}</p>
                            <p>Reasons for stopping: {response.stoppedReasons.map(r => stoppedReasonLabels[r]).join(', ')}</p>
                            {response.supersededBy && <p>Replaced by: {response.supersededBy}</p>}
                            {response.otherReason && <p>Other reason: {response.otherReason}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Would Like to Use */}
            {surveyResponse.wouldLikeToUseResponses && surveyResponse.wouldLikeToUseResponses.length > 0 && (
              <div>
                <SectionHeader id="wouldlike" title="Would Like to Use Details" count={surveyResponse.wouldLikeToUseResponses.length} />
                {expandedSections.has('wouldlike') && (
                  <div className="p-4 border border-[#E0E0E0] rounded-b-lg space-y-4">
                    {surveyResponse.wouldLikeToUseResponses.map((response, idx) => {
                      const software = surveyResponse.softwareSelections?.find(s => s.softwareId === response.softwareId);
                      return (
                        <div key={idx} className="pb-4 border-b border-[#E0E0E0] last:border-0">
                          <p className="font-semibold mb-2" style={{ color: '#006064' }}>{software?.customName || software?.softwareName}</p>
                          <div className="text-sm space-y-1" style={{ color: '#424242' }}>
                            <p>Benefit: {benefitLabels[response.benefit]}</p>
                            {response.wouldReplace && <p>Would replace: {response.wouldReplace}</p>}
                            <p>Interest: {response.interest}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* General Feedback */}
            <div>
              <SectionHeader id="feedback" title="General Feedback" />
              {expandedSections.has('feedback') && (
                <div className="p-4 border border-[#E0E0E0] rounded-b-lg">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 text-sm" style={{ color: '#424242' }}>
                      <p><span className="font-medium">Overall Enjoyment:</span> {feedback.overallSatisfaction}/5 stars</p>
                      <p><span className="font-medium">Training Resources:</span> {feedback.trainingResources ? agreementScaleLabels[feedback.trainingResources] : 'Not answered'}</p>
                      <p><span className="font-medium">IT Support:</span> {feedback.itSupport ? agreementScaleLabels[feedback.itSupport] : 'Not answered'}</p>
                      <p><span className="font-medium">Software Integration:</span> {feedback.softwareIntegration ? agreementScaleLabels[feedback.softwareIntegration] : 'Not answered'}</p>
                      {feedback.improvementSuggestions && (
                        <p><span className="font-medium">Improvement Suggestions:</span> {feedback.improvementSuggestions}</p>
                      )}
                      {feedback.personalLicenses && (
                        <p><span className="font-medium">Personal Licences:</span> {feedback.personalLicenses}</p>
                      )}
                      {feedback.additionalComments && (
                        <p><span className="font-medium">Additional Comments:</span> {feedback.additionalComments}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(6)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <NavigationButtons
              onBack={previousStep}
              onSubmit={handleSubmit}
              showNext={false}
              showSubmit={true}
              isLoading={isSubmitting}
            />
          </div>
        </Card>
      </Container>
    </div>
  );
};
