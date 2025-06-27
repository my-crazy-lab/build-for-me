/**
 * Love Journey - Settings Page
 *
 * Comprehensive settings page with theme management, preferences,
 * and account settings for the Love Journey application.
 *
 * Created: 2025-06-27
 * Version: 1.0.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Palette, Monitor, Sun, Moon, Bell, Lock, User, Heart,
  Globe, Smartphone, Mail, Shield, Download, Trash2,
  Save, RefreshCw, Eye, EyeOff
} from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ThemeToggle from '../components/ui/ThemeToggle';
import LanguageSelector from '../components/ui/LanguageSelector';

const Settings = () => {
  const { user } = useAuth();
  const { t, getCurrentLanguage } = useLanguage();
  const {
    theme,
    colorScheme,
    colorSchemes,
    setThemeMode,
    setColorSchemeMode,
    getCurrentColorScheme
  } = useTheme();

  const [activeTab, setActiveTab] = useState('appearance');
  const [notifications, setNotifications] = useState({
    milestones: true,
    memories: true,
    goals: false,
    checkins: true,
    email: true,
    push: false
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    memoriesPublic: false,
    goalsVisible: true
  });

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'account', label: 'Account', icon: User },
  ];

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Clean and bright interface' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes in low light' },
    { value: 'system', label: 'System', icon: Monitor, description: 'Follows your device setting' }
  ];

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyChange = (key) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderAppearanceTab = () => (
    <div className="space-y-8">
      {/* Theme Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Theme Mode
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = theme === option.value;

            return (
              <motion.button
                key={option.value}
                onClick={() => setThemeMode(option.value)}
                className={clsx(
                  'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                  isActive
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className={clsx(
                    'w-5 h-5',
                    isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'
                  )} />
                  <span className={clsx(
                    'font-medium',
                    isActive ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-gray-100'
                  )}>
                    {option.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {option.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Color Scheme Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Color Scheme
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(colorSchemes).map(([key, scheme]) => {
            const isActive = colorScheme === key;

            return (
              <motion.button
                key={key}
                onClick={() => setColorSchemeMode(key)}
                className={clsx(
                  'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                  isActive
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={clsx(
                    'font-medium',
                    isActive ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-gray-100'
                  )}>
                    {scheme.name}
                  </span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-primary-500 rounded-full"
                    />
                  )}
                </div>
                <div className="flex space-x-2 mb-2">
                  {Object.values(scheme.colors).map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {scheme.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Theme Preview */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Preview
        </h3>
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Sample Card
            </h4>
            <ThemeToggle size="sm" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This is how your interface will look with the current theme settings.
          </p>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
              Primary Button
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Secondary Button
            </button>
          </div>
        </div>
      </div>

      {/* Language Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Language / Ngôn ngữ
        </h3>
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
                Interface Language
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose your preferred language for the application interface
              </p>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          App Notifications
        </h3>
        <div className="space-y-4">
          {[
            { key: 'milestones', label: 'Milestone reminders', description: 'Get notified about upcoming milestones' },
            { key: 'memories', label: 'Memory suggestions', description: 'Suggestions to capture new memories' },
            { key: 'goals', label: 'Goal progress', description: 'Updates on your relationship goals' },
            { key: 'checkins', label: 'Check-in reminders', description: 'Daily relationship check-ins' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.label}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
              <button
                onClick={() => handleNotificationChange(item.key)}
                className={clsx(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  notifications[item.key] ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                )}
              >
                <span
                  className={clsx(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Communication
        </h3>
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email notifications', description: 'Receive updates via email', icon: Mail },
            { key: 'push', label: 'Push notifications', description: 'Browser push notifications', icon: Smartphone }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-gray-500" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.label}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange(item.key)}
                  className={clsx(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    notifications[item.key] ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  )}
                >
                  <span
                    className={clsx(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Profile Visibility
        </h3>
        <div className="space-y-4">
          {[
            { key: 'profileVisible', label: 'Profile visibility', description: 'Make your profile visible to others' },
            { key: 'memoriesPublic', label: 'Public memories', description: 'Allow others to see your memories' },
            { key: 'goalsVisible', label: 'Goal sharing', description: 'Share your relationship goals' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.label}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
              <button
                onClick={() => handlePrivacyChange(item.key)}
                className={clsx(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  privacy[item.key] ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                )}
              >
                <span
                  className={clsx(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    privacy[item.key] ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Privacy Notice</h4>
        </div>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          Your data is always encrypted and secure. These settings only control what you choose to share.
        </p>
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Profile Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              defaultValue={user?.name}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              defaultValue={user?.email}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Data Management
        </h3>
        <div className="space-y-3">
          <button className="flex items-center space-x-3 w-full p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Download className="w-5 h-5 text-blue-500" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Export Data</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Download all your data</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 w-full p-3 text-left rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <Trash2 className="w-5 h-5 text-red-500" />
            <div>
              <h4 className="font-medium text-red-700 dark:text-red-400">Delete Account</h4>
              <p className="text-sm text-red-600 dark:text-red-500">Permanently delete your account</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return renderAppearanceTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'account':
        return renderAccountTab();
      default:
        return renderAppearanceTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Customize your Love Journey experience
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      'flex items-center space-x-3 w-full px-4 py-3 text-left rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'
                    )}
                  >
                    <Icon className={clsx(
                      'w-5 h-5',
                      isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'
                    )} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </div>

            {/* Save button */}
            <div className="mt-6 flex justify-end">
              <button className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200">
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
