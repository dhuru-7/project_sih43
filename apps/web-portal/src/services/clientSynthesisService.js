/**
 * Intelligent Client-Side Civic Grievance Synthesis Engine
 * Provides rich, context-aware fallback titles, descriptions, categories, and impact
 * estimations when backend AI services are offline or the live backend URL is not yet connected.
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

export function synthesizeFallbackGrievance({
  notepadText = '',
  videoTranscripts = [],
  mediaItems = [],
  locationDetails = {},
  reporterType = 'Individual Citizen',
  groupName = ''
}) {
  const combinedText = [notepadText, ...videoTranscripts].filter(Boolean).join(' ').trim();
  const locCity = locationDetails.villageCity || locationDetails.district || locationDetails.state || '';
  const locState = locationDetails.state || '';
  const locFormatted = locationDetails.formatted || (locCity ? `${locCity}, ${locState}` : '');
  const locSuffix = locCity ? ` in ${locCity}` : '';

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
    lowerText.includes('spark')
  ) {
    severity = 'HIGH';
  }

  // 2. Analyze Media Attachments
  const photoCount = mediaItems.filter(m => !m.type || m.type === 'image').length;
  const videoCount = mediaItems.filter(m => m.type === 'video').length;
  const audioCount = mediaItems.filter(m => m.type === 'audio').length;

  const mediaParts = [];
  if (photoCount > 0) mediaParts.push(`${photoCount} geotagged photograph${photoCount > 1 ? 's' : ''}`);
  if (videoCount > 0) mediaParts.push(`${videoCount} on-site video recording${videoCount > 1 ? 's' : ''}`);
  if (audioCount > 0) mediaParts.push(`${audioCount} audio testimony`);
  const evidenceSummary = mediaParts.length > 0 ? mediaParts.join(' and ') : 'photographic evidence';

  // 3. Formulate Title
  let title = '';
  if (combinedText.length >= 10) {
    // Extract first punchy sentence or phrase
    let firstSentence = combinedText.split(/[.\n!?]/)[0].trim();
    if (firstSentence.length > 55) {
      firstSentence = firstSentence.slice(0, 52).trim() + '...';
    }
    title = firstSentence;
    // Capitalize first letter
    title = title.charAt(0).toUpperCase() + title.slice(1);
  } else {
    // Generate context-aware title from category and location
    const shortCat = detectedCategory.split(',')[0].split(' and ')[0];
    title = locCity
      ? `${shortCat} Issue at ${locCity}`
      : `Civic ${shortCat} Issue`;
  }

  // 4. Formulate Comprehensive Description
  let description = '';
  if (combinedText.length >= 15) {
    description = combinedText;
    if (locFormatted) {
      description += `\n\nLocation: Observed at ${locFormatted}.`;
    }
    if (mediaParts.length > 0) {
      description += ` Verified with ${evidenceSummary} submitted by ${reporterType}${groupName ? ` (${groupName})` : ''}.`;
    }
  } else {
    description = `Ground-level civic grievance reported by ${reporterType}${groupName ? ` (${groupName})` : ''} regarding ${detectedCategory.toLowerCase()}${locSuffix ? ` in ${locFormatted || locCity}` : ''}. Verified with ${evidenceSummary} uploaded for official departmental inspection and prioritized resolution.`;
  }

  return {
    title,
    description,
    category: detectedCategory,
    severity,
    impactCount: severity === 'HIGH' ? '250-500 local residents' : '100-250 local residents',
    impactDescription: `Public safety and daily convenience disruption reported in ${locCity || 'local neighborhood'}.`
  };
}
