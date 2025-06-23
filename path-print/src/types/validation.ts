/**
 * Career Path Visualization - Validation Types and Schemas
 * 
 * This file contains validation schemas and utility types for ensuring data integrity
 * throughout the application. These schemas are used to validate YAML/JSON data
 * and provide runtime type checking.
 * 
 * @fileoverview Validation schemas and utility types for data integrity
 * @author Career Path Visualization Team
 * @version 1.0.0
 * 
 * MAINTAINER NOTES:
 * - Validation schemas mirror the main type definitions
 * - Use these schemas for runtime validation of external data
 * - Error messages are user-friendly and actionable
 * - Schemas support both strict and lenient validation modes
 * - All validation functions return detailed error information
 */

import {
 type DateRange,
 type Skill,
 type Milestone,
 type Goal,
 type CareerData,
  MilestoneType,
  SkillLevel,
  ViewMode,
} from './index';

// ============================================================================
// VALIDATION RESULT TYPES
// ============================================================================

/**
 * Result of a validation operation
 */
export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  /** Array of validation errors */
  errors: ValidationError[];
  /** Array of validation warnings (non-blocking) */
  warnings: ValidationWarning[];
}

/**
 * Detailed validation error information
 */
export interface ValidationError {
  /** Field path where error occurred (e.g., "milestones[0].title") */
  field: string;
  /** Error message */
  message: string;
  /** Error code for programmatic handling */
  code: string;
  /** Actual value that failed validation */
  value: unknown;
  /** Expected value or format */
  expected?: string;
}

/**
 * Validation warning for non-critical issues
 */
export interface ValidationWarning {
  /** Field path where warning occurred */
  field: string;
  /** Warning message */
  message: string;
  /** Warning code */
  code: string;
  /** Suggested fix */
  suggestion?: string;
}

// ============================================================================
// VALIDATION OPTIONS
// ============================================================================

/**
 * Options for controlling validation behavior
 */
export interface ValidationOptions {
  /** Strict mode enforces all optional fields */
  strict: boolean;
  /** Allow unknown fields in objects */
  allowUnknownFields: boolean;
  /** Maximum number of errors to collect before stopping */
  maxErrors: number;
  /** Include warnings in validation result */
  includeWarnings: boolean;
  /** Custom validation rules */
  customRules?: ValidationRule[];
}

/**
 * Custom validation rule definition
 */
export interface ValidationRule {
  /** Field path pattern to match */
  fieldPattern: string;
  /** Validation function */
  validator: (value: unknown, context: ValidationContext) => ValidationResult;
  /** Rule description */
  description: string;
}

/**
 * Context information for validation
 */
export interface ValidationContext {
  /** Current field path */
  path: string;
  /** Parent object */
  parent: unknown;
  /** Root data object */
  root: unknown;
  /** Validation options */
  options: ValidationOptions;
}

// ============================================================================
// SCHEMA DEFINITIONS
// ============================================================================

/**
 * Schema for validating date ranges
 */
export interface DateRangeSchema {
  start: {
    required: true;
    type: 'string';
    format: 'date';
    message: 'Start date must be in YYYY-MM-DD format';
  };
  end: {
    required: false;
    type: 'string' | 'null';
    format: 'date';
    message: 'End date must be in YYYY-MM-DD format or null for ongoing';
  };
  duration: {
    required: false;
    type: 'string';
    message: 'Duration should be a human-readable string';
  };
}

/**
 * Schema for validating skills
 */
export interface SkillSchema {
  id: {
    required: true;
    type: 'string';
    minLength: 1;
    message: 'Skill ID is required and cannot be empty';
  };
  name: {
    required: true;
    type: 'string';
    minLength: 1;
    maxLength: 100;
    message: 'Skill name must be 1-100 characters';
  };
  level: {
    required: true;
    type: 'number';
    enum: [1, 2, 3, 4, 5];
    message: 'Skill level must be a valid SkillLevel enum value';
  };
  category: {
    required: true;
    type: 'string';
    minLength: 1;
    maxLength: 50;
    message: 'Category must be 1-50 characters';
  };
  description: {
    required: false;
    type: 'string';
    maxLength: 500;
    message: 'Description cannot exceed 500 characters';
  };
  history: {
    required: false;
    type: 'array';
    items: {
      type: 'object';
      properties: {
        date: { type: 'string', format: 'date' };
        level: { type: 'number', enum: [1, 2, 3, 4, 5] };
      };
    };
    message: 'History must be an array of date/level objects';
  };
  tags: {
    required: false;
    type: 'array';
    items: { type: 'string' };
    maxItems: 20;
    message: 'Tags must be an array of strings (max 20)';
  };
}

/**
 * Schema for validating milestones
 */
export interface MilestoneSchema {
  id: {
    required: true;
    type: 'string';
    minLength: 1;
    message: 'Milestone ID is required and cannot be empty';
  };
  type: {
    required: true;
    type: 'string';
    enum: ['job', 'promotion', 'education', 'side_project', 'certification', 'achievement'];
    message: 'Type must be a valid MilestoneType enum value';
  };
  title: {
    required: true;
    type: 'string';
    minLength: 1;
    maxLength: 200;
    message: 'Title must be 1-200 characters';
  };
  organization: {
    required: true;
    type: 'string';
    minLength: 1;
    maxLength: 200;
    message: 'Organization must be 1-200 characters';
  };
  dateRange: {
    required: true;
    type: 'object';
    schema: 'DateRangeSchema';
    message: 'Date range is required and must be valid';
  };
  description: {
    required: true;
    type: 'string';
    minLength: 1;
    maxLength: 1000;
    message: 'Description must be 1-1000 characters';
  };
  highlights: {
    required: true;
    type: 'array';
    items: { type: 'string', minLength: 1, maxLength: 300 };
    minItems: 1;
    maxItems: 10;
    message: 'Must have 1-10 highlights, each 1-300 characters';
  };
  skills: {
    required: true;
    type: 'array';
    items: { type: 'object', schema: 'SkillSchema' };
    message: 'Skills must be an array of valid skill objects';
  };
  icon: {
    required: true;
    type: 'string';
    minLength: 1;
    message: 'Icon identifier is required';
  };
  location: {
    required: false;
    type: 'string';
    maxLength: 100;
    message: 'Location cannot exceed 100 characters';
  };
}

/**
 * Schema for validating goals
 */
export interface GoalSchema {
  id: {
    required: true;
    type: 'string';
    minLength: 1;
    message: 'Goal ID is required and cannot be empty';
  };
  title: {
    required: true;
    type: 'string';
    minLength: 1;
    maxLength: 200;
    message: 'Title must be 1-200 characters';
  };
  description: {
    required: true;
    type: 'string';
    minLength: 1;
    maxLength: 1000;
    message: 'Description must be 1-1000 characters';
  };
  targetDate: {
    required: true;
    type: 'string';
    format: 'date';
    message: 'Target date must be in YYYY-MM-DD format';
  };
  progress: {
    required: true;
    type: 'number';
    minimum: 0;
    maximum: 100;
    message: 'Progress must be between 0 and 100';
  };
  priority: {
    required: true;
    type: 'string';
    enum: ['low', 'medium', 'high', 'critical'];
    message: 'Priority must be low, medium, high, or critical';
  };
  requiredSkills: {
    required: true;
    type: 'array';
    items: { type: 'string', minLength: 1 };
    message: 'Required skills must be an array of skill names';
  };
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Type guard for checking if a value is a valid MilestoneType
 */
export function isMilestoneType(value: unknown): value is MilestoneType {
  return typeof value === 'string' && Object.values(MilestoneType).includes(value as MilestoneType);
}

/**
 * Type guard for checking if a value is a valid SkillLevel
 */
export function isSkillLevel(value: unknown): value is SkillLevel {
  return typeof value === 'number' && Object.values(SkillLevel).includes(value as SkillLevel);
}

/**
 * Type guard for checking if a value is a valid ViewMode
 */
export function isViewMode(value: unknown): value is ViewMode {
  return typeof value === 'string' && Object.values(ViewMode).includes(value as ViewMode);
}

/**
 * Validates a date string format (YYYY-MM-DD)
 */
export function isValidDateString(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) return false;
  const date = new Date(value);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validates an email address format
 */
export function isValidEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Validates a URL format
 */
export function isValidUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Default validation options
 */
export const DEFAULT_VALIDATION_OPTIONS: ValidationOptions = {
  strict: false,
  allowUnknownFields: true,
  maxErrors: 50,
  includeWarnings: true,
  customRules: []
};

/**
 * Common validation error codes
 */
export enum ValidationErrorCode {
  REQUIRED_FIELD_MISSING = 'REQUIRED_FIELD_MISSING',
  INVALID_TYPE = 'INVALID_TYPE',
  INVALID_FORMAT = 'INVALID_FORMAT',
  VALUE_OUT_OF_RANGE = 'VALUE_OUT_OF_RANGE',
  INVALID_ENUM_VALUE = 'INVALID_ENUM_VALUE',
  ARRAY_TOO_SHORT = 'ARRAY_TOO_SHORT',
  ARRAY_TOO_LONG = 'ARRAY_TOO_LONG',
  STRING_TOO_SHORT = 'STRING_TOO_SHORT',
  STRING_TOO_LONG = 'STRING_TOO_LONG',
  INVALID_DATE = 'INVALID_DATE',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_URL = 'INVALID_URL',
  DUPLICATE_ID = 'DUPLICATE_ID',
  CIRCULAR_REFERENCE = 'CIRCULAR_REFERENCE',
  CUSTOM_VALIDATION_FAILED = 'CUSTOM_VALIDATION_FAILED'
}
