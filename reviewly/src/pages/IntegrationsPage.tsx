/**
 * Integrations Page Component for Reviewly Application
 * 
 * Comprehensive integration management system for external tools like
 * GitHub, Jira, and Notion with OAuth handling and data import capabilities.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/SimpleAuthContext';
import IntegrationCard from '../components/integrations/IntegrationCard';
import IntegrationSetup from '../components/integrations/IntegrationSetup';
import DataImportModal from '../components/integrations/DataImportModal';
import './IntegrationsPage.css';

// Integration interfaces
export interface Integration {
  id: string;
  type: 'github' | 'jira' | 'notion' | 'slack' | 'teams' | 'google-workspace';
  name: string;
  description: string;
  icon: string;
  isConnected: boolean;
  isActive: boolean;
  lastSync?: Date;
  settings: IntegrationSettings;
  permissions: string[];
  dataTypes: string[];
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  errorMessage?: string;
  syncStats?: {
    totalItems: number;
    lastSyncItems: number;
    successRate: number;
  };
}

export interface IntegrationSettings {
  github?: {
    accessToken?: string;
    repositories: string[];
    includeCommits: boolean;
    includePRs: boolean;
    includeIssues: boolean;
    syncFrequency: 'manual' | 'daily' | 'weekly';
  };
  jira?: {
    serverUrl: string;
    accessToken?: string;
    projects: string[];
    includeIssues: boolean;
    includeComments: boolean;
    syncFrequency: 'manual' | 'daily' | 'weekly';
  };
  notion?: {
    accessToken?: string;
    databases: string[];
    pages: string[];
    syncFrequency: 'manual' | 'daily' | 'weekly';
  };
  slack?: {
    accessToken?: string;
    channels: string[];
    includeMessages: boolean;
    includeFiles: boolean;
  };
  teams?: {
    accessToken?: string;
    teams: string[];
    includeMessages: boolean;
    includeFiles: boolean;
  };
  googleWorkspace?: {
    accessToken?: string;
    includeCalendar: boolean;
    includeDrive: boolean;
    includeGmail: boolean;
  };
}

const IntegrationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [showSetup, setShowSetup] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load integrations from localStorage
  useEffect(() => {
    const savedIntegrations = localStorage.getItem(`reviewly_integrations_${user?.id}`);
    if (savedIntegrations) {
      const parsedIntegrations = JSON.parse(savedIntegrations);
      setIntegrations(parsedIntegrations);
    } else {
      // Initialize with available integrations
      const availableIntegrations: Integration[] = [
        {
          id: 'github',
          type: 'github',
          name: 'GitHub',
          description: 'Import commits, pull requests, and issues to showcase your development work',
          icon: '🐙',
          isConnected: false,
          isActive: false,
          settings: {
            github: {
              repositories: [],
              includeCommits: true,
              includePRs: true,
              includeIssues: true,
              syncFrequency: 'weekly'
            }
          },
          permissions: ['read:user', 'repo'],
          dataTypes: ['commits', 'pull_requests', 'issues'],
          status: 'disconnected'
        },
        {
          id: 'jira',
          type: 'jira',
          name: 'Jira',
          description: 'Sync tickets, projects, and work logs to demonstrate project contributions',
          icon: '🔷',
          isConnected: false,
          isActive: false,
          settings: {
            jira: {
              serverUrl: '',
              projects: [],
              includeIssues: true,
              includeComments: true,
              syncFrequency: 'weekly'
            }
          },
          permissions: ['read:jira-work', 'read:jira-user'],
          dataTypes: ['issues', 'projects', 'worklogs'],
          status: 'disconnected'
        },
        {
          id: 'notion',
          type: 'notion',
          name: 'Notion',
          description: 'Import pages and databases to highlight documentation and planning work',
          icon: '📝',
          isConnected: false,
          isActive: false,
          settings: {
            notion: {
              databases: [],
              pages: [],
              syncFrequency: 'weekly'
            }
          },
          permissions: ['read'],
          dataTypes: ['pages', 'databases'],
          status: 'disconnected'
        },
        {
          id: 'slack',
          type: 'slack',
          name: 'Slack',
          description: 'Import messages and files to show collaboration and communication',
          icon: '💬',
          isConnected: false,
          isActive: false,
          settings: {
            slack: {
              channels: [],
              includeMessages: true,
              includeFiles: true
            }
          },
          permissions: ['channels:read', 'chat:write'],
          dataTypes: ['messages', 'files'],
          status: 'disconnected'
        },
        {
          id: 'teams',
          type: 'teams',
          name: 'Microsoft Teams',
          description: 'Sync team conversations and shared files for collaboration evidence',
          icon: '👥',
          isConnected: false,
          isActive: false,
          settings: {
            teams: {
              teams: [],
              includeMessages: true,
              includeFiles: true
            }
          },
          permissions: ['Team.ReadBasic.All', 'Chat.Read'],
          dataTypes: ['messages', 'files'],
          status: 'disconnected'
        },
        {
          id: 'google-workspace',
          type: 'google-workspace',
          name: 'Google Workspace',
          description: 'Import calendar events, drive files, and emails for comprehensive activity tracking',
          icon: '🔍',
          isConnected: false,
          isActive: false,
          settings: {
            googleWorkspace: {
              includeCalendar: true,
              includeDrive: true,
              includeGmail: false
            }
          },
          permissions: ['https://www.googleapis.com/auth/calendar.readonly'],
          dataTypes: ['calendar', 'drive', 'gmail'],
          status: 'disconnected'
        }
      ];
      setIntegrations(availableIntegrations);
      localStorage.setItem(`reviewly_integrations_${user?.id}`, JSON.stringify(availableIntegrations));
    }
  }, [user?.id]);

  // Save integrations to localStorage
  const saveIntegrations = (updatedIntegrations: Integration[]) => {
    setIntegrations(updatedIntegrations);
    localStorage.setItem(`reviewly_integrations_${user?.id}`, JSON.stringify(updatedIntegrations));
  };

  // Handle integration connection
  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowSetup(true);
  };

  // Handle integration disconnection
  const handleDisconnect = (integrationId: string) => {
    if (window.confirm('Are you sure you want to disconnect this integration?')) {
      const updatedIntegrations = integrations.map(integration =>
        integration.id === integrationId
          ? {
              ...integration,
              isConnected: false,
              isActive: false,
              status: 'disconnected' as const,
              lastSync: undefined,
              syncStats: undefined
            }
          : integration
      );
      saveIntegrations(updatedIntegrations);
    }
  };

  // Handle integration setup completion
  const handleSetupComplete = (integrationId: string, settings: IntegrationSettings) => {
    const updatedIntegrations = integrations.map(integration =>
      integration.id === integrationId
        ? {
            ...integration,
            isConnected: true,
            isActive: true,
            status: 'connected' as const,
            settings: { ...integration.settings, ...settings },
            lastSync: new Date(),
            syncStats: {
              totalItems: Math.floor(Math.random() * 100) + 10,
              lastSyncItems: Math.floor(Math.random() * 20) + 1,
              successRate: 0.95 + Math.random() * 0.05
            }
          }
        : integration
    );
    saveIntegrations(updatedIntegrations);
    setShowSetup(false);
    setSelectedIntegration(null);
  };

  // Handle data import
  const handleImportData = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowImportModal(true);
  };

  // Handle sync
  const handleSync = async (integrationId: string) => {
    setIsLoading(true);
    
    // Update status to syncing
    const updatedIntegrations = integrations.map(integration =>
      integration.id === integrationId
        ? { ...integration, status: 'syncing' as const }
        : integration
    );
    setIntegrations(updatedIntegrations);

    // Simulate sync process
    setTimeout(() => {
      const finalIntegrations = integrations.map(integration =>
        integration.id === integrationId
          ? {
              ...integration,
              status: 'connected' as const,
              lastSync: new Date(),
              syncStats: {
                totalItems: (integration.syncStats?.totalItems || 0) + Math.floor(Math.random() * 10) + 1,
                lastSyncItems: Math.floor(Math.random() * 15) + 1,
                successRate: 0.9 + Math.random() * 0.1
              }
            }
          : integration
      );
      saveIntegrations(finalIntegrations);
      setIsLoading(false);
    }, 3000);
  };

  // Calculate statistics
  const stats = {
    total: integrations.length,
    connected: integrations.filter(i => i.isConnected).length,
    active: integrations.filter(i => i.isActive).length,
    totalSynced: integrations.reduce((sum, i) => sum + (i.syncStats?.totalItems || 0), 0),
  };

  return (
    <div className="integrations-page">
      {/* Header */}
      <div className="page-header">
        <button
          className="btn btn-outline btn-medium back-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
        
        <div className="header-info">
          <h1>Integrations</h1>
          <p>Connect external tools to automatically import your work data</p>
        </div>
        
        <div className="header-actions">
          <button
            className="btn btn-secondary btn-medium"
            onClick={() => setShowImportModal(true)}
            disabled={stats.connected === 0}
          >
            📥 Import Data
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="integrations-stats">
        <div className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-content">
            <h3>Available</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Connected</h3>
            <p className="stat-value">{stats.connected}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <h3>Active</h3>
            <p className="stat-value">{stats.active}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Items Synced</h3>
            <p className="stat-value">{stats.totalSynced}</p>
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="integrations-content">
        <div className="integrations-grid">
          {integrations.map(integration => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onConnect={() => handleConnect(integration)}
              onDisconnect={() => handleDisconnect(integration.id)}
              onSync={() => handleSync(integration.id)}
              onImport={() => handleImportData(integration)}
              isLoading={isLoading && integration.status === 'syncing'}
            />
          ))}
        </div>
      </div>

      {/* Integration Setup Modal */}
      {showSetup && selectedIntegration && (
        <IntegrationSetup
          integration={selectedIntegration}
          onComplete={handleSetupComplete}
          onCancel={() => {
            setShowSetup(false);
            setSelectedIntegration(null);
          }}
        />
      )}

      {/* Data Import Modal */}
      {showImportModal && (
        <DataImportModal
          integrations={integrations.filter(i => i.isConnected)}
          selectedIntegration={selectedIntegration}
          onClose={() => {
            setShowImportModal(false);
            setSelectedIntegration(null);
          }}
        />
      )}
    </div>
  );
};

export default IntegrationsPage;
