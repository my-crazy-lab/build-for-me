import cron from 'node-cron';
import { logger } from './utils/logger';
import { UptimeChecker } from './services/UptimeChecker';
import { DatabaseService } from './services/DatabaseService';
import { NotificationService } from './services/NotificationService';
import { config } from './config';

/**
 * Monitoring Service
 * 
 * Automated uptime monitoring service that:
 * - Checks configured endpoints at regular intervals
 * - Records uptime data and response times
 * - Triggers notifications on status changes
 * - Updates component statuses automatically
 */

class MonitoringService {
  private uptimeChecker: UptimeChecker;
  private databaseService: DatabaseService;
  private notificationService: NotificationService;
  private isRunning = false;

  constructor() {
    this.uptimeChecker = new UptimeChecker();
    this.databaseService = new DatabaseService();
    this.notificationService = new NotificationService();
  }

  /**
   * Start the monitoring service
   */
  async start(): Promise<void> {
    try {
      logger.info('Starting Monitoring Service...');

      // Initialize database connection
      await this.databaseService.connect();
      logger.info('Database connected');

      // Start scheduled monitoring
      this.scheduleMonitoring();
      
      // Start immediate check for overdue checks
      this.scheduleOverdueChecks();

      this.isRunning = true;
      logger.info('Monitoring Service started successfully');

      // Graceful shutdown handling
      process.on('SIGINT', () => this.shutdown());
      process.on('SIGTERM', () => this.shutdown());

    } catch (error) {
      logger.error('Failed to start Monitoring Service:', error);
      process.exit(1);
    }
  }

  /**
   * Schedule regular monitoring checks
   */
  private scheduleMonitoring(): void {
    // Run every minute to check for due monitoring tasks
    cron.schedule('* * * * *', async () => {
      if (!this.isRunning) return;

      try {
        await this.runMonitoringCycle();
      } catch (error) {
        logger.error('Error in monitoring cycle:', error);
      }
    });

    logger.info('Monitoring schedule configured (every minute)');
  }

  /**
   * Schedule checks for overdue monitoring
   */
  private scheduleOverdueChecks(): void {
    // Run every 5 minutes to check for overdue checks
    cron.schedule('*/5 * * * *', async () => {
      if (!this.isRunning) return;

      try {
        await this.checkOverdueMonitoring();
      } catch (error) {
        logger.error('Error checking overdue monitoring:', error);
      }
    });

    logger.info('Overdue check schedule configured (every 5 minutes)');
  }

  /**
   * Run a complete monitoring cycle
   */
  private async runMonitoringCycle(): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Get all active uptime checks that are due
      const dueChecks = await this.databaseService.getDueUptimeChecks();
      
      if (dueChecks.length === 0) {
        return;
      }

      logger.info(`Processing ${dueChecks.length} due uptime checks`);

      // Process checks in parallel (with concurrency limit)
      const concurrencyLimit = config.monitoring.concurrencyLimit || 10;
      const chunks = this.chunkArray(dueChecks, concurrencyLimit);

      for (const chunk of chunks) {
        await Promise.all(
          chunk.map(check => this.processUptimeCheck(check))
        );
      }

      const duration = Date.now() - startTime;
      logger.info(`Monitoring cycle completed in ${duration}ms`);

    } catch (error) {
      logger.error('Error in monitoring cycle:', error);
    }
  }

  /**
   * Process a single uptime check
   */
  private async processUptimeCheck(check: any): Promise<void> {
    try {
      logger.debug(`Checking ${check.name}: ${check.url}`);

      // Perform the uptime check
      const result = await this.uptimeChecker.checkEndpoint({
        url: check.url,
        method: check.method || 'GET',
        timeout: check.timeout || 30000,
        expectedStatusCodes: check.expected_status_codes || [200],
        headers: check.headers || {},
        body: check.body,
        keywordCheck: check.keyword_check
      });

      // Record the result
      await this.databaseService.recordUptimeLog(check.id, {
        success: result.success,
        responseTime: result.responseTime,
        statusCode: result.statusCode,
        errorMessage: result.errorMessage,
        checkedAt: new Date()
      });

      // Update the uptime check's last checked time and status
      await this.databaseService.updateUptimeCheckStatus(check.id, {
        lastStatus: result.success ? 'up' : 'down',
        lastCheckedAt: new Date()
      });

      // Check if component status needs to be updated
      if (check.component_id) {
        await this.updateComponentStatus(check.component_id, check.project_id);
      }

      // Send notifications if status changed
      await this.handleStatusChange(check, result);

      logger.debug(`Check completed: ${check.name} - ${result.success ? 'UP' : 'DOWN'}`);

    } catch (error) {
      logger.error(`Error processing uptime check ${check.id}:`, error);
      
      // Record the error
      await this.databaseService.recordUptimeLog(check.id, {
        success: false,
        responseTime: null,
        statusCode: null,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        checkedAt: new Date()
      });
    }
  }

  /**
   * Update component status based on uptime checks
   */
  private async updateComponentStatus(componentId: string, projectId: string): Promise<void> {
    try {
      // Get all uptime checks for this component
      const componentChecks = await this.databaseService.getComponentUptimeChecks(componentId);
      
      if (componentChecks.length === 0) return;

      // Determine overall component status
      const allUp = componentChecks.every(check => check.last_status === 'up');
      const allDown = componentChecks.every(check => check.last_status === 'down');
      const someDown = componentChecks.some(check => check.last_status === 'down');

      let newStatus: string;
      if (allUp) {
        newStatus = 'operational';
      } else if (allDown) {
        newStatus = 'major_outage';
      } else if (someDown) {
        newStatus = 'partial_outage';
      } else {
        newStatus = 'degraded';
      }

      // Update component status if it changed
      const currentComponent = await this.databaseService.getComponent(componentId);
      if (currentComponent && currentComponent.status !== newStatus) {
        await this.databaseService.updateComponentStatus(componentId, newStatus);
        
        logger.info(`Component ${componentId} status updated: ${currentComponent.status} -> ${newStatus}`);

        // Emit real-time update
        await this.notificationService.emitComponentStatusChange(projectId, componentId, newStatus);
      }

    } catch (error) {
      logger.error(`Error updating component status ${componentId}:`, error);
    }
  }

  /**
   * Handle status change notifications
   */
  private async handleStatusChange(check: any, result: any): Promise<void> {
    try {
      // Get previous status
      const previousLogs = await this.databaseService.getRecentUptimeLogs(check.id, 2);
      
      if (previousLogs.length < 2) return; // Need at least 2 logs to compare

      const currentStatus = result.success ? 'up' : 'down';
      const previousStatus = previousLogs[1].success ? 'up' : 'down';

      // Only notify on status changes
      if (currentStatus !== previousStatus) {
        logger.info(`Status change detected for ${check.name}: ${previousStatus} -> ${currentStatus}`);

        // Send notifications
        await this.notificationService.sendUptimeAlert({
          checkId: check.id,
          checkName: check.name,
          url: check.url,
          projectId: check.project_id,
          componentId: check.component_id,
          previousStatus,
          currentStatus,
          responseTime: result.responseTime,
          errorMessage: result.errorMessage
        });
      }

    } catch (error) {
      logger.error(`Error handling status change for check ${check.id}:`, error);
    }
  }

  /**
   * Check for overdue monitoring
   */
  private async checkOverdueMonitoring(): Promise<void> {
    try {
      const overdueChecks = await this.databaseService.getOverdueUptimeChecks();
      
      if (overdueChecks.length > 0) {
        logger.warn(`Found ${overdueChecks.length} overdue uptime checks`);
        
        // Process overdue checks immediately
        for (const check of overdueChecks) {
          await this.processUptimeCheck(check);
        }
      }

    } catch (error) {
      logger.error('Error checking overdue monitoring:', error);
    }
  }

  /**
   * Utility function to chunk array
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Graceful shutdown
   */
  private async shutdown(): Promise<void> {
    logger.info('Shutting down Monitoring Service...');
    
    this.isRunning = false;
    
    try {
      await this.databaseService.disconnect();
      logger.info('Database disconnected');
    } catch (error) {
      logger.error('Error during shutdown:', error);
    }

    logger.info('Monitoring Service stopped');
    process.exit(0);
  }

  /**
   * Health check endpoint
   */
  getHealthStatus(): any {
    return {
      status: this.isRunning ? 'running' : 'stopped',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
  }
}

// Start the monitoring service
const monitoringService = new MonitoringService();

if (require.main === module) {
  monitoringService.start().catch((error) => {
    logger.error('Failed to start monitoring service:', error);
    process.exit(1);
  });
}

export { MonitoringService };
