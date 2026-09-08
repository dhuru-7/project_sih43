# 🔍 Homepage Terminology & Copy Audit (SIH PS 26043)
**File:** `docs/HOMEPAGE_TERMINOLOGY_AUDIT_AND_BRAINSTORMING.md`  
**Platform:** SETU — Societal Innovation Collaboration Portal  
**Problem Statement:** Smart India Hackathon (SIH) 26043  
**Client / Stakeholder:** Government of Jharkhand, Department of Higher & Technical Education (DHTE)  

---

## 📌 Context: Why Many Current Terms Are Mismatched

The initial visual mockups in Google Stitch (`Setu Civic Reporting App`) borrowed copy patterns from **generic municipal civic complaint portals** (like PWD pothole repairs, street cleaner dispatchers, and city municipality ward hotlines).

However, **SIH Problem Statement 26043 is NOT a municipal pothole reporting app**.  
Its official mandate is:
> *"A digital platform to crowdsource societal challenges and facilitate collaborative problem solving through universities and industry partnerships."*

### The Core Contrast:
| Current Generic Stitch Concept (Mismatched) | Real SIH 26043 Scope (Correct) |
| :--- | :--- |
| **Concept:** Fix broken street infrastructure. | **Concept:** Solve grassroots societal challenges via academic R&D and student innovation. |
| **Submitters:** City residents reporting street trash. | **Submitters:** Citizens, Gram Panchayats, Self-Help Groups (SHGs), NGOs, local bodies. |
| **Assignee:** Municipal PWD, corporator, sweepers. | **Assignee:** University Faculty & Student Teams (BIT Mesra, IIT ISM Dhanbad, Birsa Agricultural Univ). |
| **Backers:** City municipal tax fund. | **Backers:** Dept. of Higher & Technical Education (DHTE Grants) + CSR Partners (Tata Steel, Coal India). |
| **Outcome:** Road patched, streetlight bulb replaced. | **Outcome:** Working prototype, patent, startup, deployed field solution under NEP 2020. |

---

## 📋 Comprehensive Audit of Homepage Names & Headings

Below is every text string, heading, and sample data element currently on the homepage that is incorrect or irrelevant, why it is problematic, and options for our brainstorming:

---

### 1. Greeting & Welcome Banner
| Current Text on Homepage | Why It Is Incorrect / Irrelevant | Recommended Replacement Options |
| :--- | :--- | :--- |
| **`Namaste, User`** | "User" is generic and impersonal. | 1. `Namaste, Citizen`<br>2. `Namaste, Innovator`<br>3. `Namaste, Dhruv` (dynamic user name) |
| **`Let's make our city better today.`** | Assumes an urban municipality. Jharkhand has 24 districts dominated by rural, tribal, and agricultural regions with challenges in water, soil, energy, and healthcare. | 1. `Let's solve community challenges together.`<br>2. `Transforming grassroots problems into student innovations.`<br>3. `Bridging community challenges with university research.` |

---

### 2. Primary Hero Bento Card
| Current Text on Homepage | Why It Is Incorrect / Irrelevant | Recommended Replacement Options |
| :--- | :--- | :--- |
| **`Report Issue`** (Card Heading) | Sounds like reporting a broken curb or noise complaint. | 1. `Submit a Challenge`<br>2. `Post Community Challenge`<br>3. `Crowdsource a Problem` |
| **`Make your city better. Swift review by your local municipality department.`** | Municipal departments do not review research challenges; **Higher Education Nodal Officers & Academic Screening Committees** review and route them to university labs. | 1. `Share local problems. Routed to university research teams and backed by Govt & CSR grants.`<br>2. `Turn grassroots challenges into funded student innovation projects.` |
| **`Upload Media`** (Button) | Button is fine, but can be more purposeful. | 1. `Upload Photo / Audio / Doc`<br>2. `Add Evidence & Details`<br>3. Keep `Upload Media` |

---

### 3. Submissions Section & Heading
| Current Text on Homepage | Why It Is Incorrect / Irrelevant | Recommended Replacement Options |
| :--- | :--- | :--- |
| **`My Submissions`** | Acceptable, but could be clearer in an innovation context. | 1. `My Submissions` (keep clean)<br>2. `My Active Challenges`<br>3. `Tracked Challenges` |
| **`View Details` / `View Summary`** | Button labels are functional. | Keep as-is or use `Track R&D Progress` |

---

### 4. Sample Challenge Cards (The Feed Data)
Currently, `INITIAL_ISSUES` contains municipal maintenance mockups that conflict directly with university academic R&D:

| # | Current Sample Item | Why It Is Irrelevant | Proposed SIH 26043 Replacement | Assigned University & Domain |
|---|---|---|---|---|
| **4.1** | **`Deep asphalt pothole near 12th Main intersection`**<br>*Location:* `12th Main Rd, 4th Cross`<br>*Assignee:* `Municipal Road Works Division` | PWD road patching is not university research. "12th Main, 4th Cross" is a Bengaluru street address, not Jharkhand. | **`High arsenic and fluoride levels in drinking tubewells`**<br>*Location:* `Bero Block, Ranchi District` | **Domain:** Clean Water & Sanitation<br>**Assigned HEI:** BIT Mesra (Water Tech Lab) |
| **4.2** | **`Flickering LED street light causing dark zone`**<br>*Location:* `Opposite Metro Pillar 184`<br>*Assignee:* `Power & Lighting Unit` | Routine bulb replacement. Jharkhand has no metro pillars. | **`Paddy leaf blight outbreak requiring low-cost sensor diagnostics`**<br>*Location:* `Govindpur, Dhanbad District` | **Domain:** Agriculture & AgriTech<br>**Assigned HEI:** Birsa Agricultural University |
| **4.3** | **`Overflowing dry waste bin cleared and sanitization completed`**<br>*Location:* `Defence Colony Park`<br>*Assignee:* `Sanitation Rapid Response Crew` | Municipal sanitation chore. "Defence Colony" is an affluent South Delhi / Bangalore neighborhood. | **`Solar micro-grid battery failure in remote tribal residential school`**<br>*Location:* `Netarhat, Latehar District` | **Domain:** Renewable Energy & Off-Grid<br>**Assigned HEI:** IIT (ISM) Dhanbad Clean Energy Lab |
| **4.4** | *(New Proposed)* | None currently exists for Healthcare. | **`Low-cost non-invasive sickle cell anemia screening device for rural youth`**<br>*Location:* `Khunti District` | **Domain:** Healthcare & Tribal Nutrition<br>**Assigned HEI:** AIIMS Deoghar + Tata Steel CSR |

---

### 5. Notifications Feed (Right Column)
Currently, notifications reflect city municipal maintenance:

| # | Current Notification Text | Why It Is Problematic | Proposed SIH 26043 Innovation Replacement |
|---|---|---|---|
| **5.1** | `Status updated for Pothole report #SETU-8821 to Under Review.` | Mentions "Pothole report". | **`BIT Mesra Innovation Cell accepted your Drinking Water Filtration challenge for prototype development.`** |
| **5.2** | `Sanitation department responded to your query regarding waste bin clearance.` | Mentions sanitation department cleaning trash. | **`Department of Higher & Technical Education (DHTE) approved Rs 2.5L prototyping grant for Latehar Solar Project.`** |
| **5.3** | `Scheduled water pipeline maintenance in Ward 4 tomorrow morning from 9 AM to 1 PM.` | Routine plumbing advisory; mentions "Ward 4". | **`Tata Steel CSR Foundation expressed interest to mentor and co-sponsor the Agro-Waste Briquette project.`** |
| **5.4** | `14 residents validated and confirmed your Street Light report.` | Streetlight report. | **`28 community members in Bero Block upvoted and verified your Water Contamination challenge.`** |

---

### 6. Sidebar Navigation & User Profile
| Current Element | Current Value | Issue / Mismatch | Proposed Replacement |
| :--- | :--- | :--- | :--- |
| **Nav Item 3** | `Report Issue` (`add_circle`) | Sounds like municipal complaint. | `Submit Challenge` or `New Challenge` |
| **Nav Item 2** | `Explore` | Good, explores community challenges across Jharkhand. | Keep `Explore Challenges` |
| **User Profile Chip** | `Ward 4 · Active` | "Ward 4" is an urban municipal ward designation. | `Ranchi District · Bero` or `Citizen · Jharkhand` |

---

### 7. TARA AI Assistant Intake Modal
| Current Element | Current Value | Status & Recommendation |
| :--- | :--- | :--- |
| **Modal Title** | `TARA AI Civic Assistant` | Upgrade to **`TARA AI Challenge & Innovation Assistant`** |
| **Language Support** | *Hindi, Santhali, English* | ✅ Already corrected (removed "Kannada"). |
| **Intake Purpose** | Intake of problems | Tailor voice prompts to prompt: *"Describe the local problem, who is affected, and what kind of practical solution or university help is needed."* |

---

## 💡 Quick Brainstorming Decision Checklist

Before we apply any updates to the codebase, let's align on these 4 core decisions:

1. **Card & Action Verbiage:**  
   Do you prefer:
   - **Option A (Academic/Govt):** `Submit Challenge` / `My Challenges`
   - **Option B (Citizen-Friendly):** `Submit Community Problem` / `My Submissions`
   - **Option C (Short & Modern):** `Post Challenge` / `My Submissions`

2. **Hero Banner Tagline:**  
   - `Bridging community challenges with university research & funded student innovations.`

3. **Sample Feed Challenges:**  
   - Replace the Pothole / Streetlight / Trash Can with the 4 real Jharkhand domains:
     1. *Drinking Water Contamination (Arsenic/Fluoride) — Bero, Ranchi*
     2. *Paddy Crop Blight Diagnostic Sensor — Dhanbad*
     3. *Solar Micro-Grid Inverter Storage — Netarhat, Latehar*
     4. *Low-Cost Tribal Healthcare / Sickle Cell Screening Kit — Khunti*

4. **Profile Location Tag:**  
   - Change `Ward 4 · Active` to `Ranchi District · Active` or `Citizen · Jharkhand`.

---
*Created on 2026-09-07 for pair-programming brainstorming session on Project SETU (SIH 26043).*
