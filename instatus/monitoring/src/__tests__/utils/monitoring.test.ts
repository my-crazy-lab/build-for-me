/**
 * Monitoring utility tests
 * These tests demonstrate that our monitoring service testing setup works correctly
 */

describe('Monitoring Utilities', () => {
  describe('calculateUptime', () => {
    const calculateUptime = (successfulChecks: number, totalChecks: number): number => {
      if (totalChecks === 0) return 100;
      return (successfulChecks / totalChecks) * 100;
    };

    it('should calculate uptime correctly', () => {
      expect(calculateUptime(100, 100)).toBe(100);
      expect(calculateUptime(99, 100)).toBe(99);
      expect(calculateUptime(95, 100)).toBe(95);
      expect(calculateUptime(0, 100)).toBe(0);
    });

    it('should handle edge cases', () => {
      expect(calculateUptime(0, 0)).toBe(100);
      expect(calculateUptime(1, 1)).toBe(100);
      expect(calculateUptime(50, 100)).toBe(50);
    });

    it('should handle partial success rates', () => {
      expect(calculateUptime(1, 3)).toBeCloseTo(33.33, 2);
      expect(calculateUptime(2, 3)).toBeCloseTo(66.67, 2);
      expect(calculateUptime(999, 1000)).toBe(99.9);
    });
  });

  describe('calculateAverageResponseTime', () => {
    const calculateAverageResponseTime = (responseTimes: number[]): number => {
      if (responseTimes.length === 0) return 0;
      const sum = responseTimes.reduce((acc, time) => acc + time, 0);
      return sum / responseTimes.length;
    };

    it('should calculate average response time', () => {
      expect(calculateAverageResponseTime([100, 200, 300])).toBe(200);
      expect(calculateAverageResponseTime([50, 150])).toBe(100);
      expect(calculateAverageResponseTime([1000])).toBe(1000);
    });

    it('should handle empty array', () => {
      expect(calculateAverageResponseTime([])).toBe(0);
    });

    it('should handle decimal values', () => {
      expect(calculateAverageResponseTime([100.5, 200.5, 300.5])).toBeCloseTo(200.5, 1);
    });
  });

  describe('determineStatus', () => {
    const determineStatus = (uptime: number, responseTime: number): string => {
      if (uptime < 50 || responseTime > 10000) return 'major_outage';
      if (uptime < 90) return 'partial_outage';
      if (uptime < 99 || responseTime > 5000) return 'degraded';
      return 'operational';
    };

    it('should determine correct status based on uptime', () => {
      expect(determineStatus(100, 100)).toBe('operational');
      expect(determineStatus(99.5, 100)).toBe('operational');
      expect(determineStatus(98, 100)).toBe('degraded');
      expect(determineStatus(85, 100)).toBe('partial_outage');
      expect(determineStatus(30, 100)).toBe('major_outage');
    });

    it('should consider response time in status determination', () => {
      expect(determineStatus(100, 6000)).toBe('degraded');
      expect(determineStatus(100, 15000)).toBe('major_outage');
      expect(determineStatus(95, 8000)).toBe('degraded');
    });
  });

  describe('isHealthy', () => {
    const isHealthy = (uptime: number, responseTime: number, maxResponseTime: number = 5000): boolean => {
      return uptime >= 99 && responseTime <= maxResponseTime;
    };

    it('should return true for healthy services', () => {
      expect(isHealthy(100, 1000)).toBe(true);
      expect(isHealthy(99.5, 2000)).toBe(true);
      expect(isHealthy(99, 5000)).toBe(true);
    });

    it('should return false for unhealthy services', () => {
      expect(isHealthy(98, 1000)).toBe(false);
      expect(isHealthy(100, 6000)).toBe(false);
      expect(isHealthy(95, 8000)).toBe(false);
    });

    it('should respect custom max response time', () => {
      expect(isHealthy(100, 3000, 2000)).toBe(false);
      expect(isHealthy(100, 1500, 2000)).toBe(true);
    });
  });

  describe('formatResponseTime', () => {
    const formatResponseTime = (ms: number): string => {
      if (ms < 1000) return `${ms}ms`;
      if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
      return `${(ms / 60000).toFixed(1)}m`;
    };

    it('should format milliseconds correctly', () => {
      expect(formatResponseTime(500)).toBe('500ms');
      expect(formatResponseTime(999)).toBe('999ms');
    });

    it('should format seconds correctly', () => {
      expect(formatResponseTime(1000)).toBe('1.0s');
      expect(formatResponseTime(1500)).toBe('1.5s');
      expect(formatResponseTime(30000)).toBe('30.0s');
    });

    it('should format minutes correctly', () => {
      expect(formatResponseTime(60000)).toBe('1.0m');
      expect(formatResponseTime(90000)).toBe('1.5m');
      expect(formatResponseTime(120000)).toBe('2.0m');
    });
  });

  describe('parseUrl', () => {
    const parseUrl = (url: string): { protocol: string; hostname: string; port: number | null } => {
      try {
        const parsed = new URL(url);
        return {
          protocol: parsed.protocol.replace(':', ''),
          hostname: parsed.hostname,
          port: parsed.port ? parseInt(parsed.port) : null
        };
      } catch {
        throw new Error('Invalid URL');
      }
    };

    it('should parse URLs correctly', () => {
      const result = parseUrl('https://example.com:8080/path');
      expect(result).toEqual({
        protocol: 'https',
        hostname: 'example.com',
        port: 8080
      });
    });

    it('should handle URLs without port', () => {
      const result = parseUrl('https://api.example.com/v1');
      expect(result).toEqual({
        protocol: 'https',
        hostname: 'api.example.com',
        port: null
      });
    });

    it('should throw error for invalid URLs', () => {
      expect(() => parseUrl('invalid-url')).toThrow('Invalid URL');
      expect(() => parseUrl('')).toThrow('Invalid URL');
    });
  });

  describe('generateCheckId', () => {
    const generateCheckId = (url: string, timestamp: number): string => {
      const hash = url.split('').reduce((acc, char) => {
        return ((acc << 5) - acc + char.charCodeAt(0)) & 0xffffffff;
      }, 0);
      return `check_${Math.abs(hash)}_${timestamp}`;
    };

    it('should generate consistent IDs for same inputs', () => {
      const url = 'https://example.com';
      const timestamp = 1234567890;
      
      const id1 = generateCheckId(url, timestamp);
      const id2 = generateCheckId(url, timestamp);
      
      expect(id1).toBe(id2);
      expect(id1).toMatch(/^check_\d+_1234567890$/);
    });

    it('should generate different IDs for different inputs', () => {
      const timestamp = 1234567890;
      
      const id1 = generateCheckId('https://example.com', timestamp);
      const id2 = generateCheckId('https://different.com', timestamp);
      const id3 = generateCheckId('https://example.com', timestamp + 1);
      
      expect(id1).not.toBe(id2);
      expect(id1).not.toBe(id3);
      expect(id2).not.toBe(id3);
    });
  });

  describe('validateCheckInterval', () => {
    const validateCheckInterval = (interval: number): boolean => {
      const validIntervals = [30, 60, 300, 600, 1800, 3600]; // seconds
      return validIntervals.includes(interval);
    };

    it('should validate correct intervals', () => {
      expect(validateCheckInterval(30)).toBe(true);   // 30 seconds
      expect(validateCheckInterval(60)).toBe(true);   // 1 minute
      expect(validateCheckInterval(300)).toBe(true);  // 5 minutes
      expect(validateCheckInterval(600)).toBe(true);  // 10 minutes
      expect(validateCheckInterval(1800)).toBe(true); // 30 minutes
      expect(validateCheckInterval(3600)).toBe(true); // 1 hour
    });

    it('should reject invalid intervals', () => {
      expect(validateCheckInterval(15)).toBe(false);
      expect(validateCheckInterval(45)).toBe(false);
      expect(validateCheckInterval(120)).toBe(false);
      expect(validateCheckInterval(7200)).toBe(false);
    });
  });

  describe('calculateSLA', () => {
    const calculateSLA = (uptime: number, period: 'month' | 'year'): { target: number; met: boolean } => {
      const targets = {
        month: 99.9,  // 99.9% monthly SLA
        year: 99.5    // 99.5% yearly SLA
      };
      
      const target = targets[period];
      return {
        target,
        met: uptime >= target
      };
    };

    it('should calculate monthly SLA correctly', () => {
      expect(calculateSLA(99.95, 'month')).toEqual({ target: 99.9, met: true });
      expect(calculateSLA(99.8, 'month')).toEqual({ target: 99.9, met: false });
    });

    it('should calculate yearly SLA correctly', () => {
      expect(calculateSLA(99.7, 'year')).toEqual({ target: 99.5, met: true });
      expect(calculateSLA(99.2, 'year')).toEqual({ target: 99.5, met: false });
    });
  });
});
