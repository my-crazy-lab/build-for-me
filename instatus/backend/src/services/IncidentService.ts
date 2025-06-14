import { query, queryOne, transaction } from '../config/database';
import { logger } from '../utils/logger';
import { 
  Incident, 
  IncidentUpdate,
  IncidentStatus,
  IncidentImpact,
  CreateIncidentRequest,
  UpdateIncidentRequest,
  PaginationInfo 
} from '../../../shared/types';
import { NotFoundError, ValidationError } from '../middleware/errorHandler';
import { emitIncidentCreated, emitIncidentUpdated, emitIncidentResolved } from '../config/socket';

/**
 * Incident Service
 * 
 * Handles all incident-related business logic including:
 * - Incident CRUD operations
 * - Incident timeline management
 * - Status updates and notifications
 * - Real-time incident broadcasting
 */

export class IncidentService {
  /**
   * Get all incidents for a project with pagination
   */
  static async getProjectIncidents(
    projectId: string,
    page: number = 1,
    limit: number = 20,
    status?: IncidentStatus
  ): Promise<{ incidents: Incident[]; pagination: PaginationInfo }> {
    try {
      const offset = (page - 1) * limit;
      
      // Build status filter
      let statusCondition = '';
      let queryParams: any[] = [projectId];
      
      if (status) {
        statusCondition = 'AND status = $2';
        queryParams.push(status);
        queryParams.push(limit, offset);
      } else {
        queryParams.push(limit, offset);
      }

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM incidents 
        WHERE project_id = $1 ${status ? 'AND status = $2' : ''}
      `;
      const countParams = status ? [projectId, status] : [projectId];
      const countResult = await queryOne<{ total: string }>(countQuery, countParams);
      const total = parseInt(countResult?.total || '0', 10);

      // Get incidents with updates
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
        WHERE i.project_id = $1 ${statusCondition}
        GROUP BY i.id
        ORDER BY i.created_at DESC
        LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}
      `;

      const incidentsResult = await query<Incident & {
        updates: IncidentUpdate[];
        affected_component_names: string[];
      }>(incidentsQuery, queryParams);

      const incidents = incidentsResult.rows.map(incident => ({
        ...incident,
        updates: incident.updates || [],
        affected_component_names: incident.affected_component_names || []
      }));

      const totalPages = Math.ceil(total / limit);

      const pagination: PaginationInfo = {
        page,
        limit,
        total,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1
      };

      logger.debug('Incidents retrieved', {
        projectId,
        count: incidents.length,
        page,
        total,
        status
      });

      return { incidents, pagination };
    } catch (error) {
      logger.error('Error retrieving project incidents:', error);
      throw error;
    }
  }

  /**
   * Get a single incident by ID
   */
  static async getIncidentById(incidentId: string): Promise<Incident> {
    try {
      const incidentQuery = `
        SELECT 
          i.*,
          p.name as project_name,
          p.slug as project_slug,
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
        JOIN projects p ON i.project_id = p.id
        LEFT JOIN incident_updates iu ON i.id = iu.incident_id
        LEFT JOIN components c ON c.id = ANY(i.affected_components)
        WHERE i.id = $1
        GROUP BY i.id, p.name, p.slug
      `;

      const incident = await queryOne<Incident & {
        project_name: string;
        project_slug: string;
        updates: IncidentUpdate[];
        affected_component_names: string[];
      }>(incidentQuery, [incidentId]);

      if (!incident) {
        throw new NotFoundError('Incident not found');
      }

      const result = {
        ...incident,
        updates: incident.updates || [],
        affected_component_names: incident.affected_component_names || []
      };

      logger.debug('Incident retrieved', { incidentId });

      return result;
    } catch (error) {
      logger.error('Error retrieving incident:', error);
      throw error;
    }
  }

  /**
   * Create a new incident
   */
  static async createIncident(
    projectId: string,
    incidentData: CreateIncidentRequest
  ): Promise<Incident> {
    try {
      // Validate affected components exist in the project
      if (incidentData.affected_components && incidentData.affected_components.length > 0) {
        const componentsQuery = `
          SELECT id FROM components 
          WHERE project_id = $1 AND id = ANY($2)
        `;
        const componentsResult = await query(componentsQuery, [
          projectId,
          incidentData.affected_components
        ]);

        if (componentsResult.rows.length !== incidentData.affected_components.length) {
          throw new ValidationError('Some affected components do not exist in this project');
        }
      }

      const incident = await transaction(async (client) => {
        // Create incident
        const insertQuery = `
          INSERT INTO incidents (
            project_id, title, content, status, impact, 
            start_time, affected_components
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `;

        const incidentResult = await client.query(insertQuery, [
          projectId,
          incidentData.title,
          incidentData.content,
          incidentData.status || IncidentStatus.INVESTIGATING,
          incidentData.impact || IncidentImpact.MINOR,
          incidentData.start_time || new Date(),
          incidentData.affected_components || []
        ]);

        const newIncident = incidentResult.rows[0];

        // Create initial incident update
        await client.query(
          `INSERT INTO incident_updates (incident_id, status, content) 
           VALUES ($1, $2, $3)`,
          [
            newIncident.id,
            newIncident.status,
            incidentData.content
          ]
        );

        return newIncident;
      });

      logger.info('Incident created', {
        incidentId: incident.id,
        projectId,
        title: incident.title,
        status: incident.status,
        impact: incident.impact
      });

      // Emit real-time update
      emitIncidentCreated(projectId, incident);

      return incident;
    } catch (error) {
      logger.error('Error creating incident:', error);
      throw error;
    }
  }

  /**
   * Update an incident
   */
  static async updateIncident(
    incidentId: string,
    updateData: UpdateIncidentRequest
  ): Promise<Incident> {
    try {
      const existingIncident = await this.getIncidentById(incidentId);

      // Validate affected components if provided
      if (updateData.affected_components && updateData.affected_components.length > 0) {
        const componentsQuery = `
          SELECT id FROM components 
          WHERE project_id = $1 AND id = ANY($2)
        `;
        const componentsResult = await query(componentsQuery, [
          existingIncident.project_id,
          updateData.affected_components
        ]);

        if (componentsResult.rows.length !== updateData.affected_components.length) {
          throw new ValidationError('Some affected components do not exist in this project');
        }
      }

      const updatedIncident = await transaction(async (client) => {
        // Build update query dynamically
        const updateFields: string[] = [];
        const updateValues: any[] = [];
        let paramIndex = 1;

        if (updateData.title !== undefined) {
          updateFields.push(`title = $${paramIndex++}`);
          updateValues.push(updateData.title);
        }

        if (updateData.content !== undefined) {
          updateFields.push(`content = $${paramIndex++}`);
          updateValues.push(updateData.content);
        }

        if (updateData.status !== undefined) {
          updateFields.push(`status = $${paramIndex++}`);
          updateValues.push(updateData.status);
        }

        if (updateData.impact !== undefined) {
          updateFields.push(`impact = $${paramIndex++}`);
          updateValues.push(updateData.impact);
        }

        if (updateData.affected_components !== undefined) {
          updateFields.push(`affected_components = $${paramIndex++}`);
          updateValues.push(updateData.affected_components);
        }

        if (updateData.end_time !== undefined) {
          updateFields.push(`end_time = $${paramIndex++}`);
          updateValues.push(updateData.end_time);
        }

        if (updateFields.length === 0) {
          return existingIncident;
        }

        updateFields.push(`updated_at = NOW()`);
        updateValues.push(incidentId);

        const updateQuery = `
          UPDATE incidents 
          SET ${updateFields.join(', ')}
          WHERE id = $${paramIndex}
          RETURNING *
        `;

        const result = await client.query(updateQuery, updateValues);
        const incident = result.rows[0];

        // Add incident update if status or content changed
        if (updateData.status || updateData.content) {
          await client.query(
            `INSERT INTO incident_updates (incident_id, status, content) 
             VALUES ($1, $2, $3)`,
            [
              incidentId,
              updateData.status || existingIncident.status,
              updateData.content || 'Incident updated'
            ]
          );
        }

        return incident;
      });

      logger.info('Incident updated', {
        incidentId,
        projectId: existingIncident.project_id,
        updatedFields: Object.keys(updateData)
      });

      // Emit real-time updates
      if (updateData.status === IncidentStatus.RESOLVED) {
        emitIncidentResolved(existingIncident.project_id, updatedIncident);
      } else {
        emitIncidentUpdated(existingIncident.project_id, updatedIncident);
      }

      return updatedIncident;
    } catch (error) {
      logger.error('Error updating incident:', error);
      throw error;
    }
  }

  /**
   * Delete an incident
   */
  static async deleteIncident(incidentId: string): Promise<void> {
    try {
      const incident = await this.getIncidentById(incidentId);

      await transaction(async (client) => {
        // Delete incident updates first
        await client.query('DELETE FROM incident_updates WHERE incident_id = $1', [incidentId]);
        
        // Delete notifications related to this incident
        await client.query('DELETE FROM notifications WHERE incident_id = $1', [incidentId]);
        
        // Delete the incident
        await client.query('DELETE FROM incidents WHERE id = $1', [incidentId]);
      });

      logger.info('Incident deleted', {
        incidentId,
        projectId: incident.project_id,
        incidentTitle: incident.title
      });
    } catch (error) {
      logger.error('Error deleting incident:', error);
      throw error;
    }
  }

  /**
   * Add an update to an incident
   */
  static async addIncidentUpdate(
    incidentId: string,
    status: IncidentStatus,
    content: string
  ): Promise<IncidentUpdate> {
    try {
      const incident = await this.getIncidentById(incidentId);

      const update = await transaction(async (client) => {
        // Update incident status
        await client.query(
          'UPDATE incidents SET status = $1, updated_at = NOW() WHERE id = $2',
          [status, incidentId]
        );

        // Add incident update
        const updateResult = await client.query(
          `INSERT INTO incident_updates (incident_id, status, content) 
           VALUES ($1, $2, $3) RETURNING *`,
          [incidentId, status, content]
        );

        // If resolved, set end_time
        if (status === IncidentStatus.RESOLVED) {
          await client.query(
            'UPDATE incidents SET end_time = NOW() WHERE id = $1',
            [incidentId]
          );
        }

        return updateResult.rows[0];
      });

      logger.info('Incident update added', {
        incidentId,
        projectId: incident.project_id,
        status,
        updateId: update.id
      });

      // Emit real-time updates
      if (status === IncidentStatus.RESOLVED) {
        emitIncidentResolved(incident.project_id, { ...incident, status });
      } else {
        emitIncidentUpdated(incident.project_id, { ...incident, status });
      }

      return update;
    } catch (error) {
      logger.error('Error adding incident update:', error);
      throw error;
    }
  }

  /**
   * Get incident statistics for a project
   */
  static async getIncidentStats(projectId: string): Promise<any> {
    try {
      const statsQuery = `
        SELECT 
          COUNT(*) as total_incidents,
          COUNT(*) FILTER (WHERE status != 'resolved') as active_incidents,
          COUNT(*) FILTER (WHERE status = 'resolved') as resolved_incidents,
          COUNT(*) FILTER (WHERE impact = 'critical') as critical_incidents,
          COUNT(*) FILTER (WHERE impact = 'major') as major_incidents,
          COUNT(*) FILTER (WHERE impact = 'minor') as minor_incidents,
          AVG(EXTRACT(EPOCH FROM (end_time - start_time))/3600) FILTER (WHERE end_time IS NOT NULL) as avg_resolution_hours
        FROM incidents
        WHERE project_id = $1
      `;

      const stats = await queryOne(statsQuery, [projectId]);

      logger.debug('Incident stats retrieved', { projectId, stats });

      return {
        total_incidents: parseInt(stats?.total_incidents || '0', 10),
        active_incidents: parseInt(stats?.active_incidents || '0', 10),
        resolved_incidents: parseInt(stats?.resolved_incidents || '0', 10),
        critical_incidents: parseInt(stats?.critical_incidents || '0', 10),
        major_incidents: parseInt(stats?.major_incidents || '0', 10),
        minor_incidents: parseInt(stats?.minor_incidents || '0', 10),
        avg_resolution_hours: parseFloat(stats?.avg_resolution_hours || '0')
      };
    } catch (error) {
      logger.error('Error retrieving incident stats:', error);
      throw error;
    }
  }
}
