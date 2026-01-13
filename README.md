# Bailey Partnership Software Survey

A comprehensive web-based survey application to assess software usage, training needs, and satisfaction across all disciplines at Bailey Partnership Group.

## Overview

This application provides a multi-step survey experience with:
- Conditional logic based on user discipline
- Dynamic follow-up questions based on software selections
- Auto-save functionality with localStorage persistence
- JSON and CSV export capabilities
- Fully responsive design
- WCAG 2.1 AA accessibility compliance

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7.x
- **Styling**: Tailwind CSS 4.x
- **State Management**: Zustand
- **Icons**: Lucide React
- **Validation**: Custom validation utilities

## Features

### Core Functionality
- ✅ Multi-step survey with progress tracking
- ✅ Conditional software lists based on discipline (11 disciplines supported)
- ✅ Dynamic follow-up questions for software usage
- ✅ Auto-save to localStorage
- ✅ Resume from saved drafts
- ✅ Export to JSON and CSV formats
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accessibility compliant (WCAG 2.1 AA)

### Survey Steps
1. **Welcome Screen** - Introduction and instructions
2. **Basic Information** - Email, name, role, discipline
3. **Software Selection** - Select software and usage status
4. **Currently Using** - Detailed questions for software in use
5. **Previously Used** - Context on discontinued software
6. **Would Like to Use** - Interest in new software
7. **General Feedback** - Overall satisfaction and suggestions
8. **Review & Submit** - Summary with edit options
9. **Thank You** - Confirmation and download options

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BaileySoftwareSurvey
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Survey/           # Survey step components
│   │   ├── WelcomeScreen.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── StepBasicInfo.tsx
│   │   ├── StepSoftwareSelection.tsx
│   │   ├── StepCurrentlyUsing.tsx
│   │   ├── StepPreviouslyUsed.tsx
│   │   ├── StepWouldLikeToUse.tsx
│   │   ├── StepGeneralFeedback.tsx
│   │   ├── StepReview.tsx
│   │   └── ThankYouScreen.tsx
│   ├── UI/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Radio.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── StarRating.tsx
│   │   ├── Card.tsx
│   │   └── Alert.tsx
│   └── Layout/          # Layout components
│       ├── Container.tsx
│       └── NavigationButtons.tsx
├── hooks/
│   └── useSurveyState.ts    # Zustand store
├── types/
│   └── survey.types.ts       # TypeScript definitions
├── utils/
│   ├── exportData.ts         # JSON/CSV export
│   ├── validation.ts         # Form validation
│   ├── constants.ts          # App constants
│   └── softwareDatabase.ts   # Database helpers
├── data/
│   └── softwareDatabase.json # Software catalog
└── App.tsx                   # Main application
```

## Supported Disciplines

The survey includes software lists for:
1. Architectural Design
2. Building Surveying
3. Building Services/MEP Engineering
4. Civil & Structural Engineering
5. Interior Design
6. Fire Engineering
7. Planning
8. Project Management
9. Quantity Surveying
10. Admin Support
11. IT Support

## Data Export

Survey responses can be exported in two formats:

### JSON Export
Complete survey response object with full data structure.

### CSV Export
Flattened structure suitable for Excel/Google Sheets analysis with:
- User profile information
- Software selections list
- Detailed responses for each category
- Proper escaping of commas and quotes

## Deployment

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`

### Vercel
1. Framework preset: Vite
2. Build command: `npm run build`
3. Output directory: `dist`

### AWS S3 + CloudFront
1. Build: `npm run build`
2. Upload `dist/` contents to S3 bucket
3. Configure CloudFront distribution

### GitHub Pages
1. Install gh-pages: `npm install -D gh-pages`
2. Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
3. Run: `npm run deploy`

## Customization

### Branding
- Update colors in `tailwind.config.js`
- Replace logo/branding in `WelcomeScreen.tsx`
- Modify company name in constants

### Software Database
Edit `src/data/softwareDatabase.json` to:
- Add new disciplines
- Modify software lists
- Add new categories

### Question Customization
Modify step components in `src/components/Survey/` to adjust:
- Question wording
- Response options
- Validation rules

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios (WCAG AA compliant)
- Focus indicators
- Semantic HTML

## License

Proprietary - Bailey Partnership Group

## Support

For questions or issues, contact the IT department at Bailey Partnership Group.
