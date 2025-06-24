/**
 * Salary Benchmark Manager Component for Reviewly Application
 * 
 * Comprehensive interface for managing salary benchmarks, market data,
 * compensation analysis, and pay equity assessment.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useMemo } from 'react';
import type { 
  SalaryBenchmark, 
  BenchmarkFilter, 
  CompensationAnalysis,
  PayEquityAnalysis 
} from '../../utils/salaryBenchmark';
import { 
  analyzeBenchmark,
  calculatePayEquity,
  filterBenchmarks,
  formatCurrency,
  formatPercentage,
  getCompetitivenessColor,
  getRiskLevelColor,
  getConfidenceColor,
  MOCK_SALARY_BENCHMARKS
} from '../../utils/salaryBenchmark';
import './SalaryBenchmarkManager.css';

interface SalaryBenchmarkManagerProps {
  benchmarks?: SalaryBenchmark[];
  onBenchmarkAdd?: (benchmark: SalaryBenchmark) => void;
  onBenchmarkUpdate?: (benchmark: SalaryBenchmark) => void;
  onBenchmarkDelete?: (benchmarkId: string) => void;
  userRole?: 'hr' | 'manager' | 'admin';
}

const SalaryBenchmarkManager: React.FC<SalaryBenchmarkManagerProps> = ({
  benchmarks = MOCK_SALARY_BENCHMARKS,
  onBenchmarkAdd,
  onBenchmarkUpdate,
  onBenchmarkDelete,
  userRole = 'hr'
}) => {
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'analysis' | 'equity' | 'add'>('benchmarks');
  const [filters, setFilters] = useState<BenchmarkFilter>({});
  const [selectedBenchmark, setSelectedBenchmark] = useState<SalaryBenchmark | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter benchmarks
  const filteredBenchmarks = useMemo(() => 
    filterBenchmarks(benchmarks, filters), 
    [benchmarks, filters]
  );

  // Calculate pay equity analysis
  const payEquityAnalysis = useMemo(() => 
    calculatePayEquity(benchmarks, []), 
    [benchmarks]
  );

  // Get unique values for filters
  const departments = useMemo(() => 
    Array.from(new Set(benchmarks.map(b => b.department))).sort(), 
    [benchmarks]
  );
  
  const levels = useMemo(() => 
    Array.from(new Set(benchmarks.map(b => b.level))).sort(), 
    [benchmarks]
  );
  
  const locations = useMemo(() => 
    Array.from(new Set(benchmarks.map(b => b.location))).sort(), 
    [benchmarks]
  );

  const updateFilter = <K extends keyof BenchmarkFilter>(
    key: K,
    value: BenchmarkFilter[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const renderBenchmarksTab = () => (
    <div className="benchmarks-tab">
      {/* Filters */}
      <div className="filters-section">
        <h3>🔍 Filter Benchmarks</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Department:</label>
            <select 
              value={filters.department || ''} 
              onChange={(e) => updateFilter('department', e.target.value || undefined)}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Level:</label>
            <select 
              value={filters.level || ''} 
              onChange={(e) => updateFilter('level', e.target.value || undefined)}
            >
              <option value="">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Location:</label>
            <select 
              value={filters.location || ''} 
              onChange={(e) => updateFilter('location', e.target.value || undefined)}
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Job Title:</label>
            <input
              type="text"
              value={filters.jobTitle || ''}
              onChange={(e) => updateFilter('jobTitle', e.target.value || undefined)}
              placeholder="Search job titles..."
            />
          </div>
          
          <div className="filter-actions">
            <button className="btn btn-outline btn-small" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Benchmarks List */}
      <div className="benchmarks-list">
        <div className="list-header">
          <h3>📊 Salary Benchmarks ({filteredBenchmarks.length})</h3>
          {userRole === 'admin' && (
            <button 
              className="btn btn-primary btn-medium"
              onClick={() => setShowAddForm(true)}
            >
              ➕ Add Benchmark
            </button>
          )}
        </div>
        
        <div className="benchmarks-grid">
          {filteredBenchmarks.map(benchmark => {
            const analysis = analyzeBenchmark(benchmark, benchmark.internalData.averageSalary);
            
            return (
              <div 
                key={benchmark.id} 
                className="benchmark-card"
                onClick={() => setSelectedBenchmark(benchmark)}
              >
                <div className="benchmark-header">
                  <div className="benchmark-title">
                    <h4>{benchmark.jobTitle}</h4>
                    <span className="benchmark-level">{benchmark.level}</span>
                  </div>
                  <div className="benchmark-meta">
                    <span className="department">{benchmark.department}</span>
                    <span className="location">{benchmark.location}</span>
                  </div>
                </div>
                
                <div className="benchmark-data">
                  <div className="data-row">
                    <span className="label">Market Median:</span>
                    <span className="value">{formatCurrency(benchmark.marketData.percentile50)}</span>
                  </div>
                  <div className="data-row">
                    <span className="label">Internal Average:</span>
                    <span className="value">{formatCurrency(benchmark.internalData.averageSalary)}</span>
                  </div>
                  <div className="data-row">
                    <span className="label">Pay Gap:</span>
                    <span 
                      className="value"
                      style={{ color: analysis.payGap >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}
                    >
                      {formatPercentage(analysis.payGapPercentage)}
                    </span>
                  </div>
                </div>
                
                <div className="benchmark-status">
                  <div className="competitiveness">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getCompetitivenessColor(analysis.competitiveness) }}
                    >
                      {analysis.competitiveness.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="confidence">
                    <span 
                      className="confidence-badge"
                      style={{ color: getConfidenceColor(benchmark.confidence) }}
                    >
                      {benchmark.confidence.toUpperCase()} CONFIDENCE
                    </span>
                  </div>
                </div>
                
                <div className="benchmark-footer">
                  <span className="last-updated">
                    Updated: {benchmark.lastUpdated.toLocaleDateString()}
                  </span>
                  <span className="sample-size">
                    Sample: {benchmark.sampleSize.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderAnalysisTab = () => (
    <div className="analysis-tab">
      <h3>📈 Compensation Analysis</h3>
      
      {selectedBenchmark ? (
        <div className="detailed-analysis">
          <div className="analysis-header">
            <h4>{selectedBenchmark.jobTitle} - {selectedBenchmark.level}</h4>
            <p>{selectedBenchmark.department} • {selectedBenchmark.location}</p>
          </div>
          
          <div className="analysis-content">
            <div className="market-comparison">
              <h5>Market Comparison</h5>
              <div className="percentile-chart">
                {Object.entries(selectedBenchmark.marketData).map(([key, value]) => {
                  if (key === 'min' || key === 'max') return null;
                  
                  return (
                    <div key={key} className="percentile-row">
                      <span className="percentile-label">
                        {key.replace('percentile', 'P').replace('average', 'Avg')}:
                      </span>
                      <span className="percentile-value">
                        {formatCurrency(value)}
                      </span>
                      <div className="percentile-bar">
                        <div 
                          className="percentile-fill"
                          style={{ 
                            width: `${(value / selectedBenchmark.marketData.max) * 100}%`,
                            backgroundColor: key === 'percentile50' ? 'var(--color-primary)' : 'var(--color-border)'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="internal-comparison">
              <h5>Internal Data</h5>
              <div className="internal-stats">
                <div className="stat-item">
                  <span className="stat-label">Current Employees:</span>
                  <span className="stat-value">{selectedBenchmark.internalData.currentEmployees}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Average Salary:</span>
                  <span className="stat-value">{formatCurrency(selectedBenchmark.internalData.averageSalary)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Salary Range:</span>
                  <span className="stat-value">
                    {formatCurrency(selectedBenchmark.internalData.salaryRange.min)} - {formatCurrency(selectedBenchmark.internalData.salaryRange.max)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="recommendations">
              <h5>Recommendations</h5>
              <div className="recommendations-list">
                {analyzeBenchmark(selectedBenchmark, selectedBenchmark.internalData.averageSalary).recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-item">
                    <div className="recommendation-header">
                      <span className="recommendation-type">{rec.type.replace('_', ' ').toUpperCase()}</span>
                      <span 
                        className="recommendation-priority"
                        style={{ color: getRiskLevelColor(rec.priority as any) }}
                      >
                        {rec.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                    <p className="recommendation-description">{rec.description}</p>
                    <p className="recommendation-action">{rec.suggestedAction}</p>
                    <div className="recommendation-meta">
                      <span>Timeline: {rec.timeline}</span>
                      {rec.estimatedCost && (
                        <span>Estimated Cost: {formatCurrency(rec.estimatedCost)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-selection">
          <div className="no-selection-content">
            <div className="no-selection-icon">📊</div>
            <h4>Select a Benchmark</h4>
            <p>Choose a salary benchmark from the list to view detailed analysis and recommendations.</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderEquityTab = () => (
    <div className="equity-tab">
      <h3>⚖️ Pay Equity Analysis</h3>
      
      <div className="equity-overview">
        <div className="equity-score">
          <div className="score-circle">
            <div className="score-value">{payEquityAnalysis.overallEquityScore}</div>
            <div className="score-label">Equity Score</div>
          </div>
        </div>
        
        <div className="equity-metrics">
          <div className="metric-item">
            <span className="metric-label">Gender Pay Gap:</span>
            <span className="metric-value">{payEquityAnalysis.genderPayGap}%</span>
          </div>
        </div>
      </div>
      
      <div className="department-equity">
        <h4>Department Analysis</h4>
        <div className="department-list">
          {payEquityAnalysis.departmentAnalysis.map(dept => (
            <div key={dept.department} className="department-item">
              <div className="department-header">
                <span className="department-name">{dept.department}</span>
                <span 
                  className="risk-level"
                  style={{ color: getRiskLevelColor(dept.riskLevel) }}
                >
                  {dept.riskLevel.toUpperCase()} RISK
                </span>
              </div>
              <div className="department-stats">
                <div className="stat">
                  <span>Equity Score: {dept.equityScore}</span>
                </div>
                <div className="stat">
                  <span>Average Salary: {formatCurrency(dept.averageSalary)}</span>
                </div>
                <div className="stat">
                  <span>Pay Gap: {formatCurrency(dept.payGap)}</span>
                </div>
                <div className="stat">
                  <span>Employees: {dept.employeeCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="equity-recommendations">
        <h4>Recommendations</h4>
        <ul>
          {payEquityAnalysis.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
      
      <div className="risk-areas">
        <h4>Risk Areas</h4>
        <ul>
          {payEquityAnalysis.riskAreas.map((risk, index) => (
            <li key={index} className="risk-item">{risk}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="salary-benchmark-manager">
      {/* Header */}
      <div className="manager-header">
        <h2>💰 Salary Benchmark Manager</h2>
        <p>Manage market salary data and analyze compensation competitiveness</p>
      </div>

      {/* Navigation Tabs */}
      <div className="manager-tabs">
        <button
          className={`tab ${activeTab === 'benchmarks' ? 'active' : ''}`}
          onClick={() => setActiveTab('benchmarks')}
        >
          📊 Benchmarks
        </button>
        <button
          className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          📈 Analysis
        </button>
        <button
          className={`tab ${activeTab === 'equity' ? 'active' : ''}`}
          onClick={() => setActiveTab('equity')}
        >
          ⚖️ Pay Equity
        </button>
      </div>

      {/* Tab Content */}
      <div className="manager-content">
        {activeTab === 'benchmarks' && renderBenchmarksTab()}
        {activeTab === 'analysis' && renderAnalysisTab()}
        {activeTab === 'equity' && renderEquityTab()}
      </div>
    </div>
  );
};

export default SalaryBenchmarkManager;
