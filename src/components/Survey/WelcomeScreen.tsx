import React from 'react';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { Container } from '../Layout/Container';
import { ClipboardList } from 'lucide-react';
import { APP_NAME, ESTIMATED_COMPLETION_TIME, DATA_PRIVACY_STATEMENT } from '../../utils/constants';

interface WelcomeScreenProps {
  onBegin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onBegin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <Container maxWidth="2xl">
        <Card className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <ClipboardList className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {APP_NAME}
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Help us understand software usage, training needs, and satisfaction across
            all disciplines in the practice.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Survey Purpose
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Assess current software usage across all disciplines</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Identify training needs and skill development opportunities</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Gather feedback on software satisfaction and integration</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Understand interest in new software tools and technologies</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              What to Expect
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>
                  <strong>Estimated time:</strong> {ESTIMATED_COMPLETION_TIME}
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>
                  <strong>Progress saving:</strong> Your progress is automatically saved
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>
                  <strong>Relevant questions:</strong> You'll only see software options for your discipline
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>
                  <strong>Detailed feedback:</strong> Follow-up questions based on your selections
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Data Privacy
            </h2>
            <p className="text-gray-700">
              {DATA_PRIVACY_STATEMENT}
            </p>
          </div>

          <Button
            onClick={onBegin}
            size="lg"
            className="px-12 py-4 text-lg"
          >
            Begin Survey
          </Button>

          <p className="text-sm text-gray-500 mt-6">
            You can return to this survey at any time - your progress will be saved automatically
          </p>
        </Card>
      </Container>
    </div>
  );
};
