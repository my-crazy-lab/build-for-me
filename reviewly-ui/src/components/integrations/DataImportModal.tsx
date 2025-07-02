/**
 * Data Import Modal Component for Reviewly Application
 * 
 * Modal component for importing data from connected integrations
 * with progress tracking and import history.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import type { Integration } from '../../pages/IntegrationsPage';
import './DataImportModal.css';

interface DataImportModalProps {
  integrations: Integration[];
  selectedIntegration?: Integration | null;
  onClose: () => void;
}

interface ImportJob {
  id: string;
  integrationId: string;
  integrationName: string;
  dataTypes: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  itemsImported: number;
  totalItems: number;
  errors: string[];
}

const DataImportModal: React.FC<DataImportModalProps> = ({
  integrations,
  selectedIntegration,
  onClose,
}) => {
  const [selectedIntegrationId, setSelectedIntegrationId] = useState(
    selectedIntegration?.id || (integrations.length > 0 ? integrations[0].id : '')
  );
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);
  const [importJobs, setImportJobs] = useState<ImportJob[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const selectedIntegrationData = integrations.find(i => i.id === selectedIntegrationId);

  // Handle data type selection
  const handleDataTypeToggle = (dataType: string) => {
    setSelectedDataTypes(prev =>
      prev.includes(dataType)
        ? prev.filter(type => type !== dataType)
        : [...prev, dataType]
    );
  };

  // Start import process
  const handleStartImport = () => {
    if (!selectedIntegrationData || selectedDataTypes.length === 0) return;

    const newJob: ImportJob = {
      id: Date.now().toString(),
      integrationId: selectedIntegrationData.id,
      integrationName: selectedIntegrationData.name,
      dataTypes: [...selectedDataTypes],
      status: 'pending',
      progress: 0,
      startTime: new Date(),
      itemsImported: 0,
      totalItems: Math.floor(Math.random() * 100) + 20,
      errors: [],
    };

    setImportJobs(prev => [newJob, ...prev]);
    setIsImporting(true);

    // Simulate import process
    simulateImport(newJob);
  };

  // Simulate import process
  const simulateImport = (job: ImportJob) => {
    const updateJob = (updates: Partial<ImportJob>) => {
      setImportJobs(prev =>
        prev.map(j => j.id === job.id ? { ...j, ...updates } : j)
      );
    };

    // Start import
    updateJob({ status: 'running' });

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Complete import
        const success = Math.random() > 0.1; // 90% success rate
        updateJob({
          status: success ? 'completed' : 'failed',
          progress: 100,
          endTime: new Date(),
          itemsImported: success ? job.totalItems : Math.floor(job.totalItems * 0.7),
          errors: success ? [] : ['Connection timeout', 'Rate limit exceeded'],
        });
        
        setIsImporting(false);
      } else {
        updateJob({
          progress: Math.floor(progress),
          itemsImported: Math.floor((progress / 100) * job.totalItems),
        });
      }
    }, 500);
  };

  // Format duration
  const formatDuration = (start: Date, end?: Date) => {
    const endTime = end || new Date();
    const diff = endTime.getTime() - start.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="data-import-overlay">
      <div className="data-import-modal">
        <div className="import-header">
          <h2>Import Data</h2>
          <button
            className="btn btn-ghost btn-small"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="import-content">
          {/* Integration Selection */}
          <div className="import-section">
            <h3>Select Integration</h3>
            <div className="integration-selector">
              {integrations.map(integration => (
                <button
                  key={integration.id}
                  className={`integration-option ${selectedIntegrationId === integration.id ? 'selected' : ''}`}
                  onClick={() => setSelectedIntegrationId(integration.id)}
                >
                  <span className="option-icon">{integration.icon}</span>
                  <span className="option-name">{integration.name}</span>
                  <span className="option-status">
                    {integration.syncStats?.totalItems || 0} items
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Data Type Selection */}
          {selectedIntegrationData && (
            <div className="import-section">
              <h3>Select Data Types</h3>
              <div className="data-type-selector">
                {selectedIntegrationData.dataTypes.map(dataType => (
                  <label key={dataType} className="data-type-option">
                    <input
                      type="checkbox"
                      checked={selectedDataTypes.includes(dataType)}
                      onChange={() => handleDataTypeToggle(dataType)}
                    />
                    <span className="option-label">
                      {dataType.replace('_', ' ').charAt(0).toUpperCase() + dataType.replace('_', ' ').slice(1)}
                    </span>
                    <span className="option-count">
                      ~{Math.floor(Math.random() * 50) + 10} items
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Import Action */}
          <div className="import-section">
            <div className="import-action">
              <button
                className="btn btn-primary btn-large"
                onClick={handleStartImport}
                disabled={!selectedIntegrationData || selectedDataTypes.length === 0 || isImporting}
              >
                {isImporting ? (
                  <>
                    <span className="spinner-small"></span>
                    Importing...
                  </>
                ) : (
                  <>
                    📥 Start Import
                  </>
                )}
              </button>
              
              {selectedDataTypes.length > 0 && (
                <p className="import-summary">
                  Import {selectedDataTypes.length} data type(s) from {selectedIntegrationData?.name}
                </p>
              )}
            </div>
          </div>

          {/* Import History */}
          {importJobs.length > 0 && (
            <div className="import-section">
              <h3>Import History</h3>
              <div className="import-jobs">
                {importJobs.map(job => (
                  <div key={job.id} className={`import-job ${job.status}`}>
                    <div className="job-header">
                      <div className="job-info">
                        <h4>{job.integrationName}</h4>
                        <p>{job.dataTypes.join(', ')}</p>
                      </div>
                      <div className="job-status">
                        <span className={`status-badge ${job.status}`}>
                          {job.status === 'pending' && '⏳ Pending'}
                          {job.status === 'running' && '🔄 Running'}
                          {job.status === 'completed' && '✅ Completed'}
                          {job.status === 'failed' && '❌ Failed'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {(job.status === 'running' || job.status === 'completed') && (
                      <div className="job-progress">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                        <span className="progress-text">
                          {job.progress}% ({job.itemsImported}/{job.totalItems} items)
                        </span>
                      </div>
                    )}

                    {/* Job Details */}
                    <div className="job-details">
                      <div className="detail-item">
                        <span className="detail-label">Started:</span>
                        <span className="detail-value">
                          {job.startTime.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      {job.endTime && (
                        <div className="detail-item">
                          <span className="detail-label">Duration:</span>
                          <span className="detail-value">
                            {formatDuration(job.startTime, job.endTime)}
                          </span>
                        </div>
                      )}
                      
                      {job.status === 'completed' && (
                        <div className="detail-item">
                          <span className="detail-label">Imported:</span>
                          <span className="detail-value">
                            {job.itemsImported} items
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Errors */}
                    {job.errors.length > 0 && (
                      <div className="job-errors">
                        <h5>Errors:</h5>
                        <ul>
                          {job.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="import-footer">
          <button
            className="btn btn-outline btn-medium"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataImportModal;
