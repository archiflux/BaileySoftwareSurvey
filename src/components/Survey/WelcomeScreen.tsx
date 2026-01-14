import React from 'react';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { Container } from '../Layout/Container';
import { APP_NAME, ESTIMATED_COMPLETION_TIME, DATA_PRIVACY_STATEMENT, IIET_ABOUT } from '../../utils/constants';

interface WelcomeScreenProps {
  onBegin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onBegin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <Container maxWidth="2xl">
        <Card className="text-center">
          <div className="flex justify-center mb-8">
            <img
              src="/Icon-colour.png"
              alt="Bailey Partnership Logo"
              className="w-24 h-24 object-contain rounded-xl shadow-lg"
              onError={(e) => {
                console.error('Failed to load icon:', e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4 text-foreground">
            {APP_NAME}
          </h1>

          <p className="text-lg mb-10 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
            Help us understand software usage, training needs, and preferences across
            all disciplines in the practice.
          </p>

          <div className="bg-gradient-to-r from-[#0052FF]/5 to-[#4D7CFF]/5 border-l-4 border-[#0052FF] rounded-xl p-6 mb-6 text-left">
            <h2 className="text-lg font-semibold mb-3 text-[#0052FF]">
              About the IIET Committee
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {IIET_ABOUT}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#0052FF]/5 to-transparent border border-[#0052FF]/20 rounded-xl p-6 mb-6 text-left">
            <h2 className="text-lg font-semibold mb-4 text-[#0052FF]">
              Survey Purpose
            </h2>
            <ul className="space-y-3 text-foreground/80">
              <li className="flex items-start">
                <span className="text-[#0052FF] mr-3 font-bold text-lg">&#10003;</span>
                <span>Assess current software usage across all disciplines</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#0052FF] mr-3 font-bold text-lg">&#10003;</span>
                <span>Identify training needs and skill development opportunities</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#0052FF] mr-3 font-bold text-lg">&#10003;</span>
                <span>Gather feedback on software preferences and integration</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#0052FF] mr-3 font-bold text-lg">&#10003;</span>
                <span>Understand interest in new software tools and technologies</span>
              </li>
            </ul>
          </div>

          <div className="bg-muted/50 border border-border rounded-xl p-6 mb-6 text-left">
            <h2 className="text-lg font-semibold mb-4 text-foreground">
              What to Expect
            </h2>
            <ul className="space-y-3 text-foreground/80">
              <li className="flex items-start">
                <span className="text-[#0052FF] mr-3">&#8226;</span>
                <span>
                  <strong className="text-foreground">Estimated time:</strong> {ESTIMATED_COMPLETION_TIME}
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#0052FF] mr-3">&#8226;</span>
                <span>
                  <strong className="text-foreground">Progress saving:</strong> Your progress is automatically saved
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#0052FF] mr-3">&#8226;</span>
                <span>
                  <strong className="text-foreground">Relevant questions:</strong> You'll only see software options for your discipline
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#0052FF] mr-3">&#8226;</span>
                <span>
                  <strong className="text-foreground">Detailed feedback:</strong> Follow-up questions based on your selections
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-10 text-left">
            <h2 className="text-lg font-semibold mb-3 text-emerald-700">
              Data Privacy
            </h2>
            <p className="text-emerald-800/80 leading-relaxed">
              {DATA_PRIVACY_STATEMENT}
            </p>
          </div>

          <Button
            onClick={onBegin}
            size="lg"
            className="px-12 py-4 text-base shadow-accent hover:shadow-accent-lg"
          >
            Begin Survey
          </Button>

          <p className="text-sm mt-6 text-muted-foreground">
            You can return to this survey at any time - your progress will be saved automatically
          </p>
        </Card>
      </Container>
    </div>
  );
};
