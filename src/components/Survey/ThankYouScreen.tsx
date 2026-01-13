import React from 'react';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { Container } from '../Layout/Container';
import { CheckCircle, Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { useSurveyState } from '../../hooks/useSurveyState';
import { exportToJSON, exportToCSV, exportBothFormats } from '../../utils/exportData';
import type { SurveyResponse } from '../../types/survey.types';

export const ThankYouScreen: React.FC = () => {
  const { surveyResponse, clearLocalStorage } = useSurveyState();

  const handleDownloadJSON = () => {
    exportToJSON(surveyResponse as SurveyResponse);
  };

  const handleDownloadCSV = () => {
    exportToCSV(surveyResponse as SurveyResponse);
  };

  const handleDownloadBoth = () => {
    exportBothFormats(surveyResponse as SurveyResponse);
  };

  React.useEffect(() => {
    // Clear localStorage after successful submission
    clearLocalStorage();
  }, []);

  const completionDate = new Date(surveyResponse.timestamp!).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <Container maxWidth="2xl">
        <Card className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thank You!
          </h1>

          <p className="text-xl text-gray-700 mb-2">
            Your survey has been successfully submitted.
          </p>

          <p className="text-lg text-gray-600 mb-8">
            We appreciate you taking the time to share your feedback.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Submission Details
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Survey ID:</span>{' '}
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">{surveyResponse.id}</code>
              </p>
              <p>
                <span className="font-medium">Submitted:</span> {completionDate}
              </p>
              <p>
                <span className="font-medium">Name:</span> {surveyResponse.userProfile?.fullName}
              </p>
              <p>
                <span className="font-medium">Email:</span> {surveyResponse.userProfile?.email}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Download Your Responses
            </h2>
            <p className="text-gray-600 mb-4 text-sm">
              You can download a copy of your survey responses for your records.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={handleDownloadJSON}
                className="flex items-center gap-2"
              >
                <FileJson className="w-4 h-4" />
                Download JSON
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadCSV}
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Download CSV
              </Button>
              <Button
                variant="primary"
                onClick={handleDownloadBoth}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Both
              </Button>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              What Happens Next?
            </h2>
            <ul className="text-left space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Your responses have been saved and will be analyzed by the IT team</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Results will help inform software provisioning and training decisions</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>You may be contacted if we need clarification on any responses</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>A summary of findings will be shared with all staff in the coming months</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If you have any questions or concerns about this survey, please contact the IT department.
            </p>
          </div>
        </Card>
      </Container>
    </div>
  );
};
