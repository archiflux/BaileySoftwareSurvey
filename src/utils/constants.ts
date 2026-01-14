/**
 * Application constants
 */

export const APP_NAME = 'IIET Committee Software Survey';
export const APP_VERSION = '1.0.0';

export const SURVEY_STEPS = {
  WELCOME: 0,
  BASIC_INFO: 1,
  SOFTWARE_SELECTION: 2,
  CURRENTLY_USING: 3,
  PREVIOUSLY_USED: 4,
  WOULD_LIKE_TO_USE: 5,
  GENERAL_FEEDBACK: 6,
  REVIEW: 7,
  THANK_YOU: 8
} as const;

export const STEP_TITLES: Record<number, string> = {
  [SURVEY_STEPS.WELCOME]: 'Welcome',
  [SURVEY_STEPS.BASIC_INFO]: 'Basic Information',
  [SURVEY_STEPS.SOFTWARE_SELECTION]: 'Software Selection',
  [SURVEY_STEPS.CURRENTLY_USING]: 'Software You Currently Use',
  [SURVEY_STEPS.PREVIOUSLY_USED]: 'Software You Previously Used',
  [SURVEY_STEPS.WOULD_LIKE_TO_USE]: 'Software You Would Like to Use',
  [SURVEY_STEPS.GENERAL_FEEDBACK]: 'General Feedback',
  [SURVEY_STEPS.REVIEW]: 'Review & Submit',
  [SURVEY_STEPS.THANK_YOU]: 'Thank You'
};

export const ESTIMATED_COMPLETION_TIME = '15-20 minutes';

export const DATA_PRIVACY_STATEMENT = `
Your responses will be used to improve software provisioning and training at Bailey Partnership Group.
All responses are confidential and will only be used for internal assessment purposes.
`.trim();

export const IIET_ABOUT = `
The IT, Innovation and Emerging Technology Committee (IIET) is a sub-group of the Operations, Sustainability and Innovation Board (OSIB). The IIET Committee is responsible for evaluating and recommending software tools, identifying training needs, and ensuring our technology stack supports the practice's objectives across all disciplines.
`.trim();

export const AUTOSAVE_DEBOUNCE_MS = 1000;

export const LOCAL_STORAGE_KEY = 'bailey-survey-draft';
