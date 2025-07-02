/**
 * Test Setup Configuration for Reviewly Application
 *
 * Global test configuration, mocks, and utilities for Jest testing framework.
 * Sets up testing environment for React components and utility functions.
 *
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

// Basic setup for Jest tests
console.log('Setting up tests...');

// Mock fetch for tests
global.fetch = jest.fn();

// Custom matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Declare custom matcher types
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(floor: number, ceiling: number): R;
    }
  }
}

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
