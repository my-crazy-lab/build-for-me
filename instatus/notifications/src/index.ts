import Bull from 'bull';
import { logger } from './utils/logger';
import { EmailProvider } from './providers/EmailProvider';
import { SMSProvider } from './providers/SMSProvider';
import { SlackProvider } from './providers/SlackProvider';
import { WebhookProvider } from './providers/WebhookProvider';
import { DatabaseService } from './services/DatabaseService';
import { TemplateService } from './services/TemplateService';
import { config } from './config';

/**
 * Notification Service
 * 
 * Handles all notification processing including:
 * - Email notifications via SendGrid/SMTP
 * - SMS notifications via Twilio
 * - Slack notifications
 * - Webhook notifications
 * - Template rendering
 * - Queue management
 */

interface NotificationJob {
  type: 'email' | 'sms' | 'slack' | 'webhook';
  recipient: string;
  subject?: string;
  content: string;
  template?: string;
  templateData?: Record<string, any>;
  projectId: string;
  incidentId?: string;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  retryCount?: number;
}

class NotificationService {
  private emailQueue: Bull.Queue;
  private smsQueue: Bull.Queue;
  private slackQueue: Bull.Queue;
  private webhookQueue: Bull.Queue;
  
  private emailProvider: EmailProvider;
  private smsProvider: SMSProvider;
  private slackProvider: SlackProvider;
  private webhookProvider: WebhookProvider;
  private databaseService: DatabaseService;
  private templateService: TemplateService;

  constructor() {
    // Initialize Redis queues
    const redisConfig = {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      db: config.redis.db || 1 // Use different DB for notifications
    };

    this.emailQueue = new Bull('email notifications', { redis: redisConfig });
    this.smsQueue = new Bull('sms notifications', { redis: redisConfig });
    this.slackQueue = new Bull('slack notifications', { redis: redisConfig });
    this.webhookQueue = new Bull('webhook notifications', { redis: redisConfig });

    // Initialize providers
    this.emailProvider = new EmailProvider();
    this.smsProvider = new SMSProvider();
    this.slackProvider = new SlackProvider();
    this.webhookProvider = new WebhookProvider();
    this.databaseService = new DatabaseService();
    this.templateService = new TemplateService();
  }

  /**
   * Start the notification service
   */
  async start(): Promise<void> {
    try {
      logger.info('Starting Notification Service...');

      // Initialize database connection
      await this.databaseService.connect();
      logger.info('Database connected');

      // Setup queue processors
      this.setupQueueProcessors();

      // Setup queue event handlers
      this.setupQueueEventHandlers();

      logger.info('Notification Service started successfully');

      // Graceful shutdown handling
      process.on('SIGINT', () => this.shutdown());
      process.on('SIGTERM', () => this.shutdown());

    } catch (error) {
      logger.error('Failed to start Notification Service:', error);
      process.exit(1);
    }
  }

  /**
   * Setup queue processors
   */
  private setupQueueProcessors(): void {
    // Email processor
    this.emailQueue.process('send-email', config.queues.concurrency.email || 5, async (job) => {
      return this.processEmailNotification(job.data);
    });

    // SMS processor
    this.smsQueue.process('send-sms', config.queues.concurrency.sms || 3, async (job) => {
      return this.processSMSNotification(job.data);
    });

    // Slack processor
    this.slackQueue.process('send-slack', config.queues.concurrency.slack || 5, async (job) => {
      return this.processSlackNotification(job.data);
    });

    // Webhook processor
    this.webhookQueue.process('send-webhook', config.queues.concurrency.webhook || 10, async (job) => {
      return this.processWebhookNotification(job.data);
    });

    logger.info('Queue processors configured');
  }

  /**
   * Setup queue event handlers
   */
  private setupQueueEventHandlers(): void {
    const queues = [this.emailQueue, this.smsQueue, this.slackQueue, this.webhookQueue];

    queues.forEach(queue => {
      queue.on('completed', (job) => {
        logger.debug(`Job ${job.id} completed in queue ${queue.name}`);
      });

      queue.on('failed', (job, err) => {
        logger.error(`Job ${job.id} failed in queue ${queue.name}:`, err);
        this.handleFailedJob(job, err);
      });

      queue.on('stalled', (job) => {
        logger.warn(`Job ${job.id} stalled in queue ${queue.name}`);
      });
    });
  }

  /**
   * Send incident notification to all subscribers
   */
  async sendIncidentNotification(incidentId: string, type: 'created' | 'updated' | 'resolved'): Promise<void> {
    try {
      // Get incident details
      const incident = await this.databaseService.getIncident(incidentId);
      if (!incident) {
        throw new Error(`Incident ${incidentId} not found`);
      }

      // Get project subscribers
      const subscribers = await this.databaseService.getProjectSubscribers(incident.project_id, true);

      logger.info(`Sending ${type} notification for incident ${incidentId} to ${subscribers.length} subscribers`);

      // Send notifications to each subscriber
      for (const subscriber of subscribers) {
        await this.sendSubscriberNotification(subscriber, incident, type);
      }

    } catch (error) {
      logger.error(`Error sending incident notification:`, error);
      throw error;
    }
  }

  /**
   * Send notification to a specific subscriber
   */
  private async sendSubscriberNotification(subscriber: any, incident: any, type: string): Promise<void> {
    const templateData = {
      incident,
      subscriber,
      type,
      projectName: incident.project_name,
      unsubscribeUrl: `${config.app.frontendUrl}/unsubscribe?token=${subscriber.unsubscribe_token}`
    };

    // Send email notification
    if (subscriber.notify_by.includes('email')) {
      const emailContent = await this.templateService.renderTemplate('incident-email', templateData);
      
      await this.queueNotification({
        type: 'email',
        recipient: subscriber.email,
        subject: `[${incident.project_name}] ${incident.title}`,
        content: emailContent,
        projectId: incident.project_id,
        incidentId: incident.id,
        priority: this.getNotificationPriority(incident.impact)
      });
    }

    // Send SMS notification
    if (subscriber.notify_by.includes('sms') && subscriber.phone) {
      const smsContent = await this.templateService.renderTemplate('incident-sms', templateData);
      
      await this.queueNotification({
        type: 'sms',
        recipient: subscriber.phone,
        content: smsContent,
        projectId: incident.project_id,
        incidentId: incident.id,
        priority: this.getNotificationPriority(incident.impact)
      });
    }
  }

  /**
   * Send uptime alert notification
   */
  async sendUptimeAlert(alertData: any): Promise<void> {
    try {
      // Get project subscribers who want uptime alerts
      const subscribers = await this.databaseService.getProjectSubscribers(
        alertData.projectId, 
        true,
        ['uptime_alerts']
      );

      logger.info(`Sending uptime alert for ${alertData.checkName} to ${subscribers.length} subscribers`);

      const templateData = {
        ...alertData,
        timestamp: new Date().toISOString()
      };

      // Send notifications
      for (const subscriber of subscribers) {
        if (subscriber.notify_by.includes('email')) {
          const emailContent = await this.templateService.renderTemplate('uptime-alert-email', templateData);
          
          await this.queueNotification({
            type: 'email',
            recipient: subscriber.email,
            subject: `[${alertData.projectName}] ${alertData.checkName} is ${alertData.currentStatus}`,
            content: emailContent,
            projectId: alertData.projectId,
            priority: alertData.currentStatus === 'down' ? 'high' : 'normal'
          });
        }
      }

    } catch (error) {
      logger.error('Error sending uptime alert:', error);
      throw error;
    }
  }

  /**
   * Queue a notification for processing
   */
  async queueNotification(notification: NotificationJob): Promise<void> {
    const priority = this.getPriorityValue(notification.priority || 'normal');
    const delay = notification.priority === 'critical' ? 0 : 1000; // Immediate for critical

    const jobOptions = {
      priority,
      delay,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      },
      removeOnComplete: 100,
      removeOnFail: 50
    };

    switch (notification.type) {
      case 'email':
        await this.emailQueue.add('send-email', notification, jobOptions);
        break;
      case 'sms':
        await this.smsQueue.add('send-sms', notification, jobOptions);
        break;
      case 'slack':
        await this.slackQueue.add('send-slack', notification, jobOptions);
        break;
      case 'webhook':
        await this.webhookQueue.add('send-webhook', notification, jobOptions);
        break;
    }

    // Record notification in database
    await this.databaseService.recordNotification({
      type: notification.type,
      recipient: notification.recipient,
      subject: notification.subject,
      content: notification.content,
      projectId: notification.projectId,
      incidentId: notification.incidentId,
      status: 'queued'
    });
  }

  /**
   * Process email notification
   */
  private async processEmailNotification(data: NotificationJob): Promise<void> {
    try {
      await this.emailProvider.sendEmail({
        to: data.recipient,
        subject: data.subject || 'Notification',
        html: data.content,
        text: this.stripHtml(data.content)
      });

      await this.databaseService.updateNotificationStatus(data.projectId, data.recipient, 'sent');
      logger.info(`Email sent to ${data.recipient}`);

    } catch (error) {
      await this.databaseService.updateNotificationStatus(data.projectId, data.recipient, 'failed', error.message);
      throw error;
    }
  }

  /**
   * Process SMS notification
   */
  private async processSMSNotification(data: NotificationJob): Promise<void> {
    try {
      await this.smsProvider.sendSMS({
        to: data.recipient,
        body: data.content
      });

      await this.databaseService.updateNotificationStatus(data.projectId, data.recipient, 'sent');
      logger.info(`SMS sent to ${data.recipient}`);

    } catch (error) {
      await this.databaseService.updateNotificationStatus(data.projectId, data.recipient, 'failed', error.message);
      throw error;
    }
  }

  /**
   * Process Slack notification
   */
  private async processSlackNotification(data: NotificationJob): Promise<void> {
    try {
      await this.slackProvider.sendMessage({
        channel: data.recipient,
        text: data.content
      });

      await this.databaseService.updateNotificationStatus(data.projectId, data.recipient, 'sent');
      logger.info(`Slack message sent to ${data.recipient}`);

    } catch (error) {
      await this.databaseService.updateNotificationStatus(data.projectId, data.recipient, 'failed', error.message);
      throw error;
    }
  }

  /**
   * Process webhook notification
   */
  private async processWebhookNotification(data: NotificationJob): Promise<void> {
    try {
      await this.webhookProvider.sendWebhook({
        url: data.recipient,
        payload: JSON.parse(data.content)
      });

      await this.databaseService.updateNotificationStatus(data.projectId, data.recipient, 'sent');
      logger.info(`Webhook sent to ${data.recipient}`);

    } catch (error) {
      await this.databaseService.updateNotificationStatus(data.projectId, data.recipient, 'failed', error.message);
      throw error;
    }
  }

  /**
   * Handle failed job
   */
  private async handleFailedJob(job: any, error: Error): Promise<void> {
    logger.error(`Job ${job.id} failed after ${job.attemptsMade} attempts:`, error);
    
    // Update notification status in database
    if (job.data.projectId && job.data.recipient) {
      await this.databaseService.updateNotificationStatus(
        job.data.projectId, 
        job.data.recipient, 
        'failed', 
        error.message
      );
    }
  }

  /**
   * Get notification priority based on incident impact
   */
  private getNotificationPriority(impact: string): 'low' | 'normal' | 'high' | 'critical' {
    switch (impact) {
      case 'critical': return 'critical';
      case 'major': return 'high';
      case 'minor': return 'normal';
      default: return 'low';
    }
  }

  /**
   * Get numeric priority value for queue
   */
  private getPriorityValue(priority: string): number {
    switch (priority) {
      case 'critical': return 1;
      case 'high': return 2;
      case 'normal': return 3;
      case 'low': return 4;
      default: return 3;
    }
  }

  /**
   * Strip HTML tags from content
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(): Promise<any> {
    const queues = [
      { name: 'email', queue: this.emailQueue },
      { name: 'sms', queue: this.smsQueue },
      { name: 'slack', queue: this.slackQueue },
      { name: 'webhook', queue: this.webhookQueue }
    ];

    const stats = {};

    for (const { name, queue } of queues) {
      const waiting = await queue.getWaiting();
      const active = await queue.getActive();
      const completed = await queue.getCompleted();
      const failed = await queue.getFailed();

      stats[name] = {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length
      };
    }

    return stats;
  }

  /**
   * Graceful shutdown
   */
  private async shutdown(): Promise<void> {
    logger.info('Shutting down Notification Service...');

    try {
      await Promise.all([
        this.emailQueue.close(),
        this.smsQueue.close(),
        this.slackQueue.close(),
        this.webhookQueue.close()
      ]);

      await this.databaseService.disconnect();
      logger.info('Notification Service stopped');
    } catch (error) {
      logger.error('Error during shutdown:', error);
    }

    process.exit(0);
  }
}

// Start the notification service
const notificationService = new NotificationService();

if (require.main === module) {
  notificationService.start().catch((error) => {
    logger.error('Failed to start notification service:', error);
    process.exit(1);
  });
}

export { NotificationService };
