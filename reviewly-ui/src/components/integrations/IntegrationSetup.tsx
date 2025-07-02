/**
 * Integration Setup Component for Reviewly Application
 * 
 * Modal component for setting up and configuring external integrations
 * with OAuth simulation and settings management.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import type { Integration, IntegrationSettings } from '../../pages/IntegrationsPage';
import './IntegrationSetup.css';

interface IntegrationSetupProps {
  integration: Integration;
  onComplete: (integrationId: string, settings: IntegrationSettings) => void;
  onCancel: () => void;
}

const IntegrationSetup: React.FC<IntegrationSetupProps> = ({
  integration,
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [settings, setSettings] = useState<IntegrationSettings>(integration.settings);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 'auth', title: 'Authentication', icon: '🔐' },
    { id: 'permissions', title: 'Permissions', icon: '🛡️' },
    { id: 'settings', title: 'Settings', icon: '⚙️' },
    { id: 'complete', title: 'Complete', icon: '✅' },
  ];

  // Simulate OAuth connection
  const handleOAuthConnect = async () => {
    setIsConnecting(true);
    
    // Simulate OAuth flow
    setTimeout(() => {
      // Simulate successful OAuth
      const mockToken = `mock_token_${integration.type}_${Date.now()}`;
      
      if (integration.type === 'github') {
        setSettings(prev => ({
          ...prev,
          github: {
            repositories: [],
            includeCommits: true,
            includePRs: true,
            includeIssues: true,
            syncFrequency: 'weekly',
            ...prev.github,
            accessToken: mockToken,
          }
        }));
      } else if (integration.type === 'jira') {
        setSettings(prev => ({
          ...prev,
          jira: {
            serverUrl: '',
            projects: [],
            includeIssues: true,
            includeComments: true,
            syncFrequency: 'weekly',
            ...prev.jira,
            accessToken: mockToken,
          }
        }));
      } else if (integration.type === 'notion') {
        setSettings(prev => ({
          ...prev,
          notion: {
            databases: [],
            pages: [],
            syncFrequency: 'weekly',
            ...prev.notion,
            accessToken: mockToken,
          }
        }));
      }
      
      setIsConnecting(false);
      setCurrentStep(1);
    }, 2000);
  };

  // Handle settings update
  const handleSettingsUpdate = (field: string, value: any) => {
    if (integration.type === 'github') {
      setSettings(prev => ({
        ...prev,
        github: {
          repositories: [],
          includeCommits: true,
          includePRs: true,
          includeIssues: true,
          syncFrequency: 'weekly',
          ...prev.github,
          [field]: value,
        }
      }));
    } else if (integration.type === 'jira') {
      setSettings(prev => ({
        ...prev,
        jira: {
          serverUrl: '',
          projects: [],
          includeIssues: true,
          includeComments: true,
          syncFrequency: 'weekly',
          ...prev.jira,
          [field]: value,
        }
      }));
    } else if (integration.type === 'notion') {
      setSettings(prev => ({
        ...prev,
        notion: {
          databases: [],
          pages: [],
          syncFrequency: 'weekly',
          ...prev.notion,
          [field]: value,
        }
      }));
    }
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      // Check if authenticated
      const hasToken =
        (integration.type === 'github' && settings.github?.accessToken) ||
        (integration.type === 'jira' && settings.jira?.accessToken) ||
        (integration.type === 'notion' && settings.notion?.accessToken);

      if (!hasToken) {
        newErrors.auth = 'Please complete authentication first';
      }
    }

    if (step === 2) {
      // Validate settings
      if (integration.type === 'jira' && !settings.jira?.serverUrl) {
        newErrors.serverUrl = 'Server URL is required for Jira integration';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  // Handle completion
  const handleComplete = () => {
    if (validateStep(currentStep)) {
      onComplete(integration.id, settings);
    }
  };

  return (
    <div className="integration-setup-overlay">
      <div className="integration-setup-modal">
        <div className="setup-header">
          <div className="setup-title">
            <span className="setup-icon">{integration.icon}</span>
            <h2>Connect {integration.name}</h2>
          </div>
          <button
            className="btn btn-ghost btn-small"
            onClick={onCancel}
          >
            ✕
          </button>
        </div>

        {/* Step Navigation */}
        <div className="step-navigation">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`step-item ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            >
              <div className="step-icon">{step.icon}</div>
              <div className="step-title">{step.title}</div>
            </div>
          ))}
        </div>

        <div className="setup-content">
          {/* Step 0: Authentication */}
          {currentStep === 0 && (
            <div className="setup-step">
              <h3>Authenticate with {integration.name}</h3>
              <p>Connect your {integration.name} account to start importing data.</p>
              
              <div className="auth-section">
                <div className="auth-info">
                  <h4>What we'll access:</h4>
                  <ul>
                    {integration.dataTypes.map(type => (
                      <li key={type}>
                        {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="auth-action">
                  {(integration.type === 'github' && settings.github?.accessToken) ||
                   (integration.type === 'jira' && settings.jira?.accessToken) ||
                   (integration.type === 'notion' && settings.notion?.accessToken) ? (
                    <div className="auth-success">
                      <span className="success-icon">✅</span>
                      <p>Successfully connected to {integration.name}</p>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary btn-large"
                      onClick={handleOAuthConnect}
                      disabled={isConnecting}
                    >
                      {isConnecting ? (
                        <>
                          <span className="spinner-small"></span>
                          Connecting...
                        </>
                      ) : (
                        <>
                          🔗 Connect to {integration.name}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              {errors.auth && <span className="error-message">{errors.auth}</span>}
            </div>
          )}

          {/* Step 1: Permissions */}
          {currentStep === 1 && (
            <div className="setup-step">
              <h3>Review Permissions</h3>
              <p>These permissions are required for the integration to work properly.</p>
              
              <div className="permissions-list">
                {integration.permissions.map(permission => (
                  <div key={permission} className="permission-item">
                    <span className="permission-icon">✓</span>
                    <div className="permission-info">
                      <h4>{permission}</h4>
                      <p>Required for accessing {integration.name} data</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Settings */}
          {currentStep === 2 && (
            <div className="setup-step">
              <h3>Configure Settings</h3>
              <p>Customize how data is imported from {integration.name}.</p>
              
              {/* GitHub Settings */}
              {integration.type === 'github' && (
                <div className="settings-form">
                  <div className="form-group">
                    <label>Repositories (comma-separated)</label>
                    <input
                      type="text"
                      value={settings.github?.repositories.join(', ') || ''}
                      onChange={(e) => handleSettingsUpdate('repositories', e.target.value.split(',').map(r => r.trim()).filter(r => r))}
                      placeholder="owner/repo1, owner/repo2"
                    />
                  </div>
                  
                  <div className="form-options">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.github?.includeCommits || false}
                        onChange={(e) => handleSettingsUpdate('includeCommits', e.target.checked)}
                      />
                      Include commits
                    </label>
                    
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.github?.includePRs || false}
                        onChange={(e) => handleSettingsUpdate('includePRs', e.target.checked)}
                      />
                      Include pull requests
                    </label>
                    
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.github?.includeIssues || false}
                        onChange={(e) => handleSettingsUpdate('includeIssues', e.target.checked)}
                      />
                      Include issues
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <label>Sync Frequency</label>
                    <select
                      value={settings.github?.syncFrequency || 'weekly'}
                      onChange={(e) => handleSettingsUpdate('syncFrequency', e.target.value)}
                    >
                      <option value="manual">Manual</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Jira Settings */}
              {integration.type === 'jira' && (
                <div className="settings-form">
                  <div className="form-group">
                    <label>Server URL *</label>
                    <input
                      type="url"
                      value={settings.jira?.serverUrl || ''}
                      onChange={(e) => handleSettingsUpdate('serverUrl', e.target.value)}
                      placeholder="https://your-domain.atlassian.net"
                      className={errors.serverUrl ? 'error' : ''}
                    />
                    {errors.serverUrl && <span className="error-message">{errors.serverUrl}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Projects (comma-separated)</label>
                    <input
                      type="text"
                      value={settings.jira?.projects.join(', ') || ''}
                      onChange={(e) => handleSettingsUpdate('projects', e.target.value.split(',').map(p => p.trim()).filter(p => p))}
                      placeholder="PROJECT1, PROJECT2"
                    />
                  </div>
                  
                  <div className="form-options">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.jira?.includeIssues || false}
                        onChange={(e) => handleSettingsUpdate('includeIssues', e.target.checked)}
                      />
                      Include issues
                    </label>
                    
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.jira?.includeComments || false}
                        onChange={(e) => handleSettingsUpdate('includeComments', e.target.checked)}
                      />
                      Include comments
                    </label>
                  </div>
                </div>
              )}

              {/* Notion Settings */}
              {integration.type === 'notion' && (
                <div className="settings-form">
                  <div className="form-group">
                    <label>Database IDs (comma-separated)</label>
                    <input
                      type="text"
                      value={settings.notion?.databases.join(', ') || ''}
                      onChange={(e) => handleSettingsUpdate('databases', e.target.value.split(',').map(d => d.trim()).filter(d => d))}
                      placeholder="database-id-1, database-id-2"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Page IDs (comma-separated)</label>
                    <input
                      type="text"
                      value={settings.notion?.pages.join(', ') || ''}
                      onChange={(e) => handleSettingsUpdate('pages', e.target.value.split(',').map(p => p.trim()).filter(p => p))}
                      placeholder="page-id-1, page-id-2"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Complete */}
          {currentStep === 3 && (
            <div className="setup-step">
              <h3>Setup Complete!</h3>
              <p>Your {integration.name} integration is ready to use.</p>
              
              <div className="completion-summary">
                <div className="summary-item">
                  <span className="summary-icon">🔗</span>
                  <div className="summary-info">
                    <h4>Connected Successfully</h4>
                    <p>Your {integration.name} account is now connected</p>
                  </div>
                </div>
                
                <div className="summary-item">
                  <span className="summary-icon">📊</span>
                  <div className="summary-info">
                    <h4>Data Import Ready</h4>
                    <p>You can now import data from {integration.name}</p>
                  </div>
                </div>
                
                <div className="summary-item">
                  <span className="summary-icon">🔄</span>
                  <div className="summary-info">
                    <h4>Auto-Sync Enabled</h4>
                    <p>Data will sync automatically based on your settings</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="setup-footer">
          <div className="setup-navigation">
            <button
              className="btn btn-outline btn-medium"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              ← Previous
            </button>
            
            <span className="step-indicator">
              Step {currentStep + 1} of {steps.length}
            </span>
            
            {currentStep < steps.length - 1 ? (
              <button
                className="btn btn-primary btn-medium"
                onClick={handleNext}
                disabled={isConnecting}
              >
                Next →
              </button>
            ) : (
              <button
                className="btn btn-success btn-medium"
                onClick={handleComplete}
              >
                Complete Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSetup;
