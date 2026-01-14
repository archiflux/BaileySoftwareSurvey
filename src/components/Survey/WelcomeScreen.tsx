import React from 'react';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { Container } from '../Layout/Container';
import { ClipboardList } from 'lucide-react';
import { APP_NAME, ESTIMATED_COMPLETION_TIME, DATA_PRIVACY_STATEMENT, IIET_ABOUT } from '../../utils/constants';

interface WelcomeScreenProps {
  onBegin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onBegin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] to-[#E0E0E0] py-12">
      <Container maxWidth="2xl">
        <Card className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center border-4 border-primary-light">
              <ClipboardList className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold uppercase tracking-wide mb-4" style={{ color: '#212121' }}>
            {APP_NAME}
          </h1>

          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#424242' }}>
            Help us understand software usage, training needs, and preferences across
            all disciplines in the practice.
          </p>

          <div className="bg-primary/5 border-l-4 border-primary rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold uppercase tracking-wide mb-3" style={{ color: '#006064' }}>
              About the IIET Committee
            </h2>
            <p style={{ color: '#424242' }}>
              {IIET_ABOUT}
            </p>
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold uppercase tracking-wide mb-4" style={{ color: '#006064' }}>
              Survey Purpose
            </h2>
            <ul className="space-y-2" style={{ color: '#424242' }}>
              <li className="flex items-start">
                <span className="text-primary mr-2 font-bold">✓</span>
                <span>Assess current software usage across all disciplines</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2 font-bold">✓</span>
                <span>Identify training needs and skill development opportunities</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2 font-bold">✓</span>
                <span>Gather feedback on software preferences and integration</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2 font-bold">✓</span>
                <span>Understand interest in new software tools and technologies</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold uppercase tracking-wide mb-3" style={{ color: '#006064' }}>
              What to Expect
            </h2>
            <ul className="space-y-2" style={{ color: '#424242' }}>
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
            <h2 className="text-xl font-semibold uppercase tracking-wide mb-3" style={{ color: '#006064' }}>
              Data Privacy
            </h2>
            <p style={{ color: '#424242' }}>
              {DATA_PRIVACY_STATEMENT}
            </p>
          </div>

          <Button
            onClick={onBegin}
            size="lg"
            className="px-12 py-4 text-lg rounded-full uppercase tracking-widest font-semibold"
          >
            Begin Survey
          </Button>

          <p className="text-sm mt-6" style={{ color: '#424242' }}>
            You can return to this survey at any time - your progress will be saved automatically
          </p>
        </Card>
      </Container>
    </div>
  );
};
