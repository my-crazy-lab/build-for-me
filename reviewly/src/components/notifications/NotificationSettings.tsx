/**
 * Notification Settings Component for Reviewly Application
 * 
 * Configuration panel for notification preferences including email,
 * in-app notifications, and delivery frequency settings.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import type { NotificationSettings as NotificationSettingsType } from '../../pages/NotificationsPage';
import './NotificationSettings.css';

interface NotificationSettingsProps {
  settings: NotificationSettingsType;
  onSettingsChange: (settings: NotificationSettingsType) => void;
  onClose: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings,
  onSettingsChange,
  onClose,
}) => {
  const [localSettings, setLocalSettings] = useState<NotificationSettingsType>(settings);
  const [hasChanges, setHasChanges] = useState(false);

  // Handle setting changes
  const handleSettingChange = (section: keyof NotificationSettingsType, key: string, value: boolean) => {
    const updatedSettings = {
      ...localSettings,
      [section]: {
        ...localSettings[section],
        [key]: value,
      },
    };
    setLocalSettings(updatedSettings);
    setHasChanges(true);
  };

  // Save settings
  const handleSave = () => {
    onSettingsChange(localSettings);
    setHasChanges(false);
    onClose();
  };

  // Reset settings
  const handleReset = () => {
    setLocalSettings(settings);
    setHasChanges(false);
  };

  // Test notification
  const handleTestNotification = () => {
    // Simulate a test notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is a test notification from Reviewly.',
        icon: '/favicon.ico',
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Test Notification', {
            body: 'This is a test notification from Reviewly.',
            icon: '/favicon.ico',
          });
        }
      });
    } else {
      alert('Test notification sent! (Browser notifications not supported)');
    }
  };

  return (
    <div className="notification-settings-overlay">
      <div className="notification-settings-panel">
        <div className="settings-header">
          <h3>Notification Settings</h3>
          <button
            className="btn btn-ghost btn-small"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="settings-content">
          {/* Email Notifications */}
          <div className="settings-section">
            <div className="section-header">
              <h4>📧 Email Notifications</h4>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={localSettings.emailNotifications.enabled}
                  onChange={(e) => handleSettingChange('emailNotifications', 'enabled', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {localSettings.emailNotifications.enabled && (
              <div className="section-options">
                <label className="setting-option">
                  <input
                    type="checkbox"
                    checked={localSettings.emailNotifications.reviewDeadlines}
                    onChange={(e) => handleSettingChange('emailNotifications', 'reviewDeadlines', e.target.checked)}
                  />
                  <span className="option-label">Review deadlines</span>
                  <span className="option-description">Get notified about upcoming review deadlines</span>
                </label>

                <label className="setting-option">
                  <input
                    type="checkbox"
                    checked={localSettings.emailNotifications.feedbackRequests}
                    onChange={(e) => handleSettingChange('emailNotifications', 'feedbackRequests', e.target.checked)}
                  />
                  <span className="option-label">Feedback requests</span>
                  <span className="option-description">Receive emails when someone requests your feedback</span>
                </label>

                <label className="setting-option">
                  <input
                    type="checkbox"
                    checked={localSettings.emailNotifications.goalUpdates}
                    onChange={(e) => handleSettingChange('emailNotifications', 'goalUpdates', e.target.checked)}
                  />
                  <span className="option-label">Goal updates</span>
                  <span className="option-description">Get notified about goal progress and updates</span>
                </label>

                <label className="setting-option">
                  <input
                    type="checkbox"
                    checked={localSettings.emailNotifications.systemAlerts}
                    onChange={(e) => handleSettingChange('emailNotifications', 'systemAlerts', e.target.checked)}
                  />
                  <span className="option-label">System alerts</span>
                  <span className="option-description">Important system updates and announcements</span>
                </label>

                <label className="setting-option">
                  <input
                    type="checkbox"
                    checked={localSettings.emailNotifications.weeklyDigest}
                    onChange={(e) => handleSettingChange('emailNotifications', 'weeklyDigest', e.target.checked)}
                  />
                  <span className="option-label">Weekly digest</span>
                  <span className="option-description">Summary of your weekly activity and updates</span>
                </label>
              </div>
            )}
          </div>

          {/* In-App Notifications */}
          <div className="settings-section">
            <div className="section-header">
              <h4>🔔 In-App Notifications</h4>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={localSettings.inAppNotifications.enabled}
                  onChange={(e) => handleSettingChange('inAppNotifications', 'enabled', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {localSettings.inAppNotifications.enabled && (
              <div className="section-options">
                <label className="setting-option">
                  <input
                    type="checkbox"
                    checked={localSettings.inAppNotifications.showBadge}
                    onChange={(e) => handleSettingChange('inAppNotifications', 'showBadge', e.target.checked)}
                  />
                  <span className="option-label">Show notification badge</span>
                  <span className="option-description">Display unread count on navigation</span>
                </label>

                <label className="setting-option">
                  <input
                    type="checkbox"
                    checked={localSettings.inAppNotifications.playSound}
                    onChange={(e) => handleSettingChange('inAppNotifications', 'playSound', e.target.checked)}
                  />
                  <span className="option-label">Play notification sound</span>
                  <span className="option-description">Audio alert for new notifications</span>
                </label>

                <label className="setting-option">
                  <input
                    type="checkbox"
                    checked={localSettings.inAppNotifications.desktop}
                    onChange={(e) => handleSettingChange('inAppNotifications', 'desktop', e.target.checked)}
                  />
                  <span className="option-label">Desktop notifications</span>
                  <span className="option-description">Show browser notifications when app is open</span>
                </label>
              </div>
            )}
          </div>

          {/* Notification Frequency */}
          <div className="settings-section">
            <div className="section-header">
              <h4>⏰ Notification Frequency</h4>
            </div>

            <div className="section-options">
              <label className="setting-option radio">
                <input
                  type="radio"
                  name="frequency"
                  checked={localSettings.frequency.immediate}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleSettingChange('frequency', 'immediate', true);
                      handleSettingChange('frequency', 'daily', false);
                      handleSettingChange('frequency', 'weekly', false);
                    }
                  }}
                />
                <span className="option-label">Immediate</span>
                <span className="option-description">Receive notifications as they happen</span>
              </label>

              <label className="setting-option radio">
                <input
                  type="radio"
                  name="frequency"
                  checked={localSettings.frequency.daily}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleSettingChange('frequency', 'immediate', false);
                      handleSettingChange('frequency', 'daily', true);
                      handleSettingChange('frequency', 'weekly', false);
                    }
                  }}
                />
                <span className="option-label">Daily digest</span>
                <span className="option-description">Receive a daily summary of notifications</span>
              </label>

              <label className="setting-option radio">
                <input
                  type="radio"
                  name="frequency"
                  checked={localSettings.frequency.weekly}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleSettingChange('frequency', 'immediate', false);
                      handleSettingChange('frequency', 'daily', false);
                      handleSettingChange('frequency', 'weekly', true);
                    }
                  }}
                />
                <span className="option-label">Weekly digest</span>
                <span className="option-description">Receive a weekly summary of notifications</span>
              </label>
            </div>
          </div>

          {/* Test Notification */}
          <div className="settings-section">
            <div className="section-header">
              <h4>🧪 Test Notifications</h4>
            </div>
            <div className="section-options">
              <button
                className="btn btn-outline btn-medium"
                onClick={handleTestNotification}
              >
                Send Test Notification
              </button>
              <p className="test-description">
                Send a test notification to verify your settings are working correctly.
              </p>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <div className="footer-actions">
            <button
              className="btn btn-outline btn-medium"
              onClick={handleReset}
              disabled={!hasChanges}
            >
              Reset
            </button>
            <button
              className="btn btn-secondary btn-medium"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary btn-medium"
              onClick={handleSave}
              disabled={!hasChanges}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
