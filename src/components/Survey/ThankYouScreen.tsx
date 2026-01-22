import React from 'react';
import { Card } from '../UI/Card';
import { Container } from '../Layout/Container';
import { CheckCircle } from 'lucide-react';
import { useSurveyState } from '../../hooks/useSurveyState';

export const ThankYouScreen: React.FC = () => {
  const { surveyResponse, clearLocalStorage } = useSurveyState();

  React.useEffect(() => {
    // Clear localStorage after successful submission
    clearLocalStorage();
  }, []);

  const completionDate = new Date(surveyResponse.timestamp!).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen pt-20 pb-12">
      <Container maxWidth="2xl">
        <Card className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#1e6c93]/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12" style={{ color: 'rgb(30, 108, 147)' }} />
            </div>
          </div>

          <h1 className="text-4xl font-bold uppercase tracking-wide mb-4" style={{ color: '#212121' }}>
            Thank You!
          </h1>

          <p className="text-xl mb-2" style={{ color: '#424242' }}>
            Your survey has been successfully submitted.
          </p>

          <p className="text-lg mb-8" style={{ color: '#424242' }}>
            We appreciate you taking the time to share your feedback.
          </p>

          <div className="bg-[#1e6c93]/5 border border-[#1e6c93]/20 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold uppercase tracking-wide mb-3" style={{ color: 'rgb(30, 108, 147)' }}>
              Submission Details
            </h2>
            <div className="space-y-2" style={{ color: '#424242' }}>
              <p>
                <span className="font-medium">Survey ID:</span>{' '}
                <code className="bg-[#E0E0E0] px-2 py-1 rounded text-sm">{surveyResponse.id}</code>
              </p>
              <p>
                <span className="font-medium">Submitted:</span> {completionDate}
              </p>
            </div>
          </div>

          <div className="bg-[#1e6c93]/5 border border-[#1e6c93]/20 rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold uppercase tracking-wide mb-3" style={{ color: 'rgb(30, 108, 147)' }}>
              What Happens Next?
            </h2>
            <ul className="text-left space-y-2" style={{ color: '#424242' }}>
              <li className="flex items-start">
                <span className="mr-2 font-bold" style={{ color: 'rgb(30, 108, 147)' }}>✓</span>
                <span>Your responses have been saved and will be analysed by the IIET Committee</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold" style={{ color: 'rgb(30, 108, 147)' }}>✓</span>
                <span>Results will help inform software provisioning and training decisions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold" style={{ color: 'rgb(30, 108, 147)' }}>✓</span>
                <span>You may be contacted if we need clarification on any responses</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold" style={{ color: 'rgb(30, 108, 147)' }}>✓</span>
                <span>A summary of findings will be shared with all staff in the coming months</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E0E0E0]">
            <p className="text-sm" style={{ color: '#424242' }}>
              If you have any questions or concerns about this survey, please contact the IIET Committee.
            </p>
          </div>
        </Card>
      </Container>
    </div>
  );
};
