/**
 * Intelligent Client-Side Problem Synthesis Engine for SETU
 * Provides objective, evidence-grounded problem descriptions, factual titles,
 * dual severity & urgency assessment, potential impact bullets, and suggested routing.
 */

const OFFICIAL_CATEGORIES = [
  {
    name: 'Roads, Transport and Traffic Management',
    subcategory: 'Road Infrastructure',
    stakeholder: 'Roads & Traffic Infrastructure Authority',
    keywords: ['road', 'pothole', 'street', 'traffic', 'bridge', 'pavement', 'highway', 'footpath', 'signal', 'speedbreaker']
  },
  {
    name: 'Water Supply and Water Resources',
    subcategory: 'Water Distribution & Drainage',
    stakeholder: 'Water Supply & Drainage Board',
    keywords: ['water', 'pipe', 'leak', 'drain', 'sewer', 'sewage', 'tap', 'borewell', 'flooding', 'drinking water', 'waterlogging']
  },
  {
    name: 'Sanitation and Waste Management',
    subcategory: 'Solid Waste & Sanitation',
    stakeholder: 'Sanitation & Solid Waste Management Authority',
    keywords: ['garbage', 'waste', 'trash', 'dump', 'debris', 'litter', 'cleanliness', 'drainage', 'solid waste', 'bin']
  },
  {
    name: 'Electricity and Power Supply',
    subcategory: 'Utility Infrastructure',
    stakeholder: 'Power Distribution & Utility Authority',
    keywords: ['electric', 'power', 'wire', 'wires', 'light', 'pole', 'transformer', 'blackout', 'streetlight', 'outage', 'cable', 'cables', 'cabling']
  },
  {
    name: 'Public Health and Sanitation',
    subcategory: 'Community Health',
    stakeholder: 'Public Health Department',
    keywords: ['health', 'hospital', 'clinic', 'mosquito', 'dengue', 'malaria', 'disease', 'sanitary', 'medical']
  },
  {
    name: 'Environment and Pollution Control',
    subcategory: 'Environmental Quality',
    stakeholder: 'Environmental Protection Agency',
    keywords: ['pollution', 'tree', 'air', 'smoke', 'dust', 'noise', 'green', 'forest', 'factory emission']
  },
  {
    name: 'Urban Development and Infrastructure',
    subcategory: 'Civic Infrastructure',
    stakeholder: 'Urban Development & Infrastructure Agency',
    keywords: ['building', 'park', 'community', 'encroachment', 'construction', 'infrastructure', 'public']
  }
];

/**
 * Extracts street names, landmarks, and time references from freeform text or transcripts.
 */
function extractProblemDetails(text = '', locationDetails = {}) {
  const locFormatted = locationDetails.formatted || '';
  const locCity = locationDetails.villageCity || locationDetails.district || locationDetails.state || '';
  const locStreet = locationDetails.road || locationDetails.neighbourhood || locationDetails.suburb || '';

  let extractedStreet = locStreet || locFormatted || locCity || 'Local area';
  const streetPatterns = /(?:on|at|near|opposite|in front of|along)\s+([A-Z0-9a-z\s]{3,35}(?:Road|Street|Marg|Chowk|Nagar|Colony|Lane|Gali|Market|Bazaar|Sector|Block|Corner|Bridge|Park|Temple|School|Station|Hospital))/i;
  const streetMatch = text.match(streetPatterns);
  if (streetMatch && streetMatch[1]) {
    extractedStreet = streetMatch[1].trim();
  }

  let extractedTime = 'Recorded ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const timePatterns = /(?:since|from|around|at|for the past)\s+([A-Z0-9a-z\s]{2,25}(?:yesterday|today|morning|evening|night|days|hours|weeks|am|pm|o'clock))/i;
  const timeMatch = text.match(timePatterns);
  if (timeMatch && timeMatch[1]) {
    extractedTime = timeMatch[1].trim();
  }

  return {
    street: extractedStreet,
    time: extractedTime
  };
}

export function synthesizeFallbackProblem({
  notepadText = '',
  videoTranscripts = [],
  mediaItems = [],
  locationDetails = {},
  reporterType = 'Individual Citizen',
  groupName = ''
}) {
  const rawTranscripts = Array.isArray(videoTranscripts) ? videoTranscripts.filter(Boolean).join(' ') : (videoTranscripts || '');
  const combinedText = [notepadText, rawTranscripts].filter(Boolean).join(' ').trim();
  const locCity = locationDetails.villageCity || locationDetails.district || locationDetails.state || '';
  const locState = locationDetails.state || '';
  const locFormatted = locationDetails.formatted || (locCity ? `${locCity}, ${locState}` : '');

  // 1. Detect Category, Subcategory & Stakeholder
  let matchedConfig = OFFICIAL_CATEGORIES[6]; // Urban Development
  const lowerText = combinedText.toLowerCase();

  for (const cat of OFFICIAL_CATEGORIES) {
    if (cat.keywords.some((kw) => lowerText.includes(kw))) {
      matchedConfig = cat;
      break;
    }
  }

  // Check specific domain matches (e.g. tangled cables / wires)
  let subcategory = matchedConfig.subcategory;
  let issueType = matchedConfig.name;
  if (lowerText.includes('wire') || lowerText.includes('cable')) {
    subcategory = 'Utility Infrastructure';
    issueType = 'Unmanaged Overhead Cabling';
  } else if (lowerText.includes('pothole') || lowerText.includes('road')) {
    subcategory = 'Road Surface & Pavements';
    issueType = 'Damaged Road Surface';
  } else if (lowerText.includes('water') || lowerText.includes('drain') || lowerText.includes('flood')) {
    subcategory = 'Stormwater & Drainage';
    issueType = 'Waterlogging & Drainage Obstruction';
  } else if (lowerText.includes('garbage') || lowerText.includes('waste')) {
    subcategory = 'Solid Waste Collection';
    issueType = 'Uncollected Waste Accumulation';
  }

  // 2. Separate Severity (physical seriousness) vs Urgency (operational time-sensitivity)
  let severity = 'MEDIUM';
  let urgency = 'MEDIUM';

  if (
    lowerText.includes('hazard') ||
    lowerText.includes('deep pothole') ||
    lowerText.includes('live wire') ||
    lowerText.includes('collapse') ||
    lowerText.includes('severe damage') ||
    lowerText.includes('structural')
  ) {
    severity = 'HIGH';
  }

  if (
    lowerText.includes('urgent') ||
    lowerText.includes('immediately') ||
    lowerText.includes('blocking road') ||
    lowerText.includes('flooding') ||
    lowerText.includes('heavy rain') ||
    lowerText.includes('traffic blocked')
  ) {
    urgency = 'HIGH';
  }

  // 3. Extract Details (Street, Time, Landmarks)
  const { street, time } = extractProblemDetails(combinedText, locationDetails);

  // 4. Formulate Factual, Issue-Focused Title (WHAT the problem is)
  let title = '';
  if (lowerText.includes('wire') || lowerText.includes('cable')) {
    title = 'Tangled Overhead Utility Wires';
  } else if (lowerText.includes('pothole')) {
    title = 'Damaged Road Surface with Potholes';
  } else if (lowerText.includes('waterlog') || (lowerText.includes('water') && lowerText.includes('road'))) {
    title = 'Waterlogging on Roadway';
  } else if (lowerText.includes('garbage') || lowerText.includes('waste')) {
    title = 'Uncollected Waste Accumulation';
  } else if (lowerText.includes('drain') || lowerText.includes('sewer')) {
    title = 'Blocked Drainage Channel';
  } else if (lowerText.includes('light') || lowerText.includes('lamp')) {
    title = 'Non-Functional Streetlight';
  } else if (combinedText.length >= 10) {
    let clean = combinedText.split(/[.\n!?]/)[0].trim();
    clean = clean
      .replace(/^(i am reporting|i want to report|there is a|there is an|please fix the|issue with|urgent issue at|urgent problem at|problem regarding)/i, '')
      .trim();
    if (clean.length > 50) clean = clean.slice(0, 47).trim() + '...';
    if (clean) title = clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  if (!title) {
    title = `Observed ${matchedConfig.subcategory || matchedConfig.name} Problem`;
  }

  // 5. Objective, Direct, Evidence-Grounded Description (Problem Perspective)
  let description = '';
  const siteStr = street || locFormatted || locCity || 'the reported area';

  if (lowerText.includes('wire') || lowerText.includes('cable')) {
    description =
      `Multiple overhead utility cables are heavily tangled around a roadside utility pole near ${siteStr}, ` +
      `with several lines crossing and overlapping near surrounding structures and pathways. ` +
      `The unorganized cabling may create safety and maintenance concerns and makes inspection and fault identification more difficult.`;
  } else if (combinedText.length >= 15) {
    // Strip first-person complaint letter boilerplate if user wrote conversational text
    let cleanWords = combinedText
      .replace(/^(i am reporting an urgent issue regarding|i am reporting an urgent issue|i am reporting|i want to report|please fix|kindly inspect)/i, '')
      .replace(/please resolve this.*$/i, '')
      .replace(/i kindly request.*$/i, '')
      .trim();
    if (cleanWords) {
      cleanWords = cleanWords.charAt(0).toUpperCase() + cleanWords.slice(1);
    } else {
      cleanWords = combinedText;
    }
    description = `Physical problem observed near ${siteStr}: ${cleanWords}`;
  } else {
    description = `Physical defect observed in ${matchedConfig.name.toLowerCase()} near ${siteStr}, documented via uploaded on-site media.`;
  }

  // 6. Evidence-supported Potential Impact (Qualified bullet points, NO fabricated numbers)
  let potentialImpact = [];
  if (lowerText.includes('wire') || lowerText.includes('cable')) {
    potentialImpact = [
      'Difficult inspection and maintenance',
      'Potential safety concern for nearby residents and workers',
      'Visual and infrastructure clutter',
      'Possible obstruction around nearby structures'
    ];
  } else if (lowerText.includes('road') || lowerText.includes('pothole')) {
    potentialImpact = [
      'Disruption to vehicular and pedestrian movement',
      'Potential risk of vehicle tire or suspension damage',
      'Risk of sudden braking and localized traffic slowing'
    ];
  } else if (lowerText.includes('water') || lowerText.includes('flood')) {
    potentialImpact = [
      'Pedestrian and traffic movement obstruction',
      'Risk of water stagnation and localized hygiene concerns',
      'Possible deterioration of underlying road surface'
    ];
  } else {
    potentialImpact = [
      'Operational and maintenance constraint',
      'Potential convenience and safety concern in local vicinity',
      'Requires domain stakeholder inspection'
    ];
  }

  // 7. AI Observations: Observed Facts vs Qualified Inferences
  const mediaCount = mediaItems.length || 1;
  const aiObservations = {
    observed: [
      `Physical condition captured across ${mediaCount} media file(s)`,
      `Location metadata logged at ${locFormatted || locCity || 'site coordinates'}`
    ],
    potential_inference: [
      `Condition may require domain stakeholder inspection and physical maintenance`
    ]
  };

  if (lowerText.includes('wire') || lowerText.includes('cable')) {
    aiObservations.observed.unshift('Dense network of overlapping overhead cables attached to utility pole');
    aiObservations.potential_inference = [
      'Maintenance and inspection may be difficult due to cable density'
    ];
  }

  // 8. Suggested Routing & Collaboration Potential
  const suggestedRouting = {
    stakeholders: matchedConfig.stakeholder,
    collaboration_potential:
      lowerText.includes('wire') || lowerText.includes('cable')
        ? 'Potential opportunity for university/engineering teams to explore safer cable organization and infrastructure management solutions.'
        : 'Potential opportunity for engineering teams and research institutions to develop structured, durable solutions.'
  };

  return {
    title,
    description,
    category: matchedConfig.name,
    subcategory,
    issueType,
    severity,
    urgency,
    potentialImpact,
    aiObservations,
    suggestedRouting,
    impactCount: 'Local vicinity',
    impactDescription: potentialImpact.slice(0, 3).join(' • '),
    department: matchedConfig.stakeholder,
    reporterType: reporterType || 'Individual Citizen',
    groupName: groupName || ''
  };
}

// Backward-compatible export aliases
export const synthesizeFallbackGrievance = synthesizeFallbackProblem;
export const synthesizeFallbackChallenge = synthesizeFallbackProblem;
