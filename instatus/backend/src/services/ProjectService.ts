import { query, queryOne, transaction } from '../config/database';
import { logger } from '../utils/logger';
import { 
  Project, 
  CreateProjectRequest, 
  UpdateProjectRequest,
  DEFAULT_PROJECT_BRANDING,
  PaginationInfo 
} from '../../../shared/types';
import { ConflictError, NotFoundError, ValidationError } from '../middleware/errorHandler';

/**
 * Project Service
 * 
 * Handles all project-related business logic including:
 * - Project CRUD operations
 * - Project validation
 * - Project statistics
 * - Project ownership verification
 */

export class ProjectService {
  /**
   * Get all projects for a user with pagination
   */
  static async getUserProjects(
    userId: string,
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ projects: Project[]; pagination: PaginationInfo }> {
    try {
      const offset = (page - 1) * limit;
      
      // Build search condition
      let searchCondition = '';
      let searchParams: any[] = [userId];
      
      if (search) {
        searchCondition = 'AND (name ILIKE $2 OR description ILIKE $2)';
        searchParams.push(`%${search}%`);
        searchParams.push(limit, offset);
      } else {
        searchParams.push(limit, offset);
      }

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM projects 
        WHERE user_id = $1 ${search ? 'AND (name ILIKE $2 OR description ILIKE $2)' : ''}
      `;
      const countParams = search ? [userId, `%${search}%`] : [userId];
      const countResult = await queryOne<{ total: string }>(countQuery, countParams);
      const total = parseInt(countResult?.total || '0', 10);

      // Get projects
      const projectsQuery = `
        SELECT 
          p.*,
          COUNT(DISTINCT c.id) as components_count,
          COUNT(DISTINCT i.id) as incidents_count,
          COUNT(DISTINCT s.id) as subscribers_count
        FROM projects p
        LEFT JOIN components c ON p.id = c.project_id
        LEFT JOIN incidents i ON p.id = i.project_id
        LEFT JOIN subscribers s ON p.id = s.project_id
        WHERE p.user_id = $1 ${searchCondition}
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT $${searchParams.length - 1} OFFSET $${searchParams.length}
      `;

      const projectsResult = await query<Project & {
        components_count: string;
        incidents_count: string;
        subscribers_count: string;
      }>(projectsQuery, searchParams);

      const projects = projectsResult.rows.map(project => ({
        ...project,
        components_count: parseInt(project.components_count, 10),
        incidents_count: parseInt(project.incidents_count, 10),
        subscribers_count: parseInt(project.subscribers_count, 10)
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

      logger.info('Projects retrieved', {
        userId,
        count: projects.length,
        page,
        total
      });

      return { projects, pagination };
    } catch (error) {
      logger.error('Error retrieving user projects:', error);
      throw error;
    }
  }

  /**
   * Get a single project by ID
   */
  static async getProjectById(projectId: string, userId?: string): Promise<Project> {
    try {
      const projectQuery = `
        SELECT 
          p.*,
          u.name as owner_name,
          u.email as owner_email,
          COUNT(DISTINCT c.id) as components_count,
          COUNT(DISTINCT i.id) as incidents_count,
          COUNT(DISTINCT s.id) as subscribers_count
        FROM projects p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN components c ON p.id = c.project_id
        LEFT JOIN incidents i ON p.id = i.project_id
        LEFT JOIN subscribers s ON p.id = s.project_id
        WHERE p.id = $1
        GROUP BY p.id, u.name, u.email
      `;

      const result = await queryOne<Project & {
        owner_name: string;
        owner_email: string;
        components_count: string;
        incidents_count: string;
        subscribers_count: string;
      }>(projectQuery, [projectId]);

      if (!result) {
        throw new NotFoundError('Project not found');
      }

      // Check access permissions if userId is provided
      if (userId && result.user_id !== userId) {
        // Check if project is private
        if (result.is_private) {
          throw new NotFoundError('Project not found');
        }
      }

      const project = {
        ...result,
        components_count: parseInt(result.components_count, 10),
        incidents_count: parseInt(result.incidents_count, 10),
        subscribers_count: parseInt(result.subscribers_count, 10)
      };

      logger.info('Project retrieved', { projectId, userId });

      return project;
    } catch (error) {
      logger.error('Error retrieving project:', error);
      throw error;
    }
  }

  /**
   * Get project by slug (for public access)
   */
  static async getProjectBySlug(slug: string): Promise<Project> {
    try {
      const projectQuery = `
        SELECT * FROM projects WHERE slug = $1
      `;

      const project = await queryOne<Project>(projectQuery, [slug]);

      if (!project) {
        throw new NotFoundError('Status page not found');
      }

      logger.info('Project retrieved by slug', { slug, projectId: project.id });

      return project;
    } catch (error) {
      logger.error('Error retrieving project by slug:', error);
      throw error;
    }
  }

  /**
   * Create a new project
   */
  static async createProject(
    userId: string,
    projectData: CreateProjectRequest
  ): Promise<Project> {
    try {
      // Validate slug uniqueness
      const existingProject = await queryOne(
        'SELECT id FROM projects WHERE slug = $1',
        [projectData.slug]
      );

      if (existingProject) {
        throw new ConflictError('Project slug already exists');
      }

      // Validate slug format
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(projectData.slug)) {
        throw new ValidationError('Slug can only contain lowercase letters, numbers, and hyphens');
      }

      // Check user project limit (if configured)
      const userProjectsCount = await queryOne<{ count: string }>(
        'SELECT COUNT(*) as count FROM projects WHERE user_id = $1',
        [userId]
      );

      const projectCount = parseInt(userProjectsCount?.count || '0', 10);
      const maxProjects = parseInt(process.env.MAX_PROJECTS_PER_USER || '10', 10);

      if (projectCount >= maxProjects) {
        throw new ValidationError(`Maximum ${maxProjects} projects allowed per user`);
      }

      // Merge branding with defaults
      const branding = {
        ...DEFAULT_PROJECT_BRANDING,
        ...projectData.branding
      };

      const insertQuery = `
        INSERT INTO projects (
          user_id, name, slug, description, is_private, branding
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;

      const project = await queryOne<Project>(insertQuery, [
        userId,
        projectData.name,
        projectData.slug,
        projectData.description || null,
        projectData.is_private || false,
        JSON.stringify(branding)
      ]);

      if (!project) {
        throw new Error('Failed to create project');
      }

      logger.info('Project created', {
        projectId: project.id,
        userId,
        name: project.name,
        slug: project.slug
      });

      return project;
    } catch (error) {
      logger.error('Error creating project:', error);
      throw error;
    }
  }

  /**
   * Update a project
   */
  static async updateProject(
    projectId: string,
    userId: string,
    updateData: UpdateProjectRequest
  ): Promise<Project> {
    try {
      // Verify project ownership
      const existingProject = await this.getProjectById(projectId, userId);
      if (existingProject.user_id !== userId) {
        throw new NotFoundError('Project not found');
      }

      // If slug is being updated, check uniqueness
      if (updateData.slug && updateData.slug !== existingProject.slug) {
        const slugExists = await queryOne(
          'SELECT id FROM projects WHERE slug = $1 AND id != $2',
          [updateData.slug, projectId]
        );

        if (slugExists) {
          throw new ConflictError('Project slug already exists');
        }

        // Validate slug format
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(updateData.slug)) {
          throw new ValidationError('Slug can only contain lowercase letters, numbers, and hyphens');
        }
      }

      // Build update query dynamically
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramIndex = 1;

      if (updateData.name !== undefined) {
        updateFields.push(`name = $${paramIndex++}`);
        updateValues.push(updateData.name);
      }

      if (updateData.slug !== undefined) {
        updateFields.push(`slug = $${paramIndex++}`);
        updateValues.push(updateData.slug);
      }

      if (updateData.description !== undefined) {
        updateFields.push(`description = $${paramIndex++}`);
        updateValues.push(updateData.description);
      }

      if (updateData.is_private !== undefined) {
        updateFields.push(`is_private = $${paramIndex++}`);
        updateValues.push(updateData.is_private);
      }

      if (updateData.custom_domain !== undefined) {
        updateFields.push(`custom_domain = $${paramIndex++}`);
        updateValues.push(updateData.custom_domain);
      }

      if (updateData.branding !== undefined) {
        // Merge with existing branding
        const currentBranding = existingProject.branding || DEFAULT_PROJECT_BRANDING;
        const newBranding = { ...currentBranding, ...updateData.branding };
        updateFields.push(`branding = $${paramIndex++}`);
        updateValues.push(JSON.stringify(newBranding));
      }

      if (updateFields.length === 0) {
        return existingProject;
      }

      updateFields.push(`updated_at = NOW()`);
      updateValues.push(projectId);

      const updateQuery = `
        UPDATE projects 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const updatedProject = await queryOne<Project>(updateQuery, updateValues);

      if (!updatedProject) {
        throw new Error('Failed to update project');
      }

      logger.info('Project updated', {
        projectId,
        userId,
        updatedFields: Object.keys(updateData)
      });

      return updatedProject;
    } catch (error) {
      logger.error('Error updating project:', error);
      throw error;
    }
  }

  /**
   * Delete a project
   */
  static async deleteProject(projectId: string, userId: string): Promise<void> {
    try {
      // Verify project ownership
      const project = await this.getProjectById(projectId, userId);
      if (project.user_id !== userId) {
        throw new NotFoundError('Project not found');
      }

      // Use transaction to ensure data consistency
      await transaction(async (client) => {
        // Delete in correct order due to foreign key constraints
        await client.query('DELETE FROM uptime_logs WHERE uptime_check_id IN (SELECT id FROM uptime_checks WHERE project_id = $1)', [projectId]);
        await client.query('DELETE FROM uptime_checks WHERE project_id = $1', [projectId]);
        await client.query('DELETE FROM notifications WHERE project_id = $1', [projectId]);
        await client.query('DELETE FROM incident_updates WHERE incident_id IN (SELECT id FROM incidents WHERE project_id = $1)', [projectId]);
        await client.query('DELETE FROM incidents WHERE project_id = $1', [projectId]);
        await client.query('DELETE FROM subscribers WHERE project_id = $1', [projectId]);
        await client.query('DELETE FROM components WHERE project_id = $1', [projectId]);
        await client.query('DELETE FROM projects WHERE id = $1', [projectId]);
      });

      logger.info('Project deleted', {
        projectId,
        userId,
        projectName: project.name
      });
    } catch (error) {
      logger.error('Error deleting project:', error);
      throw error;
    }
  }

  /**
   * Get project statistics
   */
  static async getProjectStats(projectId: string): Promise<any> {
    try {
      const statsQuery = `
        SELECT 
          (SELECT COUNT(*) FROM components WHERE project_id = $1) as components_count,
          (SELECT COUNT(*) FROM incidents WHERE project_id = $1) as incidents_count,
          (SELECT COUNT(*) FROM subscribers WHERE project_id = $1) as subscribers_count,
          (SELECT COUNT(*) FROM uptime_checks WHERE project_id = $1) as uptime_checks_count,
          (SELECT COUNT(*) FROM incidents WHERE project_id = $1 AND status != 'resolved') as active_incidents_count
      `;

      const stats = await queryOne(statsQuery, [projectId]);

      logger.debug('Project stats retrieved', { projectId, stats });

      return {
        components_count: parseInt(stats?.components_count || '0', 10),
        incidents_count: parseInt(stats?.incidents_count || '0', 10),
        subscribers_count: parseInt(stats?.subscribers_count || '0', 10),
        uptime_checks_count: parseInt(stats?.uptime_checks_count || '0', 10),
        active_incidents_count: parseInt(stats?.active_incidents_count || '0', 10)
      };
    } catch (error) {
      logger.error('Error retrieving project stats:', error);
      throw error;
    }
  }
}
