/**
 * Bailey Partnership Software Survey - Google Apps Script
 *
 * DEPLOYMENT INSTRUCTIONS:
 * ========================
 * 1. Go to https://script.google.com and create a new project
 * 2. Replace the default Code.gs content with this entire script
 * 3. Click "Deploy" > "New deployment"
 * 4. Select type: "Web app"
 * 5. Set "Execute as": "Me" (your Google account)
 * 6. Set "Who has access": "Anyone" (for public survey submissions)
 * 7. Click "Deploy" and authorise when prompted
 * 8. Copy the "Web app URL" - this is your GOOGLE_SHEETS_URL
 * 9. Create a new Google Sheet and copy its ID from the URL
 *    (e.g., https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit)
 * 10. Replace SPREADSHEET_ID below with your Sheet ID
 *
 * SHEET STRUCTURE:
 * ================
 * The script will automatically create headers on first submission.
 * Each row represents one complete survey response.
 */

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your Google Sheet ID
const SHEET_NAME = 'Survey Responses'; // Name of the sheet tab

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Handle POST requests from the survey
 */
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Get or create the spreadsheet and sheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Add headers on first row
      const headers = getHeaders();
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Flatten the survey data and append as a new row
    const rowData = flattenSurveyData(data);
    sheet.appendRow(rowData);

    // Return success response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Survey submitted successfully',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Bailey Partnership Survey API is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Define column headers for the spreadsheet
 */
function getHeaders() {
  return [
    // Metadata
    'Submission Timestamp',
    'Survey ID',
    'Original Timestamp',

    // User Profile
    'Email',
    'Full Name',
    'Role Level',
    'Discipline',

    // Summary Counts
    'Currently Using Count',
    'Previously Used Count',
    'Would Like to Use Count',

    // Currently Using Software (comma-separated)
    'Currently Using Software',

    // Previously Used Software (comma-separated)
    'Previously Used Software',

    // Would Like to Use Software (comma-separated)
    'Would Like to Use Software',

    // General Feedback
    'Overall Enjoyment (1-5)',
    'Training Resources',
    'IT Support',
    'Software Integration',
    'Improvement Suggestions',
    'Personal Licences',
    'Additional Comments',

    // Raw JSON for detailed analysis
    'Currently Using Details (JSON)',
    'Previously Used Details (JSON)',
    'Would Like to Use Details (JSON)',
    'Full Response (JSON)'
  ];
}

/**
 * Flatten survey response into a row of values
 */
function flattenSurveyData(data) {
  const profile = data.userProfile || {};
  const feedback = data.generalFeedback || {};
  const selections = data.softwareSelections || [];

  // Filter selections by usage status
  const currentlyUsing = selections.filter(s => s.usageStatus === 'currently-using');
  const previouslyUsed = selections.filter(s => s.usageStatus === 'used-previously');
  const wouldLikeToUse = selections.filter(s => s.usageStatus === 'would-like-to-use');

  // Get software names (use customName if available)
  const getSoftwareNames = (items) => items
    .map(s => s.customName || s.softwareName)
    .join(', ');

  return [
    // Metadata
    new Date().toISOString(),
    data.id || '',
    data.timestamp || '',

    // User Profile
    profile.email || '',
    profile.fullName || '',
    formatRoleLevel(profile.roleLevel),
    formatDiscipline(profile.discipline),

    // Summary Counts
    currentlyUsing.length,
    previouslyUsed.length,
    wouldLikeToUse.length,

    // Software Lists
    getSoftwareNames(currentlyUsing),
    getSoftwareNames(previouslyUsed),
    getSoftwareNames(wouldLikeToUse),

    // General Feedback
    feedback.overallSatisfaction || '',
    formatAgreement(feedback.trainingResources),
    formatAgreement(feedback.itSupport),
    formatAgreement(feedback.softwareIntegration),
    feedback.improvementSuggestions || '',
    feedback.personalLicenses || '',
    feedback.additionalComments || '',

    // Detailed JSON
    JSON.stringify(data.currentlyUsingResponses || []),
    JSON.stringify(data.previouslyUsedResponses || []),
    JSON.stringify(data.wouldLikeToUseResponses || []),
    JSON.stringify(data)
  ];
}

/**
 * Format role level for display
 */
function formatRoleLevel(role) {
  const labels = {
    'executive': 'Executive',
    'slt': 'Senior Leadership Team',
    'associate': 'Associate',
    'senior': 'Senior',
    'architect-pm-qs': 'Architect/PM/QS',
    'intern-trainee': 'Intern/Trainee'
  };
  return labels[role] || role || '';
}

/**
 * Format discipline for display
 */
function formatDiscipline(discipline) {
  const labels = {
    'architectural-design': 'Architectural Design',
    'building-surveying': 'Building Surveying',
    'building-services-mep': 'Building Services/MEP Engineering',
    'civil-structural-engineering': 'Civil & Structural Engineering',
    'interior-design': 'Interior Design',
    'fire-engineering': 'Fire Engineering',
    'planning': 'Planning',
    'project-management': 'Project Management',
    'quantity-surveying': 'Quantity Surveying',
    'admin-support': 'Admin Support',
    'it-support': 'IT Support'
  };
  return labels[discipline] || discipline || '';
}

/**
 * Format agreement scale for display
 */
function formatAgreement(value) {
  const labels = {
    'strongly-agree': 'Strongly Agree',
    'agree': 'Agree',
    'neutral': 'Neutral',
    'disagree': 'Disagree',
    'strongly-disagree': 'Strongly Disagree'
  };
  return labels[value] || value || '';
}

// ============================================
// TEST FUNCTION (for debugging)
// ============================================

/**
 * Test the script with sample data
 * Run this function from the Apps Script editor to verify setup
 */
function testSubmission() {
  const sampleData = {
    id: 'test-' + Date.now(),
    timestamp: new Date().toISOString(),
    userProfile: {
      email: 'test@baileypartnership.com',
      fullName: 'Test User',
      roleLevel: 'associate',
      discipline: 'architectural-design'
    },
    softwareSelections: [
      { softwareId: 'revit', softwareName: 'Autodesk Revit', usageStatus: 'currently-using' },
      { softwareId: 'autocad', softwareName: 'AutoCAD', usageStatus: 'used-previously' }
    ],
    currentlyUsingResponses: [
      { softwareId: 'revit', frequency: 'daily', trainingLevel: 'very-confident', satisfaction: 4 }
    ],
    previouslyUsedResponses: [
      { softwareId: 'autocad', usedWhere: ['bailey-partnership'], stoppedReasons: ['superseded'], supersededBy: 'Revit' }
    ],
    wouldLikeToUseResponses: [],
    generalFeedback: {
      overallSatisfaction: 4,
      trainingResources: 'agree',
      itSupport: 'strongly-agree',
      softwareIntegration: 'neutral',
      improvementSuggestions: 'More BIM training would be helpful'
    },
    completionStatus: 'completed'
  };

  // Simulate POST request
  const mockEvent = {
    postData: {
      contents: JSON.stringify(sampleData)
    }
  };

  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
