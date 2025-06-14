import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from '../utils/logger';

/**
 * Uptime Checker Service
 * 
 * Performs HTTP/HTTPS checks on endpoints and returns detailed results
 */

export interface UptimeCheckConfig {
  url: string;
  method?: string;
  timeout?: number;
  expectedStatusCodes?: number[];
  headers?: Record<string, string>;
  body?: string;
  keywordCheck?: string;
  followRedirects?: boolean;
  validateSSL?: boolean;
}

export interface UptimeCheckResult {
  success: boolean;
  responseTime: number | null;
  statusCode: number | null;
  errorMessage: string | null;
  responseBody?: string;
  responseHeaders?: Record<string, string>;
  redirectCount?: number;
  sslInfo?: {
    valid: boolean;
    expiresAt?: Date;
    issuer?: string;
  };
}

export class UptimeChecker {
  private readonly defaultTimeout = 30000; // 30 seconds
  private readonly maxRedirects = 5;

  /**
   * Check an endpoint and return detailed results
   */
  async checkEndpoint(config: UptimeCheckConfig): Promise<UptimeCheckResult> {
    const startTime = Date.now();
    
    try {
      logger.debug(`Checking endpoint: ${config.method || 'GET'} ${config.url}`);

      // Prepare axios config
      const axiosConfig: AxiosRequestConfig = {
        method: (config.method || 'GET').toLowerCase() as any,
        url: config.url,
        timeout: config.timeout || this.defaultTimeout,
        headers: {
          'User-Agent': 'Instatus-Clone-Monitor/1.0',
          ...config.headers
        },
        maxRedirects: config.followRedirects !== false ? this.maxRedirects : 0,
        validateStatus: () => true, // Don't throw on any status code
        httpsAgent: config.validateSSL !== false ? undefined : {
          rejectUnauthorized: false
        }
      };

      // Add request body if provided
      if (config.body && ['post', 'put', 'patch'].includes(axiosConfig.method!)) {
        axiosConfig.data = config.body;
        if (!axiosConfig.headers!['Content-Type']) {
          axiosConfig.headers!['Content-Type'] = 'application/json';
        }
      }

      // Perform the request
      const response: AxiosResponse = await axios(axiosConfig);
      const responseTime = Date.now() - startTime;

      // Check if status code is expected
      const expectedCodes = config.expectedStatusCodes || [200];
      const statusCodeValid = expectedCodes.includes(response.status);

      // Check for keyword if specified
      let keywordFound = true;
      if (config.keywordCheck && response.data) {
        const responseText = typeof response.data === 'string' 
          ? response.data 
          : JSON.stringify(response.data);
        keywordFound = responseText.includes(config.keywordCheck);
      }

      // Determine overall success
      const success = statusCodeValid && keywordFound;

      const result: UptimeCheckResult = {
        success,
        responseTime,
        statusCode: response.status,
        errorMessage: success ? null : this.getErrorMessage(response.status, statusCodeValid, keywordFound, config.keywordCheck),
        responseHeaders: response.headers,
        redirectCount: this.getRedirectCount(response)
      };

      // Add SSL info for HTTPS URLs
      if (config.url.startsWith('https://')) {
        result.sslInfo = await this.getSSLInfo(config.url);
      }

      logger.debug(`Check completed: ${config.url} - ${success ? 'SUCCESS' : 'FAILED'} (${responseTime}ms)`);

      return result;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = this.parseError(error);

      logger.debug(`Check failed: ${config.url} - ${errorMessage} (${responseTime}ms)`);

      return {
        success: false,
        responseTime: responseTime > 100 ? responseTime : null, // Only include if meaningful
        statusCode: this.getStatusCodeFromError(error),
        errorMessage
      };
    }
  }

  /**
   * Parse error and return human-readable message
   */
  private parseError(error: any): string {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        return 'Connection refused';
      } else if (error.code === 'ENOTFOUND') {
        return 'DNS resolution failed';
      } else if (error.code === 'ECONNRESET') {
        return 'Connection reset';
      } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        return 'Request timeout';
      } else if (error.code === 'CERT_HAS_EXPIRED') {
        return 'SSL certificate expired';
      } else if (error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
        return 'SSL certificate verification failed';
      } else if (error.response) {
        return `HTTP ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        return 'No response received';
      }
    }

    return error.message || 'Unknown error';
  }

  /**
   * Get status code from error if available
   */
  private getStatusCodeFromError(error: any): number | null {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.status;
    }
    return null;
  }

  /**
   * Get error message based on check results
   */
  private getErrorMessage(
    statusCode: number, 
    statusCodeValid: boolean, 
    keywordFound: boolean, 
    keyword?: string
  ): string {
    if (!statusCodeValid && !keywordFound) {
      return `Unexpected status code ${statusCode} and keyword "${keyword}" not found`;
    } else if (!statusCodeValid) {
      return `Unexpected status code ${statusCode}`;
    } else if (!keywordFound) {
      return `Keyword "${keyword}" not found in response`;
    }
    return 'Unknown error';
  }

  /**
   * Get redirect count from response
   */
  private getRedirectCount(response: AxiosResponse): number {
    // Axios doesn't provide direct access to redirect count
    // This is a simplified implementation
    return 0;
  }

  /**
   * Get SSL certificate information
   */
  private async getSSLInfo(url: string): Promise<UptimeCheckResult['sslInfo']> {
    try {
      // This is a simplified implementation
      // In a real implementation, you'd use the 'tls' module to get certificate details
      return {
        valid: true
      };
    } catch (error) {
      return {
        valid: false
      };
    }
  }

  /**
   * Perform a batch of uptime checks
   */
  async checkMultipleEndpoints(configs: UptimeCheckConfig[]): Promise<UptimeCheckResult[]> {
    const promises = configs.map(config => this.checkEndpoint(config));
    return Promise.all(promises);
  }

  /**
   * Check if a URL is reachable (simple ping-like check)
   */
  async ping(url: string, timeout: number = 5000): Promise<boolean> {
    try {
      const result = await this.checkEndpoint({
        url,
        method: 'HEAD',
        timeout,
        expectedStatusCodes: [200, 301, 302, 304]
      });
      return result.success;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get response time for a URL
   */
  async getResponseTime(url: string, timeout: number = 10000): Promise<number | null> {
    try {
      const result = await this.checkEndpoint({
        url,
        method: 'HEAD',
        timeout
      });
      return result.responseTime;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if a service is healthy based on multiple criteria
   */
  async healthCheck(config: UptimeCheckConfig & {
    maxResponseTime?: number;
    minSuccessRate?: number;
    checkCount?: number;
  }): Promise<{
    healthy: boolean;
    averageResponseTime: number;
    successRate: number;
    checks: UptimeCheckResult[];
  }> {
    const checkCount = config.checkCount || 3;
    const maxResponseTime = config.maxResponseTime || 5000;
    const minSuccessRate = config.minSuccessRate || 0.8;

    // Perform multiple checks
    const checks: UptimeCheckResult[] = [];
    for (let i = 0; i < checkCount; i++) {
      const result = await this.checkEndpoint(config);
      checks.push(result);
      
      // Small delay between checks
      if (i < checkCount - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Calculate metrics
    const successfulChecks = checks.filter(check => check.success);
    const successRate = successfulChecks.length / checks.length;
    
    const responseTimes = checks
      .filter(check => check.responseTime !== null)
      .map(check => check.responseTime!);
    
    const averageResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0;

    // Determine if healthy
    const healthy = successRate >= minSuccessRate && averageResponseTime <= maxResponseTime;

    return {
      healthy,
      averageResponseTime,
      successRate,
      checks
    };
  }
}
