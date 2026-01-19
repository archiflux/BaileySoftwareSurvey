import React, { useState } from 'react';
import { Card } from '../UI/Card';
import { Select, Radio } from '../UI';
import { Container } from '../Layout/Container';
import { NavigationButtons } from '../Layout/NavigationButtons';
import { useSurveyState } from '../../hooks/useSurveyState';
import { roleLevelLabels, disciplineLabels, type RoleLevel, type Discipline } from '../../types/survey.types';
import { validateRequired } from '../../utils/validation';

export const StepBasicInfo: React.FC = () => {
  const { surveyResponse, updateUserProfile, nextStep } = useSurveyState();
  const profile = surveyResponse.userProfile!;

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(profile.roleLevel)) {
      newErrors.roleLevel = 'Role level is required';
    }

    if (!validateRequired(profile.discipline)) {
      newErrors.discipline = 'Discipline is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      nextStep();
    }
  };

  const disciplineOptions = Object.entries(disciplineLabels).map(([value, label]) => ({
    value,
    label
  }));

  return (
    <div className="min-h-screen pt-28 pb-12">
      <Container maxWidth="2xl">
        <Card>
          <h2 className="text-2xl md:text-3xl font-sans font-bold tracking-wide uppercase mb-2 text-foreground">Basic Information</h2>
          <p className="mb-8 text-muted-foreground">
            This survey is anonymous. Please tell us about your role.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wide mb-3 text-[#1e6c93]">
                Role Level <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {Object.entries(roleLevelLabels).map(([value, label]) => (
                  <Radio
                    key={value}
                    name="roleLevel"
                    label={label}
                    value={value}
                    checked={profile.roleLevel === value}
                    onChange={() => updateUserProfile({ roleLevel: value as RoleLevel })}
                  />
                ))}
              </div>
              {errors.roleLevel && (
                <p className="mt-1 text-sm text-red-600">{errors.roleLevel}</p>
              )}
            </div>

            <Select
              label="Primary Discipline"
              required
              value={profile.discipline}
              onChange={(e) => updateUserProfile({ discipline: e.target.value as Discipline })}
              options={disciplineOptions}
              error={errors.discipline}
              placeholder="Select your discipline"
            />
          </div>

          <div className="mt-8">
            <NavigationButtons
              onNext={handleNext}
              showBack={false}
            />
          </div>
        </Card>
      </Container>
    </div>
  );
};
