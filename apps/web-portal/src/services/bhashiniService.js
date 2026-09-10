/**
 * SETU - Bhashini & IndicTrans2 Translation Service
 * Free Government of India / AI4Bharat Translation Pipeline
 */

import { INDIAN_LANGUAGES } from '../constants/languages';

const BHASHINI_PIPELINE_URL = '/api/bhashini/translate';

export const bhashiniService = {
  /**
   * Translate dynamic citizen or user content using Bhashini / IndicTrans2
   * @param {string} text - Source text to translate
   * @param {string} targetLang - Target language code (e.g. 'hi', 'sat', 'bn', 'en')
   * @param {string} sourceLang - Source language code (default 'en' or auto)
   */
  async translate(text, targetLang = 'hi', sourceLang = 'en') {
    if (!text || targetLang === sourceLang) return text;

    try {
      const response = await fetch(BHASHINI_PIPELINE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          target_lang: targetLang,
          source_lang: sourceLang
        })
      });

      if (!response.ok) {
        throw new Error(`Bhashini API status: ${response.status}`);
      }

      const data = await response.json();
      return data.translated_text || text;
    } catch (err) {
      console.warn('Bhashini service fallback: using raw text or client cache', err);
      return text;
    }
  },

  /**
   * Get Bhashini language metadata
   */
  getLanguageMeta(langId) {
    return INDIAN_LANGUAGES.find((l) => l.id === langId) || INDIAN_LANGUAGES[0];
  }
};
