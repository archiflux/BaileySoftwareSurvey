import React, { useState } from 'react';
import { Card } from '../UI/Card';
import { Input, Select, Radio } from '../UI';
import { Container } from '../Layout/Container';
import { NavigationButtons } from '../Layout/NavigationButtons';
import { useSurveyState } from '../../hooks/useSurveyState';
import { roleLevelLabels, disciplineLabels, type RoleLevel, type Discipline } from '../../types/survey.types';
import { validateEmail, validateRequired } from '../../utils/validation';

export const StepBasicInfo: React.FC = () => {
  const { surveyResponse, updateUserProfile, nextStep } = useSurveyState();
  const profile = surveyResponse.userProfile!;

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(profile.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(profile.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validateRequired(profile.fullName)) {
      newErrors.fullName = 'Full name is required';
    }

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
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <Container maxWidth="2xl">
        <Card>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Basic Information</h2>
          <p className="text-gray-600 mb-8">
            Let's start with some basic information about you and your role.
          </p>

          <div className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              required
              value={profile.email}
              onChange={(e) => updateUserProfile({ email: e.target.value })}
              error={errors.email}
              placeholder="your.email@baileypartnership.com"
            />

            <Input
              label="Full Name"
              type="text"
              required
              value={profile.fullName}
              onChange={(e) => updateUserProfile({ fullName: e.target.value })}
              error={errors.fullName}
              placeholder="John Smith"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
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
