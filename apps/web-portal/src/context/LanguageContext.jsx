import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INDIAN_LANGUAGES, DEFAULT_LANGUAGE } from '../constants/languages';
import { getTranslation } from '../constants/translations';
import { bhashiniService } from '../services/bhashiniService';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Synchronously initialize from localStorage to prevent initial render flicker
  const [currentLanguage, setCurrentLanguageState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('setu_language') || DEFAULT_LANGUAGE;
    }
    return DEFAULT_LANGUAGE;
  });

  const languageMeta = INDIAN_LANGUAGES.find((l) => l.id === currentLanguage) || INDIAN_LANGUAGES[0];

  const setLanguage = useCallback((langId) => {
    const valid = INDIAN_LANGUAGES.find((l) => l.id === langId);
    const chosen = valid ? langId : DEFAULT_LANGUAGE;
    setCurrentLanguageState(chosen);
    if (typeof window !== 'undefined') {
      localStorage.setItem('setu_language', chosen);
      // Also tag the html lang attribute for accessibility & typography
      document.documentElement.lang = chosen;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  // Synchronous, zero-latency, zero-flicker translation lookup
  const t = useCallback((key, fallback = '') => {
    return getTranslation(currentLanguage, key, fallback);
  }, [currentLanguage]);

  // Dynamic content translation via Bhashini
  const translateDynamic = useCallback(async (text, sourceLang = 'en') => {
    return bhashiniService.translate(text, currentLanguage, sourceLang);
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        languageMeta,
        setLanguage,
        t,
        translateDynamic,
        languages: INDIAN_LANGUAGES,
        bhashiniEnabled: true
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
