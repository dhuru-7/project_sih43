/**
 * Intelligent Client-Side Civic Grievance Synthesis Engine
 * Provides rich, authentic, first-person citizen grievance descriptions, titles,
 * categories, and impact estimations matching the citizen's direct voice.
 */

const OFFICIAL_CATEGORIES = [
  { name: 'Roads, Transport and Traffic Management', keywords: ['road', 'pothole', 'street', 'traffic', 'bridge', 'pavement', 'highway', 'footpath', 'signal', 'speedbreaker'] },
  { name: 'Water Supply and Water Resources', keywords: ['water', 'pipe', 'leak', 'drain', 'sewer', 'sewage', 'tap', 'borewell', 'flooding', 'drinking water'] },
  { name: 'Sanitation and Waste Management', keywords: ['garbage', 'waste', 'trash', 'dump', 'debris', 'litter', 'cleanliness', 'drainage', 'solid waste', 'bin'] },
  { name: 'Electricity and Power Supply', keywords: ['electric', 'power', 'wire', 'light', 'pole', 'transformer', 'blackout', 'streetlight', 'outage', 'cable'] },
  { name: 'Public Health and Sanitation', keywords: ['health', 'hospital', 'clinic', 'mosquito', 'dengue', 'malaria', 'disease', 'sanitary', 'medical'] },
  { name: 'Environment and Pollution Control', keywords: ['pollution', 'tree', 'air', 'smoke', 'dust', 'noise', 'green', 'forest', 'factory emission'] },
  { name: 'Urban Development and Infrastructure', keywords: ['building', 'park', 'community', 'encroachment', 'construction', 'infrastructure', 'public'] }
];

/**
 * Extracts street names, landmarks, time references, and specific issue details
 * from freeform text or transcripts.
 */
function extractGrievanceDetails(text = '', locationDetails = {}) {
  const locFormatted = locationDetails.formatted || '';
  const locCity = locationDetails.villageCity || locationDetails.district || locationDetails.state || '';
  const locStreet = locationDetails.road || locationDetails.neighbourhood || locationDetails.suburb || '';

  // Extract street / landmark if mentioned in text
  let extractedStreet = locStreet || locFormatted || locCity || 'Local neighborhood';
  const streetPatterns = /(?:on|at|near|opposite|in front of|along)\s+([A-Z0-9a-z\s]{3,35}(?:Road|Street|Marg|Chowk|Nagar|Colony|Lane|Gali|Market|Bazaar|Sector|Block|Corner|Bridge|Park|Temple|School|Station|Hospital))/i;
  const streetMatch = text.match(streetPatterns);
  if (streetMatch && streetMatch[1]) {
    extractedStreet = streetMatch[1].trim();
  }

  // Extract time reference if mentioned in text
  let extractedTime = 'Today around ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
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

export function synthesizeFallbackGrievance({
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

  // 1. Detect Category & Keywords
  let detectedCategory = 'Urban Development and Infrastructure';
  let severity = 'MEDIUM';
  const lowerText = combinedText.toLowerCase();

  for (const cat of OFFICIAL_CATEGORIES) {
    if (cat.keywords.some(kw => lowerText.includes(kw))) {
      detectedCategory = cat.name;
      break;
    }
  }

  // Detect severity signals
  if (
    lowerText.includes('danger') ||
    lowerText.includes('accident') ||
    lowerText.includes('overflow') ||
    lowerText.includes('severe') ||
    lowerText.includes('urgent') ||
    lowerText.includes('hazard') ||
    lowerText.includes('spark') ||
    lowerText.includes('leak')
  ) {
    severity = 'HIGH';
  }

  // 2. Extract Specific Details (Street, Time, Landmarks)
  const { street, time } = extractGrievanceDetails(combinedText, locationDetails);

  // 3. Formulate Title (Concise, snappy, under 10 words)
  let title = '';
  if (combinedText.length >= 10) {
    let firstSentence = combinedText.split(/[.\n!?]/)[0].trim();
    // Remove conversational prefixes for a professional civic title
    firstSentence = firstSentence
      .replace(/^(i am reporting|i want to report|there is a|there is an|please fix the|issue with|an urgent issue at|urgent issue at|an urgent problem at|urgent problem at|an urgent issue regarding|urgent issue regarding)/i, '')
      .trim();
    if (firstSentence.length > 55) {
      firstSentence = firstSentence.slice(0, 52).trim() + '...';
    }
    if (firstSentence) {
      title = firstSentence.charAt(0).toUpperCase() + firstSentence.slice(1);
    }
  }
  if (!title || title.length < 5) {
    const shortCat = detectedCategory.split(',')[0].split(' and ')[0];
    const locPart = street !== 'Local neighborhood' ? street : locCity;
    title = locPart ? `${shortCat} Issue at ${locPart}` : `Urgent ${shortCat} Issue`;
  }

  // 4. Formulate Authentic First-Person Citizen Description (HIGHLIGHTING DETAILS)
  let description = '';

  if (combinedText.length >= 15) {
    let cleanUserWords = combinedText.trim();
    let opening = '';

    if (
      cleanUserWords.toLowerCase().startsWith('i am ') ||
      cleanUserWords.toLowerCase().startsWith('i want to') ||
      cleanUserWords.toLowerCase().startsWith('in our ')
    ) {
      opening = cleanUserWords;
    } else {
      opening = `I am reporting an urgent civic issue: ${cleanUserWords.charAt(0).toLowerCase() + cleanUserWords.slice(1)}`;
    }
    if (!opening.endsWith('.')) opening += '.';

    description = `${opening}\n\n` +
      `Details:\n` +
      `• Street / Landmark: ${street || locFormatted || locCity || 'Not specified'}\n` +
      `• Time / Duration: ${time}\n` +
      `• Category: ${detectedCategory}\n` +
      `• Impact: Poses safety and convenience hazards for local residents and daily commuters.\n\n` +
      `Please send a field inspection team to investigate and resolve this problem as soon as possible.`;
  } else {
    // When only video/photos were captured without typed words:
    const issueLabel = detectedCategory.toLowerCase();
    description = `I am reporting an urgent civic problem regarding ${issueLabel} at ${street || locFormatted || locCity || 'our locality'}.\n\n` +
      `Details:\n` +
      `• Street / Landmark: ${street || locFormatted || locCity || 'Site recorded in attached video'}\n` +
      `• Time Noted: ${time}\n` +
      `• Core Issue: Visible ${issueLabel} requiring immediate municipal maintenance and repair\n` +
      `• Impact: Disruption of public movement and safety hazard for nearby residents and commuters\n\n` +
      `Requesting the concerned departmental authorities to inspect the site and fix this issue promptly.`;
  }

  return {
    title,
    description,
    category: detectedCategory,
    severity,
    impactCount: severity === 'HIGH' ? '250-500 local residents' : '100-250 local residents',
    impactDescription: `Public safety and daily convenience disruption reported in ${street || locCity || 'local neighborhood'}.`
  };
}
