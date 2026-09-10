/**
 * SETU - Official Indian Languages Registry
 * Strictly Indian languages (and English as official associate language)
 * Priority:
 * 1. Hindi (हिंदी)
 * 2. English
 * 3. Top spoken languages in Jharkhand (Santali, Khortha, Bengali, Urdu, Nagpuri, Mundari, Kurukh, Ho, Maithili, Bhojpuri, Magahi, Odia)
 * 4. Other major Scheduled Languages of India
 */

export const INDIAN_LANGUAGES = [
  // 1. Primary
  {
    id: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    glyph: 'ह',
    script: 'Devanagari',
    ringColor: '#F59E0B', // Warm Amber (from screenshot)
    bhashiniCode: 'hi',
    category: 'primary'
  },
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    glyph: 'En',
    script: 'Latin',
    ringColor: '#3B82F6', // Apple Blue
    bhashiniCode: 'en',
    category: 'primary'
  },

  // 2. Top Spoken in Jharkhand
  {
    id: 'sat',
    name: 'Santali',
    nativeName: 'संथाली (ᱥᱟᱱᱛᱟᱲᱤ)',
    glyph: 'ᱥ',
    script: 'Ol Chiki',
    ringColor: '#10B981', // Emerald Green
    bhashiniCode: 'sat',
    category: 'jharkhand'
  },
  {
    id: 'kht',
    name: 'Khortha',
    nativeName: 'खोरठा',
    glyph: 'ख',
    script: 'Devanagari',
    ringColor: '#F97316', // Vibrant Orange
    bhashiniCode: 'hi', // Fallback dialect mapping
    category: 'jharkhand'
  },
  {
    id: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    glyph: 'বা',
    script: 'Bengali',
    ringColor: '#14B8A6', // Teal (from screenshot)
    bhashiniCode: 'bn',
    category: 'jharkhand'
  },
  {
    id: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    glyph: 'دو',
    script: 'Perso-Arabic',
    ringColor: '#1E40AF', // Deep Indigo (from screenshot)
    bhashiniCode: 'ur',
    category: 'jharkhand'
  },
  {
    id: 'sck',
    name: 'Nagpuri / Sadri',
    nativeName: 'नागपुरी',
    glyph: 'ना',
    script: 'Devanagari',
    ringColor: '#84CC16', // Lime
    bhashiniCode: 'hi',
    category: 'jharkhand'
  },
  {
    id: 'unr',
    name: 'Mundari',
    nativeName: 'मुंडारी (ᱢᱩᱱᱰᱟᱨᱤ)',
    glyph: 'মু',
    script: 'Devanagari / Mundari Bani',
    ringColor: '#6366F1', // Indigo
    bhashiniCode: 'hi',
    category: 'jharkhand'
  },
  {
    id: 'kru',
    name: 'Kurukh / Oraon',
    nativeName: 'कुड़ुख़',
    glyph: 'कु',
    script: 'Tolong Siki / Devanagari',
    ringColor: '#EC4899', // Pink
    bhashiniCode: 'hi',
    category: 'jharkhand'
  },
  {
    id: 'hoc',
    name: 'Ho',
    nativeName: 'हो (ᱦᱳ)',
    glyph: 'हो',
    script: 'Warang Citi / Devanagari',
    ringColor: '#06B6D4', // Cyan
    bhashiniCode: 'hi',
    category: 'jharkhand'
  },
  {
    id: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    glyph: 'मै',
    script: 'Tirhuta / Devanagari',
    ringColor: '#D97706', // Ochre Amber
    bhashiniCode: 'mai',
    category: 'jharkhand'
  },
  {
    id: 'bho',
    name: 'Bhojpuri',
    nativeName: 'भोजपुरी',
    glyph: 'भो',
    script: 'Devanagari',
    ringColor: '#EA580C', // Deep Orange
    bhashiniCode: 'bho',
    category: 'jharkhand'
  },
  {
    id: 'mag',
    name: 'Magahi',
    nativeName: 'मगही',
    glyph: 'मग',
    script: 'Devanagari',
    ringColor: '#CA8A04', // Dark Gold
    bhashiniCode: 'mag',
    category: 'jharkhand'
  },
  {
    id: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    glyph: 'ଓ',
    script: 'Odia',
    ringColor: '#2563EB', // Blue
    bhashiniCode: 'or',
    category: 'jharkhand'
  },

  // 3. Other Major Scheduled Languages of India
  {
    id: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    glyph: 'తె',
    script: 'Telugu',
    ringColor: '#FBBF24', // Golden Amber (from screenshot)
    bhashiniCode: 'te',
    category: 'national'
  },
  {
    id: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    glyph: 'म',
    script: 'Devanagari',
    ringColor: '#7C3AED', // Violet (from screenshot)
    bhashiniCode: 'mr',
    category: 'national'
  },
  {
    id: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    glyph: 'த',
    script: 'Tamil',
    ringColor: '#2563EB', // Royal Blue (from screenshot)
    bhashiniCode: 'ta',
    category: 'national'
  },
  {
    id: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    glyph: 'ગુ',
    script: 'Gujarati',
    ringColor: '#EF4444', // Red (from screenshot)
    bhashiniCode: 'gu',
    category: 'national'
  },
  {
    id: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    glyph: 'ಕ',
    script: 'Kannada',
    ringColor: '#06B6D4', // Cyan (from screenshot)
    bhashiniCode: 'kn',
    category: 'national'
  },
  {
    id: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    glyph: 'മ',
    script: 'Malayalam',
    ringColor: '#4ADE80', // Soft Green (from screenshot)
    bhashiniCode: 'ml',
    category: 'national'
  },
  {
    id: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    glyph: 'ਪੰ',
    script: 'Gurmukhi',
    ringColor: '#F43F5E', // Rose Red (from screenshot)
    bhashiniCode: 'pa',
    category: 'national'
  },
  {
    id: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    glyph: 'অ',
    script: 'Bengali-Assamese',
    ringColor: '#10B981', // Green
    bhashiniCode: 'as',
    category: 'national'
  }
];

export const DEFAULT_LANGUAGE = 'hi';
