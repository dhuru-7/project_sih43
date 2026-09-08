# 🔍 STITCH Design Audit & SIH Terminology Rectification Plan
**Project:** SETU — Societal Innovation Collaboration Portal  
**Problem Statement:** SIH 26043 | Government of Jharkhand — Department of Higher & Technical Education  
**Purpose:** Comprehensive audit of terminology, copywriting, and conceptual framing across UI designs, aligning Citizen UX simplicity with SIH academic & institutional problem solving.

---

## 🎯 The Core Product Axiom: Citizen Simplicity vs. Institutional Depth

A key product principle defines SETU: **Citizens do not think in terms of "Academic Challenges" or "R&D Grants" — they think in terms of real-life ISSUES affecting their community.**

```mermaid
graph LR
    Cit["📱 Citizen POV\n'Report Issue / समस्या दर्ज करें'\n(Voice, Photo, Location)"] 
    -->|SETU AI Pipeline\n(TARA AI + NLP Classifier)| Bridge["🌉 SETU Engine\nTriage · Deduplication · Priority"]
    -->|Transforms into| Univ["🎓 University & Govt POV\n'Societal R&D Challenge'\n(HEI Labs, Grants, Trials)"]
```

### The Balance:
1. **Citizen-Facing Experience (Keep it Simple & Grounded):**
   - Citizens must see **"Report Issue"**, **"Report Problem"**, **"My Reported Issues"**, and **"Nearby Issues"**.
   - Language is conversational, empathetic, and multi-lingual (Hindi, Santhali, Kurukh, Mundari, English).
   - Citizens are not burdened with academic bureaucracy ("R&D proposals", "HEI matchmaking", "TRL levels"). They simply report what is wrong and track who is solving it.

2. **The "SETU" Bridge:**
   - The platform takes the raw citizen issue and structures it into an actionable **Societal Problem Statement / Innovation Challenge**.

3. **University, Government & Industry Portals:**
   - This is where academic terminology belongs: *"Adopt Challenge"*, *"Sanction Prototyping Grant"*, *"Field Trial Milestone"*, *"CSR Co-Funding"*.

---

## 🚨 Municipal Purge: Removing Mismatched Civic/Municipal Tags

The early Stitch designs mistakenly imported tags from **city municipal apps (e.g., Bengaluru BBMP/BESCOM/PWD)**. In Jharkhand and under the Department of Higher & Technical Education, these municipal tags must be **completely removed and replaced**:

| Mismatched Municipal Tag (Must Be Removed) | Why It Is Wrong | Correct SETU Replacement |
| :--- | :--- | :--- |
| **`Assigned to BESCOM`** | BESCOM is Bengaluru's power utility. In Jharkhand it's JBVNL, and for innovation it is assigned to an academic research team. | **`Assigned to: IIT ISM Dhanbad (Clean Energy Lab)`** or **`Nodal Review Desk`** |
| **`Municipal Road Works Division`** | SETU does not dispatch municipal road patchers. | **`Nodal Technical Evaluation Desk`** or **`BIT Mesra Infrastructure Lab`** |
| **`Sanitation Rapid Response Crew`** | SETU is not a garbage truck dispatch service. | **`Birsa Agricultural University (Bio-waste & Agritech Lab)`** |
| **`Ward 4 · Active`** | Bengaluru urban ward numbering. Jharkhand's administrative structure is District + Block + Panchayat / Urban Local Body. | **`Ranchi · Bero Block`** or **`Dhanbad · Govindpur Block`** |
| **`Local Municipality Department`** | Governed by the Dept. of Higher & Technical Education (DHTE), not a municipal corporation. | **`State Technical Evaluation Cell`** or **`Assigned HEI Research Team`** |
| **`Ward Advisory / Corporator`** | Municipal political divisions. | **`District / Block Advisory`** or **`Nodal Officer Desk`** |
| **`Sanitation department responded...`** | Municipal cleaning follow-up. | **`Research team submitted field validation update...`** |

---

## 📋 Screen-by-Screen UI & Terminology Audit

### 1. `Setu Home - Desktop` (`projects/13404294252307224464/screens/e21e2b3ce7904aceaa06c7eb78f71f2c`)

| # | Current Stitch Text | Location | Problem / Mismatch | Approved Replacement |
|---|---|---|---|---|
| **1.1** | **`ARKA Civic Copilot`** | AI Intake Modal header | "ARKA" is an unassociated project name. Blueprint specifies **TARA AI**. | **`TARA AI Voice Assistant`** |
| **1.2** | *"Tell me what happened in simple words, or speak in Kannada, Hindi, or English"* | AI Modal prompt | Kannada is Karnataka's language. Jharkhand uses Hindi, Santhali, Kurukh, Khortha, and English. | *"Tell us about the problem in your words, or speak in Hindi, Santhali, Kurukh, or English:"* |
| **1.3** | *"Make your city better. Swift review by your local municipality department."* | Hero Banner subtext | Mentions municipal department; ignores rural/tribal Jharkhand and academic solving. | *"Report problems in your village or town with voice or photo. Track real solutions from verified institutions."* |
| **1.4** | **`Assigned to BESCOM`** | Issue Card #2 status (`#SETU-8819`) | BESCOM is Bengaluru municipal utility. | **`Assigned to: IIT ISM Dhanbad (Clean Energy Lab)`** |
| **1.5** | *"12th Main Rd, 4th Cross"* & *"Opposite Metro Pillar 184"* | Issue Cards #1 & #2 location | Bengaluru urban street layout. Jharkhand has no metro pillars and uses District/Block/Panchayat. | **`Bero Block, Ranchi District`** or **`Govindpur Block, Dhanbad`** |
| **1.6** | *"Deep asphalt pothole near 12th Main intersection"* | Issue Card #1 title | Municipal road maintenance chore. | **`"High fluoride & arsenic levels in drinking tubewells"`** |
| **1.7** | *"Flickering LED street light causing dark zone"* | Issue Card #2 title | Routine electrical bulb change. | **`"Frequent solar micro-grid inverter breakdown at tribal school"`** |
| **1.8** | *"Overflowing dry waste bin cleared and sanitization completed"* | Issue Card #3 title | Municipal sanitation chore. | **`"Low-cost biomass briquetting unit deployed for crop residue"`** |
| **1.9** | **`Ward 4 · Active`** | User Profile footer chip | Municipal ward tag. | **`"Ranchi · Bero Block"`** or **`"Citizen · Ranchi District"`** |
| **1.10** | *"Sanitation department responded to your query regarding waste bin clearance"* | Notification #2 | Municipal sanitation follow-up. | *"Birsa Agricultural University submitted a field validation report for your soil salinity issue."* |
| **1.11** | *"Scheduled water pipeline maintenance in Ward 4 tomorrow"* | Notification #3 | Municipal routine advisory. | *"DHTE Nodal Cell approved seed allocation for village water filtration pilot."* |
| **1.12** | **Like / Upvote Button on "My Submissions" Card** | Submission Card Actions | Redundant on citizen's own submissions (citizens don't upvote themselves). | **Removed like button**; show read-only `{upvotes} upvotes` in metadata and retain single **`View Details`** action button. |
| **1.13** | **Notification Bullet Points** | Notification Items | Circular dots/bullets clutter the card list. | **Removed bullet dots**; sleek card-based notification layout with title, timestamp, and message. |
| **1.14** | **Floating Notifications Card in Right Column** | Desktop Right Column | A static floating card leaves the right column underutilized and disconnected from core AI flows. | **Replaced with full-height TARA AI Sidechat (Sidemenu Style)** docked to the right edge with the custom 4-pointed Star SVG icon, live message stream, voice input, and direct issue drafting. |

---

### 2. `Setu Home - Redesigned Card` (Mobile Screen `0690e7f35674411dafc68ec05fa3ea86`)

| # | Current Stitch Text | Location | Problem / Mismatch | Approved Replacement |
|---|---|---|---|---|
| **2.1** | *"Namaste, User — Let's make our city better today."* | Mobile Header greeting | "City" neglects rural/tribal Jharkhand where critical needs exist. | *"Namaste, Citizen — Tell us what issue your community is facing today."* |
| **2.2** | *"Report Issue — Make your city better."* | Black Bento Action Card | Action is good ("Report Issue"), but subtext has urban/municipal slant. | Keep **`Report Issue`** (or **`Report Problem`**). Subtext: *"Report issues in your village or town with voice or photo."* |
| **2.3** | **`Nearby Issues`** section heading | Bottom feed header | "Nearby Issues" is great for citizen discoverability. Keep it clear! | Keep **`Nearby Issues`** (or **`Community Issues`**), and maintain **`My Issues`** for personal tracking. |
| **2.4** | `Pothole on Main St` [Pending] | Mobile Item 1 | Municipal chore. | `Fluoride in Village Tubewells` [Under Nodal Review] |
| **2.5** | `Broken Streetlight` [Reviewed] | Mobile Item 2 | Municipal chore. | `Paddy Crop Leaf Blight Infestation` [Assigned to Birsa Agri Univ] |
| **2.6** | `Trash Pileup` [Resolved] | Mobile Item 3 | Municipal chore. | `Solar Cold Storage Unit Deployed` [Pilot Active] |

---

### 3. Project-Level Naming & Metadata

| Item | Current Value in Stitch | Suggested Aligned Value | Notes |
|---|---|---|---|
| **Project Title** | `Setu Civic Reporting App` | **`SETU — Societal Innovation Collaboration Portal`** | Elevates project from a simple municipal app to an institutional collaborative platform. |
| **Primary Tagline** | *"Civic Engagement Platform"* | *"Crowdsourcing Grassroots Issues for Academic & Industry R&D"* | Direct alignment with SIH PS 26043. |
| **Target Authority** | *"Local Municipality / Corporator"* | **`Government of Jharkhand — Department of Higher & Technical Education (DHTE)`** | Exact SIH nodal department. |

---

## 🎯 Realistic Citizen Issue Categories (Front-Facing)

To prevent citizen confusion, the 6 technical SIH domains are presented in **plain, relatable citizen terms**:

| SIH Academic Domain | Citizen Portal Display Label | Example Citizen Issue |
| :--- | :--- | :--- |
| **Clean Water & Sanitation R&D** | 💧 **Drinking Water & Sanitation** | *"Well water smells foul / high red rust in tubewells"* |
| **Agriculture, Soil & Livestock Tech** | 🌾 **Farming, Crops & Livestock** | *"Sudden pest attack destroying paddy crops before harvest"* |
| **Renewable Energy & Rural Electrification** | ⚡ **Electricity & Solar Power** | *"Solar micro-grid inverter failing repeatedly at health sub-center"* |
| **Healthcare Diagnostics & Nutrition** | 🏥 **Health & Medical Care** | *"No cold storage for child vaccines at local Anganwadi"* |
| **Smart Education & Accessibility** | 📚 **Schools & Village Education** | *"Lack of interactive learning tools in tribal primary school"* |
| **Forest Produce & Rural Livelihoods** | 🌲 **Forest Produce & Local Work** | *"Excessive manual labor & wastage during Mahua flower collection"* |

---

## 🛠️ Summary of Required Changes
1. ✅ **Preserve Citizen Vocabulary:** Retain **"Report Issue"**, **"My Issues"**, **"Nearby Issues"**. Do not force academic jargon like "Submit R&D Challenge" on citizens.
2. 🚫 **Purge All Municipal Tags:** Eliminate BESCOM, PWD, Municipal Corporation, Ward 4, Corporator, Sanitation Crew, and municipal street names.
3. 🏛️ **Align Assignment & Geography:** Show assigned university research labs / state nodal evaluation cells, and use Jharkhand districts & blocks (Ranchi, Dhanbad, Gumla, Bero, Ormanjhi).
