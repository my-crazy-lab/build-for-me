import { query, queryOne, transaction } from '../config/database';
import { logger } from '../utils/logger';
import { 
  Component, 
  ComponentStatus,
  CreateComponentRequest,
  PaginationInfo 
} from '../../../shared/types';
import { NotFoundError, ValidationError } from '../middleware/errorHandler';
import { emitComponentStatusChanged } from '../config/socket';

/**
 * Component Service
 * 
 * Handles all component-related business logic including:
 * - Component CRUD operations
 * - Status management
 * - Component ordering
 * - Real-time status updates
 */

export class ComponentService {
  /**
   * Get all components for a project
   */
  static async getProjectComponents(
    projectId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ components: Component[]; pagination: PaginationInfo }> {
    try {
      const offset = (page - 1) * limit;

      // Get total count
      const countResult = await queryOne<{ total: string }>(
        'SELECT COUNT(*) as total FROM components WHERE project_id = $1',
        [projectId]
      );
      const total = parseInt(countResult?.total || '0', 10);

      // Get components
      const componentsQuery = `
        SELECT 
          c.*,
          COUNT(uc.id) as uptime_checks_count
        FROM components c
        LEFT JOIN uptime_checks uc ON c.id = uc.component_id
        WHERE c.project_id = $1
        GROUP BY c.id
        ORDER BY c.position ASC, c.created_at ASC
        LIMIT $2 OFFSET $3
      `;

      const componentsResult = await query<Component & { uptime_checks_count: string }>(
        componentsQuery,
        [projectId, limit, offset]
      );

      const components = componentsResult.rows.map(component => ({
        ...component,
        uptime_checks_count: parseInt(component.uptime_checks_count, 10)
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

      logger.debug('Components retrieved', {
        projectId,
        count: components.length,
        page,
        total
      });

      return { components, pagination };
    } catch (error) {
      logger.error('Error retrieving project components:', error);
      throw error;
    }
  }

  /**
   * Get a single component by ID
   */
  static async getComponentById(componentId: string): Promise<Component> {
    try {
      const componentQuery = `
        SELECT 
          c.*,
          p.name as project_name,
          p.slug as project_slug,
          COUNT(uc.id) as uptime_checks_count
        FROM components c
        JOIN projects p ON c.project_id = p.id
        LEFT JOIN uptime_checks uc ON c.id = uc.component_id
        WHERE c.id = $1
        GROUP BY c.id, p.name, p.slug
      `;

      const component = await queryOne<Component & {
        project_name: string;
        project_slug: string;
        uptime_checks_count: string;
      }>(componentQuery, [componentId]);

      if (!component) {
        throw new NotFoundError('Component not found');
      }

      const result = {
        ...component,
        uptime_checks_count: parseInt(component.uptime_checks_count, 10)
      };

      logger.debug('Component retrieved', { componentId });

      return result;
    } catch (error) {
      logger.error('Error retrieving component:', error);
      throw error;
    }
  }

  /**
   * Create a new component
   */
  static async createComponent(
    projectId: string,
    componentData: CreateComponentRequest
  ): Promise<Component> {
    try {
      // Check component limit per project
      const componentCount = await queryOne<{ count: string }>(
        'SELECT COUNT(*) as count FROM components WHERE project_id = $1',
        [projectId]
      );

      const count = parseInt(componentCount?.count || '0', 10);
      const maxComponents = parseInt(process.env.MAX_COMPONENTS_PER_PROJECT || '50', 10);

      if (count >= maxComponents) {
        throw new ValidationError(`Maximum ${maxComponents} components allowed per project`);
      }

      // Get next position
      const maxPositionResult = await queryOne<{ max_position: number }>(
        'SELECT COALESCE(MAX(position), 0) as max_position FROM components WHERE project_id = $1',
        [projectId]
      );

      const nextPosition = (maxPositionResult?.max_position || 0) + 1;

      const insertQuery = `
        INSERT INTO components (
          project_id, name, description, status, position
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const component = await queryOne<Component>(insertQuery, [
        projectId,
        componentData.name,
        componentData.description || null,
        componentData.status || ComponentStatus.OPERATIONAL,
        nextPosition
      ]);

      if (!component) {
        throw new Error('Failed to create component');
      }

      logger.info('Component created', {
        componentId: component.id,
        projectId,
        name: component.name,
        status: component.status
      });

      // Emit real-time update
      emitComponentStatusChanged(projectId, component.id, component.status);

      return component;
    } catch (error) {
      logger.error('Error creating component:', error);
      throw error;
    }
  }

  /**
   * Update a component
   */
  static async updateComponent(
    componentId: string,
    updateData: Partial<CreateComponentRequest & { position: number }>
  ): Promise<Component> {
    try {
      // Get existing component
      const existingComponent = await this.getComponentById(componentId);

      // Build update query dynamically
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramIndex = 1;

      if (updateData.name !== undefined) {
        updateFields.push(`name = $${paramIndex++}`);
        updateValues.push(updateData.name);
      }

      if (updateData.description !== undefined) {
        updateFields.push(`description = $${paramIndex++}`);
        updateValues.push(updateData.description);
      }

      if (updateData.status !== undefined) {
        updateFields.push(`status = $${paramIndex++}`);
        updateValues.push(updateData.status);
      }

      if (updateData.position !== undefined) {
        updateFields.push(`position = $${paramIndex++}`);
        updateValues.push(updateData.position);
      }

      if (updateFields.length === 0) {
        return existingComponent;
      }

      updateFields.push(`updated_at = NOW()`);
      updateValues.push(componentId);

      const updateQuery = `
        UPDATE components 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const updatedComponent = await queryOne<Component>(updateQuery, updateValues);

      if (!updatedComponent) {
        throw new Error('Failed to update component');
      }

      logger.info('Component updated', {
        componentId,
        projectId: existingComponent.project_id,
        updatedFields: Object.keys(updateData)
      });

      // Emit real-time update if status changed
      if (updateData.status && updateData.status !== existingComponent.status) {
        emitComponentStatusChanged(
          existingComponent.project_id,
          componentId,
          updateData.status
        );
      }

      return updatedComponent;
    } catch (error) {
      logger.error('Error updating component:', error);
      throw error;
    }
  }

  /**
   * Delete a component
   */
  static async deleteComponent(componentId: string): Promise<void> {
    try {
      const component = await this.getComponentById(componentId);

      // Use transaction to ensure data consistency
      await transaction(async (client) => {
        // Delete related uptime logs first
        await client.query(
          'DELETE FROM uptime_logs WHERE uptime_check_id IN (SELECT id FROM uptime_checks WHERE component_id = $1)',
          [componentId]
        );
        
        // Delete uptime checks
        await client.query('DELETE FROM uptime_checks WHERE component_id = $1', [componentId]);
        
        // Remove component from incidents
        await client.query(
          'UPDATE incidents SET affected_components = array_remove(affected_components, $1) WHERE $1 = ANY(affected_components)',
          [componentId]
        );
        
        // Delete the component
        await client.query('DELETE FROM components WHERE id = $1', [componentId]);
      });

      logger.info('Component deleted', {
        componentId,
        projectId: component.project_id,
        componentName: component.name
      });

      // Emit real-time update
      emitComponentStatusChanged(component.project_id, componentId, 'deleted');
    } catch (error) {
      logger.error('Error deleting component:', error);
      throw error;
    }
  }

  /**
   * Update component status
   */
  static async updateComponentStatus(
    componentId: string,
    status: ComponentStatus
  ): Promise<Component> {
    try {
      const component = await this.updateComponent(componentId, { status });

      logger.info('Component status updated', {
        componentId,
        projectId: component.project_id,
        status
      });

      return component;
    } catch (error) {
      logger.error('Error updating component status:', error);
      throw error;
    }
  }

  /**
   * Reorder components
   */
  static async reorderComponents(
    projectId: string,
    componentOrders: { id: string; position: number }[]
  ): Promise<void> {
    try {
      await transaction(async (client) => {
        for (const { id, position } of componentOrders) {
          await client.query(
            'UPDATE components SET position = $1, updated_at = NOW() WHERE id = $2 AND project_id = $3',
            [position, id, projectId]
          );
        }
      });

      logger.info('Components reordered', {
        projectId,
        componentCount: componentOrders.length
      });
    } catch (error) {
      logger.error('Error reordering components:', error);
      throw error;
    }
  }

  /**
   * Get component status distribution for a project
   */
  static async getComponentStatusDistribution(projectId: string): Promise<Record<ComponentStatus, number>> {
    try {
      const distributionQuery = `
        SELECT status, COUNT(*) as count
        FROM components
        WHERE project_id = $1
        GROUP BY status
      `;

      const result = await query<{ status: ComponentStatus; count: string }>(
        distributionQuery,
        [projectId]
      );

      const distribution: Record<ComponentStatus, number> = {
        [ComponentStatus.OPERATIONAL]: 0,
        [ComponentStatus.DEGRADED]: 0,
        [ComponentStatus.PARTIAL_OUTAGE]: 0,
        [ComponentStatus.MAJOR_OUTAGE]: 0,
        [ComponentStatus.MAINTENANCE]: 0
      };

      result.rows.forEach(row => {
        distribution[row.status] = parseInt(row.count, 10);
      });

      logger.debug('Component status distribution retrieved', {
        projectId,
        distribution
      });

      return distribution;
    } catch (error) {
      logger.error('Error getting component status distribution:', error);
      throw error;
    }
  }

  /**
   * Get overall project status based on component statuses
   */
  static async getOverallProjectStatus(projectId: string): Promise<ComponentStatus> {
    try {
      const statusQuery = `
        SELECT status, COUNT(*) as count
        FROM components
        WHERE project_id = $1
        GROUP BY status
        ORDER BY 
          CASE status
            WHEN 'major_outage' THEN 1
            WHEN 'partial_outage' THEN 2
            WHEN 'maintenance' THEN 3
            WHEN 'degraded' THEN 4
            WHEN 'operational' THEN 5
          END
      `;

      const result = await query<{ status: ComponentStatus; count: string }>(
        statusQuery,
        [projectId]
      );

      if (result.rows.length === 0) {
        return ComponentStatus.OPERATIONAL;
      }

      // Return the worst status
      const worstStatus = result.rows[0].status;

      logger.debug('Overall project status calculated', {
        projectId,
        overallStatus: worstStatus
      });

      return worstStatus;
    } catch (error) {
      logger.error('Error calculating overall project status:', error);
      throw error;
    }
  }
}
