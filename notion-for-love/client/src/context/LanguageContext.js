/**
 * Love Journey - Language Context
 * 
 * Internationalization context for managing language preferences
 * and translations between Vietnamese and English.
 * 
 * Created: 2025-06-27
 * Version: 1.0.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// Language context
const LanguageContext = createContext();

// Available languages
export const LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  },
  vi: {
    code: 'vi',
    name: 'Tiếng Việt',
    flag: '🇻🇳'
  }
};

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState({});

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && LANGUAGES[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Load translations when language changes
  useEffect(() => {
    loadTranslations(currentLanguage);
  }, [currentLanguage]);

  // Load translation files
  const loadTranslations = async (language) => {
    try {
      const translations = await import(`../translations/${language}.json`);
      setTranslations(translations.default || translations);
    } catch (error) {
      console.error(`Failed to load translations for ${language}:`, error);
      // Fallback to English if translation fails
      if (language !== 'en') {
        const fallbackTranslations = await import('../translations/en.json');
        setTranslations(fallbackTranslations.default || fallbackTranslations);
      }
    }
  };

  // Change language
  const changeLanguage = (languageCode) => {
    if (LANGUAGES[languageCode]) {
      setCurrentLanguage(languageCode);
      localStorage.setItem('language', languageCode);
    }
  };

  // Translation function
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let translation = translations;

    // Navigate through nested keys
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        // Return key if translation not found
        return key;
      }
    }

    // Handle string interpolation
    if (typeof translation === 'string' && Object.keys(params).length > 0) {
      return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param] || match;
      });
    }

    return translation || key;
  };

  // Get current language info
  const getCurrentLanguage = () => LANGUAGES[currentLanguage];

  // Check if language is RTL (not applicable for Vietnamese/English but good for future)
  const isRTL = () => false;

  const value = {
    currentLanguage,
    translations,
    availableLanguages: Object.values(LANGUAGES),
    changeLanguage,
    t,
    getCurrentLanguage,
    isRTL
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
