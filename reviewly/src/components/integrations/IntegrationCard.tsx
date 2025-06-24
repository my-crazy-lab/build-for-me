/**
 * Integration Card Component for Reviewly Application
 * 
 * Individual integration display card with connection status,
 * sync controls, and management actions.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React from 'react';
import type { Integration } from '../../pages/IntegrationsPage';
import './IntegrationCard.css';

interface IntegrationCardProps {
  integration: Integration;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync: () => void;
  onImport: () => void;
  isLoading?: boolean;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onConnect,
  onDisconnect,
  onSync,
  onImport,
  isLoading = false,
}) => {
  // Get status info
  const getStatusInfo = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return { icon: '🟢', label: 'Connected', color: 'success' };
      case 'disconnected':
        return { icon: '🔴', label: 'Disconnected', color: 'danger' };
      case 'error':
        return { icon: '🟡', label: 'Error', color: 'warning' };
      case 'syncing':
        return { icon: '🔄', label: 'Syncing...', color: 'info' };
      default:
        return { icon: '⚪', label: 'Unknown', color: 'neutral' };
    }
  };

  const statusInfo = getStatusInfo(integration.status);

  // Format last sync time
  const formatLastSync = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={`integration-card ${statusInfo.color} ${!integration.isActive ? 'inactive' : ''}`}>
      {/* Card Header */}
      <div className="integration-header">
        <div className="integration-icon">{integration.icon}</div>
        <div className="integration-info">
          <h3 className="integration-name">{integration.name}</h3>
          <div className="integration-status">
            <span className={`status-indicator ${statusInfo.color}`}>
              {statusInfo.icon} {statusInfo.label}
            </span>
          </div>
        </div>
        <div className="integration-actions">
          {integration.isConnected ? (
            <>
              <button
                className="btn btn-ghost btn-small"
                onClick={onSync}
                disabled={isLoading || integration.status === 'syncing'}
                title="Sync now"
              >
                {integration.status === 'syncing' ? '⏳' : '🔄'}
              </button>
              <button
                className="btn btn-ghost btn-small"
                onClick={onImport}
                disabled={isLoading}
                title="Import data"
              >
                📥
              </button>
              <button
                className="btn btn-ghost btn-small"
                onClick={onDisconnect}
                disabled={isLoading}
                title="Disconnect"
              >
                🔌
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary btn-small"
              onClick={onConnect}
              disabled={isLoading}
            >
              Connect
            </button>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="integration-content">
        <p className="integration-description">{integration.description}</p>
        
        {/* Data Types */}
        <div className="integration-data-types">
          <h4>Data Types:</h4>
          <div className="data-type-tags">
            {integration.dataTypes.map(type => (
              <span key={type} className="data-type-tag">
                {type.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Permissions */}
        <div className="integration-permissions">
          <h4>Required Permissions:</h4>
          <div className="permission-tags">
            {integration.permissions.map(permission => (
              <span key={permission} className="permission-tag">
                {permission}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer - Only show if connected */}
      {integration.isConnected && (
        <div className="integration-footer">
          <div className="sync-info">
            <div className="sync-item">
              <span className="sync-label">Last Sync:</span>
              <span className="sync-value">{formatLastSync(integration.lastSync)}</span>
            </div>
            
            {integration.syncStats && (
              <>
                <div className="sync-item">
                  <span className="sync-label">Total Items:</span>
                  <span className="sync-value">{integration.syncStats.totalItems}</span>
                </div>
                
                <div className="sync-item">
                  <span className="sync-label">Last Sync:</span>
                  <span className="sync-value">{integration.syncStats.lastSyncItems} items</span>
                </div>
                
                <div className="sync-item">
                  <span className="sync-label">Success Rate:</span>
                  <span className="sync-value">
                    {Math.round(integration.syncStats.successRate * 100)}%
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Error Message */}
          {integration.errorMessage && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{integration.errorMessage}</span>
            </div>
          )}

          {/* Sync Settings Preview */}
          <div className="sync-settings">
            {integration.type === 'github' && integration.settings.github && (
              <div className="setting-item">
                <span className="setting-label">Sync Frequency:</span>
                <span className="setting-value">{integration.settings.github.syncFrequency}</span>
              </div>
            )}
            
            {integration.type === 'jira' && integration.settings.jira && (
              <div className="setting-item">
                <span className="setting-label">Server:</span>
                <span className="setting-value">{integration.settings.jira.serverUrl || 'Not configured'}</span>
              </div>
            )}
            
            {integration.type === 'notion' && integration.settings.notion && (
              <div className="setting-item">
                <span className="setting-label">Databases:</span>
                <span className="setting-value">{integration.settings.notion.databases.length} connected</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && integration.status === 'syncing' && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Syncing data...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationCard;
