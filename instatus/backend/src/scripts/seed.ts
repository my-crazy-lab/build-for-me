#!/usr/bin/env node

import bcrypt from 'bcryptjs';
import { query } from '../config/database';
import { logger } from '../utils/logger';
import { 
  UserRole, 
  ComponentStatus, 
  IncidentStatus, 
  IncidentImpact,
  DEFAULT_USER_PREFERENCES,
  DEFAULT_PROJECT_BRANDING 
} from '../../../shared/types';

/**
 * Database Seed Script
 * 
 * Creates sample data for development and testing
 */

async function seedDatabase(): Promise<void> {
  try {
    logger.info('Starting database seeding...');

    // Check if data already exists
    const existingUsers = await query('SELECT COUNT(*) as count FROM users');
    const userCount = parseInt(existingUsers.rows[0].count, 10);

    if (userCount > 0) {
      logger.info('Database already contains data. Skipping seed.');
      return;
    }

    // Create admin user
    const adminPasswordHash = await bcrypt.hash('admin123', 12);
    const adminResult = await query(
      `INSERT INTO users (email, name, password_hash, role, email_verified, preferences) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        'admin@instatus-clone.com',
        'Admin User',
        adminPasswordHash,
        UserRole.ADMIN,
        true,
        JSON.stringify(DEFAULT_USER_PREFERENCES)
      ]
    );
    const adminId = adminResult.rows[0].id;
    logger.info('Created admin user');

    // Create regular user
    const userPasswordHash = await bcrypt.hash('user123', 12);
    const userResult = await query(
      `INSERT INTO users (email, name, password_hash, role, email_verified, preferences) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        'user@instatus-clone.com',
        'Demo User',
        userPasswordHash,
        UserRole.USER,
        true,
        JSON.stringify(DEFAULT_USER_PREFERENCES)
      ]
    );
    const userId = userResult.rows[0].id;
    logger.info('Created demo user');

    // Create sample project
    const projectResult = await query(
      `INSERT INTO projects (user_id, name, slug, description, is_private, branding) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        userId,
        'Demo Status Page',
        'demo-status-page',
        'A demonstration status page showing all features',
        false,
        JSON.stringify({
          ...DEFAULT_PROJECT_BRANDING,
          primary_color: '#3b82f6',
          secondary_color: '#1e40af'
        })
      ]
    );
    const projectId = projectResult.rows[0].id;
    logger.info('Created demo project');

    // Create sample components
    const components = [
      {
        name: 'API Server',
        description: 'Main API backend service',
        status: ComponentStatus.OPERATIONAL,
        position: 1
      },
      {
        name: 'Web Application',
        description: 'Frontend web application',
        status: ComponentStatus.OPERATIONAL,
        position: 2
      },
      {
        name: 'Database',
        description: 'Primary database cluster',
        status: ComponentStatus.DEGRADED,
        position: 3
      },
      {
        name: 'CDN',
        description: 'Content delivery network',
        status: ComponentStatus.OPERATIONAL,
        position: 4
      },
      {
        name: 'Email Service',
        description: 'Email notification service',
        status: ComponentStatus.MAINTENANCE,
        position: 5
      }
    ];

    const componentIds: string[] = [];
    for (const component of components) {
      const componentResult = await query(
        `INSERT INTO components (project_id, name, description, status, position) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [projectId, component.name, component.description, component.status, component.position]
      );
      componentIds.push(componentResult.rows[0].id);
    }
    logger.info(`Created ${components.length} sample components`);

    // Create sample incidents
    const incidents = [
      {
        title: 'Database Performance Issues',
        content: 'We are experiencing slow response times from our database cluster.',
        status: IncidentStatus.MONITORING,
        impact: IncidentImpact.MINOR,
        affected_components: [componentIds[2]], // Database
        start_time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updates: [
          {
            status: IncidentStatus.INVESTIGATING,
            content: 'We are investigating reports of slow database performance.',
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000)
          },
          {
            status: IncidentStatus.IDENTIFIED,
            content: 'We have identified the cause as high CPU usage on the primary database server.',
            created_at: new Date(Date.now() - 90 * 60 * 1000)
          },
          {
            status: IncidentStatus.MONITORING,
            content: 'We have implemented a fix and are monitoring the situation.',
            created_at: new Date(Date.now() - 30 * 60 * 1000)
          }
        ]
      },
      {
        title: 'Scheduled Email Service Maintenance',
        content: 'Planned maintenance on our email notification service.',
        status: IncidentStatus.RESOLVED,
        impact: IncidentImpact.NONE,
        affected_components: [componentIds[4]], // Email Service
        start_time: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        end_time: new Date(Date.now() - 22 * 60 * 60 * 1000), // 22 hours ago
        updates: [
          {
            status: IncidentStatus.INVESTIGATING,
            content: 'Starting scheduled maintenance on email service.',
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000)
          },
          {
            status: IncidentStatus.RESOLVED,
            content: 'Maintenance completed successfully. All services are operational.',
            created_at: new Date(Date.now() - 22 * 60 * 60 * 1000)
          }
        ]
      }
    ];

    for (const incident of incidents) {
      // Create incident
      const incidentResult = await query(
        `INSERT INTO incidents (project_id, title, content, status, impact, start_time, end_time, affected_components) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [
          projectId,
          incident.title,
          incident.content,
          incident.status,
          incident.impact,
          incident.start_time,
          incident.end_time || null,
          incident.affected_components
        ]
      );
      const incidentId = incidentResult.rows[0].id;

      // Create incident updates
      for (const update of incident.updates) {
        await query(
          `INSERT INTO incident_updates (incident_id, status, content, created_at) 
           VALUES ($1, $2, $3, $4)`,
          [incidentId, update.status, update.content, update.created_at]
        );
      }
    }
    logger.info(`Created ${incidents.length} sample incidents with updates`);

    // Create sample subscribers
    const subscribers = [
      {
        email: 'subscriber1@example.com',
        notify_by: ['email'],
        notify_on: ['incident_created', 'incident_resolved'],
        verified: true
      },
      {
        email: 'subscriber2@example.com',
        phone: '+1234567890',
        notify_by: ['email', 'sms'],
        notify_on: ['incident_created', 'incident_updated', 'incident_resolved'],
        verified: true
      },
      {
        email: 'subscriber3@example.com',
        notify_by: ['email'],
        notify_on: ['incident_created', 'incident_resolved'],
        verified: false
      }
    ];

    for (const subscriber of subscribers) {
      await query(
        `INSERT INTO subscribers (project_id, email, phone, notify_by, notify_on, verified) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          projectId,
          subscriber.email,
          subscriber.phone || null,
          JSON.stringify(subscriber.notify_by),
          JSON.stringify(subscriber.notify_on),
          subscriber.verified
        ]
      );
    }
    logger.info(`Created ${subscribers.length} sample subscribers`);

    // Create sample uptime checks
    const uptimeChecks = [
      {
        component_id: componentIds[0], // API Server
        name: 'API Health Check',
        url: 'https://api.example.com/health',
        method: 'GET',
        interval: 300, // 5 minutes
        timeout: 30,
        expected_status_codes: [200]
      },
      {
        component_id: componentIds[1], // Web Application
        name: 'Website Check',
        url: 'https://example.com',
        method: 'GET',
        interval: 300,
        timeout: 30,
        expected_status_codes: [200]
      }
    ];

    for (const check of uptimeChecks) {
      const checkResult = await query(
        `INSERT INTO uptime_checks (component_id, name, url, method, interval_seconds, timeout_seconds, expected_status_codes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [
          check.component_id,
          check.name,
          check.url,
          check.method,
          check.interval,
          check.timeout,
          check.expected_status_codes
        ]
      );

      // Create some sample uptime logs
      const checkId = checkResult.rows[0].id;
      const now = new Date();
      
      for (let i = 0; i < 100; i++) {
        const checkedAt = new Date(now.getTime() - i * 5 * 60 * 1000); // Every 5 minutes
        const success = Math.random() > 0.05; // 95% success rate
        const responseTime = success ? Math.floor(Math.random() * 500) + 50 : null;
        const statusCode = success ? 200 : Math.floor(Math.random() * 2) === 0 ? 500 : 503;

        await query(
          `INSERT INTO uptime_logs (uptime_check_id, success, response_time, status_code, checked_at) 
           VALUES ($1, $2, $3, $4, $5)`,
          [checkId, success, responseTime, statusCode, checkedAt]
        );
      }
    }
    logger.info(`Created ${uptimeChecks.length} uptime checks with sample logs`);

    logger.info('Database seeding completed successfully');
    logger.info('Sample credentials:');
    logger.info('  Admin: admin@instatus-clone.com / admin123');
    logger.info('  User:  user@instatus-clone.com / user123');
    logger.info('  Demo status page: /demo-status-page');

  } catch (error) {
    logger.error('Database seeding failed:', error);
    throw error;
  }
}

// Run seeding if this script is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      logger.info('Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seed script failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };
