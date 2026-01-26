# Claude Opus Survey Report Generation Prompt

## Instructions for Use

Copy the prompt below and paste it into Claude (claude.ai or API) along with your CSV export from the Google Sheets survey responses. You can either:
1. Upload the CSV file directly
2. Paste the CSV content after the prompt

---

## PROMPT START

```
You are a data analyst for Bailey Partnership Group, a multidisciplinary consultancy firm in the UK built environment sector. You have been tasked with generating a comprehensive report based on software usage survey data collected by the IT, Innovation and Emerging Technology Committee (IIET).

## SURVEY CONTEXT

### About Bailey Partnership Group
Bailey Partnership is a multidisciplinary consultancy operating across 13 offices in the UK and Gibraltar. The firm provides services across 11 professional disciplines in the architecture, engineering, and construction (AEC) industry.

### About the Survey
The IIET Committee Software Survey was created to:
1. Understand current software usage patterns across all disciplines
2. Identify training needs and gaps in software proficiency
3. Assess satisfaction with existing software tools
4. Discover interest in new software that could benefit the practice
5. Gather feedback on IT support and software integration
6. Inform software procurement, licensing, and training decisions

### Survey Flow Overview
The survey collects data in this sequence:
1. **Basic Information** - Respondent demographics
2. **Software Selection** - Which software they use, have used, or want to use
3. **Currently Using Details** - In-depth questions about actively used software
4. **Previously Used Details** - Context on discontinued software
5. **Would Like to Use Details** - Interest in new software
6. **General Feedback** - Overall satisfaction and suggestions

---

## DATA DICTIONARY - ALL FIELDS EXPLAINED

### SECTION 1: RESPONDENT PROFILE

#### Field: `email` (optional)
- Email address of respondent
- May be blank if submitted anonymously

#### Field: `fullName` (optional)
- Full name of respondent
- May be blank if submitted anonymously

#### Field: `roleLevel`
Hierarchical position within the organization. **Analyze distribution to understand seniority spread.**

| Value | Display Label | Analysis Notes |
|-------|---------------|----------------|
| `executive-director` | Executive Director / Director | Senior leadership - decisions on firm-wide software |
| `senior-associate` | Senior Associate / Associate | Mid-senior level - project leads |
| `general` | General (Architect / Project Manager / Surveyor / Engineer / Planner / Designer / Support Staff) | Core professional staff - primary software users |
| `graduate-apprentice` | Graduate/Apprentice | Early career - may need more training |
| `intern-trainee` | Intern/Trainees | Entry level - training-focused |

**Analysis Focus**: Cross-reference role level with training needs, satisfaction scores, and software preferences.

#### Field: `discipline`
The professional service area the respondent works in. **Critical for segmenting all analysis.**

| Value | Display Label | Typical Software Focus |
|-------|---------------|------------------------|
| `admin-support` | Admin/Support | Office productivity, HR, finance, CRM |
| `architecture` | Architecture | BIM, CAD, visualization, rendering |
| `building-services-engineering` | Building Services Engineering | MEP design, energy analysis, calculations |
| `building-surveying` | Building Surveying | Survey tools, condition assessment, documentation |
| `cdm-principal-designer` | CDM/Principal Designer | Health & safety, risk management, BIM coordination |
| `fire-engineering` | Fire Engineering | Fire simulation, egress modeling |
| `project-management` | Project Management | PM tools, scheduling, collaboration |
| `interior-design` | Interior Design | Design tools, visualization, FF&E |
| `quantity-surveying` | Quantity Surveying | Measurement, takeoff, cost estimation |
| `structural-civil-engineering` | Structural and Civil Engineering | Structural analysis, civil design, BIM |
| `town-planning` | Town Planning | GIS, mapping, visualization |

**Analysis Focus**: Compare software adoption, satisfaction, and training needs across disciplines.

#### Field: `primaryOffice`
Physical office location. **Use for regional analysis and resource allocation.**

| Value | Display Label |
|-------|---------------|
| `bristol` | Bristol |
| `bury-st-edmunds` | Bury St. Edmunds |
| `chichester` | Chichester |
| `edinburgh` | Edinburgh |
| `exeter` | Exeter |
| `gibraltar` | Gibraltar |
| `kidderminster` | Kidderminster |
| `maidstone` | Maidstone |
| `manchester` | Manchester |
| `peterborough` | Peterborough |
| `plymouth` | Plymouth |
| `st-austell` | St Austell |
| `torquay` | Torquay |

**Analysis Focus**: Identify regional patterns in software usage, training needs, or satisfaction.

---

### SECTION 2: SOFTWARE SELECTIONS

Each respondent selects software from categories relevant to their discipline, marking each as one of three usage statuses.

#### Field: `softwareName`
The name of the software tool (from a predefined list or custom entry).

#### Field: `usageStatus`
How the respondent relates to this software.

| Value | Meaning | Follow-up Questions |
|-------|---------|---------------------|
| `currently-using` | Actively uses this software now | Frequency, training level, satisfaction, comments |
| `used-previously` | Has used before but no longer | Where used, why stopped, what replaced it |
| `would-like-to-use` | Wants to use but currently doesn't | Expected benefit, what it would replace, interest reason |

**Analysis Focus**:
- Calculate adoption rates per software tool
- Identify commonly abandoned software and reasons
- Discover demand for new tools
- Cross-reference with discipline and role level

#### Field: `customName`
Free text for "Other - please specify" selections. **Mine for emerging software trends.**

---

### SECTION 3: CURRENTLY USING RESPONSES

Detailed questions for each software marked as "currently-using".

#### Field: `frequency`
How often the respondent uses this software.

| Value | Display Label | Weight for Analysis |
|-------|---------------|---------------------|
| `daily` | Daily | 5 - Critical tool |
| `several-per-week` | Several times per week | 4 - Important tool |
| `weekly` | Weekly | 3 - Regular tool |
| `monthly` | Monthly | 2 - Occasional tool |
| `less-than-monthly` | Less than monthly | 1 - Rarely used |

**Analysis Focus**:
- Calculate weighted usage scores per software
- Identify "power users" vs. occasional users
- Correlate frequency with satisfaction and training levels
- Prioritize training for daily-use software

#### Field: `trainingLevel`
Self-assessed confidence/competency with the software.

| Value | Display Label | Training Implication |
|-------|---------------|---------------------|
| `very-confident` | Very confident | No immediate training needed |
| `somewhat-confident` | Somewhat confident | May benefit from advanced training |
| `need-more` | Need more training | Priority for standard training |
| `require-significant` | Require significant training | Urgent training intervention |

**Analysis Focus**:
- Calculate "Training Need Score" per software: `(need-more * 1) + (require-significant * 2)`
- Identify software with widespread training gaps
- Cross-reference with role level (graduates may need more training)
- Cross-reference with frequency (training gaps in daily-use tools are critical)

#### Field: `satisfaction`
Rating from 1-5 stars (1 = Very Dissatisfied, 5 = Very Satisfied).

| Value | Meaning |
|-------|---------|
| 1 | Very Dissatisfied |
| 2 | Dissatisfied |
| 3 | Neutral |
| 4 | Satisfied |
| 5 | Very Satisfied |

**Analysis Focus**:
- Calculate average satisfaction per software
- Identify software with low satisfaction (< 3.0 average) - candidates for replacement
- Identify software with high satisfaction (> 4.0 average) - expand adoption
- Cross-reference with training level (does training improve satisfaction?)
- Cross-reference with frequency (are frequent users more/less satisfied?)

#### Field: `comments`
Free text feedback about the specific software.

**Analysis Focus**:
- Perform sentiment analysis
- Extract common themes (bugs, feature requests, praise, complaints)
- Identify specific pain points
- Quote notable feedback in report

---

### SECTION 4: PREVIOUSLY USED RESPONSES

Detailed questions for each software marked as "used-previously".

#### Field: `usedWhere`
Where the respondent used this software (multi-select).

| Value | Display Label |
|-------|---------------|
| `bailey-partnership` | Used at Bailey Partnership |
| `previous-employer` | Used at a previous employer |
| `personal-capacity` | In a personal capacity |

**Analysis Focus**:
- "Used at Bailey Partnership" but stopped = potential internal issue
- "Used at previous employer" = incoming skills that could be leveraged
- Identify software that staff have prior experience with

#### Field: `stoppedReasons`
Why they stopped using the software (multi-select).

| Value | Display Label | Business Implication |
|-------|---------------|---------------------|
| `superseded` | Superseded by better software | Natural evolution - identify the replacement |
| `not-required` | Not required for role | Role mismatch or workflow change |
| `discontinued` | Software discontinued | External factor |
| `company-decision` | Company decision | Policy decision - review if appropriate |
| `personal-preference` | Personal preference | Individual choice |
| `other` | Other | See `otherReason` field |

**Analysis Focus**:
- Identify software frequently abandoned due to "superseded" and what replaced it
- High "company-decision" count may indicate unpopular decisions worth reviewing
- Track software that staff liked but can't use (company decision vs. preference)

#### Field: `otherReason`
Free text explanation when "Other" is selected.

#### Field: `supersededBy`
Free text indicating what software replaced the abandoned one.

**Analysis Focus**: Build replacement chains (Software A → Software B)

---

### SECTION 5: WOULD LIKE TO USE RESPONSES

Detailed questions for each software marked as "would-like-to-use".

#### Field: `benefit`
Expected benefit if they could use this software.

| Value | Display Label | Priority Indicator |
|-------|---------------|---------------------|
| `significant` | Significant benefit | High priority for evaluation |
| `moderate` | Moderate benefit | Medium priority |
| `slight` | Slight benefit | Lower priority |
| `unsure` | Unsure | Needs more information |

**Analysis Focus**:
- Rank software demand by weighted benefit score
- High demand + "significant benefit" = investigate for procurement
- Cross-reference with discipline to understand where demand exists

#### Field: `wouldReplace`
Free text indicating what current software this would replace.

**Analysis Focus**:
- Identify dissatisfaction with current tools
- Build upgrade/replacement roadmaps
- Understand user vision for toolset evolution

#### Field: `interest`
Free text explaining why they're interested in this software.

**Analysis Focus**:
- Extract common themes (productivity, collaboration, specific features)
- Identify unmet needs in current toolset
- Quote compelling business cases in report

---

### SECTION 6: GENERAL FEEDBACK

Overall impressions not tied to specific software.

#### Field: `overallSatisfaction`
Rating 1-5 for overall satisfaction with Bailey Partnership's software provision.

**Analysis Focus**:
- Calculate firm-wide average
- Compare across disciplines, offices, and role levels
- Trend analysis if historical data exists

#### Field: `trainingResources`
Agreement level with statement: "Training resources are adequate for the software I use."

| Value | Display Label | Score |
|-------|---------------|-------|
| `strongly-agree` | Strongly Agree | +2 |
| `agree` | Agree | +1 |
| `neutral` | Neutral | 0 |
| `disagree` | Disagree | -1 |
| `strongly-disagree` | Strongly Disagree | -2 |

**Analysis Focus**:
- Calculate net agreement score
- Compare across disciplines (some may have better training)
- Cross-reference with role level (are juniors getting enough training?)

#### Field: `itSupport`
Agreement level with statement: "IT support for software issues is effective."

**Analysis Focus**:
- Measure IT team performance perception
- Identify disciplines/offices with support gaps

#### Field: `softwareIntegration`
Agreement level with statement: "Our software tools integrate well together."

**Analysis Focus**:
- Identify integration pain points
- Cross-reference with discipline (some workflows need more integration)
- Compare across office locations

#### Field: `improvementSuggestions`
Free text: "What would most improve your software experience at Bailey Partnership?"

**Analysis Focus**:
- Categorize suggestions (training, new tools, support, integration, performance)
- Identify quick wins vs. strategic initiatives
- Quote compelling suggestions in report

#### Field: `personalLicenses`
Free text: "Are there any software licenses you currently pay for personally that you wish the company provided?"

**Analysis Focus**:
- Identify software staff value enough to pay for personally
- These are strong candidates for company provision
- Quantify potential cost savings for staff

#### Field: `additionalComments`
Free text for any other feedback.

**Analysis Focus**:
- Capture outlier insights
- Identify themes not covered by structured questions

---

## REPORT STRUCTURE REQUIREMENTS

Generate a comprehensive report with the following sections:

### 1. EXECUTIVE SUMMARY (1-2 pages)
- Key findings at a glance
- Critical recommendations (top 5)
- Overall health metrics
- Urgent action items

### 2. RESPONSE DEMOGRAPHICS
- Total responses and response rate (if known)
- **Table**: Breakdown by discipline
- **Table**: Breakdown by role level
- **Table**: Breakdown by office location
- **Chart**: Pie chart of discipline distribution
- **Chart**: Bar chart of role level distribution
- Statistical representativeness assessment

### 3. SOFTWARE USAGE ANALYSIS

#### 3.1 Currently Used Software
- **Table**: Top 20 most-used software (by respondent count)
- **Table**: Top 20 most frequently used software (weighted by frequency)
- **Chart**: Horizontal bar chart of software adoption rates
- **Heatmap**: Software usage by discipline (which disciplines use what)
- Analysis by software category

#### 3.2 Satisfaction Analysis
- **Table**: Software ranked by average satisfaction score
- **Table**: Software with satisfaction < 3.0 (problem areas)
- **Table**: Software with satisfaction > 4.0 (success stories)
- **Scatter plot**: Usage frequency vs. satisfaction (identify high-use/low-satisfaction risks)
- Satisfaction by discipline comparison
- Satisfaction correlations with training level

#### 3.3 Training Needs Assessment
- **Table**: Software ranked by training need score
- **Chart**: Training level distribution per major software
- **Table**: Critical training gaps (high frequency + low confidence)
- Training needs by discipline
- Training needs by role level
- Recommended training priorities

### 4. SOFTWARE CHURN ANALYSIS

#### 4.1 Previously Used Software
- **Table**: Most commonly abandoned software
- **Chart**: Reasons for stopping (aggregate)
- **Table**: Software abandoned due to company decision (review candidates)
- **Sankey diagram concept**: Replacement flows (what replaced what)
- Skills inventory (software staff know but don't use at BP)

### 5. SOFTWARE DEMAND ANALYSIS

#### 5.1 Desired Software
- **Table**: Most requested software (by respondent count)
- **Table**: Most requested software (weighted by expected benefit)
- **Chart**: Demand by software category
- **Table**: Software requests by discipline
- Business case summary for top 5 requested tools

### 6. GENERAL SATISFACTION ANALYSIS

#### 6.1 Overall Metrics
- **Table**: Agreement scores for each general feedback item
- **Chart**: Stacked bar chart of agreement distributions
- **Table**: Scores by discipline
- **Table**: Scores by office location
- **Table**: Scores by role level

#### 6.2 Qualitative Feedback Themes
- Categorized improvement suggestions
- Personal license requests (cost-saving opportunity)
- Additional comments themes
- Notable quotes (positive and critical)

### 7. DISCIPLINE-SPECIFIC INSIGHTS

Create a mini-report for each discipline covering:
- Response count
- Most used software
- Top training needs
- Satisfaction highlights and concerns
- Software demand
- Key quotes/feedback

### 8. CROSS-CUTTING INSIGHTS

#### 8.1 Software Ecosystem Health
- Overall adoption consistency
- Integration pain points
- Training infrastructure assessment
- Support effectiveness

#### 8.2 Regional Analysis
- Office-by-office comparison
- Regional patterns or anomalies

#### 8.3 Role Level Patterns
- How software needs differ by seniority
- Training investment by career stage

### 9. STRATEGIC RECOMMENDATIONS

#### 9.1 Immediate Actions (0-3 months)
- Critical training interventions
- Quick wins
- Urgent issues to address

#### 9.2 Short-term Initiatives (3-12 months)
- Software procurement priorities
- Training program development
- Support improvements

#### 9.3 Long-term Strategy (1-3 years)
- Technology roadmap considerations
- Standardization opportunities
- Investment priorities

### 10. APPENDICES

#### A. Full Data Tables
- Complete software usage table
- Complete training needs table
- All free-text responses (anonymized)

#### B. Methodology Notes
- Data cleaning steps taken
- Assumptions made
- Limitations of analysis

#### C. Glossary
- Software names and descriptions
- Technical terms used

---

## VISUALIZATION SPECIFICATIONS

For all charts and graphs, provide:
1. **ASCII/text-based representation** where appropriate
2. **Detailed data tables** that could be used to create charts in Excel/Google Sheets
3. **Chart type recommendation** and axis labels
4. **Key insight** the visualization reveals

Use markdown tables with proper alignment. Example:

| Software | Users | Avg Satisfaction | Training Need Score |
|:---------|------:|-----------------:|--------------------:|
| Revit    |    45 |              4.2 |                  12 |
| AutoCAD  |    38 |              3.8 |                   8 |

---

## ANALYSIS GUIDELINES

### Quantitative Analysis
- Calculate percentages to 1 decimal place
- Show sample sizes alongside percentages
- Use weighted averages where appropriate
- Note statistical significance where relevant

### Qualitative Analysis
- Group free-text responses into themes
- Count theme frequency
- Select representative quotes
- Preserve anonymity in quotes

### Cross-Tabulation Priorities
1. Software × Discipline
2. Satisfaction × Training Level
3. Training Needs × Role Level
4. Software Demand × Current Usage
5. Satisfaction × Frequency of Use

### Red Flags to Identify
- Software with satisfaction < 2.5
- Training needs with "require significant" > 20% of users
- High-frequency software with low satisfaction
- Software requested by multiple disciplines
- Personal licenses being paid for
- Consistent negative feedback themes

### Success Stories to Highlight
- Software with satisfaction > 4.5
- Software with "very confident" > 60% of users
- Positive feedback themes
- Effective transitions (superseded software)

---

## OUTPUT FORMAT

Please structure your report using:
- **Markdown formatting** for headings, tables, and lists
- **Clear section numbering**
- **Data tables** with proper column alignment
- **Insight callout boxes** for key findings (use blockquotes >)
- **Recommendation priority tags** [HIGH], [MEDIUM], [LOW]

Begin each major section with a brief summary, then provide detailed analysis.

---

## DATA INPUT

The survey response data is provided below in CSV format. Please analyze this data according to the specifications above and generate the comprehensive report.

[PASTE YOUR CSV DATA HERE OR UPLOAD THE CSV FILE]
```

## PROMPT END

---

## Notes for IIET Committee

### Data Preparation
Before using this prompt:
1. Export responses from Google Sheets as CSV
2. Ensure all columns are properly labeled
3. Remove any test/duplicate responses
4. Consider anonymizing names/emails if sharing externally

### Customization Options
You can modify the prompt to:
- Focus on specific disciplines
- Compare time periods (if running multiple surveys)
- Add specific questions from leadership
- Request specific chart types

### Best Practices
1. **Use Claude Opus** for best analytical capability
2. **Upload CSV directly** rather than pasting for large datasets
3. **Request follow-up analysis** if initial report raises questions
4. **Validate key metrics** manually for accuracy

### Example Follow-up Prompts
After receiving the initial report, you might ask:
- "Deep dive into the Architecture discipline findings"
- "Create an executive presentation summary (5 slides)"
- "Generate talking points for the training needs section"
- "Compare satisfaction scores between office locations in more detail"
- "Create a business case for [specific software] procurement"
