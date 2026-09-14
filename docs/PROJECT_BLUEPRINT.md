# 🏛️ SETU - End-to-End System Blueprint & Ecosystem Architecture
**Smart India Hackathon (SIH 2024 / PS 26043)**  
*Organization: Government of Jharkhand | Department: Higher & Technical Education*

---

## 🎯 Ecosystem Overview & Vision
Communities across Jharkhand face thousands of grassroots challenges (water contamination, rural health access, agriculture diseases, road infrastructure, education). Currently, these problems remain fragmented. Meanwhile, universities have talented students and researchers seeking real-world projects, and industries have CSR funds and scaling expertise looking for impactful grassroots innovation.

**SETU** is the digital bridge uniting **Citizens & Local Bodies**, the **Government of Jharkhand**, **Universities (SPOC + Teams)**, and **Industry/CSR Partners** into a unified, transparent problem-solving pipeline.

---

## 👥 The 4 Core Portals & User Roles

```mermaid
graph LR
    subgraph 1. Intake
        Citizen["📱 Citizen & Local Bodies<br/>(Mobile & Desktop Portal)"]
    end
    
    subgraph 2. Governance
        Gov["🏛️ Govt Nodal Officer<br/>(DHTE + Line Ministries)"]
    end

    subgraph 3. Academia
        SPOC["🎓 University SPOC<br/>(Dean / Nodal Lead)"]
        Teams["🔬 Student & Faculty Teams<br/>(R&D Solvers)"]
    end

    subgraph 4. Market & Scale
        Industry["🏢 Industry & CSR Partners<br/>(Mentors, Funders, MSMEs)"]
    end

    Citizen -->|1. Submit Problem + Evidence| Gov
    Gov -->|2. AI Triage & Allocate Problem| SPOC
    SPOC -->|3. Approve & Assign Teams| Teams
    Teams -->|4. Build Prototype & Post Milestones| SPOC
    SPOC -->|5. SPOC Verification| Gov
    Gov -->|6. Govt Impact Sign-off & Field Deploy| Citizen
    Teams <-->|Collaborate, Mentor, CSR Grant| Industry
```

---

### 1. 📱 Citizen & Community Reporting Portal
* **Target Users**: Everyday citizens, Village Youth, Panchayati Raj Institutions (Gram Panchayats), Urban Local Bodies (ULBs), Schools, NGOs, and Pragya Kendra operators.
* **Design Philosophy**:
  * **Minimalist & Premium**: High typographic contrast, warm monochrome accents, clutter-free layouts, and spacious cards.
  * **Apple-Inspired Fluid Interactions**: Smooth 60fps spring animations, backdrop blurs (glassmorphism), tactile button feedback, and non-intrusive modal sheets.
* **Device Optimization**:
  * **Mobile-First (Budget Phones)**: Lightweight, 1-tap camera access, big touch targets, PWA installable (<2MB), WhatsApp share.
  * **Desktop (Gram Panchayat / CSC PCs)**: Full multi-column view, detailed document upload, high-resolution media previews, public challenge explorer.
* **Core Capabilities**:
  * **3-Step AI Reporting**:
    1. **Capture/Upload**: Record or attach photos/videos from camera or gallery.
    2. **Describe or Speak**: Speak a voice note in regional dialect or type brief notes in the notepad.
    3. **Post**: TARA automatically transcribes all speech using **Sarvam Saaras v3**, extracts keyframe evidence, and uses **Sarvam 105B** to draft an authentic first-person grievance with title, official category, severity, urgency, impact summary, and municipal routing.
  * **Interactive Explore Feed**:
    * Map and list views of verified civic problems across Jharkhand districts.
    * Real-time category filtering (all 17 official categories) and status badges (`Reported`, `Assigned`, `In Progress`, `Resolved`).
    * **Community Upvoting & Verification**: Citizens upvote existing neighborhood issues to highlight collective community priority without duplicate ticket spam.
  * **Direct Citizen-Government Messaging (`/messages`)**:
    * Two-way encrypted conversation channel between citizens, municipal officers, university SPOCs, and community leads.
    * Request clarifying details, upload supplementary site photos, and receive official resolution notifications.
  * **TARA AI Voice Assistant & Copilot**:
    * Voice-based grievance registration in Hindi and regional dialects for citizens with low digital literacy, with special focus on Jharkhand accents and dialect patterns.
    * Citizens can summon TARA at any time to navigate the app, change accessibility settings (high contrast, text size), listen to status updates, and draft responses.
  * **Geo-Tagging**: Auto GPS location capture (`navigator.geolocation`) + manual Jharkhand District / Block / Panchayat picker.
  * **Public Transparency Tracker**: Track ticket lifecycle in real-time (`Submitted ➔ AI Triaged ➔ Assigned to University ➔ Team Formed ➔ Prototype Ready ➔ Resolved`).

### TARA AI Constellation Architecture
TARA is the single unified intelligence persona that users interact with, backed by an orchestrated constellation of specialized AI models:

* **Acoustic & Speech Intelligence (Sarvam Saaras v3)**:
  * Industry-leading speech-to-text specifically trained on Indian accents, Hindi, Bhojpuri, Maithili, Santhali, Nagpuri, and colloquial Indian English.
  * Automatically transcribes both citizen voice recordings and spoken audio inside user-uploaded MP4/WebM videos.
* **Cognitive Reasoning & Synthesis (Sarvam 105B)**:
  * 105B parameter Indian-centric foundational LLM that synthesizes raw acoustic transcripts, typed notes, and geographic coordinates.
  * Formulates authentic first-person citizen grievance reports adhering strictly to official Indian civic categories, severity matrices, and administrative boundaries.
* **Computer Vision (Gemini 2.5 Flash / Vision)**:
  * Inspects video keyframes and uploaded photos to extract physical civic evidence (e.g. road craters, open manholes, contaminated water bodies, illegal garbage dumping, snapped high-voltage cables).
* **Speed & Real-time Prioritization (Groq Llama 3.3 70B)**:
  * High-throughput inference for real-time deduplication matching, semantic similarity clustering, and administrative routing.

---

### 2. 🏛️ Government Portal (Review, Allocation & Validation)
* **Target Users**:
  * **State Nodal Officers**: Department of Higher & Technical Education (DHTE) — central admin.
  * **Thematic Line Departments**: Drinking Water & Sanitation (DWSD), Agriculture, Health, Rural Development, Urban Development, Energy, etc.
  * **District Planning Officers**: DC / DM offices across Jharkhand's 24 districts.
* **Core Capabilities**:
  * **AI Problem Review Queue**: View incoming tickets triaged by AI (Domain tag, Deduplication score, Severity matrix).
  * **Clustered Similar Reports**: Officers see related reports grouped by topic, location, and duplicate similarity so repeated citizen submissions become one stronger civic signal.
  * **Follow-Up Automation via TARA**: Officers can ask TARA to message or call all citizens who reported a similar issue, collect missing details, and summarize responses back into the case file. Officers can still message a specific citizen, NGO, school, ULB, or organization manually.
  * **Task & Challenge Creation**: Convert grassroots problems into official **"State Innovation Challenges"** with defined problem statements and impact metrics.
  * **Institutional Routing & Allocation**: Assign validated challenges to appropriate universities based on academic specialization, labs, and faculty domain expertise (e.g., Water R&D to IIT ISM Dhanbad / BIT Mesra; Agro-tech to Birsa Agricultural University).
  * **University Capability Suggestions**: AI recommends departments and universities with relevant labs, mentors, and resources for solving each validated challenge.
  * **Posts & Analytics**: Officers can run awareness posts, monitor report trends, inspect district/category analytics, and track assigned university projects.
  * **Grant & Seed Funding Approval**: Sanction government innovation grants / prototyping budgets for approved university projects.
  * **Claim & Milestone Verification**: Verify university progress updates following SPOC endorsement, inspect field pilot results, and issue official impact certificates.

---

### 3. 🎓 University Portal (SPOC & Student/Faculty Teams)
The university portal is divided into **two specialized sub-roles**:

#### A. University SPOC (Single Point of Contact / Dean of R&D / Incubation Lead)
* **Responsibilities**:
  * **Receive Assigned Challenges**: Review challenges routed to the university by the Government.
  * **Team Formation & Approval**: Review applications from student/faculty teams, constitute multidisciplinary project squads, and assign designated faculty mentors.
  * **Team Login Issuance**: After team formation, the SPOC issues team-lead credentials so the team can upload project details and progress updates only for its assigned challenge.
  * **Institutional Governance**: Monitor project milestones, budget utilization, and ensure academic rigor.
  * **Primary Milestone Verification**: First-level verification of team deliverables before submission to the Government and public feed.

#### B. Student & Faculty Innovator Teams
* **Responsibilities**:
  * **Bidding & Proposing**: Submit formal solution proposals, research blueprints, tech stacks, and expected budgets.
  * **R&D & Prototyping**: Build physical hardware prototypes, software solutions, or policy models.
  * **Public Project Showcase & Progress Logging**: Regularly log milestones (photos of prototypes, field test videos, GitHub repos, patent filings, test results).
  * **Stakeholder Feedback**: Respond to feedback from government inspectors, citizen beneficiaries, and industry mentors.

---

### 4. 🏢 Industry & CSR Collaboration Portal
* **Target Users**: Startups, MSMEs, Large Enterprises (Tata Steel, Coal India, NTPC, etc.), Corporate CSR Directors, Venture Funds, and Research Labs.
* **Core Capabilities**:
  * **Project Discovery Feed**: Explore active university projects solving real Jharkhand problems, filterable by sector (Agro, Clean Water, Solar, Health) and district.
  * **Domain-Based Recommendation Engine**: Industry users receive suggested projects based on company domain, CSR priorities, sector, geography, and potential impact.
  * **Mentorship & Co-Development**: Industry engineers can offer technical mentorship, lab testing access, or engineering reviews to university teams.
  * **CSR Funding & Grants**: Pledge CSR grants or matching funds for high-potential prototypes needing pilot testing.
  * **Verified Impact Signals**: Projects verified by both university SPOC and government receive stronger visibility so funders can quickly identify credible high-impact work.
  * **Direct Collaboration & Contact**: Initiate direct messaging and MoU discussions with university teams and SPOCs.
  * **Technology Transfer & Commercialization**: License patents, acquire IP, or incubate student startups for commercial deployment in Jharkhand and across India.

---

## 🔄 End-to-End Problem Lifecycle State Machine

```text
[1. CITIZEN_SUBMITTED]
       │ (Citizen reports issue via Web/Mobile/Voice with GPS & Media)
       ▼
[2. AI_TRIAGED]
       │ (NLP classifies domain, detects duplicates, scores urgency)
       ▼
[3. GOVT_REVIEWED & APPROVED]
       │ (Govt Dept validates problem and converts into University Challenge)
       ▼
[4. ASSIGNED_TO_UNIVERSITY]
       │ (Routed to matched HEIs based on research & lab capability)
       ▼
[5. SPOC_TEAM_FORMED]
       │ (University SPOC reviews, forms student/faculty team, assigns Mentor)
       ▼
[6. PROPOSAL_SUBMITTED]
       │ (Team uploads design blueprint, timeline & seed funding request)
       ▼
[7. INDUSTRY_PARTNERED (Optional/Parallel)]
       │ (Industry/CSR pledges mentorship, funds, or pilot deployment support)
       ▼
[8. MILESTONE_IN_PROGRESS]
       │ (Team works on R&D, uploads prototype photos, test logs, code)
       ▼
[9. SPOC_VERIFIED]
       │ (University SPOC conducts lab inspection and signs off on milestone)
       ▼
[10. GOVT_VALIDATED]
       │ (Govt Nodal Officer verifies claim, disburses funds, conducts field trial)
       ▼
[11. RESOLVED_AND_DEPLOYED]
       │ (Solution deployed in target Jharkhand village/ward; Citizen notified)
```

---

## 🗺️ Detailed Phase-by-Phase Implementation Plan

### ✅ Phase 1: Cleanup & Foundation (COMPLETED)
- Removed Flutter mobile app and associated platform scripts.
- Consolidated repository into **100% React (Vite)** + **Flask AI Backend**.
- Synchronized documentation, architecture diagrams, and OpenAPI specifications.

---

### 🚧 Phase 2: Responsive Citizen Reporting Portal (CURRENT PROTOTYPE FOCUS)
- **Routes**: `/report` (Reporting wizard), `/citizen` (Citizen hub), `/track/:id` (Live issue tracker).
- **Responsive Layout**:
  - Mobile bottom navigation bar + full-screen floating action sheet.
  - Desktop multi-column layout with category cards and recent submissions.
- **Key Features**:
  1. 3-step reporting wizard: capture/upload media, type or speak optional notes, review and post AI-generated report.
  2. Integrated camera and gallery upload for photos/videos on mobile and desktop.
  3. Saaras v3 transcription for voice notes and spoken audio inside uploaded videos.
  4. Sarvam 105B synthesis for a neat citizen-style title, description, category, severity, urgency, and impact summary.
  5. Jharkhand GPS auto-detection with fallback location defaults for reliable demos.
  6. Public problem explorer, awareness feed, local submission persistence, and review screen polish.

---

### ⏳ Phase 3: Government Review & University Allocation
- **Routes**: `/government/problems`, `/government/challenges`, `/government/funding`.
- **Key Features**:
  1. Department-wise Problem Review Queue.
  2. AI matchmaker suggestion card (recommends best-fit universities based on faculty and past projects).
  3. 1-Click action to create & assign challenge to University SPOCs.
  4. Budget and CSR co-funding allocation dashboard.

---

### ⏳ Phase 4: University Portal (SPOC & Student/Faculty Teams)
- **Routes**: `/university/challenges`, `/university/teams`, `/university/projects`, `/university/milestones`.
- **Key Features**:
  1. **SPOC Dashboard**: View incoming challenges, create/approve student-faculty teams, assign faculty mentors.
  2. **Team Workspace**: Proposal submission, budget requests, task boards.
  3. **Milestone Tracker & Public Showcase**: Upload progress logs, lab photos, and testing outcomes.
  4. **SPOC Sign-off**: Verification workflow before milestone claims go to Government.

---

### ⏳ Phase 5: Industry & CSR Collaboration
- **Routes**: `/industry/challenges`, `/industry/projects`, `/industry/collaborations`, `/industry/funding`.
- **Key Features**:
  1. Public/Industry Innovation Feed: Browse ongoing university solutions across Jharkhand.
  2. CSR Grant Pledge & Funding Commitment system.
  3. Mentorship & Collaboration request module to contact teams and SPOCs.
  4. Pilot testing and technology transfer agreement workflow.

---

### ⏳ Phase 6: Analytics, Notifications & Hackathon Polish
- Real-time cross-stakeholder notifications (In-app alerts + simulated SMS/WhatsApp for citizens).
- Government Visual Analytics Dashboard (Submissions, Domain breakdown, University league table, Impact metrics).
- End-to-end testing, responsive polish, and Vercel cloud deployment.
