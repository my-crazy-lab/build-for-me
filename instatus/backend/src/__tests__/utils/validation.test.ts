/**
 * Simple validation utility tests
 * These tests demonstrate that our testing setup works correctly
 */

describe('Validation Utilities', () => {
  describe('email validation', () => {
    const validateEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'admin+tag@company.org',
        'user123@test-domain.com'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user@domain',
        'user name@domain.com'
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe('slug validation', () => {
    const validateSlug = (slug: string): boolean => {
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      return slugRegex.test(slug);
    };

    it('should validate correct slugs', () => {
      const validSlugs = [
        'my-project',
        'test-status-page',
        'api-server-status',
        'project123',
        'simple'
      ];

      validSlugs.forEach(slug => {
        expect(validateSlug(slug)).toBe(true);
      });
    });

    it('should reject invalid slugs', () => {
      const invalidSlugs = [
        'My Project',
        'test_project',
        'project-',
        '-project',
        'project--name',
        'PROJECT',
        'project.name'
      ];

      invalidSlugs.forEach(slug => {
        expect(validateSlug(slug)).toBe(false);
      });
    });
  });

  describe('password strength validation', () => {
    const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];
      
      if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      }
      
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      
      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      
      if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
      }
      
      return {
        valid: errors.length === 0,
        errors
      };
    };

    it('should validate strong passwords', () => {
      const strongPasswords = [
        'Password123',
        'MySecure1Pass',
        'Test1234',
        'Admin2023!'
      ];

      strongPasswords.forEach(password => {
        const result = validatePassword(password);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        { password: '123', expectedErrors: 3 }, // too short, no letters
        { password: 'password', expectedErrors: 2 }, // no uppercase, no numbers
        { password: 'PASSWORD', expectedErrors: 2 }, // no lowercase, no numbers
        { password: 'Pass', expectedErrors: 2 }, // too short, no numbers
      ];

      weakPasswords.forEach(({ password, expectedErrors }) => {
        const result = validatePassword(password);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThanOrEqual(expectedErrors);
      });
    });
  });

  describe('UUID validation', () => {
    const validateUUID = (uuid: string): boolean => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(uuid);
    };

    it('should validate correct UUIDs', () => {
      const validUUIDs = [
        '123e4567-e89b-12d3-a456-426614174000',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        '6ba7b811-9dad-11d1-80b4-00c04fd430c8'
      ];

      validUUIDs.forEach(uuid => {
        expect(validateUUID(uuid)).toBe(true);
      });
    });

    it('should reject invalid UUIDs', () => {
      const invalidUUIDs = [
        'not-a-uuid',
        '123e4567-e89b-12d3-a456',
        '123e4567-e89b-12d3-a456-426614174000-extra',
        'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        '123e4567e89b12d3a456426614174000' // no dashes
      ];

      invalidUUIDs.forEach(uuid => {
        expect(validateUUID(uuid)).toBe(false);
      });
    });
  });

  describe('status validation', () => {
    const validStatuses = ['operational', 'degraded', 'partial_outage', 'major_outage', 'maintenance'];
    
    const validateStatus = (status: string): boolean => {
      return validStatuses.includes(status);
    };

    it('should validate correct status values', () => {
      validStatuses.forEach(status => {
        expect(validateStatus(status)).toBe(true);
      });
    });

    it('should reject invalid status values', () => {
      const invalidStatuses = [
        'unknown',
        'OPERATIONAL',
        'down',
        'up',
        'offline',
        ''
      ];

      invalidStatuses.forEach(status => {
        expect(validateStatus(status)).toBe(false);
      });
    });
  });

  describe('pagination validation', () => {
    const validatePagination = (page: number, limit: number): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];
      
      if (!Number.isInteger(page) || page < 1) {
        errors.push('Page must be a positive integer');
      }
      
      if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        errors.push('Limit must be an integer between 1 and 100');
      }
      
      return {
        valid: errors.length === 0,
        errors
      };
    };

    it('should validate correct pagination parameters', () => {
      const validParams = [
        { page: 1, limit: 10 },
        { page: 5, limit: 50 },
        { page: 100, limit: 1 },
        { page: 1, limit: 100 }
      ];

      validParams.forEach(({ page, limit }) => {
        const result = validatePagination(page, limit);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject invalid pagination parameters', () => {
      const invalidParams = [
        { page: 0, limit: 10 },
        { page: -1, limit: 10 },
        { page: 1, limit: 0 },
        { page: 1, limit: 101 },
        { page: 1.5, limit: 10 },
        { page: 1, limit: -5 }
      ];

      invalidParams.forEach(({ page, limit }) => {
        const result = validatePagination(page, limit);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });
});
