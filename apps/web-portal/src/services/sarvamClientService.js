/**
 * Client-Side Direct Sarvam AI Service for SETU.
 * Provides resilient, zero-latency direct inference with Sarvam Saaras v3 STT
 * and Sarvam 105B when deployed on static/serverless hosts where backend proxies encounter network limits.
 *
 * api.sarvam.ai natively supports CORS with Access-Control-Allow-Origin: *
 */

export const SARVAM_API_KEY = import.meta.env.VITE_SARVAM_API_KEY || 'sk_4epvscwg_NfXygGdgX2p496s19l0VhjQP';

export const OFFICIAL_CATEGORIES = [
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
 * Synthesizes an authentic, first-person citizen grievance report directly via Sarvam 105B.
 */
export async function generateGrievanceWithSarvam105B({
  text = '',
  videoTranscript = '',
  voiceTranscript = '',
  locationInfo = {},
  reporterType = 'Individual Citizen',
  groupName = ''
}) {
  const catsStr = OFFICIAL_CATEGORIES.map((c) => `'${c}'`).join(', ');

  const systemPrompt =
    `You are TARA, the AI Civic Intelligence Engine for SETU (India National Citizen Grievance & Innovation Platform).\n` +
    `A citizen has reported a civic problem using spoken video, voice note, or written text.\n` +
    `Synthesize this into an authentic, actionable citizen grievance report.\n` +
    `CRITICAL REQUIREMENT FOR DESCRIPTION: Write the 'description' in the FIRST PERSON from the perspective of the reporting citizen themselves (e.g. 'I am reporting an urgent issue...', 'In our street...').\n` +
    `NEVER use third-person bureaucratic phrasing like 'A grievance was reported by Individual Citizen'.\n` +
    `Highlight the exact street name, nearby landmark, time/duration, core problem, and impact.\n` +
    `Format the description with an opening statement, followed by structured bullet details:\n` +
    `• Street / Landmark: [name]\n` +
    `• Time / Duration: [time]\n` +
    `• Specific Issue: [problem]\n` +
    `• Impact: [who is affected]\n` +
    `and end with a polite request for municipal action.\n` +
    `Respond with ONLY valid JSON (no markdown fences) containing these exact keys:\n` +
    `'title' (direct, under 10 words, stating problem and area),\n` +
    `'description' (the first-person structured description),\n` +
    `'category' (MUST be exactly one of: ${catsStr}),\n` +
    `'severity' (MUST be one of: 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),\n` +
    `'impact_count' (e.g. '100-250 local residents'),\n` +
    `'impact_description' (1-2 sentences on who is affected),\n` +
    `'department' (appropriate municipal department),\n` +
    `'reporter_type' ('${reporterType}').`;

  const userParts = [];
  if (videoTranscript && videoTranscript.trim()) {
    userParts.append
      ? userParts.push(`Spoken by citizen in video: '${videoTranscript.trim()}'`)
      : userParts.push(`Spoken by citizen in video: '${videoTranscript.trim()}'`);
  }
  if (voiceTranscript && voiceTranscript.trim()) {
    userParts.push(`Spoken by citizen in voice note: '${voiceTranscript.trim()}'`);
  }
  if (text && text.trim()) {
    userParts.push(`Written notes: '${text.trim()}'`);
  }
  if (!userParts.length) {
    userParts.push('Civic problem reported with attached media evidence.');
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
        max_tokens: 550,
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
        if (off.toLowerCase() === cat.toLowerCase() || off.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(off.toLowerCase())) {
          matchedCat = off;
          break;
        }
      }

      let sev = String(parsed.severity || 'MEDIUM').toUpperCase().trim();
      if (!['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(sev)) {
        sev = 'MEDIUM';
      }

      return {
        title: parsed.title || 'Civic Grievance Report',
        description: parsed.description || userMessage,
        category: matchedCat,
        severity: sev,
        impactCount: String(parsed.impact_count || '100-250 local residents'),
        impactDescription: String(parsed.impact_description || 'Affects local residents and daily commuters.'),
        department: parsed.department || 'Municipal Corporation',
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
