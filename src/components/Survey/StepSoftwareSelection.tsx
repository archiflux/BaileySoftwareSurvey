import React, { useState, useEffect } from 'react';
import { Card } from '../UI/Card';
import { Checkbox, Input } from '../UI';
import { Container } from '../Layout/Container';
import { NavigationButtons } from '../Layout/NavigationButtons';
import { useSurveyState } from '../../hooks/useSurveyState';
import { getSoftwareForDiscipline } from '../../utils/softwareDatabase';
import type { SoftwareSelection, UsageStatus } from '../../types/survey.types';

export const StepSoftwareSelection: React.FC = () => {
  const { surveyResponse, updateSoftwareSelections, goToNextValidStep, previousStep } = useSurveyState();
  const profile = surveyResponse.userProfile!;
  const disciplineData = getSoftwareForDiscipline(profile.discipline);

  // Track selections and custom names for "Other" options
  const [selections, setSelections] = useState<Map<string, Set<UsageStatus>>>(new Map());
  const [customNames, setCustomNames] = useState<Map<string, string>>(new Map());
  const [error, setError] = useState<string>('');

  // Initialize from existing selections
  useEffect(() => {
    const existingSelections = new Map<string, Set<UsageStatus>>();
    const existingCustomNames = new Map<string, string>();

    surveyResponse.softwareSelections?.forEach(selection => {
      if (!existingSelections.has(selection.softwareId)) {
        existingSelections.set(selection.softwareId, new Set());
      }
      existingSelections.get(selection.softwareId)!.add(selection.usageStatus);

      if (selection.customName) {
        existingCustomNames.set(selection.softwareId, selection.customName);
      }
    });

    setSelections(existingSelections);
    setCustomNames(existingCustomNames);
  }, []);

  const handleCheckboxChange = (softwareId: string, status: UsageStatus, checked: boolean) => {
    const newSelections = new Map(selections);

    if (!newSelections.has(softwareId)) {
      newSelections.set(softwareId, new Set());
    }

    if (checked) {
      newSelections.get(softwareId)!.add(status);
    } else {
      newSelections.get(softwareId)!.delete(status);
      if (newSelections.get(softwareId)!.size === 0) {
        newSelections.delete(softwareId);
      }
    }

    setSelections(newSelections);
  };

  const handleCustomNameChange = (softwareId: string, name: string) => {
    const newCustomNames = new Map(customNames);
    if (name.trim()) {
      newCustomNames.set(softwareId, name);
    } else {
      newCustomNames.delete(softwareId);
    }
    setCustomNames(newCustomNames);
  };

  const handleNext = () => {
    // Convert selections to SoftwareSelection array
    const softwareSelections: SoftwareSelection[] = [];

    disciplineData?.categories.forEach(category => {
      category.software.forEach(software => {
        const statuses = selections.get(software.id);
        if (statuses && statuses.size > 0) {
          // Check if custom name is required but missing
          if (software.isOther && !customNames.get(software.id)?.trim()) {
            setError(`Please specify the name for "Other" in ${category.categoryName}`);
            return;
          }

          statuses.forEach(status => {
            softwareSelections.push({
              softwareId: software.id,
              softwareName: software.name,
              usageStatus: status,
              customName: software.isOther ? customNames.get(software.id) : undefined
            });
          });
        }
      });
    });

    if (softwareSelections.length === 0) {
      setError('Please select at least one software');
      return;
    }

    setError('');
    updateSoftwareSelections(softwareSelections);
    goToNextValidStep();
  };

  if (!disciplineData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted pt-28 pb-12">
      <Container maxWidth="2xl">
        <Card>
          <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-2 text-foreground">Software Selection</h2>
          <p className="mb-6 text-muted-foreground">
            For each software tool below, indicate your usage status. You can select multiple options for each software.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {disciplineData.categories.map(category => (
              <div key={category.categoryId} className="border-b border-border pb-6 last:border-0">
                <h3 className="text-lg font-semibold mb-4 text-[#0052FF]">
                  {category.categoryName}
                </h3>

                <div className="space-y-3">
                  {category.software.map(software => {
                    const isSelected = selections.has(software.id);
                    const statuses = selections.get(software.id) || new Set();

                    return (
                      <div key={software.id} className="bg-gradient-to-r from-[#0052FF]/5 to-transparent p-4 rounded-xl border border-[#0052FF]/10 hover:border-[#0052FF]/20 transition-colors">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                          <div className="md:col-span-1 font-medium text-foreground">
                            {software.name}
                          </div>
                          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <Checkbox
                              label="Currently using"
                              checked={statuses.has('currently-using')}
                              onChange={(e) => handleCheckboxChange(software.id, 'currently-using', e.target.checked)}
                            />
                            <Checkbox
                              label="Used previously"
                              checked={statuses.has('used-previously')}
                              onChange={(e) => handleCheckboxChange(software.id, 'used-previously', e.target.checked)}
                            />
                            <Checkbox
                              label="Would like to use"
                              checked={statuses.has('would-like-to-use')}
                              onChange={(e) => handleCheckboxChange(software.id, 'would-like-to-use', e.target.checked)}
                            />
                          </div>
                        </div>

                        {software.isOther && isSelected && (
                          <div className="mt-3 ml-0 md:ml-[25%]">
                            <Input
                              placeholder="Please specify the software name"
                              value={customNames.get(software.id) || ''}
                              onChange={(e) => handleCustomNameChange(software.id, e.target.value)}
                              className="max-w-md"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <NavigationButtons
              onBack={previousStep}
              onNext={handleNext}
            />
          </div>
        </Card>
      </Container>
    </div>
  );
};
