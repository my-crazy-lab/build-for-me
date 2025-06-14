import { query, queryOne } from '../config/database';
import { logger } from '../utils/logger';
import { 
  Project, 
  Component, 
  Incident,
  ComponentStatus,
  IncidentStatus,
  StatusPageData 
} from '../../../shared/types';
import { NotFoundError } from '../middleware/errorHandler';
import { ComponentService } from './ComponentService';

/**
 * Status Service
 * 
 * Handles public status page functionality including:
 * - Public status page data retrieval
 * - Overall status calculation
 * - Historical incident data
 * - Uptime statistics
 */

export class StatusService {
  /**
   * Get public status page data by slug
   */
  static async getStatusPageData(slug: string): Promise<StatusPageData> {
    try {
      // Get project by slug
      const projectQuery = `
        SELECT * FROM projects WHERE slug = $1
      `;

      const project = await queryOne<Project>(projectQuery, [slug]);

      if (!project) {
        throw new NotFoundError('Status page not found');
      }

      // Get components with their current status
      const componentsQuery = `
        SELECT 
          id, name, description, status, position,
          created_at, updated_at
        FROM components 
        WHERE project_id = $1 
        ORDER BY position ASC, created_at ASC
      `;

      const componentsResult = await query<Component>(componentsQuery, [project.id]);
      const components = componentsResult.rows;

      // Get recent incidents (last 30 days)
      const incidentsQuery = `
        SELECT 
          i.*,
          array_agg(
            json_build_object(
              'id', iu.id,
              'status', iu.status,
              'content', iu.content,
              'created_at', iu.created_at
            ) ORDER BY iu.created_at DESC
          ) FILTER (WHERE iu.id IS NOT NULL) as updates,
          array_agg(DISTINCT c.name) FILTER (WHERE c.id = ANY(i.affected_components)) as affected_component_names
        FROM incidents i
        LEFT JOIN incident_updates iu ON i.id = iu.incident_id
        LEFT JOIN components c ON c.id = ANY(i.affected_components)
        WHERE i.project_id = $1 
          AND i.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY i.id
        ORDER BY i.created_at DESC
        LIMIT 20
      `;

      const incidentsResult = await query<Incident & {
        updates: any[];
        affected_component_names: string[];
      }>(incidentsQuery, [project.id]);

      const incidents = incidentsResult.rows.map(incident => ({
        ...incident,
        updates: incident.updates || [],
        affected_component_names: incident.affected_component_names || []
      }));

      // Calculate overall status
      const overallStatus = await ComponentService.getOverallProjectStatus(project.id);

      // Get uptime statistics for the last 90 days
      const uptimeStats = await this.getUptimeStatistics(project.id);

      const statusPageData: StatusPageData = {
        project: {
          id: project.id,
          name: project.name,
          description: project.description,
          branding: project.branding,
          custom_domain: project.custom_domain,
          created_at: project.created_at,
          updated_at: project.updated_at
        },
        components,
        incidents,
        overall_status: overallStatus,
        uptime_stats: uptimeStats
      };

      logger.info('Status page data retrieved', {
        slug,
        projectId: project.id,
        componentsCount: components.length,
        incidentsCount: incidents.length,
        overallStatus
      });

      return statusPageData;
    } catch (error) {
      logger.error('Error retrieving status page data:', error);
      throw error;
    }
  }

  /**
   * Get uptime statistics for a project
   */
  static async getUptimeStatistics(projectId: string, days: number = 90): Promise<any> {
    try {
      const uptimeQuery = `
        SELECT 
          uc.component_id,
          c.name as component_name,
          COUNT(*) as total_checks,
          COUNT(*) FILTER (WHERE ul.success = true) as successful_checks,
          ROUND(
            (COUNT(*) FILTER (WHERE ul.success = true)::decimal / COUNT(*)) * 100, 
            2
          ) as uptime_percentage,
          AVG(ul.response_time) FILTER (WHERE ul.success = true) as avg_response_time
        FROM uptime_checks uc
        JOIN components c ON uc.component_id = c.id
        LEFT JOIN uptime_logs ul ON uc.id = ul.uptime_check_id
          AND ul.checked_at >= NOW() - INTERVAL '${days} days'
        WHERE c.project_id = $1
        GROUP BY uc.component_id, c.name
        ORDER BY c.position ASC, c.created_at ASC
      `;

      const uptimeResult = await query(uptimeQuery, [projectId]);

      // Get overall project uptime
      const overallUptimeQuery = `
        SELECT 
          COUNT(*) as total_checks,
          COUNT(*) FILTER (WHERE ul.success = true) as successful_checks,
          ROUND(
            (COUNT(*) FILTER (WHERE ul.success = true)::decimal / COUNT(*)) * 100, 
            2
          ) as overall_uptime_percentage
        FROM uptime_checks uc
        JOIN components c ON uc.component_id = c.id
        LEFT JOIN uptime_logs ul ON uc.id = ul.uptime_check_id
          AND ul.checked_at >= NOW() - INTERVAL '${days} days'
        WHERE c.project_id = $1
      `;

      const overallResult = await queryOne(overallUptimeQuery, [projectId]);

      // Get daily uptime data for the last 90 days
      const dailyUptimeQuery = `
        SELECT 
          DATE(ul.checked_at) as date,
          COUNT(*) as total_checks,
          COUNT(*) FILTER (WHERE ul.success = true) as successful_checks,
          ROUND(
            (COUNT(*) FILTER (WHERE ul.success = true)::decimal / COUNT(*)) * 100, 
            2
          ) as daily_uptime_percentage
        FROM uptime_checks uc
        JOIN components c ON uc.component_id = c.id
        LEFT JOIN uptime_logs ul ON uc.id = ul.uptime_check_id
          AND ul.checked_at >= NOW() - INTERVAL '${days} days'
        WHERE c.project_id = $1
        GROUP BY DATE(ul.checked_at)
        ORDER BY date DESC
        LIMIT ${days}
      `;

      const dailyResult = await query(dailyUptimeQuery, [projectId]);

      const uptimeStats = {
        overall_uptime: parseFloat(overallResult?.overall_uptime_percentage || '100'),
        components: uptimeResult.rows.map(row => ({
          component_id: row.component_id,
          component_name: row.component_name,
          uptime_percentage: parseFloat(row.uptime_percentage || '100'),
          avg_response_time: parseFloat(row.avg_response_time || '0'),
          total_checks: parseInt(row.total_checks || '0', 10),
          successful_checks: parseInt(row.successful_checks || '0', 10)
        })),
        daily_data: dailyResult.rows.map(row => ({
          date: row.date,
          uptime_percentage: parseFloat(row.daily_uptime_percentage || '100'),
          total_checks: parseInt(row.total_checks || '0', 10),
          successful_checks: parseInt(row.successful_checks || '0', 10)
        })),
        period_days: days
      };

      logger.debug('Uptime statistics retrieved', {
        projectId,
        days,
        overallUptime: uptimeStats.overall_uptime,
        componentsCount: uptimeStats.components.length
      });

      return uptimeStats;
    } catch (error) {
      logger.error('Error retrieving uptime statistics:', error);
      return {
        overall_uptime: 100,
        components: [],
        daily_data: [],
        period_days: days
      };
    }
  }

  /**
   * Get incident history for a project
   */
  static async getIncidentHistory(
    projectId: string,
    days: number = 90,
    limit: number = 50
  ): Promise<Incident[]> {
    try {
      const incidentsQuery = `
        SELECT 
          i.*,
          array_agg(
            json_build_object(
              'id', iu.id,
              'status', iu.status,
              'content', iu.content,
              'created_at', iu.created_at
            ) ORDER BY iu.created_at DESC
          ) FILTER (WHERE iu.id IS NOT NULL) as updates,
          array_agg(DISTINCT c.name) FILTER (WHERE c.id = ANY(i.affected_components)) as affected_component_names
        FROM incidents i
        LEFT JOIN incident_updates iu ON i.id = iu.incident_id
        LEFT JOIN components c ON c.id = ANY(i.affected_components)
        WHERE i.project_id = $1 
          AND i.created_at >= NOW() - INTERVAL '${days} days'
        GROUP BY i.id
        ORDER BY i.created_at DESC
        LIMIT $2
      `;

      const incidentsResult = await query<Incident & {
        updates: any[];
        affected_component_names: string[];
      }>(incidentsQuery, [projectId, limit]);

      const incidents = incidentsResult.rows.map(incident => ({
        ...incident,
        updates: incident.updates || [],
        affected_component_names: incident.affected_component_names || []
      }));

      logger.debug('Incident history retrieved', {
        projectId,
        days,
        incidentsCount: incidents.length
      });

      return incidents;
    } catch (error) {
      logger.error('Error retrieving incident history:', error);
      throw error;
    }
  }

  /**
   * Get status summary for a project
   */
  static async getStatusSummary(projectId: string): Promise<any> {
    try {
      // Get component status distribution
      const statusDistribution = await ComponentService.getComponentStatusDistribution(projectId);

      // Get active incidents count
      const activeIncidentsResult = await queryOne<{ count: string }>(
        'SELECT COUNT(*) as count FROM incidents WHERE project_id = $1 AND status != $2',
        [projectId, IncidentStatus.RESOLVED]
      );

      const activeIncidents = parseInt(activeIncidentsResult?.count || '0', 10);

      // Get overall status
      const overallStatus = await ComponentService.getOverallProjectStatus(projectId);

      // Get recent uptime
      const recentUptimeResult = await queryOne(
        `SELECT 
           ROUND(
             (COUNT(*) FILTER (WHERE ul.success = true)::decimal / COUNT(*)) * 100, 
             2
           ) as uptime_percentage
         FROM uptime_checks uc
         JOIN components c ON uc.component_id = c.id
         LEFT JOIN uptime_logs ul ON uc.id = ul.uptime_check_id
           AND ul.checked_at >= NOW() - INTERVAL '24 hours'
         WHERE c.project_id = $1`,
        [projectId]
      );

      const recentUptime = parseFloat(recentUptimeResult?.uptime_percentage || '100');

      const summary = {
        overall_status: overallStatus,
        component_status_distribution: statusDistribution,
        active_incidents: activeIncidents,
        recent_uptime_24h: recentUptime,
        status_message: this.getStatusMessage(overallStatus, activeIncidents)
      };

      logger.debug('Status summary retrieved', {
        projectId,
        overallStatus,
        activeIncidents,
        recentUptime
      });

      return summary;
    } catch (error) {
      logger.error('Error retrieving status summary:', error);
      throw error;
    }
  }

  /**
   * Get human-readable status message
   */
  private static getStatusMessage(status: ComponentStatus, activeIncidents: number): string {
    if (activeIncidents > 0) {
      return `We are currently experiencing ${activeIncidents} active incident${activeIncidents > 1 ? 's' : ''}`;
    }

    switch (status) {
      case ComponentStatus.OPERATIONAL:
        return 'All systems operational';
      case ComponentStatus.DEGRADED:
        return 'Some systems experiencing degraded performance';
      case ComponentStatus.PARTIAL_OUTAGE:
        return 'Some systems experiencing partial outage';
      case ComponentStatus.MAJOR_OUTAGE:
        return 'Major outage affecting multiple systems';
      case ComponentStatus.MAINTENANCE:
        return 'Scheduled maintenance in progress';
      default:
        return 'Status unknown';
    }
  }

  /**
   * Check if a project exists and is accessible
   */
  static async validateProjectAccess(slug: string): Promise<Project> {
    try {
      const project = await queryOne<Project>(
        'SELECT * FROM projects WHERE slug = $1',
        [slug]
      );

      if (!project) {
        throw new NotFoundError('Status page not found');
      }

      return project;
    } catch (error) {
      logger.error('Error validating project access:', error);
      throw error;
    }
  }
}
