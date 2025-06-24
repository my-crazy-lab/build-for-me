/**
 * Security Settings Component for Reviewly Application
 * 
 * Component for managing security settings including password changes,
 * two-factor authentication, and session management.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import type { SecuritySettings as SecuritySettingsType } from '../../pages/ProfilePage';
import './SecuritySettings.css';

interface SecuritySettingsProps {
  security: SecuritySettingsType;
  onSave: (security: SecuritySettingsType) => void;
  isSaving: boolean;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  security,
  onSave,
  isSaving,
}) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Handle two-factor authentication toggle
  const handleTwoFactorToggle = () => {
    const updatedSecurity = {
      ...security,
      twoFactorEnabled: !security.twoFactorEnabled,
    };
    onSave(updatedSecurity);
  };

  // Handle password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    // Simulate password change
    const updatedSecurity = {
      ...security,
      lastPasswordChange: new Date(),
    };
    onSave(updatedSecurity);
    
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswordForm(false);
  };

  // Handle session termination
  const handleTerminateSession = (sessionId: string) => {
    const updatedSecurity = {
      ...security,
      activeSessions: security.activeSessions.filter(session => session.id !== sessionId),
    };
    onSave(updatedSecurity);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="security-settings">
      {/* Password Section */}
      <div className="security-section">
        <div className="section-header">
          <h3>Password</h3>
          <div className="section-info">
            <span>Last changed: {formatDate(security.lastPasswordChange)}</span>
          </div>
        </div>
        
        {!showPasswordForm ? (
          <button
            className="btn btn-outline btn-medium"
            onClick={() => setShowPasswordForm(true)}
          >
            Change Password
          </button>
        ) : (
          <form onSubmit={handlePasswordChange} className="password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                required
                minLength={8}
              />
              <small>Password must be at least 8 characters long</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline btn-medium"
                onClick={() => setShowPasswordForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-medium"
                disabled={isSaving}
              >
                {isSaving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="security-section">
        <div className="section-header">
          <h3>Two-Factor Authentication</h3>
          <div className="section-status">
            <span className={`status-badge ${security.twoFactorEnabled ? 'enabled' : 'disabled'}`}>
              {security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
        
        <p className="section-description">
          Add an extra layer of security to your account by requiring a verification code
          in addition to your password when signing in.
        </p>
        
        <button
          className={`btn btn-medium ${security.twoFactorEnabled ? 'btn-danger' : 'btn-primary'}`}
          onClick={handleTwoFactorToggle}
          disabled={isSaving}
        >
          {security.twoFactorEnabled ? 'Disable' : 'Enable'} Two-Factor Authentication
        </button>
      </div>

      {/* Active Sessions */}
      <div className="security-section">
        <div className="section-header">
          <h3>Active Sessions</h3>
          <div className="section-info">
            <span>{security.activeSessions.length} active session{security.activeSessions.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        
        <div className="sessions-list">
          {security.activeSessions.map(session => (
            <div key={session.id} className={`session-item ${session.current ? 'current' : ''}`}>
              <div className="session-info">
                <div className="session-device">
                  <span className="device-icon">💻</span>
                  <span className="device-name">{session.device}</span>
                  {session.current && <span className="current-badge">Current</span>}
                </div>
                <div className="session-details">
                  <span className="session-location">📍 {session.location}</span>
                  <span className="session-time">Last active: {formatDate(session.lastActive)}</span>
                </div>
              </div>
              
              {!session.current && (
                <button
                  className="btn btn-outline btn-small"
                  onClick={() => handleTerminateSession(session.id)}
                  disabled={isSaving}
                >
                  Terminate
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Login History */}
      <div className="security-section">
        <div className="section-header">
          <h3>Recent Login Activity</h3>
        </div>
        
        <div className="login-history">
          {security.loginHistory.slice(0, 5).map((login, index) => (
            <div key={index} className={`login-item ${login.success ? 'success' : 'failed'}`}>
              <div className="login-status">
                <span className={`status-icon ${login.success ? 'success' : 'failed'}`}>
                  {login.success ? '✅' : '❌'}
                </span>
              </div>
              
              <div className="login-info">
                <div className="login-device">{login.device}</div>
                <div className="login-details">
                  <span className="login-location">📍 {login.location}</span>
                  <span className="login-time">{formatDate(login.date)}</span>
                </div>
              </div>
              
              <div className="login-result">
                <span className={`result-text ${login.success ? 'success' : 'failed'}`}>
                  {login.success ? 'Successful' : 'Failed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Actions */}
      <div className="security-section danger-zone">
        <div className="section-header">
          <h3>Danger Zone</h3>
        </div>
        
        <div className="danger-actions">
          <div className="danger-action">
            <div className="action-info">
              <h4>Download Account Data</h4>
              <p>Download a copy of all your account data and activity.</p>
            </div>
            <button className="btn btn-outline btn-medium">
              Download Data
            </button>
          </div>
          
          <div className="danger-action">
            <div className="action-info">
              <h4>Delete Account</h4>
              <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
            </div>
            <button className="btn btn-danger btn-medium">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
