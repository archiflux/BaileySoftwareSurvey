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

---

## COMPLETE SOFTWARE CATALOG BY DISCIPLINE

This section lists ALL predefined software options available to respondents in each discipline. This is critical for identifying when users have selected "Other" and provided custom software names.

### How to Identify Custom "Other" Inputs

**IMPORTANT**: In the survey data, you can identify custom user-submitted software by:

1. **Software ID Pattern**: All "Other" options have IDs ending in `-other` (e.g., `arch-bim-other`, `mep-analysis-other`)
2. **Software Name**: Will show as "Other - please specify"
3. **Custom Name Field**: The `customName` field will contain the user's specified software name

**When analyzing the data:**
- If `softwareName` = "Other - please specify" → check the `customName` field for the actual software
- If `softwareId` ends with `-other` → this is a custom entry
- Any software name NOT in the lists below is a custom entry worth investigating

### Why Custom Entries Matter

Custom "Other" entries are **high-value data points** because they reveal:
- Software tools the IIET Committee hadn't considered
- Emerging tools gaining traction in the industry
- Niche discipline-specific tools
- Personal productivity tools staff find valuable
- Potential gaps in the standard software provision

**Create a dedicated section in the report highlighting all custom entries.**

---

### DISCIPLINE: Admin/Support (`admin-support`)

| Category | Software ID | Software Name |
|----------|-------------|---------------|
| **Productivity & Office Suite** | `admin-office-google` | Google Workspace (Docs, Sheets, Slides) |
| | `admin-office-onlyoffice` | OnlyOffice |
| | `admin-office-other` | Other - please specify *(custom)* |
| **Communication & Scheduling** | `admin-comms-google-meet` | Google Meet |
| | `admin-comms-zoom` | Zoom |
| | `admin-comms-teams` | Microsoft Teams |
| | `admin-comms-slack` | Slack |
| | `admin-comms-other` | Other - please specify *(custom)* |
| **Document Management** | `admin-doc-google-drive` | Google Drive |
| | `admin-doc-docusign` | DocuSign |
| | `admin-doc-bluebeam` | Bluebeam Revu |
| | `admin-doc-other` | Other - please specify *(custom)* |
| **HR & Personnel** | `admin-hr-breathe` | Breathe HR |
| | `admin-hr-bamboo` | BambooHR |
| | `admin-hr-other` | Other - please specify *(custom)* |
| **Finance & Accounting** | `admin-finance-xero` | Xero |
| | `admin-finance-sage` | Sage |
| | `admin-finance-quickbooks` | QuickBooks |
| | `admin-finance-other` | Other - please specify *(custom)* |
| **CRM & Client Management** | `admin-crm-salesforce` | Salesforce |
| | `admin-crm-hubspot` | HubSpot |
| | `admin-crm-other` | Other - please specify *(custom)* |
| **IT Support & Helpdesk** | `admin-it-freshdesk` | Freshdesk |
| | `admin-it-zendesk` | Zendesk |
| | `admin-it-teamviewer` | TeamViewer |
| | `admin-it-other` | Other - please specify *(custom)* |
| **AI Platforms** | `admin-ai-gemini` | Gemini/Notebook LM |
| | `admin-ai-other` | Other - please specify *(custom)* |

---

### DISCIPLINE: Architecture (`architecture`)

| Category | Software ID | Software Name |
|----------|-------------|---------------|
| **BIM/Modelling Tools** | `arch-bim-revit` | Autodesk Revit |
| | `arch-bim-forma` | Autodesk Forma |
| | `arch-bim-sketchup` | SketchUp Pro |
| | `arch-bim-other` | Other - please specify *(custom)* |
| **Visualisation & Rendering** | `arch-viz-enscape` | Enscape |
| | `arch-viz-twinmotion` | Twinmotion |
| | `arch-viz-other` | Other - please specify *(custom)* |
| **Computational Design** | `arch-comp-dynamo` | Dynamo (Revit) |
| | `arch-comp-pyrevit` | pyRevit |
| | `arch-comp-other` | Other - please specify *(custom)* |
| **Building Physics & Compliance** | `arch-physics-builddesk` | BuildDesk U (U-Value/Thermal) |
| | `arch-physics-other` | Other - please specify *(custom)* |
| **Documentation & Drawing** | `arch-doc-autocad` | AutoCAD |
| | `arch-doc-bluebeam` | Bluebeam Revu |
| | `arch-doc-gimp` | Affinity Suite |
| | `arch-doc-other` | Other - please specify *(custom)* |
| **Specification & Schedules** | `arch-spec-nbs-chorus` | NBS Chorus |
| | `arch-spec-other` | Other - please specify *(custom)* |
| **Collaboration & CDE** | `arch-collab-acc` | Autodesk Construction Cloud (ACC/BIM 360) |
| | `arch-collab-other` | Other - please specify *(custom)* |
| **Productivity & Office Suite** | `arch-office-google` | Google Workspace (Docs, Sheets, Slides) |
| | `arch-office-onlyoffice` | OnlyOffice |
| | `arch-office-other` | Other - please specify *(custom)* |
| **AI Platforms** | `arch-ai-gemini` | Gemini/Notebook LM |
| | `arch-ai-other` | Other - please specify *(custom)* |

---

### DISCIPLINE: Building Services Engineering (`building-services-engineering`)

| Category | Software ID | Software Name |
|----------|-------------|---------------|
| **BIM/Modelling** | `mep-bim-revit` | Revit MEP |
| | `mep-bim-autocad` | AutoCAD MEP |
| | `mep-bim-fabrication` | Autodesk Fabrication |
| | `mep-bim-magicad` | MagiCAD |
| | `mep-bim-other` | Other - please specify *(custom)* |
| **Analysis & Calculation** | `mep-analysis-insight` | Autodesk Insight |
| | `mep-analysis-ies` | IES Virtual Environment (IES VE) |
| | `mep-analysis-hevacomp` | Hevacomp |
| | `mep-analysis-dialux` | Dialux (lighting) |
| | `mep-analysis-relux` | Relux (lighting) |
| | `mep-analysis-amtech` | AmTech (electrical) |
| | `mep-analysis-trimble` | Trimble ProDesign |
| | `mep-analysis-electricalom` | ElectricalOM (BS 7671) |
| | `mep-analysis-other` | Other - please specify *(custom)* |
| **CFD & Thermal** | `mep-cfd-cfd` | Autodesk CFD |
| | `mep-cfd-ies` | IES VE |
| | `mep-cfd-tas` | TAS (EDSL) |
| | `mep-cfd-designbuilder` | DesignBuilder |
| | `mep-cfd-other` | Other - please specify *(custom)* |
| **Specification & Documentation** | `mep-spec-nbs-chorus` | NBS Chorus |
| | `mep-spec-bluebeam` | Bluebeam Revu |
| | `mep-spec-other` | Other - please specify *(custom)* |
| **Collaboration & CDE** | `mep-collab-acc` | Autodesk Construction Cloud (ACC/BIM 360) |
| | `mep-collab-other` | Other - please specify *(custom)* |
| **Productivity & Office Suite** | `mep-office-google` | Google Workspace (Docs, Sheets, Slides) |
| | `mep-office-onlyoffice` | OnlyOffice |
| | `mep-office-other` | Other - please specify *(custom)* |
| **AI Platforms** | `mep-ai-gemini` | Gemini/Notebook LM |
| | `mep-ai-other` | Other - please specify *(custom)* |

---

### DISCIPLINE: Building Surveying (`building-surveying`)

| Category | Software ID | Software Name |
|----------|-------------|---------------|
| **Survey & Measurement** | `bs-survey-revit` | Revit |
| | `bs-survey-autocad` | AutoCAD |
| | `bs-survey-recap` | Autodesk ReCap |
| | `bs-survey-leica` | Leica Cyclone |
| | `bs-survey-faro` | Faro Scene |
| | `bs-survey-other` | Other - please specify *(custom)* |
| **Condition Assessment** | `bs-condition-kykloud` | Kykloud |
| | `bs-condition-monitoring` | Condition Monitoring Software |
| | `bs-condition-other` | Other - please specify *(custom)* |
| **Documentation** | `bs-doc-bluebeam` | Bluebeam Revu |
| | `bs-doc-gimp` | Affinity Suite |
| | `bs-doc-other` | Other - please specify *(custom)* |
| **Building Pathology** | `bs-pathology-snagr` | Snag R |
| | `bs-pathology-other` | Other - please specify *(custom)* |
| **Specification & Standards** | `bs-spec-nbs-chorus` | NBS Chorus |
| | `bs-spec-other` | Other - please specify *(custom)* |
| **Contracts & Scheduling** | `bs-contracts-jct` | JCT Contracts (JCT On Demand) |
| | `bs-contracts-docusign` | DocuSign |
| | `bs-contracts-gantter` | Gantter |
| | `bs-contracts-other` | Other - please specify *(custom)* |
| **Collaboration & CDE** | `bs-collab-acc` | Autodesk Construction Cloud (ACC) |
| | `bs-collab-other` | Other - please specify *(custom)* |
| **Productivity & Office Suite** | `bs-office-google` | Google Workspace (Docs, Sheets, Slides) |
| | `bs-office-onlyoffice` | OnlyOffice |
| | `bs-office-other` | Other - please specify *(custom)* |
| **AI Platforms** | `bs-ai-gemini` | Gemini/Notebook LM |
| | `bs-ai-other` | Other - please specify *(custom)* |

---

### DISCIPLINE: CDM/Principal Designer (`cdm-principal-designer`)

| Category | Software ID | Software Name |
|----------|-------------|---------------|
| **CDM & Health and Safety Management** | `cdm-hsm-fieldview` | Fieldview |
| | `cdm-hsm-safetyculture` | SafetyCulture (iAuditor) |
| | `cdm-hsm-siteassist` | SiteAssist |
| | `cdm-hsm-other` | Other - please specify *(custom)* |
| **Documentation & Drawing Review** | `cdm-doc-bluebeam` | Bluebeam Revu |
| | `cdm-doc-autocad` | AutoCAD |
| | `cdm-doc-gimp` | Affinity Suite |
| | `cdm-doc-other` | Other - please specify *(custom)* |
| **BIM Coordination** | `cdm-bim-navisworks` | Autodesk Navisworks |
| | `cdm-bim-revit` | Revit |
| | `cdm-bim-other` | Other - please specify *(custom)* |
| **Risk Management** | `cdm-risk-procore` | Procore |
| | `cdm-risk-other` | Other - please specify *(custom)* |
| **Collaboration & CDE** | `cdm-collab-acc` | Autodesk Construction Cloud (ACC) |
| | `cdm-collab-other` | Other - please specify *(custom)* |
| **Productivity & Office Suite** | `cdm-office-google` | Google Workspace (Docs, Sheets, Slides) |
| | `cdm-office-onlyoffice` | OnlyOffice |
| | `cdm-office-other` | Other - please specify *(custom)* |
| **AI Platforms** | `cdm-ai-gemini` | Gemini/Notebook LM |
| | `cdm-ai-other` | Other - please specify *(custom)* |

---

### DISCIPLINE: Fire Engineering (`fire-engineering`)

| Category | Software ID | Software Name |
|----------|-------------|---------------|
| **Fire Simulation & Egress** | `fire-sim-pyrosim` | PyroSim (FDS interface) |
| | `fire-sim-pathfinder` | Pathfinder |
| | `fire-sim-other` | Other - please specify *(custom)* |
| **Documentation & Drawing** | `fire-doc-autocad` | AutoCAD |
| | `fire-doc-bluebeam` | Bluebeam Revu |
| | `fire-doc-other` | Other - please specify *(custom)* |
| **Collaboration & CDE** | `fire-collab-acc` | Autodesk Construction Cloud (ACC) |
| | `fire-collab-other` | Other - please specify *(custom)* |
| **Productivity & Office Suite** | `fire-office-google` | Google Workspace (Docs, Sheets, Slides) |
| | `fire-office-onlyoffice` | OnlyOffice |
| | `fire-office-other` | Other - please specify *(custom)* |
| **AI Platforms** | `fire-ai-gemini` | Gemini/Notebook LM |
| | `fire-ai-other` | Other - please specify *(custom)* |

---

### DISCIPLINE: Project Management (`project-management`)

| Category | Software ID | Software Name |
|----------|-------------|---------------|
| **Project Management Software** | `pm-software-procore` | Procore |
| | `pm-software-asite` | Asite |
| | `pm-software-viewpoint` | Viewpoint |
| | `pm-software-msproject` | Microsoft Project |
| | `pm-software-primavera` | Primavera P6 |
| | `pm-software-asta` | Asta Powerproject |
| | `pm-software-monday` | Monday.com |
| | `pm-software-asana` | Asana |
| | `pm-software-gantter` | Gantter |
| | `pm-software-other` | Other - please specify *(custom)* |
| **Documentation** | `pm-doc-bluebeam` | Bluebeam Revu |
| | `pm-doc-other` | Other - please specify *(custom)* |
| **Collaboration & CDE** | `pm-collab-acc` | Autodesk Construction Cloud (ACC/BIM 360) |
| | `pm-collab-aconex` | Aconex |
| | `pm-collab-4projects` | 4Projects |
| | `pm-collab-other` | Other - please specify *(custom)* |
| **Productivity & Office Suite** | `pm-office-google` | Google Workspace (Docs, Sheets, Slides) |
| | `pm-office-onlyoffice` | OnlyOffice |
| | `pm-office-other` | Other - please specify *(custom)* |
| **AI Platforms** | `pm-ai-gemini` | Gemini/Notebook LM |
| | `pm-ai-other` | Other - please specify *(custom)* |

---

### DISCIPLINE: Interior Design (`interior-design`)

| Category | Software ID | Software Name |
|----------|-------------|---------------|
| **Design & Modelling** | `int-design-revit` | Revit |
| | `int-design-autocad` | AutoCAD |
| | `int-design-forma` | Autodesk Forma |
| | `int-design-sketchup` | SketchUp Pro |
| | `int-design-other` | Other - please specify *(custom)* |
| **Visualisation** | `int-viz-enscape` | Enscape |
| | `int-viz-twinmotion` | Twinmotion |
| | `int-viz-other` | Other - please specify *(custom)* |
| **Revit Add-ins** | `int-addins-pyrevit` | pyRevit |
| | `int-addins-other` | Other - please specify *(custom)* |
| **Specification & FF&E** | `int-spec-nbs-chorus` | NBS Chorus |
| | `int-spec-werkspot` | Werkspot |
| | `int-spec-other` | Other - please specify *(custom)* |
| **Graphics** | `int-graphics-gimp` | Affinity Suite |
| | `int-graphics-canva` | Canva |
| | `int-graphics-other` | Other - please specify *(custom)* |
| **Collaboration & CDE** | `int-collab-acc` | Autodesk Construction Cloud (ACC) |
| | `int-collab-other` | Other - please specify *(custom)* |
| **Productivity & Office Suite** | `int-office-google` | Google Workspace (Docs, Sheets, Slides) |
| | `int-office-onlyoffice` | OnlyOffice |
| | `int-office-other` | Other - please specify *(custom)* |
| **AI Platforms** | `int-ai-gemini` | Gemini/Notebook LM |
| | `int-ai-other` | Other - please specify *(custom)* |

---

### DISCIPLINE: Quantity Surveying (`quantity-surveying`)

| Category | Software ID | Software Name |
|----------|-------------|---------------|
| **Measurement & Takeoff** | `qs-measure-navisworks` | Autodesk Navisworks |
| | `qs-measure-costx` | CostX |
| | `qs-measure-bluebeam` | Bluebeam Revu |
| | `qs-measure-other` | Other - please specify *(custom)* |
| **BIM/5D** | `qs-bim-revit` | Revit |
| | `qs-bim-acc` | Autodesk Construction Cloud (ACC/BIM 360) |
| | `qs-bim-other` | Other - please specify *(custom)* |
| **Specification & Contracts** | `qs-spec-nbs-chorus` | NBS Chorus |
| | `qs-spec-docusign` | DocuSign |
| | `qs-spec-other` | Other - please specify *(custom)* |
| **Collaboration & CDE** | `qs-collab-acc` | Autodesk Construction Cloud (ACC) |
| | `qs-collab-other` | Other - please specify *(custom)* |
| **Productivity & Office Suite** | `qs-office-google` | Google Workspace (Docs, Sheets, Slides) |
| | `qs-office-onlyoffice` | OnlyOffice |
| | `qs-office-other` | Other - please specify *(custom)* |
| **AI Platforms** | `qs-ai-gemini` | Gemini/Notebook LM |
| | `qs-ai-other` | Other - please specify *(custom)* |

---

### DISCIPLINE: Structural and Civil Engineering (`structural-civil-engineering`)

| Category | Software ID | Software Name |
|----------|-------------|---------------|
| **Structural Analysis & Design** | `struct-analysis-robot` | Robot Structural Analysis |
| | `struct-analysis-tekla-designer` | Tekla Structural Designer |
| | `struct-analysis-tedds` | Tedds |
| | `struct-analysis-other` | Other - please specify *(custom)* |
| **BIM/Modelling** | `struct-bim-revit` | Revit Structure |
| | `struct-bim-autocad` | AutoCAD |
| | `struct-bim-advance-steel` | Autodesk Advance Steel |
| | `struct-bim-tekla` | Tekla Structures |
| | `struct-bim-other` | Other - please specify *(custom)* |
| **Civil Design** | `struct-civil-civil3d` | Autodesk Civil 3D |
| | `struct-civil-infraworks` | Autodesk InfraWorks |
| | `struct-civil-other` | Other - please specify *(custom)* |
| **Specification & Standards** | `struct-spec-nbs-chorus` | NBS Chorus |
| | `struct-spec-bluebeam` | Bluebeam Revu |
| | `struct-spec-other` | Other - please specify *(custom)* |
| **Collaboration & CDE** | `struct-collab-acc` | Autodesk Construction Cloud (ACC/BIM 360) |
| | `struct-collab-other` | Other - please specify *(custom)* |
| **Productivity & Office Suite** | `struct-office-google` | Google Workspace (Docs, Sheets, Slides) |
| | `struct-office-onlyoffice` | OnlyOffice |
| | `struct-office-other` | Other - please specify *(custom)* |
| **AI Platforms** | `struct-ai-gemini` | Gemini/Notebook LM |
| | `struct-ai-other` | Other - please specify *(custom)* |

---

### DISCIPLINE: Town Planning (`town-planning`)

| Category | Software ID | Software Name |
|----------|-------------|---------------|
| **GIS & Mapping** | `plan-gis-google-earth` | Google Earth Pro |
| | `plan-gis-qgis` | QGIS |
| | `plan-gis-magicmaps` | Magic Maps |
| | `plan-gis-mapinfo` | MapInfo |
| | `plan-gis-other` | Other - please specify *(custom)* |
| **3D Visualisation** | `plan-3d-forma` | Autodesk Forma |
| | `plan-3d-sketchup` | SketchUp Pro |
| | `plan-3d-other` | Other - please specify *(custom)* |
| **Document Management** | `plan-doc-bluebeam` | Bluebeam Revu |
| | `plan-doc-other` | Other - please specify *(custom)* |
| **Graphics & Presentation** | `plan-graphics-gimp` | Affinity Suite |
| | `plan-graphics-other` | Other - please specify *(custom)* |
| **Collaboration & CDE** | `plan-collab-acc` | Autodesk Construction Cloud (ACC) |
| | `plan-collab-other` | Other - please specify *(custom)* |
| **Productivity & Office Suite** | `plan-office-google` | Google Workspace (Docs, Sheets, Slides) |
| | `plan-office-onlyoffice` | OnlyOffice |
| | `plan-office-other` | Other - please specify *(custom)* |
| **AI Platforms** | `plan-ai-gemini` | Gemini/Notebook LM |
| | `plan-ai-other` | Other - please specify *(custom)* |

---

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

### 6. SOFTWARE DISCOVERY: CUSTOM "OTHER" ENTRIES

**This section is critical for identifying software tools the IIET Committee may not have considered.**

#### 6.1 Identifying Custom Entries

To extract custom "Other" entries from the data:

1. **Filter by Software ID**: Any `softwareId` ending in `-other` indicates a custom entry
2. **Check `customName` field**: This contains the user-specified software name
3. **Cross-reference**: Compare against the predefined software lists in this document

#### 6.2 Required Analysis

**Table: All Custom Software Entries**
Create a comprehensive table with:

| Custom Software Name | Discipline | Usage Status | Respondent Count | Category |
|---------------------|------------|--------------|------------------|----------|
| [From customName]   | [discipline] | [currently-using/used-previously/would-like-to-use] | [count] | [inferred category] |

**Group custom entries by:**
- **Currently Using** - Staff are already using these tools (highest priority to investigate)
- **Would Like to Use** - Demand signal for new tools
- **Previously Used** - Tools staff have experience with

#### 6.3 Discovery Insights

For each unique custom software entry, provide:

1. **What is it?** - Brief description of the software (research if needed)
2. **Who mentioned it?** - Which disciplines/roles
3. **Usage context** - Currently using, previously used, or want to use
4. **Frequency/Satisfaction** (if currently using) - How often and how satisfied
5. **Strategic relevance** - Could this benefit other staff? Should we evaluate it?

#### 6.4 Actionable Outputs

**High Priority Discoveries** [Must investigate]
- Custom software currently being used by multiple respondents
- Custom software with high satisfaction scores
- Custom software requested across multiple disciplines

**Medium Priority Discoveries** [Worth evaluating]
- Custom software with "significant benefit" expected
- Custom software from senior staff (executives, senior associates)
- Tools that could replace existing low-satisfaction software

**Low Priority / Monitor**
- Single mentions
- Very niche/discipline-specific tools
- Personal preference tools

#### 6.5 Recommendations for Software Catalog

Based on custom entries, recommend:
1. Software to ADD to future surveys (frequently mentioned)
2. Software to EVALUATE for company-wide provision
3. Software to RESEARCH further (unclear benefit)
4. Training opportunities (staff using tools company doesn't support)

> **KEY INSIGHT BOX**: Summarize the most surprising or valuable discoveries from custom entries. What tools did staff reveal that the IIET Committee hadn't considered? What gaps does this expose in current software provision?

### 7. GENERAL SATISFACTION ANALYSIS

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

### 8. DISCIPLINE-SPECIFIC INSIGHTS

Create a mini-report for each discipline covering:
- Response count
- Most used software
- Top training needs
- Satisfaction highlights and concerns
- Software demand
- Key quotes/feedback

### 9. CROSS-CUTTING INSIGHTS

#### 9.1 Software Ecosystem Health
- Overall adoption consistency
- Integration pain points
- Training infrastructure assessment
- Support effectiveness

#### 9.2 Regional Analysis
- Office-by-office comparison
- Regional patterns or anomalies

#### 9.3 Role Level Patterns
- How software needs differ by seniority
- Training investment by career stage

### 10. STRATEGIC RECOMMENDATIONS

#### 10.1 Immediate Actions (0-3 months)
- Critical training interventions
- Quick wins
- Urgent issues to address

#### 10.2 Short-term Initiatives (3-12 months)
- Software procurement priorities
- Training program development
- Support improvements

#### 10.3 Long-term Strategy (1-3 years)
- Technology roadmap considerations
- Standardization opportunities
- Investment priorities

### 11. APPENDICES

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
- **Custom "Other" entries being used daily** - staff relying on unsupported tools
- **Same custom software mentioned by multiple respondents** - indicates unmet need

### Success Stories to Highlight
- Software with satisfaction > 4.5
- Software with "very confident" > 60% of users
- Positive feedback themes
- Effective transitions (superseded software)
- **Custom software with high satisfaction** - potential for wider adoption

### Custom Entry Analysis Priorities
1. **Aggregate all custom entries** - Create a master list of all unique `customName` values
2. **De-duplicate and normalize** - "MS Project" and "Microsoft Project" are the same
3. **Cross-reference with predefined list** - Ensure it's truly a new entry
4. **Categorize by potential value** - High/Medium/Low priority for investigation
5. **Research unknown tools** - Briefly describe what each custom software does

---

## OUTPUT FORMAT: GITHUB PAGES WEB DASHBOARD

**IMPORTANT**: Instead of generating a text report, you must create a complete, production-ready GitHub Pages web dashboard that presents the survey analysis as an interactive, professional data visualization platform.

### Deliverable Structure

Generate a complete GitHub repository structure with all necessary files:

```
survey-report-dashboard/
├── index.html                 # Main dashboard entry point
├── css/
│   └── styles.css            # All custom styles following design system
├── js/
│   ├── app.js                # Main application logic
│   ├── data.js               # Processed survey data as JavaScript objects
│   ├── charts.js             # Chart rendering functions
│   └── navigation.js         # Section navigation handling
├── pages/
│   ├── executive-summary.html
│   ├── demographics.html
│   ├── software-usage.html
│   ├── satisfaction.html
│   ├── training-needs.html
│   ├── software-churn.html
│   ├── software-demand.html
│   ├── software-discovery.html
│   ├── general-feedback.html
│   ├── discipline-insights.html
│   ├── cross-cutting.html
│   ├── recommendations.html
│   └── appendices.html
├── assets/
│   └── logo.svg              # Bailey Partnership logo placeholder
└── README.md                 # Deployment instructions
```

---

## DESIGN SYSTEM SPECIFICATIONS

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-background` | `#FFFFFF` | Page background, card backgrounds |
| `--color-primary-band` | `#143644` | Header bands, section dividers, navigation |
| `--color-accent` | `#d1c800` | Key metric highlights, call-to-action backgrounds, status badges |
| `--color-text-primary` | `#1a1a1a` | Body text, headings |
| `--color-text-secondary` | `#666666` | Secondary text, labels |
| `--color-text-inverse` | `#FFFFFF` | Text on dark backgrounds |
| `--color-border` | `#e5e5e5` | Table borders, card borders |
| `--color-success` | `#22c55e` | Positive indicators |
| `--color-warning` | `#f59e0b` | Warning indicators |
| `--color-danger` | `#ef4444` | Critical/negative indicators |

### Typography

```css
:root {
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Type Scale */
  --text-h1: 2rem;      /* 32px - Page titles */
  --text-h2: 1.5rem;    /* 24px - Section headings */
  --text-h3: 1.25rem;   /* 20px - Subsection headings */
  --text-body: 1rem;    /* 16px - Normal text */
  --text-small: 0.875rem; /* 14px - Labels, captions */
  --text-micro: 0.75rem;  /* 12px - Metadata */

  /* Font Weights */
  --weight-normal: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
}
```

### Typography Hierarchy

| Level | Style | Usage |
|-------|-------|-------|
| **Heading 1** | 32px, Bold, `#143644` | Page titles only |
| **Heading 2** | 24px, Semibold, `#1a1a1a` | Major section headings (1.0, 2.0) |
| **Heading 3** | 20px, Medium, `#1a1a1a` | Subsection headings (1.1, 1.2) |
| **Normal Text** | 16px, Regular, `#1a1a1a` | Body content |
| **Small Text** | 14px, Regular, `#666666` | Labels, table headers |

---

## LAYOUT COMPONENTS

### 1. Top Metadata Bar

A fixed-position bar at the top of every page displaying report metadata:

```html
<header class="metadata-bar">
  <div class="metadata-bar__inner">
    <div class="metadata-item">
      <span class="metadata-label">Report</span>
      <span class="metadata-value">IIET Software Survey Analysis</span>
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Job No.</span>
      <span class="metadata-value">IIET-2026-001</span>
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Date</span>
      <span class="metadata-value">[Generated Date]</span>
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Status</span>
      <span class="metadata-badge metadata-badge--approved">Final</span>
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Responses</span>
      <span class="metadata-value">[N] of [Total]</span>
    </div>
  </div>
</header>
```

Style the metadata bar with `background: #143644` and white text.

### 2. Decimal Navigation System

Implement a sidebar navigation using decimal numbering that mirrors formal technical reports:

```html
<nav class="nav-sidebar">
  <div class="nav-section">
    <a href="#1.0" class="nav-link nav-link--section">1.0 Executive Summary</a>
  </div>
  <div class="nav-section">
    <a href="#2.0" class="nav-link nav-link--section">2.0 Response Demographics</a>
    <a href="#2.1" class="nav-link nav-link--subsection">2.1 By Discipline</a>
    <a href="#2.2" class="nav-link nav-link--subsection">2.2 By Role Level</a>
    <a href="#2.3" class="nav-link nav-link--subsection">2.3 By Office</a>
  </div>
  <div class="nav-section">
    <a href="#3.0" class="nav-link nav-link--section">3.0 Software Usage</a>
    <a href="#3.1" class="nav-link nav-link--subsection">3.1 Currently Used</a>
    <a href="#3.2" class="nav-link nav-link--subsection">3.2 Satisfaction</a>
    <a href="#3.3" class="nav-link nav-link--subsection">3.3 Training Needs</a>
  </div>
  <div class="nav-section">
    <a href="#4.0" class="nav-link nav-link--section">4.0 Software Churn</a>
  </div>
  <div class="nav-section">
    <a href="#5.0" class="nav-link nav-link--section">5.0 Software Demand</a>
  </div>
  <div class="nav-section">
    <a href="#6.0" class="nav-link nav-link--section">6.0 Software Discovery</a>
  </div>
  <div class="nav-section">
    <a href="#7.0" class="nav-link nav-link--section">7.0 General Satisfaction</a>
  </div>
  <div class="nav-section">
    <a href="#8.0" class="nav-link nav-link--section">8.0 Discipline Insights</a>
  </div>
  <div class="nav-section">
    <a href="#9.0" class="nav-link nav-link--section">9.0 Cross-Cutting Insights</a>
  </div>
  <div class="nav-section">
    <a href="#10.0" class="nav-link nav-link--section">10.0 Recommendations</a>
    <a href="#10.1" class="nav-link nav-link--subsection">10.1 Immediate (0-3mo)</a>
    <a href="#10.2" class="nav-link nav-link--subsection">10.2 Short-term (3-12mo)</a>
    <a href="#10.3" class="nav-link nav-link--subsection">10.3 Long-term (1-3yr)</a>
  </div>
  <div class="nav-section">
    <a href="#11.0" class="nav-link nav-link--section">11.0 Appendices</a>
  </div>
</nav>
```

### 3. Section Headers

Each section must have a consistent header with decimal numbering:

```html
<section id="3.0" class="report-section">
  <div class="section-band">
    <span class="section-number">3.0</span>
    <h2 class="section-title">Software Usage Analysis</h2>
  </div>
  <div class="section-content">
    <!-- Content here -->
  </div>
</section>
```

Style `.section-band` with `background: #143644`, padding, and white text.

### 4. Data Widget Grid System

Create flexible widget containers for data display:

```html
<!-- Two-column horizontal layout -->
<div class="widget-grid widget-grid--2col">
  <div class="widget">
    <div class="widget__header">
      <h3 class="widget__title">Software by Usage Count</h3>
    </div>
    <div class="widget__body">
      <!-- Chart or table -->
    </div>
  </div>
  <div class="widget">
    <div class="widget__header">
      <h3 class="widget__title">Satisfaction Distribution</h3>
    </div>
    <div class="widget__body">
      <!-- Chart or table -->
    </div>
  </div>
</div>

<!-- Full-width widget -->
<div class="widget widget--full">
  <div class="widget__header">
    <h3 class="widget__title">Software Usage Heatmap by Discipline</h3>
  </div>
  <div class="widget__body">
    <!-- Large visualization -->
  </div>
</div>

<!-- Two-column vertical stack -->
<div class="widget-grid widget-grid--2col-stack">
  <div class="widget-column">
    <div class="widget"><!-- Widget 1 --></div>
    <div class="widget"><!-- Widget 2 --></div>
  </div>
  <div class="widget-column">
    <div class="widget widget--tall"><!-- Tall widget --></div>
  </div>
</div>
```

### 5. Key Metric Cards

For highlighting important statistics, use accent-colored metric cards:

```html
<div class="metric-row">
  <div class="metric-card">
    <span class="metric-card__value">78%</span>
    <span class="metric-card__label">Response Rate</span>
  </div>
  <div class="metric-card metric-card--accent">
    <span class="metric-card__value">4.2</span>
    <span class="metric-card__label">Avg Satisfaction</span>
  </div>
  <div class="metric-card">
    <span class="metric-card__value">23</span>
    <span class="metric-card__label">Training Gaps Identified</span>
  </div>
  <div class="metric-card metric-card--warning">
    <span class="metric-card__value">7</span>
    <span class="metric-card__label">Critical Issues</span>
  </div>
</div>
```

Use `background: #d1c800` with dark text for `.metric-card--accent`.

### 6. Data Tables

Tables must follow a consistent, professional style:

```html
<div class="data-table-wrapper">
  <table class="data-table">
    <thead>
      <tr>
        <th class="data-table__header">Software</th>
        <th class="data-table__header data-table__header--numeric">Users</th>
        <th class="data-table__header data-table__header--numeric">Avg Satisfaction</th>
        <th class="data-table__header data-table__header--numeric">Training Score</th>
        <th class="data-table__header">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="data-table__cell">Autodesk Revit</td>
        <td class="data-table__cell data-table__cell--numeric">45</td>
        <td class="data-table__cell data-table__cell--numeric">4.2</td>
        <td class="data-table__cell data-table__cell--numeric">12</td>
        <td class="data-table__cell">
          <span class="status-badge status-badge--success">Good</span>
        </td>
      </tr>
      <!-- More rows -->
    </tbody>
  </table>
</div>
```

Table headers should be **bold** with `background: #f5f5f5` and `border-bottom: 2px solid #143644`.

### 7. Insight Callout Boxes

For highlighting key findings:

```html
<div class="insight-box insight-box--highlight">
  <div class="insight-box__icon">💡</div>
  <div class="insight-box__content">
    <strong>Key Finding:</strong> 67% of Architecture staff report needing additional Revit training,
    despite it being the most-used software in the discipline.
  </div>
</div>

<div class="insight-box insight-box--warning">
  <div class="insight-box__icon">⚠️</div>
  <div class="insight-box__content">
    <strong>Action Required:</strong> AutoCAD satisfaction dropped below 3.0 across
    Building Surveying and CDM disciplines.
  </div>
</div>

<div class="insight-box insight-box--recommendation">
  <div class="insight-box__priority">[HIGH]</div>
  <div class="insight-box__content">
    Implement Revit training program for Architecture team within Q1.
  </div>
</div>
```

---

## CHART SPECIFICATIONS

Use Chart.js (via CDN) for all visualizations. Maintain consistent styling:

### Chart Color Palette

```javascript
const chartColors = {
  primary: '#143644',
  accent: '#d1c800',
  secondary: '#4a7c8c',
  tertiary: '#7ba3b0',
  quaternary: '#a8c5ce',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  neutral: '#9ca3af'
};
```

### Required Chart Types

1. **Bar Charts** - Software usage counts, satisfaction comparisons
2. **Horizontal Bar Charts** - Ranked lists, adoption rates
3. **Pie/Doughnut Charts** - Distribution breakdowns (discipline, role level)
4. **Stacked Bar Charts** - Agreement scale distributions
5. **Scatter Plots** - Frequency vs. satisfaction analysis
6. **Heatmaps** - Software × Discipline usage matrix (use HTML table with background colors)

### Chart Styling Requirements

```javascript
const chartDefaults = {
  font: {
    family: "'Inter', sans-serif",
    size: 12
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        usePointStyle: true
      }
    },
    title: {
      display: false // Use widget headers instead
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#666666'
      }
    },
    y: {
      grid: {
        color: '#e5e5e5'
      },
      ticks: {
        color: '#666666'
      }
    }
  }
};
```

---

## INTERACTIVE FEATURES

### 1. Discipline Filter

Add a global filter to view data by discipline:

```html
<div class="filter-bar">
  <label class="filter-label">Filter by Discipline:</label>
  <select id="discipline-filter" class="filter-select">
    <option value="all">All Disciplines</option>
    <option value="architecture">Architecture</option>
    <option value="building-services-engineering">Building Services Engineering</option>
    <!-- All 11 disciplines -->
  </select>
</div>
```

### 2. Sortable Tables

Make tables sortable by clicking column headers:

```javascript
// Add data-sort attribute to headers
// Implement click-to-sort functionality
```

### 3. Expandable Detail Sections

For long tables or detailed breakdowns:

```html
<div class="expandable-section">
  <button class="expandable-trigger" aria-expanded="false">
    <span>View all 45 software items</span>
    <svg class="expand-icon"><!-- Chevron --></svg>
  </button>
  <div class="expandable-content" hidden>
    <!-- Full table -->
  </div>
</div>
```

### 4. Print Stylesheet

Include print-optimized styles:

```css
@media print {
  .nav-sidebar,
  .filter-bar,
  .expandable-trigger {
    display: none;
  }

  .report-section {
    page-break-inside: avoid;
  }

  .section-band {
    background: #143644 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

---

## DATA STRUCTURE

Process the CSV data into JavaScript objects in `data.js`:

```javascript
const surveyData = {
  metadata: {
    totalResponses: 0,
    generatedDate: '',
    surveyPeriod: ''
  },

  demographics: {
    byDiscipline: [
      { discipline: 'Architecture', count: 0, percentage: 0 }
    ],
    byRoleLevel: [...],
    byOffice: [...]
  },

  softwareUsage: {
    currentlyUsing: [
      {
        softwareId: '',
        softwareName: '',
        userCount: 0,
        avgSatisfaction: 0,
        avgFrequency: 0,
        trainingNeedScore: 0,
        byDiscipline: {}
      }
    ],
    previouslyUsed: [...],
    wouldLikeToUse: [...]
  },

  customEntries: [
    {
      customName: '',
      discipline: '',
      usageStatus: '',
      count: 0,
      category: ''
    }
  ],

  generalFeedback: {
    overallSatisfaction: { avg: 0, distribution: [] },
    trainingResources: { netScore: 0, distribution: [] },
    itSupport: { netScore: 0, distribution: [] },
    softwareIntegration: { netScore: 0, distribution: [] }
  },

  insights: {
    redFlags: [],
    successStories: [],
    recommendations: {
      immediate: [],
      shortTerm: [],
      longTerm: []
    }
  }
};
```

---

## FILE OUTPUT REQUIREMENTS

Generate **complete, working code** for each file. Do not use placeholders or "// implement here" comments. Every function must be fully implemented.

### index.html

Complete HTML document with:
- Proper DOCTYPE and meta tags
- CSS link to styles.css
- Chart.js CDN link
- Google Fonts link for Inter
- Complete navigation sidebar
- All section content
- Script tags for all JS files

### css/styles.css

Complete stylesheet with:
- CSS custom properties (variables)
- Base reset styles
- Typography styles
- All component styles (metadata bar, navigation, widgets, tables, cards, etc.)
- Chart container styles
- Responsive breakpoints
- Print styles

### js/data.js

Complete data file with:
- All processed survey data
- Calculated metrics and aggregations
- Pre-computed chart datasets

### js/app.js

Complete application logic with:
- DOM ready initialization
- Filter functionality
- Table sorting
- Expandable sections
- Any other interactive features

### js/charts.js

Complete chart rendering with:
- Chart.js initialization
- All chart configurations
- Render functions for each chart type

### js/navigation.js

Complete navigation handling with:
- Active state management
- Smooth scrolling
- Section highlighting on scroll

---

## DEPLOYMENT INSTRUCTIONS

Include in README.md:

```markdown
# Bailey Partnership Software Survey Dashboard

## Deployment to GitHub Pages

1. Create a new GitHub repository
2. Upload all files maintaining the folder structure
3. Go to Settings > Pages
4. Select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click Save
7. Dashboard will be available at: https://[username].github.io/[repo-name]/

## Local Preview

Open `index.html` in a web browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

## Updating Data

To update with new survey responses:
1. Export new CSV from Google Sheets
2. Process data and update `js/data.js`
3. Commit and push changes
```

---

## DATA INPUT

The survey response data is provided below in CSV format. Analyze this data according to all specifications above and generate the complete GitHub Pages web dashboard with all files.

**IMPORTANT**: Generate actual, complete, working code. Do not abbreviate or use placeholders. Every file must be production-ready and deployable.

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
4. Consider anonymizing names/emails before processing

### Deployment Workflow

1. **Generate Dashboard**: Run this prompt with your CSV data
2. **Download Files**: Save all generated files maintaining the folder structure
3. **Create Repository**: Create a new GitHub repository (e.g., `bailey-software-survey-2026`)
4. **Upload Files**: Push all files to the repository
5. **Enable GitHub Pages**: Settings → Pages → Deploy from main branch
6. **Share URL**: Distribute the dashboard URL to stakeholders

### Customization Options

After generation, you can:
- Modify colors in CSS custom properties
- Add Bailey Partnership logo to `assets/logo.svg`
- Adjust chart configurations in `js/charts.js`
- Update metadata in the top bar

### Best Practices

1. **Use Claude Opus** for best code generation capability
2. **Upload CSV directly** rather than pasting for large datasets
3. **Review generated code** before deployment
4. **Test locally** before pushing to GitHub Pages
5. **Version control** by creating dated branches for each survey period

### Example Follow-up Prompts

After receiving the initial dashboard:
- "Add a comparison view for this year vs. last year's data"
- "Create a separate page for executive presentation view"
- "Add data export buttons to download charts as PNG"
- "Implement dark mode toggle"
- "Add drill-down capability to the discipline insights section"
