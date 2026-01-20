/**
 * Bailey Partnership Software Survey - Google Apps Script with Dashboard
 *
 * This script collects survey responses AND creates a real-time analytics dashboard
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
 * 8. Copy the "Web app URL" - this is your VITE_GOOGLE_SHEETS_URL
 * 9. Create a new Google Sheet and copy its ID from the URL
 *    (e.g., https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit)
 * 10. Replace SPREADSHEET_ID below with your Sheet ID
 * 11. Run the setupDashboard() function once to create all sheets and charts
 *
 * SHEETS CREATED:
 * ===============
 * - Survey Responses: Raw data from submissions
 * - Dashboard: Overview metrics and KPIs
 * - Software Analysis: Software usage breakdown
 * - Discipline Analysis: Breakdown by discipline
 * - Training Needs: Training requirements analysis
 * - Satisfaction Analysis: Satisfaction ratings analysis
 * - Office Analysis: Analysis by primary office
 * - Lookups: Reference data for dropdowns and validation
 */

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your Google Sheet ID
const SHEET_NAMES = {
  RESPONSES: 'Survey Responses',
  DASHBOARD: 'Dashboard',
  SOFTWARE: 'Software Analysis',
  DISCIPLINE: 'Discipline Analysis',
  TRAINING: 'Training Needs',
  SATISFACTION: 'Satisfaction Analysis',
  OFFICE: 'Office Analysis',
  LOOKUPS: 'Lookups'
};

// ============================================
// LOOKUP DATA
// ============================================
const ROLE_LEVELS = {
  'executive-director': 'Executive Director / Director',
  'senior-associate': 'Senior Associate / Associate',
  'general': 'General',
  'intern-trainee': 'Intern/Trainee'
};

const PRIMARY_OFFICES = {
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

const DISCIPLINES = {
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

const FREQUENCIES = {
  'daily': 'Daily',
  'several-per-week': 'Several times per week',
  'weekly': 'Weekly',
  'monthly': 'Monthly',
  'less-than-monthly': 'Less than monthly'
};

const TRAINING_LEVELS = {
  'very-confident': 'Very confident',
  'somewhat-confident': 'Somewhat confident',
  'need-more': 'Need more training',
  'require-significant': 'Require significant training'
};

const AGREEMENT_SCALE = {
  'strongly-agree': 'Strongly Agree',
  'agree': 'Agree',
  'neutral': 'Neutral',
  'disagree': 'Disagree',
  'strongly-disagree': 'Strongly Disagree'
};

// ============================================
// MAIN API FUNCTIONS
// ============================================

/**
 * Handle POST requests from the survey
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAMES.RESPONSES);

    if (!sheet) {
      // Run initial setup if sheet doesn't exist
      setupDashboard();
      sheet = spreadsheet.getSheetByName(SHEET_NAMES.RESPONSES);
    }

    // Flatten and append the survey data
    const rowData = flattenSurveyData(data);
    sheet.appendRow(rowData);

    // Refresh dashboard calculations (optional - runs on timer trigger instead)
    // refreshDashboard();

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Survey submitted successfully',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
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
// DATA PROCESSING FUNCTIONS
// ============================================

/**
 * Define column headers for the responses sheet
 */
function getResponseHeaders() {
  return [
    // Metadata (A-C)
    'Submission Timestamp',
    'Survey ID',
    'Original Timestamp',

    // User Profile (D-H)
    'Email',
    'Full Name',
    'Role Level',
    'Primary Office',
    'Discipline',

    // Summary Counts (I-K)
    'Currently Using Count',
    'Previously Used Count',
    'Would Like to Use Count',

    // Software Lists (L-N)
    'Currently Using Software',
    'Previously Used Software',
    'Would Like to Use Software',

    // General Feedback (O-U)
    'Overall Satisfaction (1-5)',
    'Training Resources',
    'IT Support',
    'Software Integration',
    'Improvement Suggestions',
    'Personal Licences',
    'Additional Comments',

    // Detailed JSON (V-Y)
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

  // Get software names
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
    formatLookup(ROLE_LEVELS, profile.roleLevel),
    formatLookup(PRIMARY_OFFICES, profile.primaryOffice),
    formatLookup(DISCIPLINES, profile.discipline),

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
    formatLookup(AGREEMENT_SCALE, feedback.trainingResources),
    formatLookup(AGREEMENT_SCALE, feedback.itSupport),
    formatLookup(AGREEMENT_SCALE, feedback.softwareIntegration),
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
 * Format lookup value
 */
function formatLookup(lookup, key) {
  return lookup[key] || key || '';
}

// ============================================
// DASHBOARD SETUP FUNCTIONS
// ============================================

/**
 * Main setup function - Run this once to create all dashboard sheets
 */
function setupDashboard() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

  // Create all sheets
  createResponsesSheet(spreadsheet);
  createLookupsSheet(spreadsheet);
  createDashboardSheet(spreadsheet);
  createSoftwareAnalysisSheet(spreadsheet);
  createDisciplineAnalysisSheet(spreadsheet);
  createTrainingNeedsSheet(spreadsheet);
  createSatisfactionAnalysisSheet(spreadsheet);
  createOfficeAnalysisSheet(spreadsheet);

  // Set up time-based trigger for dashboard refresh
  setupTriggers();

  Logger.log('Dashboard setup complete!');
}

/**
 * Create the Survey Responses sheet
 */
function createResponsesSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(SHEET_NAMES.RESPONSES);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAMES.RESPONSES, 0);
  } else {
    sheet.clear();
  }

  const headers = getResponseHeaders();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#0052FF')
    .setFontColor('#FFFFFF');
  sheet.setFrozenRows(1);

  // Set column widths
  sheet.setColumnWidth(1, 180); // Timestamp
  sheet.setColumnWidth(4, 200); // Email
  sheet.setColumnWidth(5, 150); // Name
  sheet.setColumnWidth(12, 300); // Currently Using
  sheet.setColumnWidth(13, 300); // Previously Used
  sheet.setColumnWidth(14, 300); // Would Like to Use
  sheet.setColumnWidth(19, 400); // Improvement Suggestions
}

/**
 * Create the Lookups sheet with reference data
 */
function createLookupsSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(SHEET_NAMES.LOOKUPS);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAMES.LOOKUPS);
  } else {
    sheet.clear();
  }

  // Disciplines list
  sheet.getRange('A1').setValue('Disciplines').setFontWeight('bold');
  const disciplineList = Object.values(DISCIPLINES);
  sheet.getRange(2, 1, disciplineList.length, 1).setValues(disciplineList.map(d => [d]));

  // Offices list
  sheet.getRange('C1').setValue('Offices').setFontWeight('bold');
  const officeList = Object.values(PRIMARY_OFFICES);
  sheet.getRange(2, 3, officeList.length, 1).setValues(officeList.map(o => [o]));

  // Role levels
  sheet.getRange('E1').setValue('Role Levels').setFontWeight('bold');
  const roleList = Object.values(ROLE_LEVELS);
  sheet.getRange(2, 5, roleList.length, 1).setValues(roleList.map(r => [r]));

  // Agreement scale
  sheet.getRange('G1').setValue('Agreement Scale').setFontWeight('bold');
  const agreementList = Object.values(AGREEMENT_SCALE);
  sheet.getRange(2, 7, agreementList.length, 1).setValues(agreementList.map(a => [a]));

  // Training levels
  sheet.getRange('I1').setValue('Training Levels').setFontWeight('bold');
  const trainingList = Object.values(TRAINING_LEVELS);
  sheet.getRange(2, 9, trainingList.length, 1).setValues(trainingList.map(t => [t]));

  // Frequencies
  sheet.getRange('K1').setValue('Frequencies').setFontWeight('bold');
  const frequencyList = Object.values(FREQUENCIES);
  sheet.getRange(2, 11, frequencyList.length, 1).setValues(frequencyList.map(f => [f]));

  // Style header row
  sheet.getRange('A1:K1').setBackground('#E8E8E8');
}

/**
 * Create the main Dashboard sheet with KPIs
 */
function createDashboardSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(SHEET_NAMES.DASHBOARD);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAMES.DASHBOARD, 1);
  } else {
    sheet.clear();
  }

  const responsesSheet = "'" + SHEET_NAMES.RESPONSES + "'";

  // Title
  sheet.getRange('A1').setValue('Bailey Partnership Software Survey Dashboard')
    .setFontSize(20)
    .setFontWeight('bold')
    .setFontColor('#0052FF');
  sheet.getRange('A1:H1').merge();

  // Last updated
  sheet.getRange('A2').setValue('Last Updated:');
  sheet.getRange('B2').setFormula('=NOW()').setNumberFormat('dd/mm/yyyy hh:mm');

  // ========== KEY METRICS ROW ==========
  sheet.getRange('A4').setValue('KEY METRICS')
    .setFontWeight('bold')
    .setFontSize(14)
    .setBackground('#0052FF')
    .setFontColor('#FFFFFF');
  sheet.getRange('A4:H4').merge();

  // Total Responses
  sheet.getRange('A6').setValue('Total Responses');
  sheet.getRange('A7').setFormula(`=COUNTA(${responsesSheet}!B:B)-1`)
    .setFontSize(36)
    .setFontWeight('bold')
    .setFontColor('#0052FF');

  // Average Satisfaction
  sheet.getRange('C6').setValue('Avg. Satisfaction');
  sheet.getRange('C7').setFormula(`=IFERROR(ROUND(AVERAGE(${responsesSheet}!O:O),1),"--")`)
    .setFontSize(36)
    .setFontWeight('bold')
    .setFontColor('#0052FF');
  sheet.getRange('D7').setValue('/ 5').setFontSize(18);

  // Total Software Selections
  sheet.getRange('F6').setValue('Software Selections');
  sheet.getRange('F7').setFormula(`=IFERROR(SUM(${responsesSheet}!I:I)+SUM(${responsesSheet}!J:J)+SUM(${responsesSheet}!K:K),0)`)
    .setFontSize(36)
    .setFontWeight('bold')
    .setFontColor('#0052FF');

  // Disciplines Represented
  sheet.getRange('H6').setValue('Disciplines');
  sheet.getRange('H7').setFormula(`=IFERROR(COUNTA(UNIQUE(FILTER(${responsesSheet}!H:H,${responsesSheet}!H:H<>""))),"--")`)
    .setFontSize(36)
    .setFontWeight('bold')
    .setFontColor('#0052FF');

  // ========== RESPONSES BY STATUS ==========
  sheet.getRange('A10').setValue('SOFTWARE USAGE BREAKDOWN')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground('#E8E8E8');
  sheet.getRange('A10:D10').merge();

  sheet.getRange('A11').setValue('Currently Using');
  sheet.getRange('B11').setFormula(`=IFERROR(SUM(${responsesSheet}!I:I),0)`);
  sheet.getRange('C11').setFormula(`=IFERROR(B11/($B$11+$B$12+$B$13),0)`).setNumberFormat('0%');

  sheet.getRange('A12').setValue('Previously Used');
  sheet.getRange('B12').setFormula(`=IFERROR(SUM(${responsesSheet}!J:J),0)`);
  sheet.getRange('C12').setFormula(`=IFERROR(B12/($B$11+$B$12+$B$13),0)`).setNumberFormat('0%');

  sheet.getRange('A13').setValue('Would Like to Use');
  sheet.getRange('B13').setFormula(`=IFERROR(SUM(${responsesSheet}!K:K),0)`);
  sheet.getRange('C13').setFormula(`=IFERROR(B13/($B$11+$B$12+$B$13),0)`).setNumberFormat('0%');

  // ========== FEEDBACK SUMMARY ==========
  sheet.getRange('A16').setValue('GENERAL FEEDBACK SUMMARY')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground('#E8E8E8');
  sheet.getRange('A16:E16').merge();

  sheet.getRange('A17:E17').setValues([['Question', 'Strongly Agree', 'Agree', 'Neutral', 'Disagree/Strongly Disagree']]);
  sheet.getRange('A17:E17').setFontWeight('bold');

  sheet.getRange('A18').setValue('Training Resources');
  sheet.getRange('B18').setFormula(`=COUNTIF(${responsesSheet}!P:P,"Strongly Agree")`);
  sheet.getRange('C18').setFormula(`=COUNTIF(${responsesSheet}!P:P,"Agree")`);
  sheet.getRange('D18').setFormula(`=COUNTIF(${responsesSheet}!P:P,"Neutral")`);
  sheet.getRange('E18').setFormula(`=COUNTIF(${responsesSheet}!P:P,"Disagree")+COUNTIF(${responsesSheet}!P:P,"Strongly Disagree")`);

  sheet.getRange('A19').setValue('IT Support');
  sheet.getRange('B19').setFormula(`=COUNTIF(${responsesSheet}!Q:Q,"Strongly Agree")`);
  sheet.getRange('C19').setFormula(`=COUNTIF(${responsesSheet}!Q:Q,"Agree")`);
  sheet.getRange('D19').setFormula(`=COUNTIF(${responsesSheet}!Q:Q,"Neutral")`);
  sheet.getRange('E19').setFormula(`=COUNTIF(${responsesSheet}!Q:Q,"Disagree")+COUNTIF(${responsesSheet}!Q:Q,"Strongly Disagree")`);

  sheet.getRange('A20').setValue('Software Integration');
  sheet.getRange('B20').setFormula(`=COUNTIF(${responsesSheet}!R:R,"Strongly Agree")`);
  sheet.getRange('C20').setFormula(`=COUNTIF(${responsesSheet}!R:R,"Agree")`);
  sheet.getRange('D20').setFormula(`=COUNTIF(${responsesSheet}!R:R,"Neutral")`);
  sheet.getRange('E20').setFormula(`=COUNTIF(${responsesSheet}!R:R,"Disagree")+COUNTIF(${responsesSheet}!R:R,"Strongly Disagree")`);

  // ========== SATISFACTION DISTRIBUTION ==========
  sheet.getRange('A23').setValue('SATISFACTION RATING DISTRIBUTION')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground('#E8E8E8');
  sheet.getRange('A23:D23').merge();

  sheet.getRange('A24:B28').setValues([
    ['Rating', 'Count'],
    ['5 Stars', `=COUNTIF(${responsesSheet}!O:O,5)`],
    ['4 Stars', `=COUNTIF(${responsesSheet}!O:O,4)`],
    ['3 Stars', `=COUNTIF(${responsesSheet}!O:O,3)`],
    ['2 Stars or less', `=COUNTIFS(${responsesSheet}!O:O,"<=2",${responsesSheet}!O:O,">0")`]
  ]);
  sheet.getRange('A24:B24').setFontWeight('bold');

  // Set column widths
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 200);

  // Add borders
  sheet.getRange('A11:C13').setBorder(true, true, true, true, true, true);
  sheet.getRange('A17:E20').setBorder(true, true, true, true, true, true);
  sheet.getRange('A24:B28').setBorder(true, true, true, true, true, true);
}

/**
 * Create Software Analysis sheet
 */
function createSoftwareAnalysisSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(SHEET_NAMES.SOFTWARE);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAMES.SOFTWARE);
  } else {
    sheet.clear();
  }

  // Title
  sheet.getRange('A1').setValue('Software Usage Analysis')
    .setFontSize(16)
    .setFontWeight('bold')
    .setFontColor('#0052FF');

  // Instructions
  sheet.getRange('A3').setValue('This sheet shows software usage patterns extracted from survey responses.')
    .setFontStyle('italic');

  // Headers for software breakdown
  sheet.getRange('A5:E5').setValues([['Software Name', 'Currently Using', 'Previously Used', 'Would Like to Use', 'Total Mentions']]);
  sheet.getRange('A5:E5')
    .setFontWeight('bold')
    .setBackground('#0052FF')
    .setFontColor('#FFFFFF');

  // Note about manual refresh
  sheet.getRange('A7').setValue('Run "Refresh Software Analysis" from the Survey menu to update this data.')
    .setFontStyle('italic')
    .setFontColor('#666666');

  sheet.setColumnWidth(1, 250);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 120);
}

/**
 * Create Discipline Analysis sheet
 */
function createDisciplineAnalysisSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(SHEET_NAMES.DISCIPLINE);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAMES.DISCIPLINE);
  } else {
    sheet.clear();
  }

  const responsesSheet = "'" + SHEET_NAMES.RESPONSES + "'";

  // Title
  sheet.getRange('A1').setValue('Analysis by Discipline')
    .setFontSize(16)
    .setFontWeight('bold')
    .setFontColor('#0052FF');

  // Headers
  sheet.getRange('A4:F4').setValues([['Discipline', 'Responses', 'Avg Satisfaction', 'Software Used', 'Software Wanted', '% of Total']]);
  sheet.getRange('A4:F4')
    .setFontWeight('bold')
    .setBackground('#0052FF')
    .setFontColor('#FFFFFF');

  // Discipline rows with formulas
  const disciplines = Object.values(DISCIPLINES);
  let row = 5;

  disciplines.forEach(discipline => {
    sheet.getRange(row, 1).setValue(discipline);
    sheet.getRange(row, 2).setFormula(`=COUNTIF(${responsesSheet}!H:H,"${discipline}")`);
    sheet.getRange(row, 3).setFormula(`=IFERROR(AVERAGEIF(${responsesSheet}!H:H,"${discipline}",${responsesSheet}!O:O),"--")`).setNumberFormat('0.0');
    sheet.getRange(row, 4).setFormula(`=IFERROR(SUMIF(${responsesSheet}!H:H,"${discipline}",${responsesSheet}!I:I),0)`);
    sheet.getRange(row, 5).setFormula(`=IFERROR(SUMIF(${responsesSheet}!H:H,"${discipline}",${responsesSheet}!K:K),0)`);
    sheet.getRange(row, 6).setFormula(`=IFERROR(B${row}/SUM($B$5:$B$${5+disciplines.length-1}),0)`).setNumberFormat('0%');
    row++;
  });

  // Total row
  sheet.getRange(row, 1).setValue('TOTAL').setFontWeight('bold');
  sheet.getRange(row, 2).setFormula(`=SUM(B5:B${row-1})`).setFontWeight('bold');
  sheet.getRange(row, 3).setFormula(`=IFERROR(AVERAGE(${responsesSheet}!O:O),"--")`).setNumberFormat('0.0').setFontWeight('bold');
  sheet.getRange(row, 4).setFormula(`=SUM(D5:D${row-1})`).setFontWeight('bold');
  sheet.getRange(row, 5).setFormula(`=SUM(E5:E${row-1})`).setFontWeight('bold');
  sheet.getRange(row, 6).setValue('100%').setFontWeight('bold');

  // Style
  sheet.getRange(`A5:F${row}`).setBorder(true, true, true, true, true, true);
  sheet.setColumnWidth(1, 250);
  sheet.setColumnWidth(2, 100);
  sheet.setColumnWidth(3, 130);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 120);
  sheet.setColumnWidth(6, 100);
}

/**
 * Create Training Needs sheet
 */
function createTrainingNeedsSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(SHEET_NAMES.TRAINING);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAMES.TRAINING);
  } else {
    sheet.clear();
  }

  // Title
  sheet.getRange('A1').setValue('Training Needs Analysis')
    .setFontSize(16)
    .setFontWeight('bold')
    .setFontColor('#0052FF');

  sheet.getRange('A3').setValue('This analysis extracts training needs from the detailed software usage responses.')
    .setFontStyle('italic');

  // Headers
  sheet.getRange('A5:E5').setValues([['Software', 'Very Confident', 'Somewhat Confident', 'Need More Training', 'Require Significant Training']]);
  sheet.getRange('A5:E5')
    .setFontWeight('bold')
    .setBackground('#0052FF')
    .setFontColor('#FFFFFF');

  sheet.getRange('A7').setValue('Run "Refresh Training Analysis" from the Survey menu to update this data.')
    .setFontStyle('italic')
    .setFontColor('#666666');

  // Training summary by discipline section
  sheet.getRange('A20').setValue('TRAINING RESOURCES FEEDBACK BY DISCIPLINE')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground('#E8E8E8');
  sheet.getRange('A20:C20').merge();

  const responsesSheet = "'" + SHEET_NAMES.RESPONSES + "'";
  const disciplines = Object.values(DISCIPLINES);

  sheet.getRange('A22:C22').setValues([['Discipline', 'Positive', 'Needs Improvement']]);
  sheet.getRange('A22:C22').setFontWeight('bold');

  let row = 23;
  disciplines.forEach(discipline => {
    sheet.getRange(row, 1).setValue(discipline);
    sheet.getRange(row, 2).setFormula(`=COUNTIFS(${responsesSheet}!H:H,"${discipline}",${responsesSheet}!P:P,"Strongly Agree")+COUNTIFS(${responsesSheet}!H:H,"${discipline}",${responsesSheet}!P:P,"Agree")`);
    sheet.getRange(row, 3).setFormula(`=COUNTIFS(${responsesSheet}!H:H,"${discipline}",${responsesSheet}!P:P,"Disagree")+COUNTIFS(${responsesSheet}!H:H,"${discipline}",${responsesSheet}!P:P,"Strongly Disagree")`);
    row++;
  });

  sheet.setColumnWidth(1, 250);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 150);
  sheet.setColumnWidth(5, 200);
}

/**
 * Create Satisfaction Analysis sheet
 */
function createSatisfactionAnalysisSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(SHEET_NAMES.SATISFACTION);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAMES.SATISFACTION);
  } else {
    sheet.clear();
  }

  const responsesSheet = "'" + SHEET_NAMES.RESPONSES + "'";

  // Title
  sheet.getRange('A1').setValue('Satisfaction Analysis')
    .setFontSize(16)
    .setFontWeight('bold')
    .setFontColor('#0052FF');

  // Overall stats
  sheet.getRange('A4').setValue('OVERALL SATISFACTION METRICS')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground('#E8E8E8');
  sheet.getRange('A4:C4').merge();

  sheet.getRange('A6:B9').setValues([
    ['Average Rating', ''],
    ['Median Rating', ''],
    ['% Satisfied (4-5)', ''],
    ['% Dissatisfied (1-2)', '']
  ]);

  sheet.getRange('B6').setFormula(`=IFERROR(ROUND(AVERAGE(${responsesSheet}!O:O),2),"--")`);
  sheet.getRange('B7').setFormula(`=IFERROR(MEDIAN(${responsesSheet}!O:O),"--")`);
  sheet.getRange('B8').setFormula(`=IFERROR(COUNTIFS(${responsesSheet}!O:O,">=4")/(COUNTA(${responsesSheet}!O:O)-1),"--")`).setNumberFormat('0%');
  sheet.getRange('B9').setFormula(`=IFERROR(COUNTIFS(${responsesSheet}!O:O,"<=2",${responsesSheet}!O:O,">0")/(COUNTA(${responsesSheet}!O:O)-1),"--")`).setNumberFormat('0%');

  // Satisfaction by role level
  sheet.getRange('A12').setValue('SATISFACTION BY ROLE LEVEL')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground('#E8E8E8');
  sheet.getRange('A12:C12').merge();

  sheet.getRange('A14:C14').setValues([['Role Level', 'Avg Satisfaction', 'Response Count']]);
  sheet.getRange('A14:C14').setFontWeight('bold');

  const roles = Object.values(ROLE_LEVELS);
  let row = 15;
  roles.forEach(role => {
    sheet.getRange(row, 1).setValue(role);
    sheet.getRange(row, 2).setFormula(`=IFERROR(AVERAGEIF(${responsesSheet}!F:F,"${role}",${responsesSheet}!O:O),"--")`).setNumberFormat('0.0');
    sheet.getRange(row, 3).setFormula(`=COUNTIF(${responsesSheet}!F:F,"${role}")`);
    row++;
  });

  // IT Support satisfaction breakdown
  sheet.getRange('E4').setValue('IT SUPPORT FEEDBACK')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground('#E8E8E8');
  sheet.getRange('E4:G4').merge();

  sheet.getRange('E6:F11').setValues([
    ['Response', 'Count'],
    ['Strongly Agree', `=COUNTIF(${responsesSheet}!Q:Q,"Strongly Agree")`],
    ['Agree', `=COUNTIF(${responsesSheet}!Q:Q,"Agree")`],
    ['Neutral', `=COUNTIF(${responsesSheet}!Q:Q,"Neutral")`],
    ['Disagree', `=COUNTIF(${responsesSheet}!Q:Q,"Disagree")`],
    ['Strongly Disagree', `=COUNTIF(${responsesSheet}!Q:Q,"Strongly Disagree")`]
  ]);
  sheet.getRange('E6:F6').setFontWeight('bold');

  sheet.setColumnWidth(1, 250);
  sheet.setColumnWidth(2, 130);
  sheet.setColumnWidth(3, 130);
  sheet.setColumnWidth(5, 150);
  sheet.setColumnWidth(6, 100);
}

/**
 * Create Office Analysis sheet
 */
function createOfficeAnalysisSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(SHEET_NAMES.OFFICE);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAMES.OFFICE);
  } else {
    sheet.clear();
  }

  const responsesSheet = "'" + SHEET_NAMES.RESPONSES + "'";

  // Title
  sheet.getRange('A1').setValue('Analysis by Office Location')
    .setFontSize(16)
    .setFontWeight('bold')
    .setFontColor('#0052FF');

  // Headers
  sheet.getRange('A4:E4').setValues([['Office', 'Responses', 'Avg Satisfaction', 'Software Used', '% of Total']]);
  sheet.getRange('A4:E4')
    .setFontWeight('bold')
    .setBackground('#0052FF')
    .setFontColor('#FFFFFF');

  // Office rows with formulas
  const offices = Object.values(PRIMARY_OFFICES);
  let row = 5;

  offices.forEach(office => {
    sheet.getRange(row, 1).setValue(office);
    sheet.getRange(row, 2).setFormula(`=COUNTIF(${responsesSheet}!G:G,"${office}")`);
    sheet.getRange(row, 3).setFormula(`=IFERROR(AVERAGEIF(${responsesSheet}!G:G,"${office}",${responsesSheet}!O:O),"--")`).setNumberFormat('0.0');
    sheet.getRange(row, 4).setFormula(`=IFERROR(SUMIF(${responsesSheet}!G:G,"${office}",${responsesSheet}!I:I),0)`);
    sheet.getRange(row, 5).setFormula(`=IFERROR(B${row}/SUM($B$5:$B$${5+offices.length-1}),0)`).setNumberFormat('0%');
    row++;
  });

  // Total row
  sheet.getRange(row, 1).setValue('TOTAL').setFontWeight('bold');
  sheet.getRange(row, 2).setFormula(`=SUM(B5:B${row-1})`).setFontWeight('bold');
  sheet.getRange(row, 3).setFormula(`=IFERROR(AVERAGE(${responsesSheet}!O:O),"--")`).setNumberFormat('0.0').setFontWeight('bold');
  sheet.getRange(row, 4).setFormula(`=SUM(D5:D${row-1})`).setFontWeight('bold');
  sheet.getRange(row, 5).setValue('100%').setFontWeight('bold');

  // Style
  sheet.getRange(`A5:E${row}`).setBorder(true, true, true, true, true, true);
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 100);
  sheet.setColumnWidth(3, 130);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 100);
}

// ============================================
// DATA REFRESH FUNCTIONS
// ============================================

/**
 * Refresh software analysis by parsing JSON data
 */
function refreshSoftwareAnalysis() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const responsesSheet = spreadsheet.getSheetByName(SHEET_NAMES.RESPONSES);
  const softwareSheet = spreadsheet.getSheetByName(SHEET_NAMES.SOFTWARE);

  if (!responsesSheet || !softwareSheet) {
    Logger.log('Required sheets not found');
    return;
  }

  // Get all responses
  const data = responsesSheet.getDataRange().getValues();
  if (data.length <= 1) {
    Logger.log('No responses to analyse');
    return;
  }

  // Parse software data from columns L, M, N (Currently Using, Previously Used, Would Like to Use)
  const softwareCounts = {};

  for (let i = 1; i < data.length; i++) {
    const currentlyUsing = data[i][11] ? data[i][11].toString().split(', ') : [];
    const previouslyUsed = data[i][12] ? data[i][12].toString().split(', ') : [];
    const wouldLikeToUse = data[i][13] ? data[i][13].toString().split(', ') : [];

    currentlyUsing.forEach(sw => {
      if (sw.trim()) {
        if (!softwareCounts[sw.trim()]) {
          softwareCounts[sw.trim()] = { currentlyUsing: 0, previouslyUsed: 0, wouldLikeToUse: 0 };
        }
        softwareCounts[sw.trim()].currentlyUsing++;
      }
    });

    previouslyUsed.forEach(sw => {
      if (sw.trim()) {
        if (!softwareCounts[sw.trim()]) {
          softwareCounts[sw.trim()] = { currentlyUsing: 0, previouslyUsed: 0, wouldLikeToUse: 0 };
        }
        softwareCounts[sw.trim()].previouslyUsed++;
      }
    });

    wouldLikeToUse.forEach(sw => {
      if (sw.trim()) {
        if (!softwareCounts[sw.trim()]) {
          softwareCounts[sw.trim()] = { currentlyUsing: 0, previouslyUsed: 0, wouldLikeToUse: 0 };
        }
        softwareCounts[sw.trim()].wouldLikeToUse++;
      }
    });
  }

  // Sort by total mentions
  const sortedSoftware = Object.entries(softwareCounts)
    .map(([name, counts]) => ({
      name,
      ...counts,
      total: counts.currentlyUsing + counts.previouslyUsed + counts.wouldLikeToUse
    }))
    .sort((a, b) => b.total - a.total);

  // Clear existing data (except header)
  const lastRow = softwareSheet.getLastRow();
  if (lastRow > 5) {
    softwareSheet.getRange(6, 1, lastRow - 5, 5).clear();
  }

  // Write new data
  if (sortedSoftware.length > 0) {
    const outputData = sortedSoftware.map(sw => [
      sw.name,
      sw.currentlyUsing,
      sw.previouslyUsed,
      sw.wouldLikeToUse,
      sw.total
    ]);

    softwareSheet.getRange(6, 1, outputData.length, 5).setValues(outputData);
    softwareSheet.getRange(6, 1, outputData.length, 5).setBorder(true, true, true, true, true, true);
  }

  // Update timestamp
  softwareSheet.getRange('A7').setValue('Last updated: ' + new Date().toLocaleString())
    .setFontStyle('italic')
    .setFontColor('#666666');

  Logger.log('Software analysis refreshed');
}

/**
 * Refresh training needs analysis by parsing JSON data
 */
function refreshTrainingAnalysis() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const responsesSheet = spreadsheet.getSheetByName(SHEET_NAMES.RESPONSES);
  const trainingSheet = spreadsheet.getSheetByName(SHEET_NAMES.TRAINING);

  if (!responsesSheet || !trainingSheet) {
    Logger.log('Required sheets not found');
    return;
  }

  // Get all responses
  const data = responsesSheet.getDataRange().getValues();
  if (data.length <= 1) {
    Logger.log('No responses to analyse');
    return;
  }

  // Parse training data from Currently Using Details (JSON) column (V = index 21)
  const trainingCounts = {};

  for (let i = 1; i < data.length; i++) {
    try {
      const currentlyUsingDetails = JSON.parse(data[i][21] || '[]');

      currentlyUsingDetails.forEach(detail => {
        // Get software name from the selections
        const softwareList = data[i][11] ? data[i][11].toString().split(', ') : [];
        const softwareName = softwareList.find(s => s) || detail.softwareId;

        if (!trainingCounts[softwareName]) {
          trainingCounts[softwareName] = {
            'very-confident': 0,
            'somewhat-confident': 0,
            'need-more': 0,
            'require-significant': 0
          };
        }

        if (detail.trainingLevel && trainingCounts[softwareName][detail.trainingLevel] !== undefined) {
          trainingCounts[softwareName][detail.trainingLevel]++;
        }
      });
    } catch (e) {
      // Skip invalid JSON
    }
  }

  // Sort by training needs (prioritise those needing more training)
  const sortedTraining = Object.entries(trainingCounts)
    .map(([name, counts]) => ({
      name,
      veryConfident: counts['very-confident'],
      somewhatConfident: counts['somewhat-confident'],
      needMore: counts['need-more'],
      requireSignificant: counts['require-significant'],
      needsTraining: counts['need-more'] + counts['require-significant']
    }))
    .sort((a, b) => b.needsTraining - a.needsTraining);

  // Clear existing data (except header)
  const lastRow = trainingSheet.getLastRow();
  if (lastRow > 5 && lastRow < 19) {
    trainingSheet.getRange(6, 1, lastRow - 5, 5).clear();
  }

  // Write new data
  if (sortedTraining.length > 0) {
    const outputData = sortedTraining.map(t => [
      t.name,
      t.veryConfident,
      t.somewhatConfident,
      t.needMore,
      t.requireSignificant
    ]);

    trainingSheet.getRange(6, 1, Math.min(outputData.length, 12), 5).setValues(outputData.slice(0, 12));
    trainingSheet.getRange(6, 1, Math.min(outputData.length, 12), 5).setBorder(true, true, true, true, true, true);
  }

  // Update timestamp
  trainingSheet.getRange('A7').setValue('Last updated: ' + new Date().toLocaleString())
    .setFontStyle('italic')
    .setFontColor('#666666');

  Logger.log('Training analysis refreshed');
}

/**
 * Refresh all dashboard data
 */
function refreshAllDashboards() {
  refreshSoftwareAnalysis();
  refreshTrainingAnalysis();
  Logger.log('All dashboards refreshed');
}

// ============================================
// MENU AND TRIGGERS
// ============================================

/**
 * Create custom menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Survey Dashboard')
    .addItem('Setup Dashboard', 'setupDashboard')
    .addSeparator()
    .addItem('Refresh All Data', 'refreshAllDashboards')
    .addItem('Refresh Software Analysis', 'refreshSoftwareAnalysis')
    .addItem('Refresh Training Analysis', 'refreshTrainingAnalysis')
    .addSeparator()
    .addItem('Create Charts', 'createAllCharts')
    .addToUi();
}

/**
 * Set up time-based triggers for auto-refresh
 */
function setupTriggers() {
  // Remove existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'refreshAllDashboards') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create new trigger to refresh every hour
  ScriptApp.newTrigger('refreshAllDashboards')
    .timeBased()
    .everyHours(1)
    .create();

  Logger.log('Auto-refresh trigger set up (hourly)');
}

// ============================================
// CHART FUNCTIONS
// ============================================

/**
 * Create all charts for the dashboard
 */
function createAllCharts() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

  createSatisfactionChart(spreadsheet);
  createDisciplineChart(spreadsheet);
  createOfficeChart(spreadsheet);

  Logger.log('All charts created');
}

/**
 * Create satisfaction distribution pie chart
 */
function createSatisfactionChart(spreadsheet) {
  const dashboardSheet = spreadsheet.getSheetByName(SHEET_NAMES.DASHBOARD);

  // Remove existing charts
  const charts = dashboardSheet.getCharts();
  charts.forEach(chart => {
    if (chart.getOptions().get('title') === 'Satisfaction Distribution') {
      dashboardSheet.removeChart(chart);
    }
  });

  // Create new chart
  const chartBuilder = dashboardSheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(dashboardSheet.getRange('A25:B28'))
    .setPosition(23, 5, 0, 0)
    .setOption('title', 'Satisfaction Distribution')
    .setOption('pieSliceText', 'value')
    .setOption('legend', { position: 'right' })
    .setOption('colors', ['#0052FF', '#4D7CFF', '#99B3FF', '#E8E8E8']);

  dashboardSheet.insertChart(chartBuilder.build());
}

/**
 * Create discipline distribution bar chart
 */
function createDisciplineChart(spreadsheet) {
  const disciplineSheet = spreadsheet.getSheetByName(SHEET_NAMES.DISCIPLINE);

  // Remove existing charts
  const charts = disciplineSheet.getCharts();
  charts.forEach(chart => disciplineSheet.removeChart(chart));

  const disciplines = Object.values(DISCIPLINES);
  const dataRange = disciplineSheet.getRange(5, 1, disciplines.length, 2);

  const chartBuilder = disciplineSheet.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(dataRange)
    .setPosition(5, 8, 0, 0)
    .setOption('title', 'Responses by Discipline')
    .setOption('legend', { position: 'none' })
    .setOption('colors', ['#0052FF'])
    .setOption('hAxis', { title: 'Number of Responses' })
    .setOption('vAxis', { title: '' });

  disciplineSheet.insertChart(chartBuilder.build());
}

/**
 * Create office distribution bar chart
 */
function createOfficeChart(spreadsheet) {
  const officeSheet = spreadsheet.getSheetByName(SHEET_NAMES.OFFICE);

  // Remove existing charts
  const charts = officeSheet.getCharts();
  charts.forEach(chart => officeSheet.removeChart(chart));

  const offices = Object.values(PRIMARY_OFFICES);
  const dataRange = officeSheet.getRange(5, 1, offices.length, 2);

  const chartBuilder = officeSheet.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(dataRange)
    .setPosition(5, 7, 0, 0)
    .setOption('title', 'Responses by Office')
    .setOption('legend', { position: 'none' })
    .setOption('colors', ['#0052FF'])
    .setOption('hAxis', { title: 'Number of Responses' })
    .setOption('vAxis', { title: '' });

  officeSheet.insertChart(chartBuilder.build());
}

// ============================================
// TEST FUNCTIONS
// ============================================

/**
 * Test submission with sample data
 */
function testSubmission() {
  const sampleData = {
    id: 'test-' + Date.now(),
    timestamp: new Date().toISOString(),
    userProfile: {
      email: 'test@baileypartnership.com',
      fullName: 'Test User',
      roleLevel: 'senior-associate',
      primaryOffice: 'bristol',
      discipline: 'architectural-design'
    },
    softwareSelections: [
      { softwareId: 'arch-bim-revit', softwareName: 'Autodesk Revit', usageStatus: 'currently-using' },
      { softwareId: 'arch-viz-enscape', softwareName: 'Enscape', usageStatus: 'currently-using' },
      { softwareId: 'arch-doc-autocad', softwareName: 'AutoCAD', usageStatus: 'used-previously' },
      { softwareId: 'arch-bim-forma', softwareName: 'Autodesk Forma', usageStatus: 'would-like-to-use' }
    ],
    currentlyUsingResponses: [
      { softwareId: 'arch-bim-revit', frequency: 'daily', trainingLevel: 'very-confident', satisfaction: 5 },
      { softwareId: 'arch-viz-enscape', frequency: 'several-per-week', trainingLevel: 'somewhat-confident', satisfaction: 4 }
    ],
    previouslyUsedResponses: [
      { softwareId: 'arch-doc-autocad', usedWhere: ['bailey-partnership'], stoppedReasons: ['superseded'], supersededBy: 'Revit' }
    ],
    wouldLikeToUseResponses: [
      { softwareId: 'arch-bim-forma', benefit: 'significant', interest: 'Early stage design and massing studies' }
    ],
    generalFeedback: {
      overallSatisfaction: 4,
      trainingResources: 'agree',
      itSupport: 'strongly-agree',
      softwareIntegration: 'neutral',
      improvementSuggestions: 'More BIM training sessions would be helpful',
      personalLicenses: 'SketchUp for personal projects',
      additionalComments: 'Great survey!'
    },
    completionStatus: 'completed'
  };

  const mockEvent = {
    postData: {
      contents: JSON.stringify(sampleData)
    }
  };

  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}

/**
 * Add multiple test submissions for dashboard testing
 */
function addTestData() {
  const testProfiles = [
    { discipline: 'architectural-design', office: 'bristol', role: 'senior-associate' },
    { discipline: 'building-surveying', office: 'exeter', role: 'general' },
    { discipline: 'civil-structural-engineering', office: 'manchester', role: 'executive-director' },
    { discipline: 'quantity-surveying', office: 'maidstone', role: 'intern-trainee' },
    { discipline: 'project-management', office: 'plymouth', role: 'senior-associate' }
  ];

  testProfiles.forEach((profile, index) => {
    const sampleData = {
      id: 'test-bulk-' + Date.now() + '-' + index,
      timestamp: new Date().toISOString(),
      userProfile: {
        email: `test${index}@baileypartnership.com`,
        fullName: `Test User ${index + 1}`,
        roleLevel: profile.role,
        primaryOffice: profile.office,
        discipline: profile.discipline
      },
      softwareSelections: [
        { softwareId: 'test-sw-1', softwareName: 'Autodesk Revit', usageStatus: 'currently-using' },
        { softwareId: 'test-sw-2', softwareName: 'Microsoft Teams', usageStatus: 'currently-using' }
      ],
      currentlyUsingResponses: [
        { softwareId: 'test-sw-1', frequency: 'daily', trainingLevel: 'somewhat-confident', satisfaction: Math.floor(Math.random() * 3) + 3 }
      ],
      previouslyUsedResponses: [],
      wouldLikeToUseResponses: [],
      generalFeedback: {
        overallSatisfaction: Math.floor(Math.random() * 3) + 3,
        trainingResources: ['strongly-agree', 'agree', 'neutral'][Math.floor(Math.random() * 3)],
        itSupport: ['strongly-agree', 'agree', 'neutral'][Math.floor(Math.random() * 3)],
        softwareIntegration: 'neutral'
      },
      completionStatus: 'completed'
    };

    const mockEvent = {
      postData: {
        contents: JSON.stringify(sampleData)
      }
    };

    doPost(mockEvent);
    Utilities.sleep(100); // Small delay between submissions
  });

  Logger.log('Test data added');
}
