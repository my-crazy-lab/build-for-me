/**
 * Jest Configuration for Reviewly Application
 *
 * Simplified Jest configuration for testing React components and TypeScript utilities.
 *
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx)'
  ],
  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/setupTests.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.*',
    '!src/**/*.spec.*'
  ],
  testTimeout: 10000,
  clearMocks: true,
  restoreMocks: true
};
