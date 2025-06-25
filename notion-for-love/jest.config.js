/**
 * Love Journey - Jest Configuration
 * 
 * Comprehensive Jest configuration for unit, integration,
 * and performance testing across client and server.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/client/src/setupTests.js',
    '<rootDir>/server/src/setupTests.js'
  ],
  
  // Module paths
  moduleNameMapping: {
    // Client aliases
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '^@components/(.*)$': '<rootDir>/client/src/components/$1',
    '^@pages/(.*)$': '<rootDir>/client/src/pages/$1',
    '^@hooks/(.*)$': '<rootDir>/client/src/hooks/$1',
    '^@utils/(.*)$': '<rootDir>/client/src/utils/$1',
    '^@context/(.*)$': '<rootDir>/client/src/context/$1',
    
    // Server aliases
    '^@server/(.*)$': '<rootDir>/server/src/$1',
    '^@models/(.*)$': '<rootDir>/server/src/models/$1',
    '^@controllers/(.*)$': '<rootDir>/server/src/controllers/$1',
    '^@middleware/(.*)$': '<rootDir>/server/src/middleware/$1',
    '^@routes/(.*)$': '<rootDir>/server/src/routes/$1',
    
    // Static assets
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
  },
  
  // Test patterns
  testMatch: [
    '<rootDir>/client/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/client/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/server/src/**/__tests__/**/*.{js,ts}',
    '<rootDir>/server/src/**/*.{test,spec}.{js,ts}'
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/client/build/',
    '<rootDir>/server/dist/',
    '<rootDir>/client/cypress/'
  ],
  
  // Transform files
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript'
      ],
      plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-class-properties'
      ]
    }]
  },
  
  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    // Client coverage
    'client/src/**/*.{js,jsx,ts,tsx}',
    '!client/src/**/*.d.ts',
    '!client/src/index.js',
    '!client/src/reportWebVitals.js',
    '!client/src/**/*.stories.{js,jsx,ts,tsx}',
    
    // Server coverage
    'server/src/**/*.{js,ts}',
    '!server/src/**/*.d.ts',
    '!server/src/index.js',
    '!server/src/**/*.config.js'
  ],
  
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    // Specific thresholds for critical files
    'client/src/components/ui/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
    'server/src/controllers/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  
  // Test timeout
  testTimeout: 10000,
  
  // Global setup and teardown
  globalSetup: '<rootDir>/jest.global-setup.js',
  globalTeardown: '<rootDir>/jest.global-teardown.js',
  
  // Projects for multi-project setup
  projects: [
    {
      displayName: 'client',
      testMatch: ['<rootDir>/client/src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/client/src/setupTests.js'],
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/client/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
      }
    },
    {
      displayName: 'server',
      testMatch: ['<rootDir>/server/src/**/*.{test,spec}.{js,ts}'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/server/src/setupTests.js'],
      moduleNameMapping: {
        '^@server/(.*)$': '<rootDir>/server/src/$1'
      }
    }
  ],
  
  // Reporters
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: '<rootDir>/test-results',
      outputName: 'junit.xml'
    }],
    ['jest-html-reporters', {
      publicPath: '<rootDir>/test-results',
      filename: 'report.html',
      expand: true
    }]
  ],
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  
  // Module directories
  moduleDirectories: [
    'node_modules',
    '<rootDir>/client/src',
    '<rootDir>/server/src'
  ],
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  
  // Verbose output
  verbose: true,
  
  // Error handling
  errorOnDeprecated: true,
  
  // Performance monitoring
  maxWorkers: '50%',
  
  // Custom matchers
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js'
  ]
};
