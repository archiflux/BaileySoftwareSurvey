// User Profile Types
export type RoleLevel =
  | 'executive-director'
  | 'senior-associate'
  | 'general'
  | 'graduate-apprentice'
  | 'intern-trainee';

export type PrimaryOffice =
  | 'bristol'
  | 'bury-st-edmunds'
  | 'chichester'
  | 'edinburgh'
  | 'exeter'
  | 'gibraltar'
  | 'kidderminster'
  | 'maidstone'
  | 'manchester'
  | 'peterborough'
  | 'plymouth'
  | 'st-austell'
  | 'torquay';

export type Discipline =
  | 'architecture'
  | 'building-services-engineering'
  | 'building-surveying'
  | 'cdm-principal-designer'
  | 'fire-engineering'
  | 'project-management'
  | 'interior-design'
  | 'quantity-surveying'
  | 'structural-civil-engineering'
  | 'town-planning';

export interface UserProfile {
  email?: string;
  fullName?: string;
  roleLevel: RoleLevel;
  discipline: Discipline;
  primaryOffice: PrimaryOffice;
}

// Software Category Types
export interface SoftwareItem {
  id: string;
  name: string;
  isOther?: boolean;
}

export interface SoftwareCategory {
  categoryName: string;
  categoryId: string;
  software: SoftwareItem[];
}

export interface DisciplineSoftware {
  discipline: Discipline;
  displayName: string;
  categories: SoftwareCategory[];
}

// Software Selection Types
export type UsageStatus = 'currently-using' | 'used-previously' | 'would-like-to-use';

export interface SoftwareSelection {
  softwareId: string;
  softwareName: string;
  usageStatus: UsageStatus;
  customName?: string;
}

// Follow-up Question Response Types
export type Frequency =
  | 'daily'
  | 'several-per-week'
  | 'weekly'
  | 'monthly'
  | 'less-than-monthly';

export type TrainingLevel =
  | 'very-confident'
  | 'somewhat-confident'
  | 'need-more'
  | 'require-significant';

export type Satisfaction = 1 | 2 | 3 | 4 | 5;

export interface CurrentlyUsingResponse {
  softwareId: string;
  frequency: Frequency;
  trainingLevel: TrainingLevel;
  satisfaction: Satisfaction;
  comments?: string;
}

export type UsageLocation = 'bailey-partnership' | 'previous-employer' | 'personal-capacity';

export type StoppedReason =
  | 'superseded'
  | 'not-required'
  | 'discontinued'
  | 'company-decision'
  | 'personal-preference'
  | 'other';

export interface PreviouslyUsedResponse {
  softwareId: string;
  usedWhere: UsageLocation[];
  stoppedReasons: StoppedReason[];
  otherReason?: string;
  supersededBy?: string;
}

export type Benefit = 'significant' | 'moderate' | 'slight' | 'unsure';

export interface WouldLikeToUseResponse {
  softwareId: string;
  benefit: Benefit;
  wouldReplace?: string;
  interest: string;
}

// General Feedback Types
export type AgreementScale =
  | 'strongly-agree'
  | 'agree'
  | 'neutral'
  | 'disagree'
  | 'strongly-disagree';

export interface GeneralFeedback {
  overallSatisfaction: Satisfaction;
  trainingResources: AgreementScale;
  itSupport: AgreementScale;
  softwareIntegration: AgreementScale;
  improvementSuggestions?: string;
  personalLicenses?: string;
  additionalComments?: string;
}

// Complete Survey Response
export type CompletionStatus = 'draft' | 'completed';

export interface SurveyResponse {
  id: string;
  timestamp: string;
  userProfile: UserProfile;
  softwareSelections: SoftwareSelection[];
  currentlyUsingResponses: CurrentlyUsingResponse[];
  previouslyUsedResponses: PreviouslyUsedResponse[];
  wouldLikeToUseResponses: WouldLikeToUseResponse[];
  generalFeedback: GeneralFeedback;
  completionStatus: CompletionStatus;
}

// Display Labels
export const roleLevelLabels: Record<RoleLevel, string> = {
  'executive-director': 'Executive Director / Director',
  'senior-associate': 'Senior Associate / Associate',
  'general': 'General (Architect / Project Manager / Surveyor / Engineer / Planner / Designer / Support Staff)',
  'graduate-apprentice': 'Graduate/Apprentice',
  'intern-trainee': 'Intern/Trainees'
};

export const primaryOfficeLabels: Record<PrimaryOffice, string> = {
  'bristol': 'Bristol',
  'bury-st-edmunds': 'Bury St. Edmunds',
  'chichester': 'Chichester',
  'edinburgh': 'Edinburgh',
  'exeter': 'Exeter',
  'gibraltar': 'Gibraltar',
  'kidderminster': 'Kidderminster',
  'maidstone': 'Maidstone',
  'manchester': 'Manchester',
  'peterborough': 'Peterborough',
  'plymouth': 'Plymouth',
  'st-austell': 'St Austell',
  'torquay': 'Torquay'
};

export const disciplineLabels: Record<Discipline, string> = {
  'architecture': 'Architecture',
  'building-services-engineering': 'Building Services Engineering',
  'building-surveying': 'Building Surveying',
  'cdm-principal-designer': 'CDM/Principal Designer',
  'fire-engineering': 'Fire Engineering',
  'project-management': 'Project Management',
  'interior-design': 'Interior Design',
  'quantity-surveying': 'Quantity Surveying',
  'structural-civil-engineering': 'Structural and Civil Engineering',
  'town-planning': 'Town Planning'
};

export const frequencyLabels: Record<Frequency, string> = {
  'daily': 'Daily',
  'several-per-week': 'Several times per week',
  'weekly': 'Weekly',
  'monthly': 'Monthly',
  'less-than-monthly': 'Less than monthly'
};

export const trainingLevelLabels: Record<TrainingLevel, string> = {
  'very-confident': 'Very confident',
  'somewhat-confident': 'Somewhat confident',
  'need-more': 'Need more training',
  'require-significant': 'Require significant training'
};

export const usageLocationLabels: Record<UsageLocation, string> = {
  'bailey-partnership': 'Used at Bailey Partnership',
  'previous-employer': 'Used at a previous employer',
  'personal-capacity': 'In a personal capacity'
};

export const stoppedReasonLabels: Record<StoppedReason, string> = {
  'superseded': 'Superseded by better software',
  'not-required': 'Not required for role',
  'discontinued': 'Software discontinued',
  'company-decision': 'Company decision',
  'personal-preference': 'Personal preference',
  'other': 'Other'
};

export const benefitLabels: Record<Benefit, string> = {
  'significant': 'Significant benefit',
  'moderate': 'Moderate benefit',
  'slight': 'Slight benefit',
  'unsure': 'Unsure'
};

export const agreementScaleLabels: Record<AgreementScale, string> = {
  'strongly-agree': 'Strongly Agree',
  'agree': 'Agree',
  'neutral': 'Neutral',
  'disagree': 'Disagree',
  'strongly-disagree': 'Strongly Disagree'
};
