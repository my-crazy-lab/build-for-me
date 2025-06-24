/**
 * Preferences Form Component for Reviewly Application
 * 
 * Form for managing user preferences including theme, notifications,
 * privacy settings, and display options.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import type { UserPreferences } from '../../pages/ProfilePage';
import './PreferencesForm.css';

interface PreferencesFormProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  isSaving: boolean;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({
  preferences,
  onSave,
  isSaving,
}) => {
  const [formData, setFormData] = useState<UserPreferences>(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  // Handle form field changes
  const handleFieldChange = (field: keyof UserPreferences, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  // Handle nested field changes
  const handleNestedFieldChange = (parent: keyof UserPreferences, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent] as any,
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setHasChanges(false);
  };

  // Reset form
  const handleReset = () => {
    setFormData(preferences);
    setHasChanges(false);
  };

  return (
    <div className="preferences-form">
      <form onSubmit={handleSubmit}>
        {/* Appearance */}
        <div className="form-section">
          <h3>Appearance</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="theme">Theme</label>
              <select
                id="theme"
                value={formData.theme}
                onChange={(e) => handleFieldChange('theme', e.target.value as UserPreferences['theme'])}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => handleFieldChange('language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="timezone">Timezone</label>
              <select
                id="timezone"
                value={formData.timezone}
                onChange={(e) => handleFieldChange('timezone', e.target.value)}
              >
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="Europe/London">GMT</option>
                <option value="Europe/Paris">CET</option>
                <option value="Asia/Tokyo">JST</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dateFormat">Date Format</label>
              <select
                id="dateFormat"
                value={formData.dateFormat}
                onChange={(e) => handleFieldChange('dateFormat', e.target.value)}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="MMM DD, YYYY">MMM DD, YYYY</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="form-section">
          <h3>Notifications</h3>
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.emailNotifications}
                onChange={(e) => handleFieldChange('emailNotifications', e.target.checked)}
              />
              <span>Email notifications</span>
              <small>Receive notifications via email</small>
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.pushNotifications}
                onChange={(e) => handleFieldChange('pushNotifications', e.target.checked)}
              />
              <span>Push notifications</span>
              <small>Receive browser push notifications</small>
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.weeklyDigest}
                onChange={(e) => handleFieldChange('weeklyDigest', e.target.checked)}
              />
              <span>Weekly digest</span>
              <small>Receive a weekly summary of your activity</small>
            </label>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="form-section">
          <h3>Privacy Settings</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="profileVisibility">Profile Visibility</label>
              <select
                id="profileVisibility"
                value={formData.privacySettings.profileVisibility}
                onChange={(e) => handleNestedFieldChange('privacySettings', 'profileVisibility', e.target.value)}
              >
                <option value="public">Public</option>
                <option value="team">Team Only</option>
                <option value="private">Private</option>
              </select>
              <small>Who can see your profile information</small>
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.privacySettings.showEmail}
                onChange={(e) => handleNestedFieldChange('privacySettings', 'showEmail', e.target.checked)}
              />
              <span>Show email address</span>
              <small>Display your email on your profile</small>
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.privacySettings.showPhone}
                onChange={(e) => handleNestedFieldChange('privacySettings', 'showPhone', e.target.checked)}
              />
              <span>Show phone number</span>
              <small>Display your phone number on your profile</small>
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.privacySettings.showLocation}
                onChange={(e) => handleNestedFieldChange('privacySettings', 'showLocation', e.target.checked)}
              />
              <span>Show location</span>
              <small>Display your location on your profile</small>
            </label>
          </div>
        </div>

        {/* Dashboard Settings */}
        <div className="form-section">
          <h3>Dashboard Settings</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="dashboardLayout">Dashboard Layout</label>
              <select
                id="dashboardLayout"
                value={formData.dashboardLayout}
                onChange={(e) => handleFieldChange('dashboardLayout', e.target.value)}
              >
                <option value="default">Default</option>
                <option value="compact">Compact</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="defaultView">Default View</label>
              <select
                id="defaultView"
                value={formData.defaultView}
                onChange={(e) => handleFieldChange('defaultView', e.target.value)}
              >
                <option value="dashboard">Dashboard</option>
                <option value="reviews">Reviews</option>
                <option value="feedback">Feedback</option>
                <option value="goals">Goals</option>
                <option value="analytics">Analytics</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline btn-medium"
            onClick={handleReset}
            disabled={!hasChanges || isSaving}
          >
            Reset
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-medium"
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PreferencesForm;
