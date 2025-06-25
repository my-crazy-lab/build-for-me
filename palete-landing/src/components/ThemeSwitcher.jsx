import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Palette, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * ThemeSwitcher Component
 * 
 * A dropdown component that allows users to switch between different themes.
 * Features:
 * - Live theme preview with color swatches
 * - Smooth transitions
 * - Keyboard navigation support
 * - Click outside to close
 * - System theme detection indicator
 */

export default function ThemeSwitcher() {
  const { currentTheme, themes, changeTheme, getActiveTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeSelect = (themeId) => {
    changeTheme(themeId);
    setIsOpen(false);
  };

  const activeTheme = getActiveTheme();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Theme Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-earthy-sand/30 
                   bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200
                   text-earthy-brown hover:border-earthy-terracotta/50 group"
        aria-label="Switch theme"
        aria-expanded={isOpen}
      >
        <Palette className="w-4 h-4 text-earthy-terracotta group-hover:rotate-12 transition-transform" />
        <span className="text-sm font-medium hidden sm:inline">
          {activeTheme?.name || 'Theme'}
        </span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-md 
                        rounded-xl shadow-xl border border-earthy-sand/30 overflow-hidden z-50
                        animate-slide-up">
          <div className="p-3 border-b border-earthy-sand/20">
            <h3 className="text-sm font-semibold text-earthy-brown flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Choose Theme
            </h3>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {Object.values(themes).map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className={`w-full px-4 py-3 text-left hover:bg-earthy-cream/50 
                           transition-colors duration-150 flex items-center gap-3 group
                           ${currentTheme === theme.id ? 'bg-earthy-cream/70' : ''}`}
              >
                {/* Color Preview */}
                <div className="flex gap-1">
                  {theme.preview.map((color, index) => (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-full border border-white/50 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Theme Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-earthy-brown">
                      {theme.name}
                    </span>
                    {theme.id === 'auto' && (
                      <Monitor className="w-3 h-3 text-earthy-olive" />
                    )}
                    {currentTheme === theme.id && (
                      <div className="w-2 h-2 bg-earthy-terracotta rounded-full" />
                    )}
                  </div>
                  <p className="text-xs text-earthy-olive truncate">
                    {theme.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-earthy-sand/20 bg-earthy-light/30">
            <p className="text-xs text-earthy-olive text-center">
              Theme preference is saved automatically
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
