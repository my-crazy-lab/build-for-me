/**
 * Internationalization (i18n) Configuration for Reviewly Application
 * 
 * This file sets up React i18next for multi-language support with
 * language detection, resource loading, and fallback handling.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation resources
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import frTranslations from './locales/fr.json';
import deTranslations from './locales/de.json';
import ptTranslations from './locales/pt.json';
import itTranslations from './locales/it.json';
import jaTranslations from './locales/ja.json';
import koTranslations from './locales/ko.json';
import zhTranslations from './locales/zh.json';

// Define supported languages
export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

// Translation resources
const resources = {
  en: { translation: enTranslations },
  es: { translation: esTranslations },
  fr: { translation: frTranslations },
  de: { translation: deTranslations },
  pt: { translation: ptTranslations },
  it: { translation: itTranslations },
  ja: { translation: jaTranslations },
  ko: { translation: koTranslations },
  zh: { translation: zhTranslations },
};

// Initialize i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Resources
    resources,
    
    // Default language
    fallbackLng: 'en',
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'reviewly_language',
    },
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // React options
    react: {
      useSuspense: false,
    },
    
    // Debug mode (disable in production)
    debug: process.env.NODE_ENV === 'development',
    
    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Key separator
    keySeparator: '.',
    
    // Nested separator
    nsSeparator: ':',
    
    // Return objects for complex translations
    returnObjects: true,
    
    // Return empty string for missing keys in development
    returnEmptyString: process.env.NODE_ENV === 'development',
    
    // Pluralization
    pluralSeparator: '_',
    contextSeparator: '_',
    
    // Backend options (if using HTTP backend)
    backend: {
      loadPath: '/locales/{{lng}}.json',
      addPath: '/locales/add/{{lng}}/{{ns}}',
    },
    
    // Save missing keys
    saveMissing: process.env.NODE_ENV === 'development',
    saveMissingTo: 'current',
    
    // Update missing keys
    updateMissing: process.env.NODE_ENV === 'development',
    
    // Postprocessing
    postProcess: ['interval', 'plural'],
    
    // Clean code on production
    cleanCode: true,
  });

// Export language utilities
export const getCurrentLanguage = () => i18n.language;
export const changeLanguage = (lng: string) => i18n.changeLanguage(lng);
export const getLanguageName = (code: string) => {
  const lang = supportedLanguages.find(l => l.code === code);
  return lang ? lang.name : code;
};
export const getLanguageFlag = (code: string) => {
  const lang = supportedLanguages.find(l => l.code === code);
  return lang ? lang.flag : '🌐';
};

// Export i18n instance
export default i18n;
