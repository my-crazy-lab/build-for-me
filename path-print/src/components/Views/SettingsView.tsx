/**
 * Career Path Visualization - Settings View Component
 * 
 * This component provides application settings and preferences management
 * including theme, display options, and data management.
 * 
 * @fileoverview Application settings and preferences
 * @author Career Path Visualization Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Palette, 
  Monitor, 
  Sun, 
  Moon,
  Eye,
  Database,
  Bell,
  Shield,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Save,
  Info
} from 'lucide-react';
import { useAppContext } from '../Layout/AppLayout';

// ============================================================================
// INTERFACES
// ============================================================================

interface SettingsViewProps {
  className?: string;
}

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Settings view component
 */
export function SettingsView({ className = '' }: SettingsViewProps): React.JSX.Element {
  const { theme, toggleTheme, careerData } = useAppContext();
  const [activeSection, setActiveSection] = useState('appearance');
  const [settings, setSettings] = useState({
    animations: true,
    autoSave: true,
    notifications: true,
    analytics: false,
    highContrast: false,
    reducedMotion: false,
    defaultView: 'overview',
    dataBackup: true
  });

  const sections: SettingSection[] = [
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Theme, colors, and visual preferences',
      icon: Palette
    },
    {
      id: 'display',
      title: 'Display',
      description: 'Layout, animations, and accessibility',
      icon: Eye
    },
    {
      id: 'data',
      title: 'Data Management',
      description: 'Backup, import, and data handling',
      icon: Database
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Alerts and reminder preferences',
      icon: Bell
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Data privacy and security settings',
      icon: Shield
    }
  ];

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // TODO: Implement settings persistence
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        animations: true,
        autoSave: true,
        notifications: true,
        analytics: false,
        highContrast: false,
        reducedMotion: false,
        defaultView: 'overview',
        dataBackup: true
      });
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            console.log('Imported data:', data);
            alert('Data imported successfully! (Feature in development)');
          } catch (error) {
            alert('Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExportData = () => {
    if (careerData) {
      const dataStr = JSON.stringify(careerData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'career-data-backup.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all career data? This action cannot be undone.')) {
      console.log('Clearing data...');
      alert('Data clearing functionality will be implemented');
    }
  };

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Theme Preferences
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {theme === 'light' ? <Sun size={20} /> : 
               theme === 'dark' ? <Moon size={20} /> : 
               <Monitor size={20} />}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Theme Mode
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Current: {theme === 'auto' ? 'System' : theme.charAt(0).toUpperCase() + theme.slice(1)}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Toggle Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDisplaySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Display Options
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Animations
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Show smooth transitions and animations
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.animations}
              onChange={(e) => handleSettingChange('animations', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Reduced Motion
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Minimize animations for accessibility
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                High Contrast Mode
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Increase contrast for better visibility
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Default View
            </label>
            <select
              value={settings.defaultView}
              onChange={(e) => setSettings(prev => ({ ...prev, defaultView: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="overview">Overview</option>
              <option value="timeline">Timeline</option>
              <option value="map">Career Map</option>
              <option value="radar">Skills Radar</option>
              <option value="progress">Progress</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Data Management
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Auto-save Changes
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Automatically save changes as you make them
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Automatic Backups
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Create automatic backups of your data
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.dataBackup}
              onChange={(e) => handleSettingChange('dataBackup', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Data Actions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleImportData}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Upload size={16} />
                <span>Import</span>
              </button>
              <button
                onClick={handleExportData}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
              <button
                onClick={handleClearData}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Notifications
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Receive notifications about goals and milestones
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleSettingChange('notifications', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Privacy & Security
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Analytics & Usage Data
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Help improve the app by sharing anonymous usage data
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.analytics}
              onChange={(e) => handleSettingChange('analytics', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-3">
              <Info size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Data Privacy
                </h4>
                <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                  Your career data is stored locally in your browser and never sent to external servers 
                  unless you explicitly choose to export or share it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'appearance':
        return renderAppearanceSettings();
      case 'display':
        return renderDisplaySettings();
      case 'data':
        return renderDataSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      default:
        return renderAppearanceSettings();
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`max-w-6xl mx-auto ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your experience and manage your preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Settings Categories
            </h3>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                    ${activeSection === section.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <section.icon size={18} />
                  <div>
                    <div className="text-sm font-medium">{section.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {section.description}
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            {renderSectionContent()}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleResetSettings}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <RefreshCw size={16} />
                <span>Reset to Defaults</span>
              </button>
              
              <button
                onClick={handleSaveSettings}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} />
                <span>Save Settings</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
