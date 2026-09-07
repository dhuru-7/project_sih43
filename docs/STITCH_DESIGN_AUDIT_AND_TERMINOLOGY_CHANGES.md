# 🔍 STITCH Design Audit & SIH Terminology Rectification Plan
**Project:** SETU — Societal Innovation Collaboration Portal  
**Problem Statement:** SIH 26043 | Government of Jharkhand — Department of Higher & Technical Education  
**Purpose:** Comprehensive audit of terminology, copywriting, and conceptual framing in the Stitch UI designs (`Setu Civic Reporting App`), identifying mismatched municipal/regional artifacts and providing aligned recommendations for team brainstorming.

---

## 🚨 Executive Summary & Core Disconnect

The initial screens generated in Stitch (`Setu Civic Reporting App`) inadvertently drew patterns from **generic civic complaint portals (e.g., Bengaluru municipal PWD / BESCOM apps)**. 

### The Fundamental Difference:
| Generic Civic / Municipal App (Incorrect) | SETU for SIH PS 26043 (Correct) |
| :--- | :--- |
| **Grievances:** Potholes, broken streetlights, garbage piles, sewage overflows. | **Societal Challenges:** Fluoride/arsenic water contamination, crop disease outbreaks, rural cold storage, off-grid tribal school solar power, malnutrition tracking. |
| **Solvers:** Municipal ward sweepers, PWD road contractors, local corporator offices. | **Solvers:** Multidisciplinary Student & Faculty R&D Teams across Higher Education Institutions (HEIs) like BIT Mesra, IIT ISM Dhanbad, Birsa Agricultural University. |
| **Sponsors / Enablers:** City municipal budget. | **Sponsors / Enablers:** Govt. Innovation Seed Grants (Dept. of Higher & Technical Education) + Corporate CSR Partners (Tata Steel, Coal India, NTPC). |
| **Outcome:** Pothole filled, garbage truck sent. | **Outcome:** Working prototype developed, lab/field trials completed, technology transfer, patents, deployable grassroots social innovation. |

If evaluators from the **Jharkhand Department of Higher & Technical Education** see municipal maintenance terms like *"BESCOM"*, *"Ward 4"*, *"Pothole on Main St"*, or *"Kannada"*, they will deduct points for failing to address the Higher Education & Academic R&D scope of PS 26043.

---

## 📋 Comprehensive Screen-by-Screen Audit

### 1. `Setu Home - Desktop` (`projects/13404294252307224464/screens/e21e2b3ce7904aceaa06c7eb78f71f2c`)

| # | Current Stitch Text / Element | Location in Design | Why It Is Problematic / Mismatched | Recommended SETU / SIH 26043 Replacement |
|---|-------------------------------|--------------------|-----------------------------------|------------------------------------------|
| **1.1** | **`ARKA Civic Copilot`** | AI Intake Modal header | "ARKA" is a remnant from another project in your Stitch account. The blueprint specifies **TARA AI**. | **`TARA AI Voice & Challenge Assistant`** |
| **1.2** | *"Tell me what happened in simple words, or speak in Kannada, Hindi, or English"* | AI Modal prompt | **Kannada** is the language of Karnataka. Jharkhand's official/regional languages are **Hindi, Santhali, Kurukh, Mundari, Ho, Khortha, and English**. | *"Describe the challenge in your words, or speak in Hindi, Santhali, Kurukh, or English:"* |
| **1.3** | *"Make your city better. Swift review by your local municipality department."* | Hero Banner subtext | Setu is for Jharkhand's 24 districts (predominantly rural/tribal + urban blocks), governed by the **Dept. of Higher & Technical Education**, not municipal corporators. | *"Transforming grassroots challenges into academic research & funded student innovations."* |
| **1.4** | **`Assigned to BESCOM`** | Issue Card #2 status (`#SETU-8819`) | **BESCOM** is the Bangalore Electricity Supply Company! In Jharkhand, electricity is handled by **JBVNL**, and for university R&D, it is assigned to an **HEI Engineering Faculty Team** (e.g., IIT ISM Dhanbad Energy Lab). | **`Assigned to: IIT ISM Dhanbad (Clean Energy Lab)`** |
| **1.5** | *"12th Main Rd, 4th Cross"* & *"Opposite Metro Pillar 184"* | Issue Cards #1 & #2 location | Bengaluru urban street layout. Jharkhand has no metro pillars (except proposed) and uses District / Block / Panchayat / Ward geography. | **`Ormanjhi Block, Ranchi District`** or **`Govindpur Block, Dhanbad`** |
| **1.6** | *"Deep asphalt pothole near 12th Main intersection"* | Issue Card #1 title | Engineering colleges and professors do not repair asphalt potholes; that's PWD work. | **`"High arsenic & fluoride levels in drinking tubewells — Bero Block"`** |
| **1.7** | *"Flickering LED street light causing dark zone"* | Issue Card #2 title | Routine electrical maintenance, not university R&D. | **`"Frequent solar micro-grid inverter failures in tribal residential school"`** |
| **1.8** | *"Overflowing dry waste bin cleared and sanitization completed"* | Issue Card #3 title | Municipal sanitation chore. | **`"Low-cost biomass briquetting from agricultural residue successfully deployed"`** |
| **1.9** | **`Ward 4 · Active`** | User Profile footer chip | Bengaluru municipal ward numbering. Jharkhand identification uses District + Block + Panchayat. | **`"Ranchi District · Bero Block"`** or **`"Panchayat Citizen / Gram Pradhan"`** |
| **1.10** | *"Sanitation department responded to your query regarding waste bin clearance"* | Notification #2 | Pertains to municipal cleaning. | *"Birsa Agricultural University submitted a field prototype proposal for your soil salinity challenge."* |
| **1.11** | *"Scheduled water pipeline maintenance in Ward 4 tomorrow"* | Notification #3 | Routine municipal utility advisory. | *"DHTE Nodal Officer sanctioned Rs 2.5L prototyping grant for your community water challenge."* |

---

### 2. `Setu Home - Redesigned Card` (Mobile Screen `0690e7f35674411dafc68ec05fa3ea86`)

| # | Current Stitch Text / Element | Location in Design | Why It Is Problematic / Mismatched | Recommended SETU / SIH 26043 Replacement |
|---|-------------------------------|--------------------|-----------------------------------|------------------------------------------|
| **2.1** | *"Namaste, User — Let's make our city better today."* | Mobile Header greeting | Ignores the rural and tribal communities of Jharkhand where the largest challenges lie. | *"Namaste, Citizen — Bridging grassroots needs with academic innovation."* |
| **2.2** | *"Report Issue — Make your city better."* | Black Bento Action Card | Sounds like a pothole/litter complaint form. | *"Submit a Challenge — Turn community problems into university R&D projects."* |
| **2.3** | **`Nearby Issues`** section heading | Bottom feed header | Redundant with the bottom navigation **Compass (Explore)** icon, and lists potholes/streetlights. | Replace on Home with **`My Active Challenges`** (tracking user's submitted problems), and keep community feed on the **Explore** tab. |
| **2.4** | `Pothole on Main St` [Pending] | Mobile Item 1 | Municipal chore. | `Fluoride in Village Wells` [Assigned to BIT Mesra] |
| **2.5** | `Broken Streetlight` [Reviewed] | Mobile Item 2 | Municipal chore. | `Paddy Blight Sensor Needed` [Under Govt Review] |
| **2.6** | `Trash Pileup` [Resolved] | Mobile Item 3 | Municipal chore. | `Solar Cold Storage Unit` [Pilot Deployed] |

---

### 3. Project-Level Naming & Metadata in Stitch

| Item | Current Value in Stitch | Suggested Aligned Value | Notes |
|---|---|---|---|
| **Project Title** | `Setu Civic Reporting App` | **`SETU — Societal Innovation Collaboration Portal`** | Elevates project from a simple "civic reporting app" to an institutional collaborative platform. |
| **Primary Tagline** | *"Civic Engagement Platform"* | *"Crowdsourcing Societal Challenges for Academic & Industry R&D"* | Matches SIH PS 26043 exact title. |
| **Target Authority** | *"Local Municipality / Corporator"* | **`Government of Jharkhand — Department of Higher & Technical Education (DHTE)`** | Exact SIH nodal department. |

---

## 🎯 Proposed Domain Categories for the Report Portal

Instead of generic municipal categories (*"Roads", "Streetlights", "Garbage", "Drains"*), the Report Portal must feature the **Thematic Domains outlined in SIH PS 26043**:

1. **💧 Clean Water & Sanitation R&D**
   * *Examples:* Ground water arsenic/fluoride filtration, smart water metering in rural tanks, indigenous rainwater harvesting tech.
2. **🌾 Agriculture, Soil & Livestock Tech**
   * *Examples:* Early crop pest/blight detection, affordable grain moisture meters, solar-powered grain dehydrators, organic fertilizer optimization.
3. **⚡ Renewable Energy & Rural Electrification**
   * *Examples:* Low-maintenance solar micro-inverters for remote hills, biomass briquette units, micro-hydro power for tribal hamlets.
4. **🏥 Healthcare Diagnostics & Tribal Nutrition**
   * *Examples:* Non-invasive anemia / sickle-cell screening kits, portable vaccine cold-chain carriers, tele-medicine connectivity in shadow zones.
5. **📚 Smart Education & Accessibility (NEP 2020)**
   * *Examples:* Low-bandwidth regional dialect e-learning kits for tribal schools, assistive learning devices for disabled children.
6. **🌲 Forest Produce & Rural Livelihood Mechanization**
   * *Examples:* Mechanized Mahua flower collection/processing tools, lac cultivation temperature monitoring, tussar silk weaving ergonomics.

---

## 🚀 Recommended Architecture for the Report Portal

### 1. Step-by-Step Reporting Flow (Apple Design Principles)
- **Step 1: Evidence & Voice (Intake):**
  - Instant camera/video capture & drag-and-drop.
  - **TARA AI Voice Assistant** button: Tap to record in Hindi/regional dialects with fluid live soundwave animation.
- **Step 2: Challenge Definition & Thematic Domain:**
  - Clear problem title & descriptive summary.
  - Interactive pill selection for the 6 official PS 26043 domains.
  - Severity / urgency gauge.
- **Step 3: Jharkhand Geo-Tagging & Demographics:**
  - 1-Click GPS location (`navigator.geolocation`) with accuracy radius.
  - Dropdown cascading selection for Jharkhand's **24 Districts**, **Blocks**, and **Gram Panchayats / Urban Local Bodies**.
  - Estimated community impact (e.g. 500+ villagers affected).
- **Step 4: AI Pre-Triage & University Matching Preview:**
  - Real-time NLP preview showing:
    - *Auto-detected domain*
    - *Matched Higher Education Institutions (HEIs)* (e.g., BIT Mesra, IIT ISM Dhanbad, Birsa Agricultural University)
    - *Deduplication Radar:* verifies no identical challenges were submitted within 5km.
- **Step 5: Confirmation & Lifecycle Tracking:**
  - Generates official ticket ID (e.g., `#JH-SETU-9402`).
  - Outlines the 5-stage lifecycle (`Submitted ➔ AI Triaged ➔ Govt Allocated ➔ University R&D ➔ Field Deployed`).

---

## 🧠 Brainstorming Checklist for Team
- [ ] Agree on final terminology for the AI assistant (**TARA AI**).
- [ ] Rename the Stitch project to `SETU — Societal Innovation Collaboration Portal`.
- [ ] Replace municipal mock data (potholes/BESCOM) across all desktop and mobile Stitch screens with the approved Jharkhand R&D examples above.
- [ ] Update Stitch design system copy and mock cards.
