/**
 * Setu Color Tokens Library
 * Standardized colors for primary accents, light-mode pastel backgrounds,
 * and WCAG-accessible high-contrast text.
 */

export const PRIMARY_COLORS = {
  indigo: '#818CF8',
  cyan: '#22D3EE',
  cyanAlt: '#00BCD4',
  emerald: '#34D399',
  amber: '#FB923C',
  pink: '#F472B6',
  purple: '#C084FC',
  blue: '#60A5FA',
  yellow: '#FACC15',
  lavender: '#A78BFA'
};

export const PASTEL_BACKGROUNDS = {
  softPurple: '#F3E8FF',
  softCyan: '#E0F7FA',
  softOrange: '#FFF3E0',
  softGreen: '#E8F5E9',
  softBlue: '#E3F2FD',
  softYellow: '#FFFDE7',
  softPink: '#FCE4EC',
  softLavender: '#EDE7F6'
};

export const HIGH_CONTRAST_TEXT = {
  darkCharcoal: '#0F172A',
  deepPurple: '#581C87',
  deepCyan: '#006064',
  deepOrange: '#7C2D12',
  deepGreen: '#064E3B',
  deepBlue: '#1E3A8A',
  deepAmber: '#713F12',
  deepPink: '#831843',
  deepViolet: '#4C1D95'
};

/**
 * Pre-calibrated 3-piece Harmony Triads (Background, Border/Accent, Text)
 */
export const COLOR_HARMONIES = {
  purple: {
    bg: PASTEL_BACKGROUNDS.softPurple,
    border: PRIMARY_COLORS.indigo,
    text: HIGH_CONTRAST_TEXT.deepPurple
  },
  cyan: {
    bg: PASTEL_BACKGROUNDS.softCyan,
    border: PRIMARY_COLORS.cyan,
    text: HIGH_CONTRAST_TEXT.deepCyan
  },
  orange: {
    bg: PASTEL_BACKGROUNDS.softOrange,
    border: PRIMARY_COLORS.amber,
    text: HIGH_CONTRAST_TEXT.deepOrange
  },
  green: {
    bg: PASTEL_BACKGROUNDS.softGreen,
    border: PRIMARY_COLORS.emerald,
    text: HIGH_CONTRAST_TEXT.deepGreen
  },
  blue: {
    bg: PASTEL_BACKGROUNDS.softBlue,
    border: PRIMARY_COLORS.blue,
    text: HIGH_CONTRAST_TEXT.deepBlue
  },
  yellow: {
    bg: PASTEL_BACKGROUNDS.softYellow,
    border: PRIMARY_COLORS.yellow,
    text: HIGH_CONTRAST_TEXT.deepAmber
  },
  pink: {
    bg: PASTEL_BACKGROUNDS.softPink,
    border: PRIMARY_COLORS.pink,
    text: HIGH_CONTRAST_TEXT.deepPink
  },
  lavender: {
    bg: PASTEL_BACKGROUNDS.softLavender,
    border: PRIMARY_COLORS.lavender,
    text: HIGH_CONTRAST_TEXT.deepViolet
  }
};
