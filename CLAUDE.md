# CLAUDE.md - AI Assistant Guide for Bailey Partnership Software Survey

> **Last Updated**: 2026-01-14
> **Project**: Bailey Partnership Software Survey
> **Version**: 1.0.0

This document provides comprehensive guidance for AI assistants working with this codebase. It covers architecture, conventions, workflows, and best practices specific to this project.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack & Architecture](#tech-stack--architecture)
3. [Codebase Structure](#codebase-structure)
4. [State Management](#state-management)
5. [Type System](#type-system)
6. [Component Patterns](#component-patterns)
7. [Styling Conventions](#styling-conventions)
8. [Data Flow](#data-flow)
9. [Development Workflow](#development-workflow)
10. [Testing & Quality](#testing--quality)
11. [Common Tasks](#common-tasks)
12. [Important Conventions](#important-conventions)
13. [Troubleshooting](#troubleshooting)

---

## Project Overview

### Purpose
A comprehensive web-based survey application to assess software usage, training needs, and satisfaction across all disciplines at Bailey Partnership Group. Managed by the IT, Innovation and Emerging Technology Committee (IIET).

### Key Features
- Multi-step survey with conditional logic based on user discipline
- Dynamic follow-up questions based on software selections
- Auto-save functionality with localStorage persistence
- Smart step navigation that skips irrelevant sections
- JSON and CSV export capabilities
- WCAG 2.1 AA accessibility compliance
- Fully responsive design (mobile, tablet, desktop)

### Survey Flow
1. **Welcome Screen** (Step 0) - Introduction and instructions
2. **Basic Information** (Step 1) - Email, name, role, discipline
3. **Software Selection** (Step 2) - Select software and usage status
4. **Currently Using** (Step 3) - *Conditional* - Detailed questions for software in use
5. **Previously Used** (Step 4) - *Conditional* - Context on discontinued software
6. **Would Like to Use** (Step 5) - *Conditional* - Interest in new software
7. **General Feedback** (Step 6) - Overall satisfaction and suggestions
8. **Review & Submit** (Step 7) - Summary with edit options
9. **Thank You** (Step 8) - Confirmation and download options

**Note**: Steps 3-5 are dynamically shown/hidden based on software selections in Step 2.

---

## Tech Stack & Architecture

### Core Technologies
```json
{
  "frontend": "React 19.2.0",
  "language": "TypeScript 5.9.3",
  "buildTool": "Vite 7.2.4",
  "stateManagement": "Zustand 5.0.10",
  "styling": "Tailwind CSS 4.1.18",
  "formHandling": "react-hook-form 7.71.0 + Zod 4.3.5",
  "icons": "Lucide React 0.562.0"
}
```

### Development Tools
- **ESLint** 9.39.1 with React plugins
- **TypeScript ESLint** 8.46.4
- **PostCSS** 8.5.6 with Autoprefixer
- **Vite Plugin React** 5.1.1

### Architecture Pattern
- **Component-based architecture** - Modular, reusable components
- **Presentational/Container pattern** - UI components vs. state logic
- **Single source of truth** - Zustand store for all survey state
- **Type-safe** - Comprehensive TypeScript definitions
- **Accessibility-first** - ARIA labels, semantic HTML, keyboard navigation

---

## Codebase Structure

```
BaileySoftwareSurvey/
├── src/
│   ├── components/
│   │   ├── Survey/              # Survey step components
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── StepBasicInfo.tsx
│   │   │   ├── StepSoftwareSelection.tsx
│   │   │   ├── StepCurrentlyUsing.tsx
│   │   │   ├── StepPreviouslyUsed.tsx
│   │   │   ├── StepWouldLikeToUse.tsx
│   │   │   ├── StepGeneralFeedback.tsx
│   │   │   ├── StepReview.tsx
│   │   │   └── ThankYouScreen.tsx
│   │   ├── UI/                  # Reusable UI components
│   │   │   ├── Alert.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Radio.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── StarRating.tsx
│   │   │   ├── Textarea.tsx
│   │   │   └── index.ts         # Barrel export
│   │   └── Layout/              # Layout components
│   │       ├── Container.tsx
│   │       └── NavigationButtons.tsx
│   ├── hooks/
│   │   └── useSurveyState.ts    # Zustand store (single source of truth)
│   ├── types/
│   │   └── survey.types.ts      # All TypeScript type definitions
│   ├── utils/
│   │   ├── constants.ts         # App constants & configuration
│   │   ├── exportData.ts        # JSON/CSV export utilities
│   │   ├── validation.ts        # Form validation rules
│   │   └── softwareDatabase.ts  # Database helper functions
│   ├── data/
│   │   └── softwareDatabase.json # Software catalog (11 disciplines)
│   ├── assets/                  # Static assets
│   ├── App.tsx                  # Main application component
│   ├── App.css                  # Global styles & animations
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Tailwind base styles
├── public/                      # Static public assets
├── dist/                        # Build output (generated)
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript configuration
├── tsconfig.app.json            # App-specific TS config
├── tsconfig.node.json           # Node-specific TS config
├── tailwind.config.js           # Tailwind theme & design tokens
├── eslint.config.js             # ESLint rules
├── vite.config.ts               # Vite build configuration
└── README.md                    # User-facing documentation
```

---

## State Management

### Zustand Store (`src/hooks/useSurveyState.ts`)

**Single Source of Truth** - All survey state is managed in one Zustand store.

#### Store Structure
```typescript
interface SurveyStore {
  // State
  currentStep: number;
  surveyResponse: Partial<SurveyResponse>;

  // Navigation Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToNextValidStep: () => void;      // Smart navigation (skips empty steps)
  goToPreviousValidStep: () => void;  // Smart navigation (skips empty steps)

  // Data Update Actions
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateSoftwareSelections: (selections: SoftwareSelection[]) => void;
  addOrUpdateCurrentlyUsing: (response: CurrentlyUsingResponse) => void;
  addOrUpdatePreviouslyUsed: (response: PreviouslyUsedResponse) => void;
  addOrUpdateWouldLikeToUse: (response: WouldLikeToUseResponse) => void;
  updateGeneralFeedback: (feedback: Partial<GeneralFeedback>) => void;

  // LocalStorage Operations
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => boolean;
  clearLocalStorage: () => void;

  // Survey Lifecycle
  initializeSurvey: () => void;
  submitSurvey: () => void;
  resetSurvey: () => void;

  // Getters/Utilities
  getSoftwareByUsageStatus: (status: UsageStatus) => SoftwareSelection[];
  isStepValid: (step: number) => boolean;
}
```

#### Key Patterns

1. **Smart Navigation**
   - `goToNextValidStep()` and `goToPreviousValidStep()` automatically skip steps 3-5 if user hasn't selected software for those categories
   - Example: If user only selects "would-like-to-use" software, navigation jumps from Step 2 → Step 5 → Step 6

2. **Auto-save**
   - Triggered in `App.tsx` after 1 second debounce when step changes
   - Only saves on steps 1-7 (not welcome or thank you screens)
   - Key: `'bailey-survey-draft'`

3. **Update Patterns**
   - Use `addOrUpdate*` methods for array-based responses (prevents duplicates)
   - Use `update*` methods for object-based data (merges partial updates)

---

## Type System

### Core Types (`src/types/survey.types.ts`)

All types are fully documented with JSDoc comments. Key type hierarchies:

#### User Profile
```typescript
type RoleLevel = 'executive' | 'slt' | 'associate' | 'senior' | 'architect-pm-qs' | 'intern-trainee';
type Discipline = 'architectural-design' | 'building-surveying' | ... (11 total);

interface UserProfile {
  email: string;
  fullName: string;
  roleLevel: RoleLevel;
  discipline: Discipline;
}
```

#### Software Selection
```typescript
type UsageStatus = 'currently-using' | 'used-previously' | 'would-like-to-use';

interface SoftwareSelection {
  softwareId: string;
  softwareName: string;
  usageStatus: UsageStatus;
  customName?: string;  // For "Other" selections
}
```

#### Response Types
- `CurrentlyUsingResponse` - Frequency, training level, satisfaction (1-5 stars), comments
- `PreviouslyUsedResponse` - Where used, why stopped, superseded by
- `WouldLikeToUseResponse` - Expected benefit, would replace, interest reason

#### Complete Survey
```typescript
interface SurveyResponse {
  id: string;
  timestamp: string;
  userProfile: UserProfile;
  softwareSelections: SoftwareSelection[];
  currentlyUsingResponses: CurrentlyUsingResponse[];
  previouslyUsedResponses: PreviouslyUsedResponse[];
  wouldLikeToUseResponses: WouldLikeToUseResponse[];
  generalFeedback: GeneralFeedback;
  completionStatus: 'draft' | 'completed';
}
```

#### Display Labels
All enums have corresponding label objects (e.g., `roleLevelLabels`, `disciplineLabels`) for user-friendly display.

---

## Component Patterns

### File Organization
- **Survey components** - Multi-step survey screens (in `components/Survey/`)
- **UI components** - Reusable, presentational components (in `components/UI/`)
- **Layout components** - Structural components (in `components/Layout/`)

### Component Conventions

#### 1. Survey Step Components
```typescript
// Pattern: Each step is a self-contained component
// - Manages local form state with react-hook-form
// - Reads/writes to Zustand store
// - Includes built-in navigation buttons

export function StepBasicInfo() {
  const { surveyResponse, updateUserProfile, goToNextValidStep } = useSurveyState();
  // ... component logic
}
```

#### 2. UI Components
```typescript
// Pattern: Reusable, typed props, no direct state access
// - Fully accessible (ARIA labels, keyboard navigation)
// - Consistent variant patterns (e.g., Button has 'primary', 'outline', 'ghost')

interface ButtonProps {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  // ... other props
}
```

#### 3. Barrel Exports
```typescript
// src/components/UI/index.ts - Simplifies imports
export { Alert } from './Alert';
export { Button } from './Button';
// ... etc
```

### Accessibility Requirements
- All form inputs must have `aria-label` or associated `<label>`
- Buttons must have descriptive text or `aria-label`
- Use semantic HTML (`<main>`, `<section>`, `<article>`, etc.)
- Keyboard navigation support (Tab, Enter, Esc)
- Focus indicators visible (ring classes)
- Color contrast ratios meet WCAG AA standards

---

## Styling Conventions

### Tailwind Configuration

#### Color System (`tailwind.config.js`)
```javascript
colors: {
  // Primary: Electric Blue
  primary: {
    DEFAULT: '#0052FF',
    dark: '#0041CC',
    light: '#4D7CFF',
  },

  // UI Colors
  background: '#FAFAFA',
  foreground: '#0F172A',
  muted: '#F1F5F9',
  accent: '#0052FF',
  border: '#E2E8F0',
  card: '#FFFFFF',
  ring: '#0052FF',

  // Legacy BP brand colors (bp-*)
  bp: {
    teal: '#0052FF',
    // ... etc
  }
}
```

#### Typography
- **Font Family**: `Inter` (sans), `Calistoga` (display), `JetBrains Mono` (mono)
- **Font Loading**: Specified in `index.css` via Google Fonts

#### Spacing Scale
```javascript
spacing: {
  'xs': '8px',
  'sm': '16px',
  'md': '24px',
  'lg': '48px',
  'xl': '72px',
  'xxl': '120px',
}
```

#### Shadows
```javascript
boxShadow: {
  'sm': '0 1px 3px rgba(0,0,0,0.06)',
  'md': '0 4px 6px rgba(0,0,0,0.07)',
  'lg': '0 10px 15px rgba(0,0,0,0.08)',
  'xl': '0 20px 25px rgba(0,0,0,0.1)',
  'accent': '0 4px 14px rgba(0,82,255,0.25)',
  'accent-lg': '0 8px 24px rgba(0,82,255,0.35)',
}
```

### CSS Conventions

#### 1. Utility-First
Always prefer Tailwind utilities over custom CSS:
```tsx
// ✅ Good
<div className="p-4 bg-white rounded-lg shadow-md">

// ❌ Avoid (unless truly custom)
<div className="custom-card">
```

#### 2. Responsive Design
```tsx
// Mobile-first approach
<div className="text-sm md:text-base lg:text-lg">
```

#### 3. Custom Animations
Defined in `App.css`:
```css
.page-transition {
  animation: fadeSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}
```

---

## Data Flow

### Survey Data Lifecycle

```
1. User starts survey
   ↓
2. App.tsx checks localStorage
   ↓
3. If found: Restore prompt → Load or start fresh
   If not found: initializeSurvey()
   ↓
4. User navigates through steps
   - Each step updates Zustand store
   - Auto-save triggers after 1s debounce
   ↓
5. Smart navigation skips irrelevant steps
   ↓
6. Review step shows complete summary
   ↓
7. Submit → Mark as 'completed', update timestamp
   ↓
8. Thank you screen → Download JSON/CSV
```

### Software Database Flow

```
src/data/softwareDatabase.json
   ↓
Loaded in StepBasicInfo (after discipline selection)
   ↓
Filtered by user's discipline
   ↓
Displayed in StepSoftwareSelection
   ↓
User selects software + usage status
   ↓
Stored in surveyResponse.softwareSelections[]
   ↓
Used to conditionally show Steps 3-5
```

---

## Development Workflow

### Setup
```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Git Workflow
- **Main Branch**: `main` (production-ready code)
- **Feature Branches**: `claude/*` for AI assistant work
- **Commit Messages**: Conventional commits format
  - `feat: Add new feature`
  - `fix: Fix bug`
  - `docs: Update documentation`
  - `refactor: Refactor code`
  - `style: Update styling`

### Build & Deploy
- **Build Output**: `dist/` directory
- **Deployment Options**:
  - Netlify (build: `npm run build`, publish: `dist`)
  - Vercel (framework: Vite, output: `dist`)
  - GitHub Pages (`npm run deploy`)
  - AWS S3 + CloudFront

---

## Testing & Quality

### Code Quality Tools
1. **TypeScript** - Strict mode enabled (`tsc -b`)
2. **ESLint** - React & React Hooks rules (`npm run lint`)
3. **Type Coverage** - 100% of source files typed

### Manual Testing Checklist
- [ ] All 11 disciplines load correct software lists
- [ ] Smart navigation skips empty steps correctly
- [ ] Auto-save restores data after page refresh
- [ ] Form validation prevents invalid submissions
- [ ] JSON export contains complete data
- [ ] CSV export is properly formatted
- [ ] Mobile responsive (320px - 1920px)
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announcements are clear

### Accessibility Testing
- Use browser DevTools Lighthouse (Target: 90+ accessibility score)
- Test with keyboard only (no mouse)
- Test with screen reader (NVDA, JAWS, VoiceOver)

---

## Common Tasks

### Adding a New Survey Step

1. **Create component** in `src/components/Survey/StepNewName.tsx`
2. **Update constants** in `src/utils/constants.ts`:
   ```typescript
   export const SURVEY_STEPS = {
     // ... existing steps
     NEW_STEP: 9,
   };
   ```
3. **Update App.tsx** `renderStep()` function
4. **Update navigation logic** in `useSurveyState.ts` (if conditional)
5. **Update types** in `src/types/survey.types.ts` if new data structure needed

### Adding a New Discipline

1. **Edit** `src/data/softwareDatabase.json`:
   ```json
   {
     "discipline": "new-discipline-slug",
     "displayName": "New Discipline Name",
     "categories": [...]
   }
   ```
2. **Update types** in `src/types/survey.types.ts`:
   ```typescript
   export type Discipline = '...' | 'new-discipline-slug';
   export const disciplineLabels: Record<Discipline, string> = {
     // ... existing
     'new-discipline-slug': 'New Discipline Name',
   };
   ```

### Customizing UI Components

1. **Variant System**: Add new variants to existing components
   ```typescript
   type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
   ```
2. **Tailwind Classes**: Update component's className logic
3. **Maintain Accessibility**: Keep ARIA attributes when modifying

### Modifying Export Formats

Edit `src/utils/exportData.ts`:
- `exportToJSON()` - Simple JSON.stringify
- `exportToCSV()` - Custom CSV flattening logic
- Add new export formats by creating new functions

---

## Important Conventions

### DO's ✅

1. **Always use TypeScript** - No implicit `any` types
2. **Use Zustand store** - Never create local state for survey data
3. **Follow accessibility guidelines** - ARIA labels, semantic HTML, keyboard nav
4. **Use Tailwind utilities** - Avoid custom CSS unless necessary
5. **Validate user input** - Use Zod schemas or custom validators
6. **Test responsive design** - Mobile, tablet, desktop breakpoints
7. **Use barrel exports** - Import UI components from `components/UI/index.ts`
8. **Document complex logic** - Add comments for non-obvious code
9. **Keep components focused** - Single responsibility principle
10. **Use smart navigation** - `goToNextValidStep()` instead of `nextStep()`

### DON'Ts ❌

1. **Don't bypass Zustand** - Never use React state for survey responses
2. **Don't hardcode data** - Use constants from `utils/constants.ts`
3. **Don't break accessibility** - Never remove ARIA labels or keyboard support
4. **Don't ignore TypeScript errors** - Fix them, don't use `@ts-ignore`
5. **Don't create one-off styles** - Extend Tailwind config instead
6. **Don't modify `softwareDatabase.json` structure** - Components depend on it
7. **Don't skip validation** - All user inputs must be validated
8. **Don't use inline styles** - Use Tailwind classes
9. **Don't create duplicate utilities** - Check `utils/` before adding new functions
10. **Don't forget auto-save** - Changes should persist to localStorage

---

## Troubleshooting

### Common Issues

#### 1. TypeScript Errors After Adding New Types
```bash
# Clean build and restart TypeScript server
rm -rf dist/
npm run build
```

#### 2. Tailwind Classes Not Applying
- Check `tailwind.config.js` content paths include your file
- Ensure class names are complete strings (not dynamic)
- Run dev server with clean cache: `npm run dev -- --force`

#### 3. LocalStorage Not Saving
- Check browser privacy settings (localStorage might be blocked)
- Verify `saveToLocalStorage()` is called after state updates
- Check browser console for errors

#### 4. Smart Navigation Not Working
- Verify `softwareSelections` array has correct `usageStatus` values
- Debug with: `console.log(useSurveyState.getState().surveyResponse)`

#### 5. Software Database Not Loading
- Validate JSON syntax in `softwareDatabase.json`
- Check file path in import statement
- Verify discipline slug matches exactly

### Debug Tools

#### Zustand DevTools
Add to `useSurveyState.ts`:
```typescript
import { devtools } from 'zustand/middleware';

export const useSurveyState = create<SurveyStore>()(
  devtools((set, get) => ({ /* ... */ }), { name: 'SurveyStore' })
);
```

#### React DevTools
- Install React DevTools browser extension
- Inspect component props and state
- Profile component re-renders

---

## Key Files Reference

| File | Purpose | When to Modify |
|------|---------|---------------|
| `App.tsx` | Main app component, step routing | Adding/removing steps, changing navigation flow |
| `useSurveyState.ts` | Zustand store, all state logic | Adding new state fields, actions, or business logic |
| `survey.types.ts` | TypeScript type definitions | Adding new data structures, enums, or types |
| `constants.ts` | App configuration, step titles | Changing app name, step names, or constants |
| `softwareDatabase.json` | Software catalog for all disciplines | Adding/removing software or disciplines |
| `exportData.ts` | JSON/CSV export utilities | Changing export format or adding new export types |
| `tailwind.config.js` | Design system tokens | Changing colors, spacing, fonts, or shadows |
| `validation.ts` | Form validation rules | Adding new validation rules |

---

## Performance Considerations

1. **Code Splitting** - Vite automatically code-splits by route
2. **Lazy Loading** - Large components can use React.lazy() if needed
3. **Memoization** - Use `useMemo()` for expensive calculations
4. **LocalStorage** - Debounced saves prevent excessive writes
5. **Bundle Size** - Current optimized build: ~150KB gzipped

---

## Additional Resources

- [React 19 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Guide](https://vite.dev/guide/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Contact & Support

For questions or issues related to this codebase:
- **Technical Issues**: Contact Bailey Partnership IT Support
- **Feature Requests**: Submit to IIET Committee
- **Bug Reports**: Document in project issue tracker

---

**End of CLAUDE.md**

*This document should be updated whenever significant architectural changes are made to the codebase.*
