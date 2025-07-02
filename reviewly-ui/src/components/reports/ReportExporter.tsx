/**
 * Report Exporter Component for Reviewly Application
 * 
 * Interactive component for generating and exporting professional reports
 * in PDF and Word formats with customizable templates and options.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import type { ReportData, ExportOptions } from '../../utils/reportExport';
import { exportToPDF, exportToWord, generateReportData } from '../../utils/reportExport';
import './ReportExporter.css';

interface ReportExporterProps {
  employeeData?: any;
  reviewData?: any;
  analyticsData?: any;
  onExportStart?: () => void;
  onExportComplete?: (format: string) => void;
  onExportError?: (error: Error) => void;
}

const ReportExporter: React.FC<ReportExporterProps> = ({
  employeeData = {},
  reviewData = {},
  analyticsData = {},
  onExportStart,
  onExportComplete,
  onExportError
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    template: 'standard',
    includeCharts: true,
    includeSignatures: false,
    watermark: '',
    footerText: 'Confidential - Internal Use Only'
  });
  const [previewMode, setPreviewMode] = useState(false);

  const handleExport = async (format: 'pdf' | 'docx') => {
    try {
      setIsExporting(true);
      onExportStart?.();

      const reportData = generateReportData(employeeData, reviewData, analyticsData);
      const options = { ...exportOptions, format };

      if (format === 'pdf') {
        await exportToPDF(reportData, options);
      } else {
        await exportToWord(reportData, options);
      }

      onExportComplete?.(format);
    } catch (error) {
      console.error('Export failed:', error);
      onExportError?.(error as Error);
    } finally {
      setIsExporting(false);
    }
  };

  const updateExportOption = <K extends keyof ExportOptions>(
    key: K,
    value: ExportOptions[K]
  ) => {
    setExportOptions(prev => ({ ...prev, [key]: value }));
  };

  const getTemplateDescription = (template: string) => {
    switch (template) {
      case 'standard':
        return 'Comprehensive report with all sections and detailed information';
      case 'executive':
        return 'High-level summary focused on key metrics and outcomes';
      case 'detailed':
        return 'In-depth analysis with extended commentary and data';
      case 'summary':
        return 'Concise overview highlighting main points and ratings';
      default:
        return 'Standard report format';
    }
  };

  const renderPreview = () => {
    const reportData = generateReportData(employeeData, reviewData, analyticsData);
    
    return (
      <div className="report-preview">
        <div className="preview-header">
          <h2>{reportData.title}</h2>
          {reportData.subtitle && <h3>{reportData.subtitle}</h3>}
        </div>
        
        <div className="preview-employee-info">
          <h4>Employee Information</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Name:</span>
              <span className="value">{reportData.employeeName}</span>
            </div>
            <div className="info-item">
              <span className="label">Employee ID:</span>
              <span className="value">{reportData.employeeId}</span>
            </div>
            <div className="info-item">
              <span className="label">Department:</span>
              <span className="value">{reportData.department}</span>
            </div>
            <div className="info-item">
              <span className="label">Review Period:</span>
              <span className="value">{reportData.reviewPeriod}</span>
            </div>
          </div>
        </div>

        {exportOptions.template !== 'summary' && (
          <div className="preview-sections">
            {reportData.sections.map(section => (
              <div key={section.id} className="preview-section">
                <h4>{section.title}</h4>
                <div className="section-content">
                  {section.content.map((content, index) => (
                    <div key={index} className={`content-${content.type}`}>
                      {content.type === 'paragraph' && <p>{content.data}</p>}
                      {content.type === 'bullet' && <li>{content.data}</li>}
                      {content.type === 'rating' && (
                        <div className="rating-display">
                          <span>{content.data.label}: </span>
                          <span className="rating-value">
                            {content.data.value}/{content.data.maxValue}
                          </span>
                          <div className="rating-bar">
                            <div 
                              className="rating-fill"
                              style={{ width: `${(content.data.value / content.data.maxValue) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {reportData.summary && (
          <div className="preview-summary">
            <h4>Executive Summary</h4>
            <div className="summary-content">
              <div className="overall-rating">
                <span>Overall Rating: {reportData.summary.overallRating}/5</span>
              </div>
              
              {reportData.summary.keyStrengths.length > 0 && (
                <div className="strengths">
                  <h5>Key Strengths:</h5>
                  <ul>
                    {reportData.summary.keyStrengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {reportData.summary.improvementAreas.length > 0 && (
                <div className="improvements">
                  <h5>Areas for Improvement:</h5>
                  <ul>
                    {reportData.summary.improvementAreas.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {exportOptions.watermark && (
          <div className="preview-watermark">
            Watermark: {exportOptions.watermark}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="report-exporter">
      <div className="exporter-header">
        <h2>📄 Export Report</h2>
        <p>Generate professional reports in PDF or Word format</p>
      </div>

      <div className="exporter-content">
        <div className="export-options">
          <div className="options-section">
            <h3>📋 Report Template</h3>
            <div className="template-options">
              {['standard', 'executive', 'detailed', 'summary'].map(template => (
                <label key={template} className="template-option">
                  <input
                    type="radio"
                    name="template"
                    value={template}
                    checked={exportOptions.template === template}
                    onChange={(e) => updateExportOption('template', e.target.value as any)}
                  />
                  <div className="template-info">
                    <span className="template-name">{template.charAt(0).toUpperCase() + template.slice(1)}</span>
                    <span className="template-description">{getTemplateDescription(template)}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="options-section">
            <h3>⚙️ Export Options</h3>
            <div className="option-controls">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={exportOptions.includeCharts}
                  onChange={(e) => updateExportOption('includeCharts', e.target.checked)}
                />
                <span>Include Charts and Visualizations</span>
              </label>

              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={exportOptions.includeSignatures}
                  onChange={(e) => updateExportOption('includeSignatures', e.target.checked)}
                />
                <span>Include Signature Fields</span>
              </label>

              <div className="text-option">
                <label>Watermark Text (optional):</label>
                <input
                  type="text"
                  value={exportOptions.watermark || ''}
                  onChange={(e) => updateExportOption('watermark', e.target.value)}
                  placeholder="e.g., CONFIDENTIAL, DRAFT"
                />
              </div>

              <div className="text-option">
                <label>Footer Text:</label>
                <input
                  type="text"
                  value={exportOptions.footerText || ''}
                  onChange={(e) => updateExportOption('footerText', e.target.value)}
                  placeholder="Footer text for all pages"
                />
              </div>
            </div>
          </div>

          <div className="options-section">
            <h3>📤 Export Actions</h3>
            <div className="export-buttons">
              <button
                className="btn btn-primary btn-large"
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
              >
                {isExporting ? '⏳ Generating...' : '📄 Export as PDF'}
              </button>

              <button
                className="btn btn-outline btn-large"
                onClick={() => handleExport('docx')}
                disabled={isExporting}
              >
                {isExporting ? '⏳ Generating...' : '📝 Export as Word'}
              </button>

              <button
                className="btn btn-secondary btn-large"
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? '👁️ Hide Preview' : '👁️ Show Preview'}
              </button>
            </div>
          </div>
        </div>

        {previewMode && (
          <div className="preview-section">
            <div className="preview-header-controls">
              <h3>📖 Report Preview</h3>
              <button
                className="btn btn-text btn-small"
                onClick={() => setPreviewMode(false)}
              >
                ✕ Close Preview
              </button>
            </div>
            {renderPreview()}
          </div>
        )}
      </div>

      {isExporting && (
        <div className="export-progress">
          <div className="progress-content">
            <div className="progress-spinner">⏳</div>
            <div className="progress-text">
              <h4>Generating Report...</h4>
              <p>Please wait while we create your professional report.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportExporter;
