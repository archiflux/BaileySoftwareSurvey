import type { SurveyResponse } from '../types/survey.types';

/**
 * Export survey response as JSON file
 */
export const exportToJSON = (surveyResponse: SurveyResponse): void => {
  const dataStr = JSON.stringify(surveyResponse, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `bailey-survey-${surveyResponse.id}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Escape CSV field value
 */
const escapeCSVField = (value: any): string => {
  if (value === null || value === undefined) return '';

  const str = String(value);
  // If the field contains comma, quote, or newline, wrap it in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * Export survey response as CSV file
 */
export const exportToCSV = (surveyResponse: SurveyResponse): void => {
  const rows: string[][] = [];

  // Header row
  rows.push([
    'Survey ID',
    'Timestamp',
    'Email',
    'Full Name',
    'Role Level',
    'Discipline',
    'Overall Satisfaction',
    'Training Resources',
    'IT Support',
    'Software Integration',
    'Improvement Suggestions',
    'Personal Licenses',
    'Additional Comments'
  ]);

  // Data row
  const profile = surveyResponse.userProfile;
  const feedback = surveyResponse.generalFeedback;

  rows.push([
    surveyResponse.id,
    surveyResponse.timestamp,
    profile.email,
    profile.fullName,
    profile.roleLevel,
    profile.discipline,
    String(feedback.overallSatisfaction),
    feedback.trainingResources,
    feedback.itSupport,
    feedback.softwareIntegration,
    feedback.improvementSuggestions || '',
    feedback.personalLicenses || '',
    feedback.additionalComments || ''
  ]);

  // Software selections section
  rows.push([]); // Empty row
  rows.push(['Software Selections']);
  rows.push(['Software Name', 'Usage Status', 'Custom Name (if Other)']);

  surveyResponse.softwareSelections.forEach(selection => {
    rows.push([
      selection.softwareName,
      selection.usageStatus,
      selection.customName || ''
    ]);
  });

  // Currently using responses
  if (surveyResponse.currentlyUsingResponses.length > 0) {
    rows.push([]); // Empty row
    rows.push(['Currently Using - Detailed Responses']);
    rows.push(['Software ID', 'Frequency', 'Training Level', 'Satisfaction', 'Comments']);

    surveyResponse.currentlyUsingResponses.forEach(response => {
      rows.push([
        response.softwareId,
        response.frequency,
        response.trainingLevel,
        String(response.satisfaction),
        response.comments || ''
      ]);
    });
  }

  // Previously used responses
  if (surveyResponse.previouslyUsedResponses.length > 0) {
    rows.push([]); // Empty row
    rows.push(['Previously Used - Detailed Responses']);
    rows.push(['Software ID', 'Used Where', 'Stopped Reasons', 'Other Reason']);

    surveyResponse.previouslyUsedResponses.forEach(response => {
      rows.push([
        response.softwareId,
        response.usedWhere.join('; '),
        response.stoppedReasons.join('; '),
        response.otherReason || ''
      ]);
    });
  }

  // Would like to use responses
  if (surveyResponse.wouldLikeToUseResponses.length > 0) {
    rows.push([]); // Empty row
    rows.push(['Would Like to Use - Detailed Responses']);
    rows.push(['Software ID', 'Benefit', 'Would Replace', 'Interest']);

    surveyResponse.wouldLikeToUseResponses.forEach(response => {
      rows.push([
        response.softwareId,
        response.benefit,
        response.wouldReplace || '',
        response.interest
      ]);
    });
  }

  // Convert rows to CSV string
  const csvContent = rows
    .map(row => row.map(field => escapeCSVField(field)).join(','))
    .join('\n');

  // Create and download file
  const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `bailey-survey-${surveyResponse.id}-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Download both JSON and CSV formats
 */
export const exportBothFormats = (surveyResponse: SurveyResponse): void => {
  exportToJSON(surveyResponse);
  setTimeout(() => exportToCSV(surveyResponse), 100);
};
