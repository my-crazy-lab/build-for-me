/**
 * Career Matrix Component for Reviewly Application
 * 
 * Interactive competency matrix showing skill levels, progress tracking,
 * and development planning with visual indicators.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useMemo } from 'react';
import type { 
  Competency, 
  SkillAssessment, 
  CareerPath, 
  ProgressSnapshot,
  CompetencyCategory 
} from '../../utils/careerMatrix';
import { 
  calculateOverallScore,
  assessPromotionReadiness,
  identifySkillGaps,
  getCompetencyColor,
  formatCompetencyLevel
} from '../../utils/careerMatrix';
import './CareerMatrix.css';

interface CareerMatrixProps {
  competencies: Competency[];
  assessments: SkillAssessment[];
  careerPath: CareerPath;
  currentLevel: number;
  onAssessmentUpdate?: (assessment: SkillAssessment) => void;
  onDevelopmentPlanCreate?: (competencyId: string, targetLevel: number) => void;
  readOnly?: boolean;
}

const CareerMatrix: React.FC<CareerMatrixProps> = ({
  competencies,
  assessments,
  careerPath,
  currentLevel,
  onAssessmentUpdate,
  onDevelopmentPlanCreate,
  readOnly = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CompetencyCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'matrix' | 'progress' | 'gaps'>('matrix');
  const [hoveredCompetency, setHoveredCompetency] = useState<string | null>(null);

  // Calculate metrics
  const overallScore = useMemo(() => 
    calculateOverallScore(assessments, competencies), 
    [assessments, competencies]
  );

  const promotionReadiness = useMemo(() => 
    assessPromotionReadiness(assessments, careerPath, currentLevel),
    [assessments, careerPath, currentLevel]
  );

  const skillGaps = useMemo(() => 
    identifySkillGaps(assessments, careerPath, currentLevel + 1),
    [assessments, careerPath, currentLevel]
  );

  // Filter competencies by category
  const filteredCompetencies = useMemo(() => {
    if (selectedCategory === 'all') return competencies;
    return competencies.filter(c => c.category === selectedCategory);
  }, [competencies, selectedCategory]);

  // Group competencies by category
  const competenciesByCategory = useMemo(() => {
    const grouped: Record<CompetencyCategory, Competency[]> = {} as any;
    competencies.forEach(competency => {
      if (!grouped[competency.category]) {
        grouped[competency.category] = [];
      }
      grouped[competency.category].push(competency);
    });
    return grouped;
  }, [competencies]);

  const getAssessment = (competencyId: string): SkillAssessment | undefined => {
    return assessments.find(a => a.competencyId === competencyId);
  };

  const getPromotionReadinessColor = (readiness: ProgressSnapshot['readinessForPromotion']) => {
    switch (readiness) {
      case 'ready': return 'var(--color-success)';
      case 'developing': return 'var(--color-warning)';
      case 'not_ready': return 'var(--color-danger)';
      case 'overqualified': return 'var(--color-info)';
    }
  };

  const renderCompetencyCell = (competency: Competency, level: number) => {
    const assessment = getAssessment(competency.id);
    const currentLevel = assessment?.currentLevel || 0;
    const targetLevel = assessment?.targetLevel || 0;
    
    const isCurrent = currentLevel === level;
    const isTarget = targetLevel === level;
    const isAchieved = currentLevel >= level;
    const isRequired = careerPath.levels
      .find(l => l.level === currentLevel + 1)
      ?.competencyRequirements[competency.id] === level;

    let cellClass = 'competency-cell';
    if (isAchieved) cellClass += ' achieved';
    if (isCurrent) cellClass += ' current';
    if (isTarget) cellClass += ' target';
    if (isRequired) cellClass += ' required';

    return (
      <div
        key={`${competency.id}-${level}`}
        className={cellClass}
        style={{ 
          backgroundColor: isAchieved ? getCompetencyColor(competency.category) + '40' : undefined,
          borderColor: isCurrent ? getCompetencyColor(competency.category) : undefined
        }}
        onMouseEnter={() => setHoveredCompetency(competency.id)}
        onMouseLeave={() => setHoveredCompetency(null)}
        onClick={() => !readOnly && onAssessmentUpdate?.({
          competencyId: competency.id,
          currentLevel: level,
          targetLevel: Math.max(level, targetLevel),
          assessedAt: new Date(),
          assessedBy: 'self',
          evidence: [],
          confidence: 'medium'
        })}
      >
        <span className="level-number">{level}</span>
        {isCurrent && <span className="current-indicator">●</span>}
        {isTarget && <span className="target-indicator">🎯</span>}
        {isRequired && <span className="required-indicator">!</span>}
      </div>
    );
  };

  const renderMatrixView = () => (
    <div className="matrix-view">
      <div className="matrix-header">
        <div className="competency-label">Competency</div>
        {[1, 2, 3, 4, 5].map(level => (
          <div key={level} className="level-header">
            Level {level}
          </div>
        ))}
        <div className="actions-label">Actions</div>
      </div>
      
      <div className="matrix-body">
        {filteredCompetencies.map(competency => {
          const assessment = getAssessment(competency.id);
          const gap = skillGaps.find(g => g.competencyId === competency.id);
          
          return (
            <div key={competency.id} className="matrix-row">
              <div className="competency-info">
                <div className="competency-name">
                  {competency.name}
                  {competency.isCore && <span className="core-badge">Core</span>}
                </div>
                <div className="competency-description">{competency.description}</div>
                <div className="competency-meta">
                  <span className="category" style={{ color: getCompetencyColor(competency.category) }}>
                    {competency.category.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="weight">Weight: {competency.weight}</span>
                </div>
              </div>
              
              <div className="competency-levels">
                {[1, 2, 3, 4, 5].map(level => renderCompetencyCell(competency, level))}
              </div>
              
              <div className="competency-actions">
                {assessment && (
                  <div className="current-status">
                    <span className="current-level">
                      {formatCompetencyLevel(assessment.currentLevel, 5)}
                    </span>
                    {assessment.targetLevel > assessment.currentLevel && (
                      <span className="target-level">
                        → {formatCompetencyLevel(assessment.targetLevel, 5)}
                      </span>
                    )}
                  </div>
                )}
                
                {gap && (
                  <div className="skill-gap">
                    <span className="gap-indicator">Gap: {gap.gap} levels</span>
                  </div>
                )}
                
                {!readOnly && (
                  <button
                    className="btn btn-outline btn-small"
                    onClick={() => onDevelopmentPlanCreate?.(competency.id, (assessment?.targetLevel || 1) + 1)}
                  >
                    Plan Development
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderProgressView = () => (
    <div className="progress-view">
      <div className="progress-summary">
        <div className="summary-card">
          <h3>Overall Progress</h3>
          <div className="progress-circle">
            <div className="circle-progress" style={{ '--progress': `${overallScore}%` } as any}>
              <span className="progress-value">{overallScore}%</span>
            </div>
          </div>
        </div>
        
        <div className="summary-card">
          <h3>Promotion Readiness</h3>
          <div className="readiness-indicator" style={{ color: getPromotionReadinessColor(promotionReadiness) }}>
            {promotionReadiness.replace('_', ' ').toUpperCase()}
          </div>
          <p>For {careerPath.levels.find(l => l.level === currentLevel + 1)?.title || 'Next Level'}</p>
        </div>
      </div>
      
      <div className="category-progress">
        {Object.entries(competenciesByCategory).map(([category, categoryCompetencies]) => {
          const categoryAssessments = assessments.filter(a => 
            categoryCompetencies.some(c => c.id === a.competencyId)
          );
          const categoryScore = calculateOverallScore(categoryAssessments, categoryCompetencies);
          
          return (
            <div key={category} className="category-progress-item">
              <div className="category-header">
                <span className="category-name" style={{ color: getCompetencyColor(category as CompetencyCategory) }}>
                  {category.replace('_', ' ').toUpperCase()}
                </span>
                <span className="category-score">{categoryScore}%</span>
              </div>
              <div className="category-bar">
                <div 
                  className="category-fill"
                  style={{ 
                    width: `${categoryScore}%`,
                    backgroundColor: getCompetencyColor(category as CompetencyCategory)
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderGapsView = () => (
    <div className="gaps-view">
      <h3>Skill Gaps for Next Level</h3>
      {skillGaps.length === 0 ? (
        <div className="no-gaps">
          <div className="no-gaps-icon">🎉</div>
          <h4>No Skill Gaps!</h4>
          <p>You meet all requirements for the next level.</p>
        </div>
      ) : (
        <div className="gaps-list">
          {skillGaps.map(gap => {
            const competency = competencies.find(c => c.id === gap.competencyId);
            if (!competency) return null;
            
            return (
              <div key={gap.competencyId} className="gap-item">
                <div className="gap-header">
                  <span className="competency-name">{competency.name}</span>
                  <span className="gap-size">Gap: {gap.gap} levels</span>
                </div>
                <div className="gap-details">
                  <span className="current">Current: Level {gap.currentLevel}</span>
                  <span className="arrow">→</span>
                  <span className="required">Required: Level {gap.requiredLevel}</span>
                </div>
                <div className="gap-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(gap.currentLevel / gap.requiredLevel) * 100}%` }}
                    />
                  </div>
                </div>
                {!readOnly && (
                  <button
                    className="btn btn-primary btn-small"
                    onClick={() => onDevelopmentPlanCreate?.(gap.competencyId, gap.requiredLevel)}
                  >
                    Create Development Plan
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="career-matrix">
      {/* Header */}
      <div className="matrix-header-section">
        <div className="header-info">
          <h2>🎯 Career Development Matrix</h2>
          <p>Track your competency development and career progression</p>
        </div>
        
        <div className="header-controls">
          <div className="view-modes">
            <button
              className={`view-mode ${viewMode === 'matrix' ? 'active' : ''}`}
              onClick={() => setViewMode('matrix')}
            >
              📊 Matrix
            </button>
            <button
              className={`view-mode ${viewMode === 'progress' ? 'active' : ''}`}
              onClick={() => setViewMode('progress')}
            >
              📈 Progress
            </button>
            <button
              className={`view-mode ${viewMode === 'gaps' ? 'active' : ''}`}
              onClick={() => setViewMode('gaps')}
            >
              🎯 Gaps
            </button>
          </div>
          
          <div className="category-filter">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value as any)}
            >
              <option value="all">All Categories</option>
              {Object.keys(competenciesByCategory).map(category => (
                <option key={category} value={category}>
                  {category.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="matrix-content">
        {viewMode === 'matrix' && renderMatrixView()}
        {viewMode === 'progress' && renderProgressView()}
        {viewMode === 'gaps' && renderGapsView()}
      </div>

      {/* Legend */}
      <div className="matrix-legend">
        <h4>Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-indicator current"></div>
            <span>Current Level</span>
          </div>
          <div className="legend-item">
            <div className="legend-indicator target"></div>
            <span>Target Level</span>
          </div>
          <div className="legend-item">
            <div className="legend-indicator required"></div>
            <span>Required for Promotion</span>
          </div>
          <div className="legend-item">
            <div className="legend-indicator achieved"></div>
            <span>Achieved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerMatrix;
