import { create } from 'zustand';
import type {
  SurveyResponse,
  UserProfile,
  SoftwareSelection,
  CurrentlyUsingResponse,
  PreviouslyUsedResponse,
  WouldLikeToUseResponse,
  GeneralFeedback
} from '../types/survey.types';

interface SurveyStore {
  // Current state
  currentStep: number;
  surveyResponse: Partial<SurveyResponse>;

  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;

  // Smart navigation that skips empty follow-up steps
  goToNextValidStep: () => void;
  goToPreviousValidStep: () => void;

  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateSoftwareSelections: (selections: SoftwareSelection[]) => void;
  addOrUpdateCurrentlyUsing: (response: CurrentlyUsingResponse) => void;
  addOrUpdatePreviouslyUsed: (response: PreviouslyUsedResponse) => void;
  addOrUpdateWouldLikeToUse: (response: WouldLikeToUseResponse) => void;
  updateGeneralFeedback: (feedback: Partial<GeneralFeedback>) => void;

  // LocalStorage operations
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => boolean;
  clearLocalStorage: () => void;

  // Survey operations
  initializeSurvey: () => void;
  submitSurvey: () => void;
  resetSurvey: () => void;

  // Getters
  getSoftwareByUsageStatus: (status: 'currently-using' | 'used-previously' | 'would-like-to-use') => SoftwareSelection[];
  isStepValid: (step: number) => boolean;
}

const LOCAL_STORAGE_KEY = 'bailey-survey-draft';

const initialSurveyResponse: Partial<SurveyResponse> = {
  id: '',
  timestamp: '',
  userProfile: {
    email: '',
    fullName: '',
    roleLevel: 'associate',
    discipline: 'architectural-design'
  },
  softwareSelections: [],
  currentlyUsingResponses: [],
  previouslyUsedResponses: [],
  wouldLikeToUseResponses: [],
  generalFeedback: {
    overallSatisfaction: undefined as unknown as any,
    trainingResources: undefined as unknown as any,
    itSupport: undefined as unknown as any,
    softwareIntegration: undefined as unknown as any,
    improvementSuggestions: '',
    personalLicenses: '',
    additionalComments: ''
  },
  completionStatus: 'draft'
};

export const useSurveyState = create<SurveyStore>((set, get) => ({
  currentStep: 0,
  surveyResponse: { ...initialSurveyResponse },

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

  previousStep: () => set((state) => ({
    currentStep: Math.max(0, state.currentStep - 1)
  })),

  // Smart navigation that skips empty follow-up steps (3, 4, 5)
  goToNextValidStep: () => {
    const state = get();
    const { currentStep, surveyResponse } = state;

    const hasCurrentlyUsing = (surveyResponse.softwareSelections || []).some(
      s => s.usageStatus === 'currently-using'
    );
    const hasPreviouslyUsed = (surveyResponse.softwareSelections || []).some(
      s => s.usageStatus === 'used-previously'
    );
    const hasWouldLike = (surveyResponse.softwareSelections || []).some(
      s => s.usageStatus === 'would-like-to-use'
    );

    let nextStep = currentStep + 1;

    // From step 2 (Software Selection), find the first valid follow-up step
    if (currentStep === 2) {
      if (hasCurrentlyUsing) nextStep = 3;
      else if (hasPreviouslyUsed) nextStep = 4;
      else if (hasWouldLike) nextStep = 5;
      else nextStep = 6; // Go straight to General Feedback
    }
    // From step 3 (Currently Using)
    else if (currentStep === 3) {
      if (hasPreviouslyUsed) nextStep = 4;
      else if (hasWouldLike) nextStep = 5;
      else nextStep = 6;
    }
    // From step 4 (Previously Used)
    else if (currentStep === 4) {
      if (hasWouldLike) nextStep = 5;
      else nextStep = 6;
    }
    // From step 5 (Would Like to Use)
    else if (currentStep === 5) {
      nextStep = 6;
    }

    set({ currentStep: nextStep });
  },

  goToPreviousValidStep: () => {
    const state = get();
    const { currentStep, surveyResponse } = state;

    const hasCurrentlyUsing = (surveyResponse.softwareSelections || []).some(
      s => s.usageStatus === 'currently-using'
    );
    const hasPreviouslyUsed = (surveyResponse.softwareSelections || []).some(
      s => s.usageStatus === 'used-previously'
    );
    const hasWouldLike = (surveyResponse.softwareSelections || []).some(
      s => s.usageStatus === 'would-like-to-use'
    );

    let prevStep = currentStep - 1;

    // From step 6 (General Feedback), find the last valid follow-up step
    if (currentStep === 6) {
      if (hasWouldLike) prevStep = 5;
      else if (hasPreviouslyUsed) prevStep = 4;
      else if (hasCurrentlyUsing) prevStep = 3;
      else prevStep = 2; // Go back to Software Selection
    }
    // From step 5 (Would Like to Use)
    else if (currentStep === 5) {
      if (hasPreviouslyUsed) prevStep = 4;
      else if (hasCurrentlyUsing) prevStep = 3;
      else prevStep = 2;
    }
    // From step 4 (Previously Used)
    else if (currentStep === 4) {
      if (hasCurrentlyUsing) prevStep = 3;
      else prevStep = 2;
    }
    // From step 3 (Currently Using)
    else if (currentStep === 3) {
      prevStep = 2;
    }

    set({ currentStep: Math.max(0, prevStep) });
  },

  updateUserProfile: (profile) => set((state) => ({
    surveyResponse: {
      ...state.surveyResponse,
      userProfile: {
        ...state.surveyResponse.userProfile!,
        ...profile
      }
    }
  })),

  updateSoftwareSelections: (selections) => set((state) => ({
    surveyResponse: {
      ...state.surveyResponse,
      softwareSelections: selections
    }
  })),

  addOrUpdateCurrentlyUsing: (response) => set((state) => {
    const existing = state.surveyResponse.currentlyUsingResponses || [];
    const index = existing.findIndex(r => r.softwareId === response.softwareId);

    const updated = index >= 0
      ? existing.map((r, i) => i === index ? response : r)
      : [...existing, response];

    return {
      surveyResponse: {
        ...state.surveyResponse,
        currentlyUsingResponses: updated
      }
    };
  }),

  addOrUpdatePreviouslyUsed: (response) => set((state) => {
    const existing = state.surveyResponse.previouslyUsedResponses || [];
    const index = existing.findIndex(r => r.softwareId === response.softwareId);

    const updated = index >= 0
      ? existing.map((r, i) => i === index ? response : r)
      : [...existing, response];

    return {
      surveyResponse: {
        ...state.surveyResponse,
        previouslyUsedResponses: updated
      }
    };
  }),

  addOrUpdateWouldLikeToUse: (response) => set((state) => {
    const existing = state.surveyResponse.wouldLikeToUseResponses || [];
    const index = existing.findIndex(r => r.softwareId === response.softwareId);

    const updated = index >= 0
      ? existing.map((r, i) => i === index ? response : r)
      : [...existing, response];

    return {
      surveyResponse: {
        ...state.surveyResponse,
        wouldLikeToUseResponses: updated
      }
    };
  }),

  updateGeneralFeedback: (feedback) => set((state) => ({
    surveyResponse: {
      ...state.surveyResponse,
      generalFeedback: {
        ...state.surveyResponse.generalFeedback!,
        ...feedback
      }
    }
  })),

  saveToLocalStorage: () => {
    const state = get();
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          currentStep: state.currentStep,
          surveyResponse: state.surveyResponse,
          savedAt: new Date().toISOString()
        })
      );
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  loadFromLocalStorage: () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        set({
          currentStep: data.currentStep,
          surveyResponse: data.surveyResponse
        });
        return true;
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    return false;
  },

  clearLocalStorage: () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },

  initializeSurvey: () => {
    set({
      currentStep: 0,
      surveyResponse: {
        ...initialSurveyResponse,
        id: `survey-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      }
    });
  },

  submitSurvey: () => set((state) => ({
    surveyResponse: {
      ...state.surveyResponse,
      completionStatus: 'completed',
      timestamp: new Date().toISOString()
    }
  })),

  resetSurvey: () => {
    get().clearLocalStorage();
    set({
      currentStep: 0,
      surveyResponse: { ...initialSurveyResponse }
    });
  },

  getSoftwareByUsageStatus: (status) => {
    const { surveyResponse } = get();
    return (surveyResponse.softwareSelections || []).filter(
      s => s.usageStatus === status
    );
  },

  isStepValid: (step) => {
    const { surveyResponse } = get();

    switch (step) {
      case 1: // Basic Info
        const profile = surveyResponse.userProfile;
        return !!(
          profile?.email &&
          profile?.fullName &&
          profile?.roleLevel &&
          profile?.discipline
        );

      case 2: // Software Selection
        return (surveyResponse.softwareSelections?.length || 0) > 0;

      default:
        return true;
    }
  }
}));
