# Google Sheets Dashboard Setup Guide

This guide explains how to set up the real-time analytics dashboard for the Bailey Partnership Software Survey.

## Overview

The dashboard provides:
- **Real-time metrics**: Response counts, satisfaction scores, software usage totals
- **Discipline analysis**: Breakdown by each discipline with averages
- **Office analysis**: Breakdown by primary office location
- **Software analysis**: Most used software across the organisation
- **Training needs**: Identify where additional training is required
- **Satisfaction tracking**: Overall satisfaction trends and distributions
- **Auto-refresh**: Data refreshes automatically every hour

## Setup Instructions

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "Bailey Partnership Software Survey Responses"
4. Copy the **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```

### Step 2: Create the Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Name the project "Bailey Survey Dashboard"
4. Delete any existing code in `Code.gs`
5. Copy the entire contents of `google-apps-script-with-dashboard.js` into the editor
6. Replace `YOUR_SPREADSHEET_ID_HERE` with your actual Spreadsheet ID:
   ```javascript
   const SPREADSHEET_ID = 'your-actual-spreadsheet-id-here';
   ```
7. Click **Save** (Ctrl+S / Cmd+S)

### Step 3: Run Initial Setup

1. In the Apps Script editor, select the function `setupDashboard` from the dropdown
2. Click **Run**
3. You'll be prompted to authorise the script:
   - Click "Review permissions"
   - Select your Google account
   - Click "Advanced" > "Go to Bailey Survey Dashboard (unsafe)"
   - Click "Allow"
4. The script will create all dashboard sheets automatically

### Step 4: Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click the gear icon and select **Web app**
3. Configure the deployment:
   - **Description**: "Bailey Survey API v1"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Click **Deploy**
5. Copy the **Web app URL** - this is your API endpoint

### Step 5: Configure the Survey App

1. Create a `.env` file in the project root (if not exists)
2. Add the Web App URL:
   ```
   VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```
3. Restart the development server

## Dashboard Sheets

After setup, your spreadsheet will contain these sheets:

| Sheet | Description |
|-------|-------------|
| **Survey Responses** | Raw data from all submissions |
| **Dashboard** | Main overview with KPIs and key metrics |
| **Software Analysis** | Software usage breakdown and rankings |
| **Discipline Analysis** | Response analysis by discipline |
| **Training Needs** | Training requirements by software |
| **Satisfaction Analysis** | Satisfaction ratings breakdown |
| **Office Analysis** | Response analysis by office location |
| **Lookups** | Reference data for dropdowns |

## Using the Dashboard

### Custom Menu

When you open the spreadsheet, a **Survey Dashboard** menu appears:

- **Setup Dashboard**: Re-run the initial setup (resets all sheets)
- **Refresh All Data**: Manually refresh software and training analysis
- **Refresh Software Analysis**: Update only the software breakdown
- **Refresh Training Analysis**: Update only the training needs
- **Create Charts**: Generate visual charts on relevant sheets

### Key Metrics (Dashboard Sheet)

The main Dashboard sheet shows:

1. **Total Responses**: Count of completed surveys
2. **Average Satisfaction**: Overall satisfaction rating (out of 5)
3. **Software Selections**: Total software items selected
4. **Disciplines**: Number of disciplines represented

### Real-Time Updates

- Basic metrics (counts, averages) update automatically via formulas
- Software and training analysis refresh hourly via a trigger
- Manual refresh available via the Survey Dashboard menu

## Testing the Setup

### Test Single Submission

1. In Apps Script, select `testSubmission` function
2. Click **Run**
3. Check the Survey Responses sheet for the new entry

### Test Multiple Submissions

1. In Apps Script, select `addTestData` function
2. Click **Run**
3. This adds 5 test responses with varied disciplines and offices

### Verify API Endpoint

Visit your Web App URL in a browser. You should see:
```json
{
  "status": "ok",
  "message": "Bailey Partnership Survey API is running",
  "timestamp": "2026-01-20T..."
}
```

## Customisation

### Modifying Lookups

Edit the lookup constants at the top of the script:
- `ROLE_LEVELS`: Job role categories
- `PRIMARY_OFFICES`: Office locations
- `DISCIPLINES`: Team disciplines
- `FREQUENCIES`: Usage frequency options
- `TRAINING_LEVELS`: Training confidence levels
- `AGREEMENT_SCALE`: Likert scale options

### Adding New Metrics

1. Add new formulas to the relevant sheet in `create*Sheet` functions
2. Reference the `Survey Responses` sheet using:
   ```javascript
   const responsesSheet = "'" + SHEET_NAMES.RESPONSES + "'";
   ```
3. Re-run `setupDashboard()` to apply changes

### Changing Refresh Frequency

Modify the `setupTriggers()` function:
```javascript
ScriptApp.newTrigger('refreshAllDashboards')
  .timeBased()
  .everyHours(1)  // Change to everyMinutes(30) for more frequent updates
  .create();
```

## Troubleshooting

### "Spreadsheet not found" Error
- Verify the SPREADSHEET_ID is correct
- Ensure you have edit access to the spreadsheet

### Submissions Not Appearing
- Check the Web App URL is correct in `.env`
- Verify the deployment has "Anyone" access
- Check the Apps Script execution logs for errors

### Charts Not Displaying
- Run "Create Charts" from the Survey Dashboard menu
- Ensure there's data in the responses sheet

### Formulas Showing Errors
- Check that all sheets exist with correct names
- Verify the responses sheet has the correct column structure
- Run `setupDashboard()` to reset all sheets

## Data Privacy

- Survey responses contain personal data (email, name)
- Restrict spreadsheet access to authorised personnel only
- Consider using "Anyone with the link" access for the Web App
- Review Google's data processing terms for compliance

## Support

For technical issues:
- Check the Apps Script execution logs (Executions menu)
- Verify all configuration values are correct
- Contact Bailey Partnership IT Support

---

**Version**: 1.0.0
**Last Updated**: January 2026
