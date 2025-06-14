import { query, queryOne, transaction } from '../config/database';
import { logger } from '../utils/logger';
import { 
  Subscriber, 
  CreateSubscriberRequest,
  PaginationInfo 
} from '../../../shared/types';
import { ConflictError, NotFoundError, ValidationError } from '../middleware/errorHandler';
import { emitNewSubscriber } from '../config/socket';
import crypto from 'crypto';

/**
 * Subscriber Service
 * 
 * Handles all subscriber-related business logic including:
 * - Subscription management
 * - Email verification
 * - Notification preferences
 * - Unsubscribe functionality
 */

export class SubscriberService {
  /**
   * Get all subscribers for a project with pagination
   */
  static async getProjectSubscribers(
    projectId: string,
    page: number = 1,
    limit: number = 50,
    verified?: boolean
  ): Promise<{ subscribers: Subscriber[]; pagination: PaginationInfo }> {
    try {
      const offset = (page - 1) * limit;
      
      // Build verified filter
      let verifiedCondition = '';
      let queryParams: any[] = [projectId];
      
      if (verified !== undefined) {
        verifiedCondition = 'AND verified = $2';
        queryParams.push(verified);
        queryParams.push(limit, offset);
      } else {
        queryParams.push(limit, offset);
      }

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM subscribers 
        WHERE project_id = $1 ${verified !== undefined ? 'AND verified = $2' : ''}
      `;
      const countParams = verified !== undefined ? [projectId, verified] : [projectId];
      const countResult = await queryOne<{ total: string }>(countQuery, countParams);
      const total = parseInt(countResult?.total || '0', 10);

      // Get subscribers
      const subscribersQuery = `
        SELECT 
          id, project_id, email, phone, notify_by, notify_on, 
          verified, created_at, updated_at
        FROM subscribers 
        WHERE project_id = $1 ${verifiedCondition}
        ORDER BY created_at DESC
        LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}
      `;

      const subscribersResult = await query<Subscriber>(subscribersQuery, queryParams);
      const subscribers = subscribersResult.rows;

      const totalPages = Math.ceil(total / limit);

      const pagination: PaginationInfo = {
        page,
        limit,
        total,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1
      };

      logger.debug('Subscribers retrieved', {
        projectId,
        count: subscribers.length,
        page,
        total,
        verified
      });

      return { subscribers, pagination };
    } catch (error) {
      logger.error('Error retrieving project subscribers:', error);
      throw error;
    }
  }

  /**
   * Get a single subscriber by ID
   */
  static async getSubscriberById(subscriberId: string): Promise<Subscriber> {
    try {
      const subscriberQuery = `
        SELECT 
          s.*,
          p.name as project_name,
          p.slug as project_slug
        FROM subscribers s
        JOIN projects p ON s.project_id = p.id
        WHERE s.id = $1
      `;

      const subscriber = await queryOne<Subscriber & {
        project_name: string;
        project_slug: string;
      }>(subscriberQuery, [subscriberId]);

      if (!subscriber) {
        throw new NotFoundError('Subscriber not found');
      }

      logger.debug('Subscriber retrieved', { subscriberId });

      return subscriber;
    } catch (error) {
      logger.error('Error retrieving subscriber:', error);
      throw error;
    }
  }

  /**
   * Create a new subscription
   */
  static async createSubscription(
    projectId: string,
    subscriptionData: CreateSubscriberRequest
  ): Promise<Subscriber> {
    try {
      // Check if subscriber already exists
      const existingSubscriber = await queryOne(
        'SELECT id, verified FROM subscribers WHERE project_id = $1 AND email = $2',
        [projectId, subscriptionData.email]
      );

      if (existingSubscriber) {
        if (existingSubscriber.verified) {
          throw new ConflictError('Email is already subscribed to this status page');
        } else {
          // Resend verification email for unverified subscriber
          await this.sendVerificationEmail(existingSubscriber.id);
          return existingSubscriber;
        }
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');

      const insertQuery = `
        INSERT INTO subscribers (
          project_id, email, phone, notify_by, notify_on, 
          verification_token, verified
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, project_id, email, phone, notify_by, notify_on, verified, created_at, updated_at
      `;

      const subscriber = await queryOne<Subscriber>(insertQuery, [
        projectId,
        subscriptionData.email,
        subscriptionData.phone || null,
        JSON.stringify(subscriptionData.notify_by),
        JSON.stringify(subscriptionData.notify_on),
        verificationToken,
        false // Start as unverified
      ]);

      if (!subscriber) {
        throw new Error('Failed to create subscription');
      }

      logger.info('Subscription created', {
        subscriberId: subscriber.id,
        projectId,
        email: subscriber.email,
        notifyBy: subscriptionData.notify_by
      });

      // Send verification email
      await this.sendVerificationEmail(subscriber.id);

      // Emit real-time update
      emitNewSubscriber(projectId, subscriber);

      return subscriber;
    } catch (error) {
      logger.error('Error creating subscription:', error);
      throw error;
    }
  }

  /**
   * Verify a subscription
   */
  static async verifySubscription(token: string): Promise<Subscriber> {
    try {
      const subscriber = await queryOne<Subscriber>(
        'SELECT * FROM subscribers WHERE verification_token = $1 AND verified = false',
        [token]
      );

      if (!subscriber) {
        throw new NotFoundError('Invalid or expired verification token');
      }

      // Update subscriber as verified
      const updatedSubscriber = await queryOne<Subscriber>(
        `UPDATE subscribers 
         SET verified = true, verification_token = NULL, updated_at = NOW()
         WHERE id = $1
         RETURNING id, project_id, email, phone, notify_by, notify_on, verified, created_at, updated_at`,
        [subscriber.id]
      );

      if (!updatedSubscriber) {
        throw new Error('Failed to verify subscription');
      }

      logger.info('Subscription verified', {
        subscriberId: subscriber.id,
        projectId: subscriber.project_id,
        email: subscriber.email
      });

      return updatedSubscriber;
    } catch (error) {
      logger.error('Error verifying subscription:', error);
      throw error;
    }
  }

  /**
   * Update subscriber preferences
   */
  static async updateSubscriber(
    subscriberId: string,
    updateData: Partial<CreateSubscriberRequest>
  ): Promise<Subscriber> {
    try {
      const existingSubscriber = await this.getSubscriberById(subscriberId);

      // Build update query dynamically
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramIndex = 1;

      if (updateData.phone !== undefined) {
        updateFields.push(`phone = $${paramIndex++}`);
        updateValues.push(updateData.phone);
      }

      if (updateData.notify_by !== undefined) {
        updateFields.push(`notify_by = $${paramIndex++}`);
        updateValues.push(JSON.stringify(updateData.notify_by));
      }

      if (updateData.notify_on !== undefined) {
        updateFields.push(`notify_on = $${paramIndex++}`);
        updateValues.push(JSON.stringify(updateData.notify_on));
      }

      if (updateFields.length === 0) {
        return existingSubscriber;
      }

      updateFields.push(`updated_at = NOW()`);
      updateValues.push(subscriberId);

      const updateQuery = `
        UPDATE subscribers 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING id, project_id, email, phone, notify_by, notify_on, verified, created_at, updated_at
      `;

      const updatedSubscriber = await queryOne<Subscriber>(updateQuery, updateValues);

      if (!updatedSubscriber) {
        throw new Error('Failed to update subscriber');
      }

      logger.info('Subscriber updated', {
        subscriberId,
        projectId: existingSubscriber.project_id,
        updatedFields: Object.keys(updateData)
      });

      return updatedSubscriber;
    } catch (error) {
      logger.error('Error updating subscriber:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe by email
   */
  static async unsubscribe(projectId: string, email: string): Promise<void> {
    try {
      const result = await query(
        'DELETE FROM subscribers WHERE project_id = $1 AND email = $2 RETURNING id',
        [projectId, email]
      );

      if (result.rows.length === 0) {
        throw new NotFoundError('Subscription not found');
      }

      logger.info('Subscriber unsubscribed', {
        projectId,
        email,
        subscriberId: result.rows[0].id
      });
    } catch (error) {
      logger.error('Error unsubscribing:', error);
      throw error;
    }
  }

  /**
   * Delete a subscriber
   */
  static async deleteSubscriber(subscriberId: string): Promise<void> {
    try {
      const subscriber = await this.getSubscriberById(subscriberId);

      await query('DELETE FROM subscribers WHERE id = $1', [subscriberId]);

      logger.info('Subscriber deleted', {
        subscriberId,
        projectId: subscriber.project_id,
        email: subscriber.email
      });
    } catch (error) {
      logger.error('Error deleting subscriber:', error);
      throw error;
    }
  }

  /**
   * Get verified subscribers for notifications
   */
  static async getVerifiedSubscribers(
    projectId: string,
    notifyBy?: string[]
  ): Promise<Subscriber[]> {
    try {
      let notifyByCondition = '';
      let queryParams: any[] = [projectId];

      if (notifyBy && notifyBy.length > 0) {
        // Check if any of the notify_by methods match
        notifyByCondition = 'AND notify_by ?| $2';
        queryParams.push(notifyBy);
      }

      const subscribersQuery = `
        SELECT 
          id, project_id, email, phone, notify_by, notify_on, 
          verified, created_at, updated_at
        FROM subscribers 
        WHERE project_id = $1 AND verified = true ${notifyByCondition}
        ORDER BY created_at DESC
      `;

      const subscribersResult = await query<Subscriber>(subscribersQuery, queryParams);

      logger.debug('Verified subscribers retrieved', {
        projectId,
        count: subscribersResult.rows.length,
        notifyBy
      });

      return subscribersResult.rows;
    } catch (error) {
      logger.error('Error retrieving verified subscribers:', error);
      throw error;
    }
  }

  /**
   * Send verification email (placeholder - implement with actual email service)
   */
  private static async sendVerificationEmail(subscriberId: string): Promise<void> {
    try {
      const subscriber = await this.getSubscriberById(subscriberId);
      
      // TODO: Implement actual email sending
      // This would integrate with your email service (SendGrid, etc.)
      
      logger.info('Verification email sent', {
        subscriberId,
        email: subscriber.email
      });
    } catch (error) {
      logger.error('Error sending verification email:', error);
      // Don't throw error here as subscription was created successfully
    }
  }

  /**
   * Get subscriber statistics for a project
   */
  static async getSubscriberStats(projectId: string): Promise<any> {
    try {
      const statsQuery = `
        SELECT 
          COUNT(*) as total_subscribers,
          COUNT(*) FILTER (WHERE verified = true) as verified_subscribers,
          COUNT(*) FILTER (WHERE verified = false) as unverified_subscribers,
          COUNT(*) FILTER (WHERE 'email' = ANY(notify_by::text[])) as email_subscribers,
          COUNT(*) FILTER (WHERE 'sms' = ANY(notify_by::text[])) as sms_subscribers
        FROM subscribers
        WHERE project_id = $1
      `;

      const stats = await queryOne(statsQuery, [projectId]);

      logger.debug('Subscriber stats retrieved', { projectId, stats });

      return {
        total_subscribers: parseInt(stats?.total_subscribers || '0', 10),
        verified_subscribers: parseInt(stats?.verified_subscribers || '0', 10),
        unverified_subscribers: parseInt(stats?.unverified_subscribers || '0', 10),
        email_subscribers: parseInt(stats?.email_subscribers || '0', 10),
        sms_subscribers: parseInt(stats?.sms_subscribers || '0', 10)
      };
    } catch (error) {
      logger.error('Error retrieving subscriber stats:', error);
      throw error;
    }
  }
}
