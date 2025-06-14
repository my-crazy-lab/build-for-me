import React, { useState } from 'react';
import { Save, User, Globe, Palette, DollarSign, Shield, Download, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useJars } from '../../context/JarsContext';

const Settings: React.FC = () => {
  const { user, updatePreferences } = useAuth();
  const { transactions, incomes, expenses, goals } = useJars();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    language: user?.preferences.language || 'en',
    theme: user?.preferences.theme || 'light',
    currency: user?.preferences.currency || 'USD',
  });
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    updatePreferences({
      language: formData.language as 'en' | 'vi',
      theme: formData.theme as 'light' | 'dark',
      currency: formData.currency,
    });
    setHasChanges(false);
  };

  const handleExportData = () => {
    const data = {
      user: user,
      transactions: transactions,
      incomes: incomes,
      expenses: expenses,
      goals: goals,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jars-data-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      if (user) {
        localStorage.removeItem(`jars_incomes_${user.id}`);
        localStorage.removeItem(`jars_expenses_${user.id}`);
        localStorage.removeItem(`jars_goals_${user.id}`);
        localStorage.removeItem(`jars_transactions_${user.id}`);
        window.location.reload();
      }
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'preferences', name: 'Preferences', icon: Palette },
    { id: 'data', name: 'Data Management', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your account and application preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="jar-card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Profile Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="input-field opacity-50 cursor-not-allowed"
                placeholder="Enter your email"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Email cannot be changed in this demo version
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <div className="jar-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Language & Region
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Globe className="h-4 w-4 inline mr-2" />
                  Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="input-field"
                >
                  <option value="en">English</option>
                  <option value="vi">Tiếng Việt</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <DollarSign className="h-4 w-4 inline mr-2" />
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="input-field"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="VND">VND - Vietnamese Dong</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                </select>
              </div>
            </div>
          </div>

          <div className="jar-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Appearance
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Palette className="h-4 w-4 inline mr-2" />
                Theme
              </label>
              <select
                value={formData.theme}
                onChange={(e) => handleInputChange('theme', e.target.value)}
                className="input-field"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Note: Dark mode styling is prepared but not fully implemented in this demo
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Data Management Tab */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="jar-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Data Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{transactions.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{incomes.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Income Records</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{expenses.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Expense Records</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{goals.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Goals</p>
              </div>
            </div>
          </div>

          <div className="jar-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Export & Backup
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Export All Data
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download a complete backup of your financial data
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  className="btn-primary flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          <div className="jar-card border-red-200 dark:border-red-700">
            <h3 className="text-lg font-semibold text-red-600 mb-4">
              Danger Zone
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900">
                <div>
                  <h4 className="font-medium text-red-900 dark:text-red-100">
                    Clear All Data
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Permanently delete all your financial records. This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={handleClearData}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
