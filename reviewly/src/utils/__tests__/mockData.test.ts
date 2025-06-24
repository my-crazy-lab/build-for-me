/**
 * Mock Data Generator Tests
 *
 * Unit tests for the mock data generation utilities including
 * data validation, consistency, and edge cases.
 *
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import { mockDataGenerator, TEST_USERS } from '../mockData';

describe('MockDataGenerator', () => {
  beforeEach(() => {
    mockDataGenerator.reset();
  });

  describe('generateUser', () => {
    it('generates a valid user with required fields', () => {
      const user = mockDataGenerator.generateUser();

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('department');
      expect(user).toHaveProperty('isActive');
      expect(user).toHaveProperty('lastLogin');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('preferences');

      expect(typeof user.id).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(typeof user.name).toBe('string');
      expect(typeof user.isActive).toBe('boolean');
      expect(user.lastLogin).toBeInstanceOf(Date);
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('generates unique user IDs', () => {
      const user1 = mockDataGenerator.generateUser();
      const user2 = mockDataGenerator.generateUser();

      expect(user1.id).not.toBe(user2.id);
    });

    it('generates valid email addresses', () => {
      const user = mockDataGenerator.generateUser();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      expect(user.email).toMatch(emailRegex);
      expect(user.email).toContain('@company.com');
    });

    it('applies overrides correctly', () => {
      const overrides = {
        name: 'Custom Name',
        email: 'custom@test.com',
        department: 'Custom Department'
      };

      const user = mockDataGenerator.generateUser(overrides);

      expect(user.name).toBe('Custom Name');
      expect(user.email).toBe('custom@test.com');
      expect(user.department).toBe('Custom Department');
    });
  });

  describe('generateUsers', () => {
    it('generates the correct number of users', () => {
      const users = mockDataGenerator.generateUsers(5);

      expect(users).toHaveLength(5);
    });

    it('generates unique users', () => {
      const users = mockDataGenerator.generateUsers(10);
      const ids = users.map(u => u.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(10);
    });
  });

  describe('TEST_USERS', () => {
    it('provides predefined test users', () => {
      expect(TEST_USERS.admin.id).toBe('test-admin');
      expect(TEST_USERS.admin.email).toBe('admin@test.com');
      expect(TEST_USERS.admin.role).toBe('Administrator');

      expect(TEST_USERS.manager.id).toBe('test-manager');
      expect(TEST_USERS.manager.email).toBe('manager@test.com');

      expect(TEST_USERS.employee.id).toBe('test-employee');
      expect(TEST_USERS.employee.email).toBe('employee@test.com');
    });
  });

  describe('reset functionality', () => {
    it('resets counters correctly', () => {
      // Generate some data to increment counters
      mockDataGenerator.generateUser();
      mockDataGenerator.generateSelfReview('user1');
      mockDataGenerator.generateFeedback('user1', 'user2');

      // Reset and generate new data
      mockDataGenerator.reset();

      const user = mockDataGenerator.generateUser();
      const review = mockDataGenerator.generateSelfReview('user1');
      const feedback = mockDataGenerator.generateFeedback('user1', 'user2');

      expect(user.id).toBe('user-1');
      expect(review.id).toBe('review-1');
      expect(feedback.id).toBe('feedback-1');
    });
  });
});
