/**
 * Love Journey - Theme Demo Component
 * 
 * Demo component to showcase the theme system with all color schemes
 * and dark/light mode variations.
 * 
 * Created: 2025-06-27
 * Version: 1.0.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Heart, Star, Palette } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const ThemeDemo = () => {
  const { 
    theme, 
    isDark, 
    colorScheme, 
    colorSchemes, 
    setThemeMode, 
    setColorSchemeMode,
    getCurrentColorScheme 
  } = useTheme();

  const currentScheme = getCurrentColorScheme();

  return (
    <div className="p-8 space-y-8 bg-primary text-primary">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gradient mb-4">
          Love Journey Theme System
        </h1>
        <p className="text-secondary text-lg">
          Beautiful themes that adapt to your preferences
        </p>
      </div>

      {/* Current Theme Info */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-primary">Current Theme</h2>
          <ThemeToggle />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-secondary rounded-lg">
            <div className="flex justify-center mb-2">
              {theme === 'light' ? <Sun className="w-8 h-8 text-accent" /> :
               theme === 'dark' ? <Moon className="w-8 h-8 text-accent" /> :
               <Monitor className="w-8 h-8 text-accent" />}
            </div>
            <h3 className="font-semibold text-primary">Mode</h3>
            <p className="text-secondary capitalize">{theme}</p>
          </div>
          
          <div className="text-center p-4 bg-secondary rounded-lg">
            <div className="flex justify-center mb-2">
              <Palette className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-semibold text-primary">Color Scheme</h3>
            <p className="text-secondary">{currentScheme.name}</p>
          </div>
          
          <div className="text-center p-4 bg-secondary rounded-lg">
            <div className="flex justify-center space-x-1 mb-2">
              {Object.values(currentScheme.colors).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-primary"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <h3 className="font-semibold text-primary">Colors</h3>
            <p className="text-secondary text-sm">{currentScheme.description}</p>
          </div>
        </div>
      </div>

      {/* Theme Mode Selector */}
      <div className="card p-6">
        <h2 className="text-2xl font-semibold text-primary mb-4">Theme Modes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'light', label: 'Light', icon: Sun, desc: 'Clean and bright' },
            { value: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes' },
            { value: 'system', label: 'System', icon: Monitor, desc: 'Follows device' }
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = theme === mode.value;
            
            return (
              <motion.button
                key={mode.value}
                onClick={() => setThemeMode(mode.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  isActive 
                    ? 'border-accent bg-card' 
                    : 'border-primary hover:border-secondary'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className={`w-8 h-8 mx-auto mb-2 ${
                  isActive ? 'text-accent' : 'text-secondary'
                }`} />
                <h3 className={`font-semibold ${
                  isActive ? 'text-accent' : 'text-primary'
                }`}>
                  {mode.label}
                </h3>
                <p className="text-secondary text-sm">{mode.desc}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Color Scheme Selector */}
      <div className="card p-6">
        <h2 className="text-2xl font-semibold text-primary mb-4">Color Schemes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(colorSchemes).map(([key, scheme]) => {
            const isActive = colorScheme === key;
            
            return (
              <motion.button
                key={key}
                onClick={() => setColorSchemeMode(key)}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  isActive 
                    ? 'border-accent bg-card' 
                    : 'border-primary hover:border-secondary'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-semibold ${
                    isActive ? 'text-accent' : 'text-primary'
                  }`}>
                    {scheme.name}
                  </h3>
                  {isActive && (
                    <Star className="w-4 h-4 text-accent fill-current" />
                  )}
                </div>
                
                <div className="flex space-x-2 mb-2">
                  {Object.values(scheme.colors).map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full border border-primary"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                
                <p className="text-secondary text-sm">{scheme.description}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Component Examples */}
      <div className="card p-6">
        <h2 className="text-2xl font-semibold text-primary mb-4">Component Examples</h2>
        
        <div className="space-y-6">
          {/* Buttons */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary">Primary Button</button>
              <button className="btn-secondary">Secondary Button</button>
              <button className="btn-outline">Outline Button</button>
              <button className="btn-ghost">Ghost Button</button>
            </div>
          </div>

          {/* Cards */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card card-hover p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Heart className="w-6 h-6 text-accent" />
                  <h4 className="font-semibold text-primary">Love Memory</h4>
                </div>
                <p className="text-secondary">
                  A beautiful memory from our journey together.
                </p>
              </div>
              
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Star className="w-6 h-6 text-accent" />
                  <h4 className="font-semibold text-primary">Glass Card</h4>
                </div>
                <p className="text-secondary">
                  Elegant glass morphism effect.
                </p>
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Form Elements</h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Enter your thoughts..." 
                className="input"
              />
              <textarea 
                placeholder="Share your feelings..." 
                className="input h-24 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background Examples */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">Background Examples</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-romantic p-6 rounded-lg">
            <h3 className="font-semibold text-primary mb-2">Romantic Background</h3>
            <p className="text-secondary">Soft gradient background perfect for romantic content.</p>
          </div>
          
          <div className="bg-romantic-radial p-6 rounded-lg">
            <h3 className="font-semibold text-primary mb-2">Radial Background</h3>
            <p className="text-secondary">Subtle radial gradient for elegant sections.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;
