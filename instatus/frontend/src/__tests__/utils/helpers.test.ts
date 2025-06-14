/**
 * Frontend utility helper tests
 * These tests demonstrate that our frontend testing setup works correctly
 */

describe('Frontend Helper Utilities', () => {
  describe('formatDate', () => {
    const formatDate = (date: Date): string => {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    it('should format dates correctly', () => {
      const testDate = new Date('2023-12-25T10:30:00Z');
      const formatted = formatDate(testDate);
      
      expect(formatted).toContain('Dec');
      expect(formatted).toContain('25');
      expect(formatted).toContain('2023');
    });

    it('should handle different date formats', () => {
      const dates = [
        new Date('2023-01-01T00:00:00Z'),
        new Date('2023-06-15T12:30:45Z'),
        new Date('2023-12-31T23:59:59Z')
      ];

      dates.forEach(date => {
        const formatted = formatDate(date);
        expect(typeof formatted).toBe('string');
        expect(formatted.length).toBeGreaterThan(0);
      });
    });
  });

  describe('truncateText', () => {
    const truncateText = (text: string, maxLength: number): string => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength - 3) + '...';
    };

    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated';
      const truncated = truncateText(longText, 20);
      
      expect(truncated).toHaveLength(20);
      expect(truncated.endsWith('...')).toBe(true);
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      const result = truncateText(shortText, 20);
      
      expect(result).toBe(shortText);
      expect(result).not.toContain('...');
    });

    it('should handle edge cases', () => {
      expect(truncateText('', 10)).toBe('');
      expect(truncateText('abc', 3)).toBe('abc');
      expect(truncateText('abcd', 3)).toBe('...');
    });
  });

  describe('capitalizeFirst', () => {
    const capitalizeFirst = (str: string): string => {
      if (!str) return str;
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    it('should capitalize first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
      expect(capitalizeFirst('WORLD')).toBe('World');
      expect(capitalizeFirst('tEST')).toBe('Test');
    });

    it('should handle edge cases', () => {
      expect(capitalizeFirst('')).toBe('');
      expect(capitalizeFirst('a')).toBe('A');
      expect(capitalizeFirst('A')).toBe('A');
    });
  });

  describe('generateSlug', () => {
    const generateSlug = (text: string): string => {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    it('should generate valid slugs', () => {
      const testCases = [
        { input: 'My Project Name', expected: 'my-project-name' },
        { input: 'API Server Status!', expected: 'api-server-status' },
        { input: 'Test_Project-123', expected: 'test-project-123' },
        { input: '  Spaced  Out  ', expected: 'spaced-out' }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(generateSlug(input)).toBe(expected);
      });
    });

    it('should handle special characters', () => {
      const input = 'Project@#$%^&*()Name!';
      const slug = generateSlug(input);
      
      expect(slug).toBe('projectname');
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    });
  });

  describe('formatUptime', () => {
    const formatUptime = (uptime: number): string => {
      if (uptime >= 99.9) return '99.9%+';
      if (uptime >= 99) return `${uptime.toFixed(1)}%`;
      return `${uptime.toFixed(2)}%`;
    };

    it('should format uptime percentages', () => {
      expect(formatUptime(100)).toBe('99.9%+');
      expect(formatUptime(99.95)).toBe('99.9%+');
      expect(formatUptime(99.5)).toBe('99.5%');
      expect(formatUptime(98.76)).toBe('98.76%');
      expect(formatUptime(95.1234)).toBe('95.12%');
    });

    it('should handle edge cases', () => {
      expect(formatUptime(0)).toBe('0.00%');
      expect(formatUptime(50)).toBe('50.00%');
      expect(formatUptime(99.0)).toBe('99.0%');
    });
  });

  describe('getStatusColor', () => {
    const getStatusColor = (status: string): string => {
      const colors: Record<string, string> = {
        operational: 'green',
        degraded: 'yellow',
        partial_outage: 'orange',
        major_outage: 'red',
        maintenance: 'blue'
      };
      return colors[status] || 'gray';
    };

    it('should return correct colors for statuses', () => {
      expect(getStatusColor('operational')).toBe('green');
      expect(getStatusColor('degraded')).toBe('yellow');
      expect(getStatusColor('partial_outage')).toBe('orange');
      expect(getStatusColor('major_outage')).toBe('red');
      expect(getStatusColor('maintenance')).toBe('blue');
    });

    it('should return default color for unknown status', () => {
      expect(getStatusColor('unknown')).toBe('gray');
      expect(getStatusColor('')).toBe('gray');
      expect(getStatusColor('invalid')).toBe('gray');
    });
  });

  describe('isValidUrl', () => {
    const isValidUrl = (url: string): boolean => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    it('should validate correct URLs', () => {
      const validUrls = [
        'https://example.com',
        'http://localhost:3000',
        'https://api.example.com/v1/status',
        'https://subdomain.example.co.uk'
      ];

      validUrls.forEach(url => {
        expect(isValidUrl(url)).toBe(true);
      });
    });

    it('should reject invalid URLs', () => {
      const invalidUrls = [
        'not-a-url',
        'example.com',
        'http://',
        ''
      ];

      invalidUrls.forEach(url => {
        expect(isValidUrl(url)).toBe(false);
      });
    });
  });

  describe('debounce', () => {
    const debounce = (func: Function, delay: number) => {
      let timeoutId: NodeJS.Timeout;
      return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
      };
    };

    it('should debounce function calls', (done) => {
      let callCount = 0;
      const debouncedFn = debounce(() => {
        callCount++;
      }, 100);

      // Call multiple times quickly
      debouncedFn();
      debouncedFn();
      debouncedFn();

      // Should not have been called yet
      expect(callCount).toBe(0);

      // Wait for debounce delay
      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 150);
    });
  });

  describe('formatBytes', () => {
    const formatBytes = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    it('should format byte sizes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1048576)).toBe('1 MB');
      expect(formatBytes(1073741824)).toBe('1 GB');
      expect(formatBytes(1536)).toBe('1.5 KB');
    });

    it('should handle small values', () => {
      expect(formatBytes(512)).toBe('512 Bytes');
      expect(formatBytes(1)).toBe('1 Bytes');
      expect(formatBytes(100)).toBe('100 Bytes');
    });
  });
});
