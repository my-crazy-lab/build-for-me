/**
 * Language Selector Component for Reviewly Application
 * 
 * Dropdown component for selecting and changing the application language
 * with support for multiple languages and visual indicators.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, changeLanguage, getCurrentLanguage, getLanguageFlag } from '../../i18n';
import './LanguageSelector.css';

interface LanguageSelectorProps {
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  showLabel = true,
  compact = false,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  
  const currentLanguage = getCurrentLanguage();
  const currentLangInfo = supportedLanguages.find(lang => lang.code === currentLanguage) || supportedLanguages[0];

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === currentLanguage) {
      setIsOpen(false);
      return;
    }

    setIsChanging(true);
    try {
      await changeLanguage(languageCode);
      // Store the language preference
      localStorage.setItem('reviewly_language', languageCode);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <div className={`language-selector ${compact ? 'compact' : ''} ${className}`}>
      {showLabel && !compact && (
        <label className="language-label">
          {t('language.current')}:
        </label>
      )}
      
      <div className="language-dropdown">
        <button
          className={`language-trigger ${isOpen ? 'open' : ''}`}
          onClick={toggleDropdown}
          disabled={isChanging}
          title={t('language.change')}
        >
          <span className="language-flag">{currentLangInfo.flag}</span>
          {!compact && (
            <span className="language-name">{currentLangInfo.name}</span>
          )}
          <span className={`dropdown-arrow ${isOpen ? 'up' : 'down'}`}>
            {isChanging ? '⏳' : '▼'}
          </span>
        </button>

        {isOpen && (
          <>
            <div className="language-overlay" onClick={handleClickOutside} />
            <div className="language-menu">
              <div className="language-menu-header">
                <h4>{t('language.title')}</h4>
              </div>
              
              <div className="language-options">
                {supportedLanguages.map((language) => (
                  <button
                    key={language.code}
                    className={`language-option ${language.code === currentLanguage ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(language.code)}
                    disabled={isChanging}
                  >
                    <span className="option-flag">{language.flag}</span>
                    <span className="option-name">{language.name}</span>
                    <span className="option-code">({language.code.toUpperCase()})</span>
                    {language.code === currentLanguage && (
                      <span className="option-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="language-menu-footer">
                <p className="language-note">
                  {t('language.subtitle')}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
