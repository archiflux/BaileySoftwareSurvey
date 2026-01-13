import React, { useState } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Container } from '../Layout/Container';
import { NavigationButtons } from '../Layout/NavigationButtons';
import { useSurveyState } from '../../hooks/useSurveyState';
import { ChevronDown, ChevronUp, Edit, Download } from 'lucide-react';
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
import { exportToJSON } from '../../utils/exportData';

export const StepReview: React.FC = () => {
  const { surveyResponse, submitSurvey, nextStep, previousStep, setCurrentStep } = useSurveyState();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']));
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    submitSurvey();
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    nextStep();
  };

  const handleDownloadDraft = () => {
    exportToJSON(surveyResponse as any);
  };

  const profile = surveyResponse.userProfile!;
  const feedback = surveyResponse.generalFeedback!;

  const SectionHeader: React.FC<{ id: string; title: string; count?: number }> = ({ id, title, count }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {count !== undefined && (
          <span className="text-sm text-gray-600">({count})</span>
        )}
      </div>
      {expandedSections.has(id) ? (
        <ChevronUp className="w-5 h-5 text-gray-600" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <Container maxWidth="2xl">
        <Card>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Responses</h2>
              <p className="text-gray-600">
                Please review your responses before submitting. You can edit any section by clicking the Edit button.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadDraft}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Draft
            </Button>
          </div>

          <div className="space-y-4">
            {/* Basic Information */}
            <div>
              <SectionHeader id="basic" title="Basic Information" />
              {expandedSections.has('basic') && (
                <div className="p-4 border border-gray-200 rounded-b-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
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
                <div className="p-4 border border-gray-200 rounded-b-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-2 flex-1">
                      {surveyResponse.softwareSelections?.map((selection, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <span className="font-medium">{selection.customName || selection.softwareName}:</span>
                          <span className="text-gray-600">{selection.usageStatus.replace(/-/g, ' ')}</span>
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
                  <div className="p-4 border border-gray-200 rounded-b-lg space-y-4">
                    {surveyResponse.currentlyUsingResponses.map((response, idx) => {
                      const software = surveyResponse.softwareSelections?.find(s => s.softwareId === response.softwareId);
                      return (
                        <div key={idx} className="pb-4 border-b last:border-0">
                          <p className="font-semibold mb-2">{software?.customName || software?.softwareName}</p>
                          <div className="text-sm space-y-1 text-gray-700">
                            <p>Frequency: {frequencyLabels[response.frequency]}</p>
                            <p>Training: {trainingLevelLabels[response.trainingLevel]}</p>
                            <p>Satisfaction: {response.satisfaction}/5 ⭐</p>
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
                  <div className="p-4 border border-gray-200 rounded-b-lg space-y-4">
                    {surveyResponse.previouslyUsedResponses.map((response, idx) => {
                      const software = surveyResponse.softwareSelections?.find(s => s.softwareId === response.softwareId);
                      return (
                        <div key={idx} className="pb-4 border-b last:border-0">
                          <p className="font-semibold mb-2">{software?.customName || software?.softwareName}</p>
                          <div className="text-sm space-y-1 text-gray-700">
                            <p>Used at: {response.usedWhere.map(w => usageLocationLabels[w]).join(', ')}</p>
                            <p>Reasons for stopping: {response.stoppedReasons.map(r => stoppedReasonLabels[r]).join(', ')}</p>
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
                  <div className="p-4 border border-gray-200 rounded-b-lg space-y-4">
                    {surveyResponse.wouldLikeToUseResponses.map((response, idx) => {
                      const software = surveyResponse.softwareSelections?.find(s => s.softwareId === response.softwareId);
                      return (
                        <div key={idx} className="pb-4 border-b last:border-0">
                          <p className="font-semibold mb-2">{software?.customName || software?.softwareName}</p>
                          <div className="text-sm space-y-1 text-gray-700">
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
                <div className="p-4 border border-gray-200 rounded-b-lg">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Overall Satisfaction:</span> {feedback.overallSatisfaction}/5 ⭐</p>
                      <p><span className="font-medium">Training Resources:</span> {agreementScaleLabels[feedback.trainingResources]}</p>
                      <p><span className="font-medium">IT Support:</span> {agreementScaleLabels[feedback.itSupport]}</p>
                      <p><span className="font-medium">Software Integration:</span> {agreementScaleLabels[feedback.softwareIntegration]}</p>
                      {feedback.improvementSuggestions && (
                        <p><span className="font-medium">Improvement Suggestions:</span> {feedback.improvementSuggestions}</p>
                      )}
                      {feedback.personalLicenses && (
                        <p><span className="font-medium">Personal Licenses:</span> {feedback.personalLicenses}</p>
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
