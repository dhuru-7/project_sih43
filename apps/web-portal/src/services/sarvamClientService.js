/**
 * Direct Client-Side Sarvam 105B Integration for SETU
 * Synthesizes evidence-grounded problem reports directly via Sarvam 105B.
 */

const SARVAM_API_KEY =
  import.meta.env.VITE_SARVAM_API_KEY ||
  'sk_u6a1ad1y_d17Zk95M94q4G7f9H3j2K1L5';

const OFFICIAL_CATEGORIES = [
  'Education',
  'Healthcare',
  'Agriculture',
  'Water Resources',
  'Environment',
  'Energy',
  'Urban Development and Infrastructure',
  'Accessibility and Inclusion',
  'Public Administration and Governance',
  'Rural Livelihoods and Development',
  'Disaster Management',
  'Transportation and Mobility',
  'Sanitation and Waste Management',
  'Employment and Entrepreneurship',
  'Housing and Community',
  'Public Safety and Security',
  'Cyber Security'
];

/**
 * Transcribes audio blob directly via Sarvam Saaras v3 STT.
 */
export async function transcribeAudioDirect(audioBlob, filename = 'speech.wav') {
  if (!audioBlob || audioBlob.size <= 800) return '';

  try {
    const formData = new FormData();
    formData.append('file', audioBlob, filename);
    formData.append('model', 'saaras:v3');
    formData.append('language_code', 'unknown');

    const res = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'api-subscription-key': SARVAM_API_KEY
      },
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      return (data?.transcript || '').trim();
    }
  } catch (err) {
    console.warn('Direct Sarvam STT failed:', err);
  }
  return '';
}

/**
 * Synthesizes an evidence-grounded problem report directly via Sarvam 105B.
 */
export async function generateProblemWithSarvam105B({
  text = '',
  videoTranscript = '',
  voiceTranscript = '',
  locationInfo = {},
  reporterType = 'Individual Citizen',
  groupName = ''
}) {
  const catsStr = OFFICIAL_CATEGORIES.map((c) => `'${c}'`).join(', ');

  const systemPrompt =
    `You are TARA, the AI Civic Intelligence Engine for SETU.\n` +
    `A citizen has reported a real-world problem using photos, video frames, voice notes, or text.\n` +
    `Analyze the input and synthesize an evidence-grounded, structured problem report.\n\n` +
    `CRITICAL PHILOSOPHY & EVIDENCE RULES:\n` +
    `1. Setu connects problems to appropriate stakeholders, government bodies, and potential academic/industry research collaborators. ` +
    `Do NOT assume every issue is a municipal complaint. Do NOT state that the municipality will resolve it or is responsible.\n` +
    `2. TITLE: Direct, factual, and problem-focused (under 10 words). Describe WHAT the problem is (e.g. 'Tangled Overhead Utility Wires', 'Waterlogging on Road', 'Damaged Road Surface', 'Uncollected Waste Accumulation', 'Broken Streetlight', 'Blocked Drainage'). ` +
    `NEVER use titles like 'Complaint Against Municipality', 'Urgent Civic Grievance', 'Societal Challenge: Utility', or 'Request for Municipal Intervention'.\n` +
    `3. DESCRIPTION: Factual, concise, and neutral. Describe the observed problem directly from a problem perspective. ` +
    `DO NOT use first-person complaint letters (NO 'I am reporting...', NO 'In our locality...', NO 'I kindly request the municipal authority...', NO 'Please resolve...', NO 'The concerned authority must...'). ` +
    `DO NOT invent unverified hazards or assumptions: never state 'risk of electrocution', 'live electrical wires', 'illegal wiring', or 'imminent catastrophe' unless directly proven by evidence. ` +
    `When inferring potential consequences, always use qualified phrasing ('potential', 'may', or 'appears').\n` +
    `4. POTENTIAL IMPACT: Provide a list of 2-4 concise, evidence-supported or qualified bullet points (e.g. ['Difficult inspection and maintenance', 'Potential safety concern for nearby residents and workers', 'Visual and infrastructure clutter', 'Possible obstruction around nearby structures']). ` +
    `NEVER invent numbers of affected people (no fake '50-100 residents at risk of electrocution'), deaths, injuries, or financial loss.\n` +
    `5. SEVERITY vs URGENCY: Keep them separate. ` +
    `- severity: Potential physical seriousness of the issue ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'). ` +
    `- urgency: How quickly operational attention may be needed ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'). Do not mark high urgency merely because the citizen used dramatic words like 'urgent'.\n` +
    `6. AI OBSERVATIONS: ` +
    `- observed: List of 2-3 directly visible or verified physical facts. ` +
    `- potential_inference: 1-2 reasonable, qualified conclusions using 'may', 'appears', or 'potential'.\n` +
    `7. SUGGESTED ROUTING: ` +
    `- stakeholders: Domain-relevant authority or entity (e.g. 'Relevant utility / infrastructure stakeholders', 'Urban infrastructure / roads authority', 'Sanitation / local body', 'Water supply & drainage board'). Do NOT default to municipality. ` +
    `- collaboration_potential: Potential opportunity for university, engineering, or industry collaboration (e.g. 'Potential opportunity for university/engineering teams to explore safer cable organization and infrastructure management solutions.').\n\n` +
    `Respond with ONLY valid JSON (no markdown fences) containing these exact keys:\n` +
    `{\n` +
    `  "title": "Factual problem title",\n` +
    `  "category": "Exactly one of: ${catsStr}",\n` +
    `  "subcategory": "Subcategory name (e.g. Utility Infrastructure)",\n` +
    `  "issue_type": "Specific issue type (e.g. Unmanaged Overhead Cabling)",\n` +
    `  "severity": "LOW | MEDIUM | HIGH | CRITICAL",\n` +
    `  "urgency": "LOW | MEDIUM | HIGH | CRITICAL",\n` +
    `  "description": "Factual neutral description without complaint letter phrasing",\n` +
    `  "potential_impact": ["Impact point 1", "Impact point 2"],\n` +
    `  "ai_observations": {\n` +
    `    "observed": ["Observed physical detail 1", "Observed physical detail 2"],\n` +
    `    "potential_inference": ["Qualified inference 1"]\n` +
    `  },\n` +
    `  "suggested_routing": {\n` +
    `    "stakeholders": "Relevant stakeholders",\n` +
    `    "collaboration_potential": "University / industry research & solution potential"\n` +
    `  },\n` +
    `  "reporter_type": "${reporterType}"\n` +
    `}`;

  const userParts = [];
  if (videoTranscript && videoTranscript.trim()) {
    userParts.push(`Spoken by citizen in video: '${videoTranscript.trim()}'`);
  }
  if (voiceTranscript && voiceTranscript.trim()) {
    userParts.push(`Spoken by citizen in voice note: '${voiceTranscript.trim()}'`);
  }
  if (text && text.trim()) {
    userParts.push(`Written notes: '${text.trim()}'`);
  }
  if (!userParts.length) {
    userParts.push('Visual problem reported with attached media evidence.');
  }

  const locAddress = locationInfo?.formatted || locationInfo?.villageCity || '';
  if (locAddress) {
    userParts.push(`Location: ${locAddress}`);
  }
  if (groupName) {
    userParts.push(`Organization / Community Body: ${groupName}`);
  }

  const userMessage = userParts.join('\n');

  try {
    const res = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'api-subscription-key': SARVAM_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sarvam-105b-conversations',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 600,
        temperature: 0.2
      })
    });

    if (res.ok) {
      const resJson = await res.json();
      let rawContent = resJson?.choices?.[0]?.message?.content?.trim() || '';

      if (rawContent.startsWith('```')) {
        rawContent = rawContent.split('\n').slice(1).join('\n');
      }
      if (rawContent.endsWith('```')) {
        rawContent = rawContent.split('\n').slice(0, -1).join('\n');
      }
      rawContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();

      const match = rawContent.match(/\{[\s\S]*\}/);
      if (match) {
        rawContent = match[0];
      }

      const parsed = JSON.parse(rawContent);

      let matchedCat = 'Urban Development and Infrastructure';
      const cat = parsed.category || '';
      for (const off of OFFICIAL_CATEGORIES) {
        if (
          off.toLowerCase() === cat.toLowerCase() ||
          off.toLowerCase().includes(cat.toLowerCase()) ||
          cat.toLowerCase().includes(off.toLowerCase())
        ) {
          matchedCat = off;
          break;
        }
      }

      let sev = String(parsed.severity || 'MEDIUM').toUpperCase().trim();
      if (!['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(sev)) {
        sev = 'MEDIUM';
      }

      let urg = String(parsed.urgency || 'MEDIUM').toUpperCase().trim();
      if (!['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(urg)) {
        urg = 'MEDIUM';
      }

      let potImpact = parsed.potential_impact;
      if (typeof potImpact === 'string') {
        potImpact = potImpact.split('\n').map((s) => s.replace(/^[•\- ]+/, '').trim()).filter(Boolean);
      } else if (!Array.isArray(potImpact) || !potImpact.length) {
        potImpact = [
          'Inspection and maintenance operational concern',
          'Potential safety concern for surrounding area',
          'Infrastructure clutter and access constraint'
        ];
      }

      const aiObs = parsed.ai_observations || {};
      const obs = Array.isArray(aiObs.observed)
        ? aiObs.observed
        : ['Observed physical condition documented via submitted media.'];
      const inf = Array.isArray(aiObs.potential_inference)
        ? aiObs.potential_inference
        : ['Potential operational impact subject to on-site evaluation.'];

      const routing = parsed.suggested_routing || {};
      const stakeholders = typeof routing === 'string'
        ? routing
        : routing.stakeholders || 'Relevant utility / infrastructure stakeholders';
      const collab = typeof routing === 'string'
        ? 'Potential opportunity for university/engineering teams to explore structured solutions.'
        : routing.collaboration_potential || 'Potential opportunity for university/engineering teams to explore structured solutions.';

      const titleRes = parsed.title || 'Observed Problem Report';
      const descRes = parsed.description || userMessage;

      return {
        title: titleRes,
        description: descRes,
        category: matchedCat,
        subcategory: parsed.subcategory || 'General Infrastructure',
        issueType: parsed.issue_type || titleRes,
        severity: sev,
        urgency: urg,
        potentialImpact: potImpact,
        aiObservations: {
          observed: obs,
          potential_inference: inf
        },
        suggestedRouting: {
          stakeholders,
          collaboration_potential: collab
        },
        impactCount: 'Local vicinity',
        impactDescription: potImpact.slice(0, 3).join(' • '),
        department: stakeholders,
        reporterType,
        groupName,
        language: 'hi-IN'
      };
    }
  } catch (err) {
    console.warn('Sarvam 105B direct invocation error:', err);
  }

  return null;
}

// Backward-compatible export aliases
export const generateGrievanceWithSarvam105B = generateProblemWithSarvam105B;
export const generateChallengeWithSarvam105B = generateProblemWithSarvam105B;
