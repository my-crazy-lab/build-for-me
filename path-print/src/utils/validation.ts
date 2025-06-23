/**
 * Career Path Visualization - Validation Utilities
 * 
 * This module provides comprehensive validation functions for career data.
 * It ensures data integrity and provides detailed error reporting for debugging.
 * 
 * @fileoverview Validation utilities for career data integrity
 * @author Career Path Visualization Team
 * @version 1.0.0
 * 
 * MAINTAINER NOTES:
 * - All validation functions return detailed ValidationResult objects
 * - Error messages are user-friendly and actionable
 * - Validation can be run in strict or lenient mode
 * - Custom validation rules can be added for specific requirements
 * - Performance is optimized for large datasets
 */

import {
  type CareerData,
  type Milestone,
  type Skill,
  type Goal,
  type DateRange,
  SkillLevel,
  MilestoneType,
} from '../types';

import type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationOptions,
  ValidationContext
} from '../types/validation';

import {
  isMilestoneType,
  isSkillLevel,
  isValidDateString,
  isValidEmail,
  isValidUrl,
  ValidationErrorCode,
  DEFAULT_VALIDATION_OPTIONS
} from '../types/validation';

// ============================================================================
// VALIDATION CONTEXT UTILITIES
// ============================================================================

/**
 * Create a validation context for nested validation
 */
function createContext(
  path: string,
  parent: unknown,
  root: unknown,
  options: ValidationOptions
): ValidationContext {
  return { path, parent, root, options };
}

/**
 * Add a field to the current path
 */
function addPath(context: ValidationContext, field: string): ValidationContext {
  return {
    ...context,
    path: context.path ? `${context.path}.${field}` : field
  };
}

/**
 * Add an array index to the current path
 */
function addIndex(context: ValidationContext, index: number): ValidationContext {
  return {
    ...context,
    path: `${context.path}[${index}]`
  };
}

// ============================================================================
// ERROR CREATION UTILITIES
// ============================================================================

/**
 * Create a validation error
 */
function createError(
  field: string,
  message: string,
  code: ValidationErrorCode,
  value: unknown,
  expected?: string
): ValidationError {
  return { field, message, code, value, expected };
}

/**
 * Create a validation warning
 */
function createWarning(
  field: string,
  message: string,
  code: string,
  suggestion?: string
): ValidationWarning {
  return { field, message, code, suggestion };
}

// ============================================================================
// BASIC TYPE VALIDATORS
// ============================================================================

/**
 * Validate that a value is a non-empty string
 */
function validateString(
  value: unknown,
  context: ValidationContext,
  minLength = 1,
  maxLength = Infinity
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof value !== 'string') {
    errors.push(createError(
      context.path,
      'Must be a string',
      ValidationErrorCode.INVALID_TYPE,
      value,
      'string'
    ));
    return errors;
  }

  if (value.length < minLength) {
    errors.push(createError(
      context.path,
      `Must be at least ${minLength} characters long`,
      ValidationErrorCode.STRING_TOO_SHORT,
      value,
      `string with ${minLength}+ characters`
    ));
  }

  if (value.length > maxLength) {
    errors.push(createError(
      context.path,
      `Must be no more than ${maxLength} characters long`,
      ValidationErrorCode.STRING_TOO_LONG,
      value,
      `string with ${maxLength} or fewer characters`
    ));
  }

  return errors;
}

/**
 * Validate that a value is a number within range
 */
function validateNumber(
  value: unknown,
  context: ValidationContext,
  min = -Infinity,
  max = Infinity
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof value !== 'number' || isNaN(value)) {
    errors.push(createError(
      context.path,
      'Must be a valid number',
      ValidationErrorCode.INVALID_TYPE,
      value,
      'number'
    ));
    return errors;
  }

  if (value < min || value > max) {
    errors.push(createError(
      context.path,
      `Must be between ${min} and ${max}`,
      ValidationErrorCode.VALUE_OUT_OF_RANGE,
      value,
      `number between ${min} and ${max}`
    ));
  }

  return errors;
}

/**
 * Validate that a value is an array with proper length
 */
function validateArray(
  value: unknown,
  context: ValidationContext,
  minItems = 0,
  maxItems = Infinity
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!Array.isArray(value)) {
    errors.push(createError(
      context.path,
      'Must be an array',
      ValidationErrorCode.INVALID_TYPE,
      value,
      'array'
    ));
    return errors;
  }

  if (value.length < minItems) {
    errors.push(createError(
      context.path,
      `Must have at least ${minItems} items`,
      ValidationErrorCode.ARRAY_TOO_SHORT,
      value,
      `array with ${minItems}+ items`
    ));
  }

  if (value.length > maxItems) {
    errors.push(createError(
      context.path,
      `Must have no more than ${maxItems} items`,
      ValidationErrorCode.ARRAY_TOO_LONG,
      value,
      `array with ${maxItems} or fewer items`
    ));
  }

  return errors;
}

// ============================================================================
// DOMAIN-SPECIFIC VALIDATORS
// ============================================================================

/**
 * Validate a date range object
 */
export function validateDateRange(
  dateRange: unknown,
  context: ValidationContext
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!dateRange || typeof dateRange !== 'object') {
    errors.push(createError(
      context.path,
      'Date range must be an object',
      ValidationErrorCode.INVALID_TYPE,
      dateRange,
      'object with start and end dates'
    ));
    return { isValid: false, errors, warnings };
  }

  const range = dateRange as Record<string, unknown>;

  // Validate start date
  const startContext = addPath(context, 'start');
  if (!range.start) {
    errors.push(createError(
      startContext.path,
      'Start date is required',
      ValidationErrorCode.REQUIRED_FIELD_MISSING,
      range.start
    ));
  } else if (!isValidDateString(range.start)) {
    errors.push(createError(
      startContext.path,
      'Start date must be in YYYY-MM-DD format',
      ValidationErrorCode.INVALID_DATE,
      range.start,
      'YYYY-MM-DD'
    ));
  }

  // Validate end date (can be null for ongoing)
  const endContext = addPath(context, 'end');
  if (range.end !== null && range.end !== undefined && !isValidDateString(range.end)) {
    errors.push(createError(
      endContext.path,
      'End date must be in YYYY-MM-DD format or null',
      ValidationErrorCode.INVALID_DATE,
      range.end,
      'YYYY-MM-DD or null'
    ));
  }

  // Check date logic
  if (isValidDateString(range.start) && isValidDateString(range.end)) {
    const startDate = new Date(range.start);
    const endDate = new Date(range.end);
    
    if (endDate < startDate) {
      errors.push(createError(
        context.path,
        'End date cannot be before start date',
        ValidationErrorCode.INVALID_FORMAT,
        { start: range.start, end: range.end }
      ));
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate a skill object
 */
export function validateSkill(
  skill: unknown,
  context: ValidationContext
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!skill || typeof skill !== 'object') {
    errors.push(createError(
      context.path,
      'Skill must be an object',
      ValidationErrorCode.INVALID_TYPE,
      skill,
      'skill object'
    ));
    return { isValid: false, errors, warnings };
  }

  const s = skill as Record<string, unknown>;

  // Validate required fields
  errors.push(...validateString(s.id, addPath(context, 'id')));
  errors.push(...validateString(s.name, addPath(context, 'name'), 1, 100));
  errors.push(...validateString(s.category, addPath(context, 'category'), 1, 50));

  // Validate skill level
  if (!isSkillLevel(s.level)) {
    errors.push(createError(
      addPath(context, 'level').path,
      'Skill level must be between 1 and 5',
      ValidationErrorCode.INVALID_ENUM_VALUE,
      s.level,
      'number between 1 and 5'
    ));
  }

  // Validate optional fields
  if (s.description !== undefined) {
    errors.push(...validateString(s.description, addPath(context, 'description'), 0, 500));
  }

  if (s.tags !== undefined) {
    const tagsErrors = validateArray(s.tags, addPath(context, 'tags'), 0, 20);
    errors.push(...tagsErrors);
    
    if (Array.isArray(s.tags)) {
      s.tags.forEach((tag, index) => {
        errors.push(...validateString(tag, addIndex(addPath(context, 'tags'), index)));
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate a milestone object
 */
export function validateMilestone(
  milestone: unknown,
  context: ValidationContext
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!milestone || typeof milestone !== 'object') {
    errors.push(createError(
      context.path,
      'Milestone must be an object',
      ValidationErrorCode.INVALID_TYPE,
      milestone,
      'milestone object'
    ));
    return { isValid: false, errors, warnings };
  }

  const m = milestone as Record<string, unknown>;

  // Validate required fields
  errors.push(...validateString(m.id, addPath(context, 'id')));
  errors.push(...validateString(m.title, addPath(context, 'title'), 1, 200));
  errors.push(...validateString(m.organization, addPath(context, 'organization'), 1, 200));
  errors.push(...validateString(m.description, addPath(context, 'description'), 1, 1000));
  errors.push(...validateString(m.icon, addPath(context, 'icon')));

  // Validate milestone type
  if (!isMilestoneType(m.type)) {
    errors.push(createError(
      addPath(context, 'type').path,
      'Invalid milestone type',
      ValidationErrorCode.INVALID_ENUM_VALUE,
      m.type,
      Object.values(MilestoneType).join(', ')
    ));
  }

  // Validate date range
  const dateRangeResult = validateDateRange(m.dateRange, addPath(context, 'dateRange'));
  errors.push(...dateRangeResult.errors);
  warnings.push(...dateRangeResult.warnings);

  // Validate highlights array
  const highlightsErrors = validateArray(m.highlights, addPath(context, 'highlights'), 1, 10);
  errors.push(...highlightsErrors);
  
  if (Array.isArray(m.highlights)) {
    m.highlights.forEach((highlight, index) => {
      errors.push(...validateString(highlight, addIndex(addPath(context, 'highlights'), index), 1, 300));
    });
  }

  // Validate skills array
  const skillsErrors = validateArray(m.skills, addPath(context, 'skills'));
  errors.push(...skillsErrors);
  
  if (Array.isArray(m.skills)) {
    m.skills.forEach((skill, index) => {
      const skillResult = validateSkill(skill, addIndex(addPath(context, 'skills'), index));
      errors.push(...skillResult.errors);
      warnings.push(...skillResult.warnings);
    });
  }

  // Validate optional fields
  if (m.location !== undefined) {
    errors.push(...validateString(m.location, addPath(context, 'location'), 0, 100));
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate a goal object
 */
export function validateGoal(
  goal: unknown,
  context: ValidationContext
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!goal || typeof goal !== 'object') {
    errors.push(createError(
      context.path,
      'Goal must be an object',
      ValidationErrorCode.INVALID_TYPE,
      goal,
      'goal object'
    ));
    return { isValid: false, errors, warnings };
  }

  const g = goal as Record<string, unknown>;

  // Validate required fields
  errors.push(...validateString(g.id, addPath(context, 'id')));
  errors.push(...validateString(g.title, addPath(context, 'title'), 1, 200));
  errors.push(...validateString(g.description, addPath(context, 'description'), 1, 1000));
  errors.push(...validateNumber(g.progress, addPath(context, 'progress'), 0, 100));

  // Validate target date
  if (!isValidDateString(g.targetDate)) {
    errors.push(createError(
      addPath(context, 'targetDate').path,
      'Target date must be in YYYY-MM-DD format',
      ValidationErrorCode.INVALID_DATE,
      g.targetDate,
      'YYYY-MM-DD'
    ));
  }

  // Validate priority
  const validPriorities = ['low', 'medium', 'high', 'critical'];
  if (!validPriorities.includes(g.priority as string)) {
    errors.push(createError(
      addPath(context, 'priority').path,
      'Priority must be low, medium, high, or critical',
      ValidationErrorCode.INVALID_ENUM_VALUE,
      g.priority,
      validPriorities.join(', ')
    ));
  }

  // Validate required skills array
  const skillsErrors = validateArray(g.requiredSkills, addPath(context, 'requiredSkills'));
  errors.push(...skillsErrors);
  
  if (Array.isArray(g.requiredSkills)) {
    g.requiredSkills.forEach((skill, index) => {
      errors.push(...validateString(skill, addIndex(addPath(context, 'requiredSkills'), index)));
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate complete career data
 */
export function validateCareerData(
  data: unknown,
  options: Partial<ValidationOptions> = {}
): ValidationResult {
  const fullOptions = { ...DEFAULT_VALIDATION_OPTIONS, ...options };
  const context = createContext('', null, data, fullOptions);
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!data || typeof data !== 'object') {
    errors.push(createError(
      '',
      'Career data must be an object',
      ValidationErrorCode.INVALID_TYPE,
      data,
      'career data object'
    ));
    return { isValid: false, errors, warnings };
  }

  const careerData = data as Record<string, unknown>;

  // Validate milestones
  if (Array.isArray(careerData.milestones)) {
    careerData.milestones.forEach((milestone, index) => {
      const milestoneResult = validateMilestone(
        milestone,
        addIndex(addPath(context, 'milestones'), index)
      );
      errors.push(...milestoneResult.errors);
      warnings.push(...milestoneResult.warnings);
    });
  }

  // Validate skills
  if (Array.isArray(careerData.skills)) {
    careerData.skills.forEach((skill, index) => {
      const skillResult = validateSkill(
        skill,
        addIndex(addPath(context, 'skills'), index)
      );
      errors.push(...skillResult.errors);
      warnings.push(...skillResult.warnings);
    });
  }

  // Validate goals
  if (Array.isArray(careerData.goals)) {
    careerData.goals.forEach((goal, index) => {
      const goalResult = validateGoal(
        goal,
        addIndex(addPath(context, 'goals'), index)
      );
      errors.push(...goalResult.errors);
      warnings.push(...goalResult.warnings);
    });
  }

  // Check for duplicate IDs
  const allIds = new Set<string>();
  const checkDuplicateId = (id: string, type: string, path: string) => {
    if (allIds.has(id)) {
      errors.push(createError(
        path,
        `Duplicate ID "${id}" found in ${type}`,
        ValidationErrorCode.DUPLICATE_ID,
        id
      ));
    } else {
      allIds.add(id);
    }
  };

  // Check milestone IDs
  if (Array.isArray(careerData.milestones)) {
    careerData.milestones.forEach((milestone: any, index) => {
      if (milestone?.id) {
        checkDuplicateId(milestone.id, 'milestones', `milestones[${index}].id`);
      }
    });
  }

  // Check skill IDs
  if (Array.isArray(careerData.skills)) {
    careerData.skills.forEach((skill: any, index) => {
      if (skill?.id) {
        checkDuplicateId(skill.id, 'skills', `skills[${index}].id`);
      }
    });
  }

  // Check goal IDs
  if (Array.isArray(careerData.goals)) {
    careerData.goals.forEach((goal: any, index) => {
      if (goal?.id) {
        checkDuplicateId(goal.id, 'goals', `goals[${index}].id`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors: errors.slice(0, fullOptions.maxErrors),
    warnings: fullOptions.includeWarnings ? warnings : []
  };
}
