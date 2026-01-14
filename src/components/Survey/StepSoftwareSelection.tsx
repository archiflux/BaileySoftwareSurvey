import React, { useState, useEffect } from 'react';
import { Card } from '../UI/Card';
import { Checkbox, Input } from '../UI';
import { Container } from '../Layout/Container';
import { NavigationButtons } from '../Layout/NavigationButtons';
import { useSurveyState } from '../../hooks/useSurveyState';
import { getSoftwareForDiscipline } from '../../utils/softwareDatabase';
import type { SoftwareSelection, UsageStatus, SoftwareItem } from '../../types/survey.types';

export const StepSoftwareSelection: React.FC = () => {
  const { surveyResponse, updateSoftwareSelections, goToNextValidStep, previousStep } = useSurveyState();
  const profile = surveyResponse.userProfile!;
  const disciplineData = getSoftwareForDiscipline(profile.discipline);

  // Track selections and custom names for "Other" options
  const [selections, setSelections] = useState<Map<string, Set<UsageStatus>>>(new Map());
  const [customNames, setCustomNames] = useState<Map<string, string>>(new Map());
  const [error, setError] = useState<string>('');

  // Track dynamic "Other" entries per category
  const [dynamicOthers, setDynamicOthers] = useState<Map<string, SoftwareItem[]>>(new Map());
  // Track which "Other" boxes have spawned a next one to prevent duplicates
  const [spawnedNextBox, setSpawnedNextBox] = useState<Set<string>>(new Set());

  // Initialize from existing selections
  useEffect(() => {
    const existingSelections = new Map<string, Set<UsageStatus>>();
    const existingCustomNames = new Map<string, string>();
    const existingDynamicOthers = new Map<string, SoftwareItem[]>();

    surveyResponse.softwareSelections?.forEach(selection => {
      if (!existingSelections.has(selection.softwareId)) {
        existingSelections.set(selection.softwareId, new Set());
      }
      existingSelections.get(selection.softwareId)!.add(selection.usageStatus);

      if (selection.customName) {
        existingCustomNames.set(selection.softwareId, selection.customName);
      }

      // Track dynamic "Other" entries by checking if they have IDs ending with a number
      if (selection.softwareId.match(/-other-\d+$/)) {
        const categoryId = selection.softwareId.replace(/-other-\d+$/, '');
        if (!existingDynamicOthers.has(categoryId)) {
          existingDynamicOthers.set(categoryId, []);
        }
        const dynamicList = existingDynamicOthers.get(categoryId)!;
        // Only add if not already in the list
        if (!dynamicList.some(item => item.id === selection.softwareId)) {
          dynamicList.push({
            id: selection.softwareId,
            name: 'Other - please specify',
            isOther: true
          });
        }
      }
    });

    setSelections(existingSelections);
    setCustomNames(existingCustomNames);
    setDynamicOthers(existingDynamicOthers);
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

  const handleCustomNameChange = (softwareId: string, name: string, categoryId: string) => {
    const newCustomNames = new Map(customNames);
    if (name.trim()) {
      newCustomNames.set(softwareId, name);

      // Check if this is an "Other" option and if it has any selections
      // Only add a new "Other" box if we haven't already spawned one for this ID
      const hasSelections = selections.has(softwareId) && selections.get(softwareId)!.size > 0;
      const hasNotSpawnedYet = !spawnedNextBox.has(softwareId);

      if (hasSelections && hasNotSpawnedYet) {
        const categoryDynamicOthers = dynamicOthers.get(categoryId) || [];
        const lastOtherId = categoryDynamicOthers.length > 0
          ? categoryDynamicOthers[categoryDynamicOthers.length - 1].id
          : `${categoryId}-other`;

        // Only add new "Other" if current one is the last one
        if (softwareId === lastOtherId || softwareId === `${categoryId}-other`) {
          const nextIndex = categoryDynamicOthers.length + 1;
          const newOtherId = `${categoryId}-other-${nextIndex}`;

          // Check if this ID already exists
          if (!categoryDynamicOthers.some(item => item.id === newOtherId)) {
            const newDynamicOthers = new Map(dynamicOthers);
            const updatedList = [
              ...categoryDynamicOthers,
              {
                id: newOtherId,
                name: 'Other - please specify',
                isOther: true
              }
            ];
            newDynamicOthers.set(categoryId, updatedList);
            setDynamicOthers(newDynamicOthers);

            // Mark this "Other" box as having spawned a next one
            const newSpawnedSet = new Set(spawnedNextBox);
            newSpawnedSet.add(softwareId);
            setSpawnedNextBox(newSpawnedSet);
          }
        }
      }
    } else {
      newCustomNames.delete(softwareId);
    }
    setCustomNames(newCustomNames);
  };

  const handleNext = () => {
    // Convert selections to SoftwareSelection array
    const softwareSelections: SoftwareSelection[] = [];

    disciplineData?.categories.forEach(category => {
      // Get all software including dynamic "Other" entries
      const allSoftware = [
        ...category.software,
        ...(dynamicOthers.get(category.categoryId) || [])
      ];

      allSoftware.forEach(software => {
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
            {disciplineData.categories.map(category => {
              // Combine regular software with dynamic "Other" entries
              const allSoftware = [
                ...category.software,
                ...(dynamicOthers.get(category.categoryId) || [])
              ];

              return (
                <div key={category.categoryId} className="border-b border-border pb-6 last:border-0">
                  <h3 className="text-lg font-semibold mb-4 text-[#0052FF]">
                    {category.categoryName}
                  </h3>

                  <div className="space-y-3">
                    {allSoftware.map(software => {
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
                                onChange={(e) => handleCustomNameChange(software.id, e.target.value, category.categoryId)}
                                className="max-w-md"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
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
