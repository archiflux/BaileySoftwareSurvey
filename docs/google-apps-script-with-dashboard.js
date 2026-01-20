/**
 * Bailey Partnership Software Survey - Google Apps Script with Enhanced Dashboard
 *
 * This script collects survey responses AND creates a real-time analytics dashboard
 * with charts, insights, visualizations, and conditional formatting.
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
 * - Dashboard: Executive overview with KPIs and insights
 * - Software Analysis: Software usage breakdown with charts
 * - Discipline Analysis: Breakdown by discipline with visualizations
 * - Training Needs: Training requirements analysis with priority indicators
 * - Satisfaction Analysis: Satisfaction ratings with trend analysis
 * - Office Analysis: Analysis by primary office with geographic insights
 * - Insights: AI-generated insights and recommendations
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
  INSIGHTS: 'Insights',
  LOOKUPS: 'Lookups'
};

// Brand colors
const COLORS = {
  PRIMARY: '#0052FF',
  PRIMARY_DARK: '#0041CC',
  PRIMARY_LIGHT: '#4D7CFF',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  NEUTRAL: '#6B7280',
  BACKGROUND: '#F8FAFC',
  WHITE: '#FFFFFF',
  BLACK: '#0F172A'
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
  'building-services-mep': 'Building Services/MEP',
  'civil-structural-engineering': 'Civil & Structural',
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
      setupDashboard();
      sheet = spreadsheet.getSheetByName(SHEET_NAMES.RESPONSES);
    }

    const rowData = flattenSurveyData(data);
    sheet.appendRow(rowData);

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
    'Submission Timestamp', 'Survey ID', 'Original Timestamp',
    'Email', 'Full Name', 'Role Level', 'Primary Office', 'Discipline',
    'Currently Using Count', 'Previously Used Count', 'Would Like to Use Count',
    'Currently Using Software', 'Previously Used Software', 'Would Like to Use Software',
    'Overall Satisfaction (1-5)', 'Training Resources', 'IT Support', 'Software Integration',
    'Improvement Suggestions', 'Personal Licences', 'Additional Comments',
    'Currently Using Details (JSON)', 'Previously Used Details (JSON)',
    'Would Like to Use Details (JSON)', 'Full Response (JSON)'
  ];
}

/**
 * Flatten survey response into a row of values
 */
function flattenSurveyData(data) {
  const profile = data.userProfile || {};
  const feedback = data.generalFeedback || {};
  const selections = data.softwareSelections || [];

  const currentlyUsing = selections.filter(s => s.usageStatus === 'currently-using');
  const previouslyUsed = selections.filter(s => s.usageStatus === 'used-previously');
  const wouldLikeToUse = selections.filter(s => s.usageStatus === 'would-like-to-use');

  const getSoftwareNames = (items) => items.map(s => s.customName || s.softwareName).join(', ');

  return [
    new Date().toISOString(), data.id || '', data.timestamp || '',
    profile.email || '', profile.fullName || '',
    formatLookup(ROLE_LEVELS, profile.roleLevel),
    formatLookup(PRIMARY_OFFICES, profile.primaryOffice),
    formatLookup(DISCIPLINES, profile.discipline),
    currentlyUsing.length, previouslyUsed.length, wouldLikeToUse.length,
    getSoftwareNames(currentlyUsing), getSoftwareNames(previouslyUsed), getSoftwareNames(wouldLikeToUse),
    feedback.overallSatisfaction || '',
    formatLookup(AGREEMENT_SCALE, feedback.trainingResources),
    formatLookup(AGREEMENT_SCALE, feedback.itSupport),
    formatLookup(AGREEMENT_SCALE, feedback.softwareIntegration),
    feedback.improvementSuggestions || '', feedback.personalLicenses || '', feedback.additionalComments || '',
    JSON.stringify(data.currentlyUsingResponses || []),
    JSON.stringify(data.previouslyUsedResponses || []),
    JSON.stringify(data.wouldLikeToUseResponses || []),
    JSON.stringify(data)
  ];
}

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

  createResponsesSheet(spreadsheet);
  createLookupsSheet(spreadsheet);
  createDashboardSheet(spreadsheet);
  createSoftwareAnalysisSheet(spreadsheet);
  createDisciplineAnalysisSheet(spreadsheet);
  createTrainingNeedsSheet(spreadsheet);
  createSatisfactionAnalysisSheet(spreadsheet);
  createOfficeAnalysisSheet(spreadsheet);
  createInsightsSheet(spreadsheet);

  setupTriggers();
  Logger.log('Dashboard setup complete!');
}

/**
 * Create the Survey Responses sheet
 */
function createResponsesSheet(spreadsheet) {
  let sheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.RESPONSES, 0);
  sheet.clear();

  const headers = getResponseHeaders();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground(COLORS.PRIMARY)
    .setFontColor(COLORS.WHITE);
  sheet.setFrozenRows(1);

  // Set column widths
  [180, 100, 180, 200, 150, 180, 120, 180, 80, 80, 80, 300, 300, 300, 80, 120, 120, 120, 400, 200, 300, 200, 200, 200, 200]
    .forEach((width, i) => sheet.setColumnWidth(i + 1, width));
}

/**
 * Create the Lookups sheet
 */
function createLookupsSheet(spreadsheet) {
  let sheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.LOOKUPS);
  sheet.clear();

  const lookups = [
    { col: 1, name: 'Disciplines', data: Object.values(DISCIPLINES) },
    { col: 3, name: 'Offices', data: Object.values(PRIMARY_OFFICES) },
    { col: 5, name: 'Role Levels', data: Object.values(ROLE_LEVELS) },
    { col: 7, name: 'Agreement Scale', data: Object.values(AGREEMENT_SCALE) },
    { col: 9, name: 'Training Levels', data: Object.values(TRAINING_LEVELS) },
    { col: 11, name: 'Frequencies', data: Object.values(FREQUENCIES) }
  ];

  lookups.forEach(lookup => {
    sheet.getRange(1, lookup.col).setValue(lookup.name).setFontWeight('bold').setBackground('#E8E8E8');
    sheet.getRange(2, lookup.col, lookup.data.length, 1).setValues(lookup.data.map(d => [d]));
  });
}

/**
 * Create the enhanced Dashboard sheet with KPIs, metrics, and insights
 */
function createDashboardSheet(spreadsheet) {
  let sheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.DASHBOARD, 1);
  sheet.clear();

  const R = "'" + SHEET_NAMES.RESPONSES + "'";

  // ===== HEADER SECTION =====
  sheet.getRange('A1:L1').merge().setValue('BAILEY PARTNERSHIP SOFTWARE SURVEY')
    .setFontSize(24).setFontWeight('bold').setFontColor(COLORS.PRIMARY)
    .setHorizontalAlignment('center');

  sheet.getRange('A2:L2').merge().setValue('Executive Dashboard')
    .setFontSize(14).setFontColor(COLORS.NEUTRAL).setHorizontalAlignment('center');

  sheet.getRange('A3').setValue('Last Updated:').setFontColor(COLORS.NEUTRAL);
  sheet.getRange('B3').setFormula('=TEXT(NOW(),"DD MMM YYYY, HH:MM")').setFontWeight('bold');

  // ===== KPI CARDS ROW =====
  createKPICard(sheet, 'A', 5, 'Total Responses', `=COUNTA(${R}!B:B)-1`, COLORS.PRIMARY, '📊');
  createKPICard(sheet, 'D', 5, 'Avg Satisfaction', `=IFERROR(ROUND(AVERAGE(${R}!O:O),1)&" / 5","--")`, COLORS.SUCCESS, '⭐');
  createKPICard(sheet, 'G', 5, 'Software Tools', `=IFERROR(SUM(${R}!I:I)+SUM(${R}!J:J)+SUM(${R}!K:K),0)`, COLORS.PRIMARY_LIGHT, '🛠️');
  createKPICard(sheet, 'J', 5, 'Offices Active', `=IFERROR(COUNTA(UNIQUE(FILTER(${R}!G:G,${R}!G:G<>"")))&" / 13","--")`, COLORS.WARNING, '🏢');

  // ===== SATISFACTION GAUGE SECTION =====
  sheet.getRange('A11:C11').merge().setValue('SATISFACTION BREAKDOWN')
    .setFontWeight('bold').setFontSize(12).setBackground(COLORS.BACKGROUND);

  sheet.getRange('A12:C16').setValues([
    ['Rating', 'Count', 'Visual'],
    ['⭐⭐⭐⭐⭐ (5)', `=COUNTIF(${R}!O:O,5)`, ''],
    ['⭐⭐⭐⭐ (4)', `=COUNTIF(${R}!O:O,4)`, ''],
    ['⭐⭐⭐ (3)', `=COUNTIF(${R}!O:O,3)`, ''],
    ['⭐⭐ or less', `=COUNTIFS(${R}!O:O,"<=2",${R}!O:O,">0")`, '']
  ]);
  sheet.getRange('A12:C12').setFontWeight('bold').setBackground('#E8E8E8');

  // Add sparkline-style bars for satisfaction
  sheet.getRange('C13').setFormula(`=REPT("█",ROUND(B13/MAX($B$13:$B$16)*10,0))&REPT("░",10-ROUND(B13/MAX($B$13:$B$16)*10,0))`).setFontColor(COLORS.SUCCESS);
  sheet.getRange('C14').setFormula(`=REPT("█",ROUND(B14/MAX($B$13:$B$16)*10,0))&REPT("░",10-ROUND(B14/MAX($B$13:$B$16)*10,0))`).setFontColor(COLORS.SUCCESS);
  sheet.getRange('C15').setFormula(`=REPT("█",ROUND(B15/MAX($B$13:$B$16)*10,0))&REPT("░",10-ROUND(B15/MAX($B$13:$B$16)*10,0))`).setFontColor(COLORS.WARNING);
  sheet.getRange('C16').setFormula(`=REPT("█",ROUND(B16/MAX($B$13:$B$16)*10,0))&REPT("░",10-ROUND(B16/MAX($B$13:$B$16)*10,0))`).setFontColor(COLORS.DANGER);

  // ===== SOFTWARE USAGE SECTION =====
  sheet.getRange('E11:H11').merge().setValue('SOFTWARE USAGE STATUS')
    .setFontWeight('bold').setFontSize(12).setBackground(COLORS.BACKGROUND);

  sheet.getRange('E12:H15').setValues([
    ['Status', 'Count', '%', 'Visual'],
    ['🟢 Currently Using', `=IFERROR(SUM(${R}!I:I),0)`, '', ''],
    ['🟡 Previously Used', `=IFERROR(SUM(${R}!J:J),0)`, '', ''],
    ['🔵 Would Like to Use', `=IFERROR(SUM(${R}!K:K),0)`, '', '']
  ]);
  sheet.getRange('E12:H12').setFontWeight('bold').setBackground('#E8E8E8');

  // Percentage formulas
  sheet.getRange('G13').setFormula(`=IFERROR(F13/($F$13+$F$14+$F$15),0)`).setNumberFormat('0%');
  sheet.getRange('G14').setFormula(`=IFERROR(F14/($F$13+$F$14+$F$15),0)`).setNumberFormat('0%');
  sheet.getRange('G15').setFormula(`=IFERROR(F15/($F$13+$F$14+$F$15),0)`).setNumberFormat('0%');

  // Progress bars
  sheet.getRange('H13').setFormula(`=REPT("█",ROUND(G13*20,0))&REPT("░",20-ROUND(G13*20,0))`).setFontColor(COLORS.SUCCESS);
  sheet.getRange('H14').setFormula(`=REPT("█",ROUND(G14*20,0))&REPT("░",20-ROUND(G14*20,0))`).setFontColor(COLORS.WARNING);
  sheet.getRange('H15').setFormula(`=REPT("█",ROUND(G15*20,0))&REPT("░",20-ROUND(G15*20,0))`).setFontColor(COLORS.PRIMARY);

  // ===== FEEDBACK SUMMARY SECTION =====
  sheet.getRange('J11:L11').merge().setValue('FEEDBACK HEALTH')
    .setFontWeight('bold').setFontSize(12).setBackground(COLORS.BACKGROUND);

  sheet.getRange('J12:L15').setValues([
    ['Area', 'Score', 'Status'],
    ['Training Resources', '', ''],
    ['IT Support', '', ''],
    ['Software Integration', '', '']
  ]);
  sheet.getRange('J12:L12').setFontWeight('bold').setBackground('#E8E8E8');

  // Score calculations (positive responses / total)
  sheet.getRange('K13').setFormula(`=IFERROR(ROUND((COUNTIF(${R}!P:P,"Strongly Agree")+COUNTIF(${R}!P:P,"Agree"))/(COUNTA(${R}!P:P)-1)*100,0)&"%","--")`);
  sheet.getRange('K14').setFormula(`=IFERROR(ROUND((COUNTIF(${R}!Q:Q,"Strongly Agree")+COUNTIF(${R}!Q:Q,"Agree"))/(COUNTA(${R}!Q:Q)-1)*100,0)&"%","--")`);
  sheet.getRange('K15').setFormula(`=IFERROR(ROUND((COUNTIF(${R}!R:R,"Strongly Agree")+COUNTIF(${R}!R:R,"Agree"))/(COUNTA(${R}!R:R)-1)*100,0)&"%","--")`);

  // Status indicators
  sheet.getRange('L13').setFormula(`=IF(VALUE(SUBSTITUTE(K13,"%",""))>=70,"✅ Good",IF(VALUE(SUBSTITUTE(K13,"%",""))>=50,"⚠️ Fair","❌ Needs Attention"))`);
  sheet.getRange('L14').setFormula(`=IF(VALUE(SUBSTITUTE(K14,"%",""))>=70,"✅ Good",IF(VALUE(SUBSTITUTE(K14,"%",""))>=50,"⚠️ Fair","❌ Needs Attention"))`);
  sheet.getRange('L15').setFormula(`=IF(VALUE(SUBSTITUTE(K15,"%",""))>=70,"✅ Good",IF(VALUE(SUBSTITUTE(K15,"%",""))>=50,"⚠️ Fair","❌ Needs Attention"))`);

  // ===== TOP DISCIPLINES SECTION =====
  sheet.getRange('A18:D18').merge().setValue('TOP RESPONDING DISCIPLINES')
    .setFontWeight('bold').setFontSize(12).setBackground(COLORS.BACKGROUND);

  const disciplines = Object.values(DISCIPLINES);
  sheet.getRange('A19:C19').setValues([['Discipline', 'Responses', 'Bar']]);
  sheet.getRange('A19:C19').setFontWeight('bold').setBackground('#E8E8E8');

  let row = 20;
  disciplines.slice(0, 6).forEach((discipline, i) => {
    sheet.getRange(row, 1).setValue(discipline);
    sheet.getRange(row, 2).setFormula(`=COUNTIF(${R}!H:H,"${discipline}")`);
    sheet.getRange(row, 3).setFormula(`=SPARKLINE(B${row},{\"charttype\",\"bar\";\"max\",MAX($B$20:$B$25);\"color1\",\"${COLORS.PRIMARY}\"})`);
    row++;
  });

  // ===== QUICK INSIGHTS SECTION =====
  sheet.getRange('E18:H18').merge().setValue('QUICK INSIGHTS')
    .setFontWeight('bold').setFontSize(12).setBackground(COLORS.BACKGROUND);

  sheet.getRange('E19:H26').setValues([
    ['📈 Response Rate', '', '', ''],
    [`=IFERROR(COUNTA(${R}!B:B)-1,"0")&" responses collected"`, '', '', ''],
    ['', '', '', ''],
    ['🎯 Most Active Office', '', '', ''],
    [`=IFERROR(INDEX(${R}!G:G,MATCH(MAX(COUNTIF(${R}!G:G,${R}!G:G)),COUNTIF(${R}!G:G,${R}!G:G),0)),"--")`, '', '', ''],
    ['', '', '', ''],
    ['📊 Satisfaction Trend', '', '', ''],
    [`=IF(AVERAGE(${R}!O:O)>=4,"↑ Above Target",IF(AVERAGE(${R}!O:O)>=3,"→ On Track","↓ Below Target"))`, '', '', '']
  ]);

  // ===== RECENT RESPONSES TABLE =====
  sheet.getRange('J18:L18').merge().setValue('RECENT SUBMISSIONS')
    .setFontWeight('bold').setFontSize(12).setBackground(COLORS.BACKGROUND);

  sheet.getRange('J19:L19').setValues([['Name', 'Discipline', 'Rating']]);
  sheet.getRange('J19:L19').setFontWeight('bold').setBackground('#E8E8E8');

  // Show last 5 responses
  for (let i = 0; i < 5; i++) {
    sheet.getRange(20 + i, 10).setFormula(`=IFERROR(INDEX(${R}!E:E,COUNTA(${R}!E:E)-${i}),"--")`);
    sheet.getRange(20 + i, 11).setFormula(`=IFERROR(INDEX(${R}!H:H,COUNTA(${R}!H:H)-${i}),"--")`);
    sheet.getRange(20 + i, 12).setFormula(`=IFERROR(REPT("⭐",INDEX(${R}!O:O,COUNTA(${R}!O:O)-${i})),"--")`);
  }

  // Borders and styling
  sheet.getRange('A12:C16').setBorder(true, true, true, true, true, true);
  sheet.getRange('E12:H15').setBorder(true, true, true, true, true, true);
  sheet.getRange('J12:L15').setBorder(true, true, true, true, true, true);
  sheet.getRange('A19:C25').setBorder(true, true, true, true, true, true);
  sheet.getRange('J19:L24').setBorder(true, true, true, true, true, true);

  // Column widths
  [150, 80, 120, 20, 180, 80, 60, 200, 20, 150, 150, 120].forEach((w, i) => sheet.setColumnWidth(i + 1, w));
}

/**
 * Helper function to create KPI cards
 */
function createKPICard(sheet, col, row, title, formula, color, emoji) {
  const colNum = col.charCodeAt(0) - 64;

  // Card background
  sheet.getRange(row, colNum, 3, 2).setBackground(COLORS.BACKGROUND);
  sheet.getRange(row, colNum, 3, 2).setBorder(true, true, true, true, null, null, COLORS.NEUTRAL, SpreadsheetApp.BorderStyle.SOLID);

  // Emoji and title
  sheet.getRange(row, colNum).setValue(emoji + ' ' + title)
    .setFontSize(10).setFontColor(COLORS.NEUTRAL);
  sheet.getRange(row, colNum, 1, 2).merge();

  // Value
  sheet.getRange(row + 1, colNum).setFormula(formula)
    .setFontSize(28).setFontWeight('bold').setFontColor(color);
  sheet.getRange(row + 1, colNum, 1, 2).merge();

  // Indicator line
  sheet.getRange(row + 2, colNum, 1, 2).merge().setBackground(color);
}

/**
 * Create enhanced Software Analysis sheet
 */
function createSoftwareAnalysisSheet(spreadsheet) {
  let sheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.SOFTWARE);
  sheet.clear();

  // Title
  sheet.getRange('A1:H1').merge().setValue('SOFTWARE USAGE ANALYSIS')
    .setFontSize(18).setFontWeight('bold').setFontColor(COLORS.PRIMARY);

  sheet.getRange('A2').setValue('Comprehensive breakdown of software tools across the organisation')
    .setFontStyle('italic').setFontColor(COLORS.NEUTRAL);

  // Headers
  sheet.getRange('A4:G4').setValues([['Software Name', 'Currently Using', 'Previously Used', 'Would Like to Use', 'Total', 'Popularity', 'Trend']]);
  sheet.getRange('A4:G4').setFontWeight('bold').setBackground(COLORS.PRIMARY).setFontColor(COLORS.WHITE);

  // Placeholder for data
  sheet.getRange('A5').setValue('Run "Refresh All Data" from the Survey Dashboard menu to populate this sheet.')
    .setFontStyle('italic').setFontColor(COLORS.NEUTRAL);

  // Summary stats section
  sheet.getRange('I4').setValue('SUMMARY STATS').setFontWeight('bold').setBackground(COLORS.BACKGROUND);
  sheet.getRange('I5:J9').setValues([
    ['Total Unique Tools', '=COUNTA(A5:A100)'],
    ['Most Popular', '=IFERROR(A5,"--")'],
    ['Highest Demand', '=IFERROR(INDEX(A5:A100,MATCH(MAX(D5:D100),D5:D100,0)),"--")'],
    ['Avg Tools/Person', '=IFERROR(ROUND(SUM(E5:E100)/Dashboard!B6,1),"--")'],
    ['Active vs Legacy', '=IFERROR(SUM(B5:B100)&" / "&SUM(C5:C100),"--")']
  ]);

  [250, 100, 100, 120, 80, 150, 100, 20, 150, 150].forEach((w, i) => sheet.setColumnWidth(i + 1, w));
}

/**
 * Create enhanced Discipline Analysis sheet
 */
function createDisciplineAnalysisSheet(spreadsheet) {
  let sheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.DISCIPLINE);
  sheet.clear();

  const R = "'" + SHEET_NAMES.RESPONSES + "'";

  // Title
  sheet.getRange('A1:I1').merge().setValue('DISCIPLINE ANALYSIS')
    .setFontSize(18).setFontWeight('bold').setFontColor(COLORS.PRIMARY);

  // Headers
  sheet.getRange('A3:I3').setValues([[
    'Discipline', 'Responses', '% Share', 'Avg Satisfaction', 'Rating',
    'Tools Used', 'Tools Wanted', 'Training Need', 'Engagement'
  ]]);
  sheet.getRange('A3:I3').setFontWeight('bold').setBackground(COLORS.PRIMARY).setFontColor(COLORS.WHITE);

  const disciplines = Object.values(DISCIPLINES);
  let row = 4;
  const lastRow = 4 + disciplines.length - 1;

  disciplines.forEach((discipline, i) => {
    sheet.getRange(row, 1).setValue(discipline);
    sheet.getRange(row, 2).setFormula(`=COUNTIF(${R}!H:H,"${discipline}")`);
    sheet.getRange(row, 3).setFormula(`=IFERROR(B${row}/SUM($B$4:$B$${lastRow}),0)`).setNumberFormat('0%');
    sheet.getRange(row, 4).setFormula(`=IFERROR(AVERAGEIF(${R}!H:H,"${discipline}",${R}!O:O),"--")`).setNumberFormat('0.0');
    sheet.getRange(row, 5).setFormula(`=IFERROR(REPT("⭐",ROUND(D${row},0)),"--")`);
    sheet.getRange(row, 6).setFormula(`=IFERROR(SUMIF(${R}!H:H,"${discipline}",${R}!I:I),0)`);
    sheet.getRange(row, 7).setFormula(`=IFERROR(SUMIF(${R}!H:H,"${discipline}",${R}!K:K),0)`);
    sheet.getRange(row, 8).setFormula(`=IF(G${row}>F${row}*0.5,"🔴 High",IF(G${row}>F${row}*0.25,"🟡 Medium","🟢 Low"))`);
    sheet.getRange(row, 9).setFormula(`=SPARKLINE({B${row},F${row},G${row}},{\"charttype\",\"bar\";\"color1\",\"${COLORS.PRIMARY}\";\"color2\",\"${COLORS.SUCCESS}\";\"color3\",\"${COLORS.WARNING}\"})`);
    row++;
  });

  // Total row
  sheet.getRange(row, 1).setValue('TOTAL').setFontWeight('bold');
  sheet.getRange(row, 2).setFormula(`=SUM(B4:B${row-1})`).setFontWeight('bold');
  sheet.getRange(row, 3).setValue('100%').setFontWeight('bold');
  sheet.getRange(row, 4).setFormula(`=IFERROR(AVERAGE(${R}!O:O),"--")`).setNumberFormat('0.0').setFontWeight('bold');
  sheet.getRange(row, 6).setFormula(`=SUM(F4:F${row-1})`).setFontWeight('bold');
  sheet.getRange(row, 7).setFormula(`=SUM(G4:G${row-1})`).setFontWeight('bold');

  sheet.getRange(`A4:I${row}`).setBorder(true, true, true, true, true, true);

  // Conditional formatting for satisfaction
  const satRange = sheet.getRange(`D4:D${lastRow}`);
  const satRules = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(4)
    .setBackground('#D1FAE5')
    .setRanges([satRange])
    .build();
  const satRules2 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(3)
    .setBackground('#FEE2E2')
    .setRanges([satRange])
    .build();
  sheet.setConditionalFormatRules([satRules, satRules2]);

  [200, 80, 80, 100, 100, 80, 100, 100, 150].forEach((w, i) => sheet.setColumnWidth(i + 1, w));
}

/**
 * Create enhanced Training Needs sheet
 */
function createTrainingNeedsSheet(spreadsheet) {
  let sheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.TRAINING);
  sheet.clear();

  const R = "'" + SHEET_NAMES.RESPONSES + "'";

  // Title
  sheet.getRange('A1:G1').merge().setValue('TRAINING NEEDS ANALYSIS')
    .setFontSize(18).setFontWeight('bold').setFontColor(COLORS.PRIMARY);

  sheet.getRange('A2').setValue('Identify software training priorities across the organisation')
    .setFontStyle('italic').setFontColor(COLORS.NEUTRAL);

  // Software training table
  sheet.getRange('A4:F4').setValues([['Software', 'Very Confident', 'Somewhat Confident', 'Need Training', 'Need Significant', 'Priority']]);
  sheet.getRange('A4:F4').setFontWeight('bold').setBackground(COLORS.PRIMARY).setFontColor(COLORS.WHITE);

  sheet.getRange('A5').setValue('Run "Refresh Training Analysis" from the menu to populate.')
    .setFontStyle('italic').setFontColor(COLORS.NEUTRAL);

  // Training Resources feedback by discipline
  sheet.getRange('A20:D20').merge().setValue('TRAINING RESOURCES FEEDBACK BY DISCIPLINE')
    .setFontWeight('bold').setBackground(COLORS.BACKGROUND);

  sheet.getRange('A21:D21').setValues([['Discipline', 'Positive', 'Negative', 'Score']]);
  sheet.getRange('A21:D21').setFontWeight('bold').setBackground('#E8E8E8');

  const disciplines = Object.values(DISCIPLINES);
  let row = 22;
  disciplines.forEach(discipline => {
    sheet.getRange(row, 1).setValue(discipline);
    sheet.getRange(row, 2).setFormula(`=COUNTIFS(${R}!H:H,"${discipline}",${R}!P:P,"Strongly Agree")+COUNTIFS(${R}!H:H,"${discipline}",${R}!P:P,"Agree")`);
    sheet.getRange(row, 3).setFormula(`=COUNTIFS(${R}!H:H,"${discipline}",${R}!P:P,"Disagree")+COUNTIFS(${R}!H:H,"${discipline}",${R}!P:P,"Strongly Disagree")`);
    sheet.getRange(row, 4).setFormula(`=IF(B${row}+C${row}=0,"--",IF(B${row}/(B${row}+C${row})>=0.7,"✅",IF(B${row}/(B${row}+C${row})>=0.5,"⚠️","❌")))`);
    row++;
  });

  sheet.getRange(`A21:D${row-1}`).setBorder(true, true, true, true, true, true);

  [200, 120, 140, 120, 140, 100].forEach((w, i) => sheet.setColumnWidth(i + 1, w));
}

/**
 * Create enhanced Satisfaction Analysis sheet
 */
function createSatisfactionAnalysisSheet(spreadsheet) {
  let sheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.SATISFACTION);
  sheet.clear();

  const R = "'" + SHEET_NAMES.RESPONSES + "'";

  // Title
  sheet.getRange('A1:H1').merge().setValue('SATISFACTION ANALYSIS')
    .setFontSize(18).setFontWeight('bold').setFontColor(COLORS.PRIMARY);

  // Key metrics
  sheet.getRange('A3:C3').merge().setValue('KEY SATISFACTION METRICS')
    .setFontWeight('bold').setBackground(COLORS.BACKGROUND);

  sheet.getRange('A4:C8').setValues([
    ['Metric', 'Value', 'Indicator'],
    ['Average Rating', `=IFERROR(ROUND(AVERAGE(${R}!O:O),2),"--")`, `=IF(B5>=4,"✅ Excellent",IF(B5>=3,"⚠️ Good","❌ Needs Work"))`],
    ['Median Rating', `=IFERROR(MEDIAN(${R}!O:O),"--")`, ''],
    ['% Satisfied (4-5)', `=IFERROR(COUNTIFS(${R}!O:O,">=4")/(COUNTA(${R}!O:O)-1),"--")`, `=IF(B7>=0.7,"✅",IF(B7>=0.5,"⚠️","❌"))`],
    ['% Dissatisfied (1-2)', `=IFERROR(COUNTIFS(${R}!O:O,"<=2",${R}!O:O,">0")/(COUNTA(${R}!O:O)-1),"--")`, `=IF(B8<=0.1,"✅",IF(B8<=0.2,"⚠️","❌"))`]
  ]);
  sheet.getRange('A4:C4').setFontWeight('bold').setBackground('#E8E8E8');
  sheet.getRange('B7:B8').setNumberFormat('0%');

  // Satisfaction by role
  sheet.getRange('A11:D11').merge().setValue('SATISFACTION BY ROLE LEVEL')
    .setFontWeight('bold').setBackground(COLORS.BACKGROUND);

  sheet.getRange('A12:D12').setValues([['Role Level', 'Avg Rating', 'Responses', 'Visual']]);
  sheet.getRange('A12:D12').setFontWeight('bold').setBackground('#E8E8E8');

  const roles = Object.values(ROLE_LEVELS);
  let row = 13;
  roles.forEach(role => {
    sheet.getRange(row, 1).setValue(role);
    sheet.getRange(row, 2).setFormula(`=IFERROR(AVERAGEIF(${R}!F:F,"${role}",${R}!O:O),"--")`).setNumberFormat('0.0');
    sheet.getRange(row, 3).setFormula(`=COUNTIF(${R}!F:F,"${role}")`);
    sheet.getRange(row, 4).setFormula(`=IFERROR(REPT("⭐",ROUND(B${row},0)),"--")`);
    row++;
  });

  // IT Support breakdown
  sheet.getRange('F3:H3').merge().setValue('IT SUPPORT FEEDBACK')
    .setFontWeight('bold').setBackground(COLORS.BACKGROUND);

  sheet.getRange('F4:H9').setValues([
    ['Response', 'Count', 'Bar'],
    ['Strongly Agree', `=COUNTIF(${R}!Q:Q,"Strongly Agree")`, `=SPARKLINE(G5,{\"charttype\",\"bar\";\"max\",MAX($G$5:$G$9);\"color1\",\"${COLORS.SUCCESS}\"})`],
    ['Agree', `=COUNTIF(${R}!Q:Q,"Agree")`, `=SPARKLINE(G6,{\"charttype\",\"bar\";\"max\",MAX($G$5:$G$9);\"color1\",\"${COLORS.SUCCESS}\"})`],
    ['Neutral', `=COUNTIF(${R}!Q:Q,"Neutral")`, `=SPARKLINE(G7,{\"charttype\",\"bar\";\"max\",MAX($G$5:$G$9);\"color1\",\"${COLORS.WARNING}\"})`],
    ['Disagree', `=COUNTIF(${R}!Q:Q,"Disagree")`, `=SPARKLINE(G8,{\"charttype\",\"bar\";\"max\",MAX($G$5:$G$9);\"color1\",\"${COLORS.DANGER}\"})`],
    ['Strongly Disagree', `=COUNTIF(${R}!Q:Q,"Strongly Disagree")`, `=SPARKLINE(G9,{\"charttype\",\"bar\";\"max\",MAX($G$5:$G$9);\"color1\",\"${COLORS.DANGER}\"})`]
  ]);
  sheet.getRange('F4:H4').setFontWeight('bold').setBackground('#E8E8E8');

  sheet.getRange('A4:C8').setBorder(true, true, true, true, true, true);
  sheet.getRange(`A12:D${row-1}`).setBorder(true, true, true, true, true, true);
  sheet.getRange('F4:H9').setBorder(true, true, true, true, true, true);

  [200, 100, 100, 120, 20, 150, 80, 150].forEach((w, i) => sheet.setColumnWidth(i + 1, w));
}

/**
 * Create enhanced Office Analysis sheet
 */
function createOfficeAnalysisSheet(spreadsheet) {
  let sheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.OFFICE);
  sheet.clear();

  const R = "'" + SHEET_NAMES.RESPONSES + "'";

  // Title
  sheet.getRange('A1:G1').merge().setValue('OFFICE LOCATION ANALYSIS')
    .setFontSize(18).setFontWeight('bold').setFontColor(COLORS.PRIMARY);

  // Headers
  sheet.getRange('A3:G3').setValues([['Office', 'Responses', '% Share', 'Avg Satisfaction', 'Rating', 'Tools Used', 'Participation']]);
  sheet.getRange('A3:G3').setFontWeight('bold').setBackground(COLORS.PRIMARY).setFontColor(COLORS.WHITE);

  const offices = Object.values(PRIMARY_OFFICES);
  let row = 4;
  const lastRow = 4 + offices.length - 1;

  offices.forEach(office => {
    sheet.getRange(row, 1).setValue(office);
    sheet.getRange(row, 2).setFormula(`=COUNTIF(${R}!G:G,"${office}")`);
    sheet.getRange(row, 3).setFormula(`=IFERROR(B${row}/SUM($B$4:$B$${lastRow}),0)`).setNumberFormat('0%');
    sheet.getRange(row, 4).setFormula(`=IFERROR(AVERAGEIF(${R}!G:G,"${office}",${R}!O:O),"--")`).setNumberFormat('0.0');
    sheet.getRange(row, 5).setFormula(`=IFERROR(REPT("⭐",ROUND(D${row},0)),"--")`);
    sheet.getRange(row, 6).setFormula(`=IFERROR(SUMIF(${R}!G:G,"${office}",${R}!I:I),0)`);
    sheet.getRange(row, 7).setFormula(`=SPARKLINE(B${row},{\"charttype\",\"bar\";\"max\",MAX($B$4:$B$${lastRow});\"color1\",\"${COLORS.PRIMARY}\"})`);
    row++;
  });

  // Total
  sheet.getRange(row, 1).setValue('TOTAL').setFontWeight('bold');
  sheet.getRange(row, 2).setFormula(`=SUM(B4:B${row-1})`).setFontWeight('bold');
  sheet.getRange(row, 3).setValue('100%').setFontWeight('bold');
  sheet.getRange(row, 4).setFormula(`=IFERROR(AVERAGE(${R}!O:O),"--")`).setNumberFormat('0.0').setFontWeight('bold');
  sheet.getRange(row, 6).setFormula(`=SUM(F4:F${row-1})`).setFontWeight('bold');

  sheet.getRange(`A4:G${row}`).setBorder(true, true, true, true, true, true);

  // Conditional formatting
  const respRange = sheet.getRange(`B4:B${lastRow}`);
  const rule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThan(0)
    .setBackground('#D1FAE5')
    .setRanges([respRange])
    .build();
  sheet.setConditionalFormatRules([rule]);

  [150, 80, 80, 100, 100, 80, 150].forEach((w, i) => sheet.setColumnWidth(i + 1, w));
}

/**
 * Create Insights sheet with automated observations
 */
function createInsightsSheet(spreadsheet) {
  let sheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.INSIGHTS);
  sheet.clear();

  const R = "'" + SHEET_NAMES.RESPONSES + "'";

  // Title
  sheet.getRange('A1:F1').merge().setValue('AUTOMATED INSIGHTS & RECOMMENDATIONS')
    .setFontSize(18).setFontWeight('bold').setFontColor(COLORS.PRIMARY);

  sheet.getRange('A2').setValue('Generated insights based on survey response patterns')
    .setFontStyle('italic').setFontColor(COLORS.NEUTRAL);

  // Key findings
  sheet.getRange('A4:F4').merge().setValue('🔍 KEY FINDINGS')
    .setFontWeight('bold').setFontSize(14).setBackground(COLORS.PRIMARY).setFontColor(COLORS.WHITE);

  sheet.getRange('A5:F13').setValues([
    ['Finding', 'Value', 'Assessment', '', '', ''],
    ['Total Survey Participation', `=COUNTA(${R}!B:B)-1&" responses"`, `=IF(COUNTA(${R}!B:B)-1>=50,"✅ Strong participation",IF(COUNTA(${R}!B:B)-1>=20,"⚠️ Moderate participation","❌ Low participation"))`, '', '', ''],
    ['Overall Satisfaction Score', `=IFERROR(ROUND(AVERAGE(${R}!O:O),1)&" / 5","--")`, `=IF(AVERAGE(${R}!O:O)>=4,"✅ Excellent",IF(AVERAGE(${R}!O:O)>=3,"⚠️ Good","❌ Needs improvement"))`, '', '', ''],
    ['Training Resources Approval', `=IFERROR(ROUND((COUNTIF(${R}!P:P,"Strongly Agree")+COUNTIF(${R}!P:P,"Agree"))/(COUNTA(${R}!P:P)-1)*100,0)&"%","--")`, `=IF(VALUE(SUBSTITUTE(B8,"%",""))>=70,"✅ Positive",IF(VALUE(SUBSTITUTE(B8,"%",""))>=50,"⚠️ Mixed","❌ Needs attention"))`, '', '', ''],
    ['IT Support Approval', `=IFERROR(ROUND((COUNTIF(${R}!Q:Q,"Strongly Agree")+COUNTIF(${R}!Q:Q,"Agree"))/(COUNTA(${R}!Q:Q)-1)*100,0)&"%","--")`, `=IF(VALUE(SUBSTITUTE(B9,"%",""))>=70,"✅ Positive",IF(VALUE(SUBSTITUTE(B9,"%",""))>=50,"⚠️ Mixed","❌ Needs attention"))`, '', '', ''],
    ['Software Integration Satisfaction', `=IFERROR(ROUND((COUNTIF(${R}!R:R,"Strongly Agree")+COUNTIF(${R}!R:R,"Agree"))/(COUNTA(${R}!R:R)-1)*100,0)&"%","--")`, `=IF(VALUE(SUBSTITUTE(B10,"%",""))>=70,"✅ Positive",IF(VALUE(SUBSTITUTE(B10,"%",""))>=50,"⚠️ Mixed","❌ Needs attention"))`, '', '', ''],
    ['Average Tools per Person', `=IFERROR(ROUND((SUM(${R}!I:I)+SUM(${R}!J:J)+SUM(${R}!K:K))/(COUNTA(${R}!B:B)-1),1),"--")`, '', '', '', ''],
    ['Software Demand Ratio', `=IFERROR(ROUND(SUM(${R}!K:K)/SUM(${R}!I:I)*100,0)&"% want new vs current","--")`, `=IF(SUM(${R}!K:K)/SUM(${R}!I:I)>0.5,"📈 High demand for new tools","📊 Moderate interest")`, '', '', '']
  ]);
  sheet.getRange('A5:C5').setFontWeight('bold').setBackground('#E8E8E8');

  // Recommendations
  sheet.getRange('A15:F15').merge().setValue('💡 RECOMMENDATIONS')
    .setFontWeight('bold').setFontSize(14).setBackground(COLORS.PRIMARY).setFontColor(COLORS.WHITE);

  sheet.getRange('A16:F21').setValues([
    ['Priority', 'Area', 'Recommendation', 'Based On', '', ''],
    ['1', 'Training', `=IF(VALUE(SUBSTITUTE(B8,"%",""))<50,"Urgently improve training resources","Continue current training approach")`, 'Training feedback score', '', ''],
    ['2', 'Software', `=IF(SUM(${R}!K:K)>SUM(${R}!I:I)*0.3,"Evaluate new software requests from users","Software portfolio is well-aligned")`, 'Want vs Have ratio', '', ''],
    ['3', 'IT Support', `=IF(VALUE(SUBSTITUTE(B9,"%",""))<60,"Review IT support response times and quality","IT support performing well")`, 'IT Support feedback', '', ''],
    ['4', 'Integration', `=IF(VALUE(SUBSTITUTE(B10,"%",""))<50,"Investigate software integration pain points","Integration working well")`, 'Integration satisfaction', '', ''],
    ['5', 'Engagement', `=IF(COUNTA(${R}!B:B)-1<30,"Send survey reminders to increase participation","Participation is adequate")`, 'Response count', '', '']
  ]);
  sheet.getRange('A16:F16').setFontWeight('bold').setBackground('#E8E8E8');

  // Attention areas
  sheet.getRange('A23:F23').merge().setValue('⚠️ AREAS REQUIRING ATTENTION')
    .setFontWeight('bold').setFontSize(14).setBackground(COLORS.WARNING).setFontColor(COLORS.BLACK);

  sheet.getRange('A24:F26').setValues([
    ['Area', 'Issue', 'Impact', 'Suggested Action', '', ''],
    [`=IF(VALUE(SUBSTITUTE(B8,"%",""))<50,"Training Resources","--")`, `=IF(VALUE(SUBSTITUTE(B8,"%",""))<50,"Low approval rating","--")`, `=IF(VALUE(SUBSTITUTE(B8,"%",""))<50,"Skill gaps may develop","--")`, `=IF(VALUE(SUBSTITUTE(B8,"%",""))<50,"Review training programmes","--")`, '', ''],
    [`=IF(AVERAGE(${R}!O:O)<3.5,"Overall Satisfaction","--")`, `=IF(AVERAGE(${R}!O:O)<3.5,"Below target satisfaction","--")`, `=IF(AVERAGE(${R}!O:O)<3.5,"Employee engagement at risk","--")`, `=IF(AVERAGE(${R}!O:O)<3.5,"Investigate specific pain points","--")`, '', '']
  ]);
  sheet.getRange('A24:F24').setFontWeight('bold').setBackground('#E8E8E8');

  sheet.getRange('A5:C13').setBorder(true, true, true, true, true, true);
  sheet.getRange('A16:D21').setBorder(true, true, true, true, true, true);
  sheet.getRange('A24:D26').setBorder(true, true, true, true, true, true);

  [60, 200, 300, 150, 20, 20].forEach((w, i) => sheet.setColumnWidth(i + 1, w));
}

/**
 * Helper: Get or create a sheet
 */
function getOrCreateSheet(spreadsheet, name, index) {
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = index !== undefined
      ? spreadsheet.insertSheet(name, index)
      : spreadsheet.insertSheet(name);
  }
  return sheet;
}

// ============================================
// DATA REFRESH FUNCTIONS
// ============================================

/**
 * Refresh software analysis with enhanced visualizations
 */
function refreshSoftwareAnalysis() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const responsesSheet = spreadsheet.getSheetByName(SHEET_NAMES.RESPONSES);
  const softwareSheet = spreadsheet.getSheetByName(SHEET_NAMES.SOFTWARE);

  if (!responsesSheet || !softwareSheet) return;

  const data = responsesSheet.getDataRange().getValues();
  if (data.length <= 1) return;

  const softwareCounts = {};

  for (let i = 1; i < data.length; i++) {
    const currentlyUsing = data[i][11] ? data[i][11].toString().split(', ') : [];
    const previouslyUsed = data[i][12] ? data[i][12].toString().split(', ') : [];
    const wouldLikeToUse = data[i][13] ? data[i][13].toString().split(', ') : [];

    [
      { list: currentlyUsing, key: 'currentlyUsing' },
      { list: previouslyUsed, key: 'previouslyUsed' },
      { list: wouldLikeToUse, key: 'wouldLikeToUse' }
    ].forEach(({ list, key }) => {
      list.forEach(sw => {
        if (sw.trim()) {
          if (!softwareCounts[sw.trim()]) {
            softwareCounts[sw.trim()] = { currentlyUsing: 0, previouslyUsed: 0, wouldLikeToUse: 0 };
          }
          softwareCounts[sw.trim()][key]++;
        }
      });
    });
  }

  const sortedSoftware = Object.entries(softwareCounts)
    .map(([name, counts]) => ({
      name,
      ...counts,
      total: counts.currentlyUsing + counts.previouslyUsed + counts.wouldLikeToUse
    }))
    .sort((a, b) => b.total - a.total);

  // Clear and write data
  const lastRow = softwareSheet.getLastRow();
  if (lastRow > 4) softwareSheet.getRange(5, 1, lastRow - 4, 7).clear();

  if (sortedSoftware.length > 0) {
    const maxTotal = Math.max(...sortedSoftware.map(s => s.total));
    const outputData = sortedSoftware.map(sw => [
      sw.name,
      sw.currentlyUsing,
      sw.previouslyUsed,
      sw.wouldLikeToUse,
      sw.total,
      `=SPARKLINE({B${5 + sortedSoftware.indexOf(sw)},C${5 + sortedSoftware.indexOf(sw)},D${5 + sortedSoftware.indexOf(sw)}},{"charttype","bar";"color1","${COLORS.SUCCESS}";"color2","${COLORS.WARNING}";"color3","${COLORS.PRIMARY}"})`,
      sw.currentlyUsing > sw.previouslyUsed ? '📈 Growing' : (sw.previouslyUsed > sw.currentlyUsing ? '📉 Declining' : '➡️ Stable')
    ]);

    softwareSheet.getRange(5, 1, outputData.length, 7).setValues(outputData);
    softwareSheet.getRange(5, 1, outputData.length, 7).setBorder(true, true, true, true, true, true);

    // Conditional formatting for popularity
    const totalRange = softwareSheet.getRange(5, 5, outputData.length, 1);
    const rule = SpreadsheetApp.newConditionalFormatRule()
      .setGradientMaxpointWithValue(COLORS.SUCCESS, SpreadsheetApp.InterpolationType.NUMBER, maxTotal.toString())
      .setGradientMinpointWithValue(COLORS.WHITE, SpreadsheetApp.InterpolationType.NUMBER, '0')
      .setRanges([totalRange])
      .build();
    softwareSheet.setConditionalFormatRules([rule]);
  }

  Logger.log('Software analysis refreshed');
}

/**
 * Refresh training analysis with priority indicators
 */
function refreshTrainingAnalysis() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const responsesSheet = spreadsheet.getSheetByName(SHEET_NAMES.RESPONSES);
  const trainingSheet = spreadsheet.getSheetByName(SHEET_NAMES.TRAINING);

  if (!responsesSheet || !trainingSheet) return;

  const data = responsesSheet.getDataRange().getValues();
  if (data.length <= 1) return;

  const trainingCounts = {};

  for (let i = 1; i < data.length; i++) {
    try {
      const currentlyUsingDetails = JSON.parse(data[i][21] || '[]');
      const softwareList = data[i][11] ? data[i][11].toString().split(', ') : [];

      currentlyUsingDetails.forEach((detail, idx) => {
        const softwareName = softwareList[idx] || detail.softwareId;

        if (!trainingCounts[softwareName]) {
          trainingCounts[softwareName] = {
            'very-confident': 0, 'somewhat-confident': 0,
            'need-more': 0, 'require-significant': 0
          };
        }

        if (detail.trainingLevel && trainingCounts[softwareName][detail.trainingLevel] !== undefined) {
          trainingCounts[softwareName][detail.trainingLevel]++;
        }
      });
    } catch (e) { }
  }

  const sortedTraining = Object.entries(trainingCounts)
    .map(([name, counts]) => ({
      name,
      veryConfident: counts['very-confident'],
      somewhatConfident: counts['somewhat-confident'],
      needMore: counts['need-more'],
      requireSignificant: counts['require-significant'],
      needsTraining: counts['need-more'] + counts['require-significant'],
      total: Object.values(counts).reduce((a, b) => a + b, 0)
    }))
    .filter(t => t.total > 0)
    .sort((a, b) => b.needsTraining - a.needsTraining);

  // Clear and write
  const lastRow = trainingSheet.getLastRow();
  if (lastRow > 4 && lastRow < 19) trainingSheet.getRange(5, 1, lastRow - 4, 6).clear();

  if (sortedTraining.length > 0) {
    const outputData = sortedTraining.slice(0, 15).map(t => {
      const priority = t.needsTraining >= 3 ? '🔴 HIGH' : (t.needsTraining >= 1 ? '🟡 MEDIUM' : '🟢 LOW');
      return [t.name, t.veryConfident, t.somewhatConfident, t.needMore, t.requireSignificant, priority];
    });

    trainingSheet.getRange(5, 1, outputData.length, 6).setValues(outputData);
    trainingSheet.getRange(5, 1, outputData.length, 6).setBorder(true, true, true, true, true, true);
  }

  Logger.log('Training analysis refreshed');
}

/**
 * Refresh all dashboards
 */
function refreshAllDashboards() {
  refreshSoftwareAnalysis();
  refreshTrainingAnalysis();
  createAllCharts();
  Logger.log('All dashboards refreshed');
}

// ============================================
// MENU AND TRIGGERS
// ============================================

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📊 Survey Dashboard')
    .addItem('🔄 Refresh All Data', 'refreshAllDashboards')
    .addItem('📈 Create/Update Charts', 'createAllCharts')
    .addSeparator()
    .addItem('🛠️ Refresh Software Analysis', 'refreshSoftwareAnalysis')
    .addItem('📚 Refresh Training Analysis', 'refreshTrainingAnalysis')
    .addSeparator()
    .addItem('⚙️ Re-run Setup', 'setupDashboard')
    .addItem('🧪 Add Test Data', 'addTestData')
    .addToUi();
}

function setupTriggers() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'refreshAllDashboards')
    .forEach(t => ScriptApp.deleteTrigger(t));

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
 * Create all charts
 */
function createAllCharts() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

  createSatisfactionPieChart(spreadsheet);
  createDisciplineBarChart(spreadsheet);
  createOfficeColumnChart(spreadsheet);
  createSoftwareUsageChart(spreadsheet);
  createFeedbackStackedChart(spreadsheet);

  Logger.log('All charts created/updated');
}

function createSatisfactionPieChart(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(SHEET_NAMES.DASHBOARD);
  removeChartsByTitle(sheet, 'Satisfaction Distribution');

  const chart = sheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(sheet.getRange('A13:B16'))
    .setPosition(28, 1, 0, 0)
    .setOption('title', 'Satisfaction Distribution')
    .setOption('pieHole', 0.4)
    .setOption('colors', [COLORS.SUCCESS, COLORS.PRIMARY_LIGHT, COLORS.WARNING, COLORS.DANGER])
    .setOption('legend', { position: 'right' })
    .setOption('pieSliceText', 'percentage')
    .setOption('width', 400)
    .setOption('height', 250)
    .build();

  sheet.insertChart(chart);
}

function createDisciplineBarChart(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(SHEET_NAMES.DISCIPLINE);
  removeChartsByTitle(sheet, 'Responses by Discipline');

  const disciplines = Object.values(DISCIPLINES);

  const chart = sheet.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(sheet.getRange(4, 1, disciplines.length, 2))
    .setPosition(4, 11, 0, 0)
    .setOption('title', 'Responses by Discipline')
    .setOption('legend', { position: 'none' })
    .setOption('colors', [COLORS.PRIMARY])
    .setOption('hAxis', { title: 'Number of Responses', minValue: 0 })
    .setOption('width', 450)
    .setOption('height', 350)
    .build();

  sheet.insertChart(chart);
}

function createOfficeColumnChart(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(SHEET_NAMES.OFFICE);
  removeChartsByTitle(sheet, 'Responses by Office');

  const offices = Object.values(PRIMARY_OFFICES);

  const chart = sheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(sheet.getRange(4, 1, offices.length, 2))
    .setPosition(4, 9, 0, 0)
    .setOption('title', 'Responses by Office')
    .setOption('legend', { position: 'none' })
    .setOption('colors', [COLORS.PRIMARY])
    .setOption('vAxis', { title: 'Responses', minValue: 0 })
    .setOption('width', 500)
    .setOption('height', 350)
    .build();

  sheet.insertChart(chart);
}

function createSoftwareUsageChart(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(SHEET_NAMES.SOFTWARE);
  removeChartsByTitle(sheet, 'Top Software Tools');

  const lastRow = Math.min(sheet.getLastRow(), 14); // Top 10
  if (lastRow <= 4) return;

  const chart = sheet.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(sheet.getRange(5, 1, lastRow - 4, 5))
    .setPosition(4, 9, 0, 0)
    .setOption('title', 'Top Software Tools')
    .setOption('isStacked', true)
    .setOption('colors', [COLORS.SUCCESS, COLORS.WARNING, COLORS.PRIMARY])
    .setOption('legend', { position: 'top' })
    .setOption('width', 500)
    .setOption('height', 400)
    .build();

  sheet.insertChart(chart);
}

function createFeedbackStackedChart(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(SHEET_NAMES.SATISFACTION);
  removeChartsByTitle(sheet, 'IT Support Feedback');

  const chart = sheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(sheet.getRange('F5:G9'))
    .setPosition(12, 6, 0, 0)
    .setOption('title', 'IT Support Feedback')
    .setOption('pieHole', 0.4)
    .setOption('colors', [COLORS.SUCCESS, COLORS.PRIMARY_LIGHT, COLORS.WARNING, COLORS.DANGER, '#991B1B'])
    .setOption('legend', { position: 'right' })
    .setOption('width', 350)
    .setOption('height', 250)
    .build();

  sheet.insertChart(chart);
}

function removeChartsByTitle(sheet, title) {
  sheet.getCharts().forEach(chart => {
    try {
      if (chart.getOptions().get('title') === title) {
        sheet.removeChart(chart);
      }
    } catch (e) { }
  });
}

// ============================================
// TEST FUNCTIONS
// ============================================

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
      { softwareId: 'arch-viz-enscape', frequency: 'several-per-week', trainingLevel: 'need-more', satisfaction: 4 }
    ],
    previouslyUsedResponses: [
      { softwareId: 'arch-doc-autocad', usedWhere: ['bailey-partnership'], stoppedReasons: ['superseded'], supersededBy: 'Revit' }
    ],
    wouldLikeToUseResponses: [
      { softwareId: 'arch-bim-forma', benefit: 'significant', interest: 'Early stage design' }
    ],
    generalFeedback: {
      overallSatisfaction: 4,
      trainingResources: 'agree',
      itSupport: 'strongly-agree',
      softwareIntegration: 'neutral',
      improvementSuggestions: 'More BIM training would be helpful'
    },
    completionStatus: 'completed'
  };

  const result = doPost({ postData: { contents: JSON.stringify(sampleData) } });
  Logger.log(result.getContent());
}

function addTestData() {
  const testProfiles = [
    { name: 'Alice Johnson', discipline: 'architectural-design', office: 'bristol', role: 'senior-associate', sat: 5 },
    { name: 'Bob Smith', discipline: 'building-surveying', office: 'exeter', role: 'general', sat: 4 },
    { name: 'Carol Williams', discipline: 'civil-structural-engineering', office: 'manchester', role: 'executive-director', sat: 5 },
    { name: 'David Brown', discipline: 'quantity-surveying', office: 'maidstone', role: 'intern-trainee', sat: 3 },
    { name: 'Eve Davis', discipline: 'project-management', office: 'plymouth', role: 'senior-associate', sat: 4 },
    { name: 'Frank Miller', discipline: 'building-services-mep', office: 'edinburgh', role: 'general', sat: 4 },
    { name: 'Grace Wilson', discipline: 'interior-design', office: 'chichester', role: 'senior-associate', sat: 5 },
    { name: 'Henry Taylor', discipline: 'fire-engineering', office: 'torquay', role: 'general', sat: 3 },
    { name: 'Ivy Anderson', discipline: 'planning', office: 'peterborough', role: 'intern-trainee', sat: 4 },
    { name: 'Jack Thomas', discipline: 'admin-support', office: 'gibraltar', role: 'general', sat: 5 }
  ];

  const software = [
    ['Autodesk Revit', 'Microsoft Teams', 'AutoCAD'],
    ['Bluebeam Revu', 'Microsoft SharePoint', 'Kykloud'],
    ['Robot Structural Analysis', 'Tekla Structures', 'AutoCAD'],
    ['CostX', 'Bluebeam Revu', 'Microsoft Excel'],
    ['Microsoft Project', 'Procore', 'Microsoft Teams'],
    ['Revit MEP', 'IES Virtual Environment', 'Dialux'],
    ['SketchUp Pro', 'Adobe Creative Suite', 'Enscape'],
    ['PyroSim', 'Pathfinder', 'Microsoft Office'],
    ['ArcGIS', 'Google Earth Pro', 'QGIS'],
    ['Microsoft 365', 'Adobe Acrobat', 'SharePoint']
  ];

  const agreements = ['strongly-agree', 'agree', 'neutral', 'disagree'];
  const trainingLevels = ['very-confident', 'somewhat-confident', 'need-more', 'require-significant'];

  testProfiles.forEach((profile, index) => {
    const sw = software[index] || software[0];
    const sampleData = {
      id: 'test-bulk-' + Date.now() + '-' + index,
      timestamp: new Date().toISOString(),
      userProfile: {
        email: profile.name.toLowerCase().replace(' ', '.') + '@baileypartnership.com',
        fullName: profile.name,
        roleLevel: profile.role,
        primaryOffice: profile.office,
        discipline: profile.discipline
      },
      softwareSelections: [
        { softwareId: 'sw-1', softwareName: sw[0], usageStatus: 'currently-using' },
        { softwareId: 'sw-2', softwareName: sw[1], usageStatus: 'currently-using' },
        { softwareId: 'sw-3', softwareName: sw[2], usageStatus: index % 2 === 0 ? 'would-like-to-use' : 'used-previously' }
      ],
      currentlyUsingResponses: [
        { softwareId: 'sw-1', frequency: 'daily', trainingLevel: trainingLevels[index % 4], satisfaction: profile.sat },
        { softwareId: 'sw-2', frequency: 'several-per-week', trainingLevel: trainingLevels[(index + 1) % 4], satisfaction: Math.max(3, profile.sat - 1) }
      ],
      previouslyUsedResponses: index % 2 !== 0 ? [
        { softwareId: 'sw-3', usedWhere: ['bailey-partnership'], stoppedReasons: ['superseded'] }
      ] : [],
      wouldLikeToUseResponses: index % 2 === 0 ? [
        { softwareId: 'sw-3', benefit: 'moderate', interest: 'Would improve workflow' }
      ] : [],
      generalFeedback: {
        overallSatisfaction: profile.sat,
        trainingResources: agreements[index % 4],
        itSupport: agreements[(index + 1) % 4],
        softwareIntegration: agreements[(index + 2) % 4],
        improvementSuggestions: index % 3 === 0 ? 'More training sessions please' : ''
      },
      completionStatus: 'completed'
    };

    doPost({ postData: { contents: JSON.stringify(sampleData) } });
    Utilities.sleep(100);
  });

  Logger.log('10 test records added');
  refreshAllDashboards();
}
