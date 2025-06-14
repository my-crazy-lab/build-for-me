import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { authenticate, requireProjectOwnership } from '../middleware/auth';
import { asyncHandler, ValidationError } from '../middleware/errorHandler';
import { ProjectService } from '../services/ProjectService';
import { ComponentService } from '../services/ComponentService';
import { CreateProjectRequest, UpdateProjectRequest } from '../../../shared/types';

/**
 * Project Routes
 *
 * Handles:
 * - Project CRUD operations
 * - Project settings management
 * - Project statistics
 * - Component management within projects
 */

const router = Router();

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get user's projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for project name or description
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationInfo'
 */
router.get('/',
  authenticate,
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('search').optional().isString().trim()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validation failed', errors.array());
    }

    const page = req.query.page as number || 1;
    const limit = req.query.limit as number || 10;
    const search = req.query.search as string;

    const result = await ProjectService.getUserProjects(
      req.user!.id,
      page,
      limit,
      search
    );

    res.json({
      success: true,
      data: result.projects,
      pagination: result.pagination,
      message: 'Projects retrieved successfully',
    });
  })
);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 example: "My Status Page"
 *               slug:
 *                 type: string
 *                 pattern: "^[a-z0-9-]+$"
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: "my-status-page"
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "Status page for my services"
 *               is_private:
 *                 type: boolean
 *                 default: false
 *               branding:
 *                 $ref: '#/components/schemas/ProjectBranding'
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *                 message:
 *                   type: string
 *                   example: "Project created successfully"
 */
router.post('/',
  authenticate,
  [
    body('name')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Name must be between 1 and 255 characters'),
    body('slug')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Slug must be between 1 and 100 characters')
      .matches(/^[a-z0-9-]+$/)
      .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters'),
    body('is_private')
      .optional()
      .isBoolean()
      .withMessage('is_private must be a boolean'),
    body('branding')
      .optional()
      .isObject()
      .withMessage('Branding must be an object')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validation failed', errors.array());
    }

    const projectData: CreateProjectRequest = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      is_private: req.body.is_private || false,
      branding: req.body.branding
    };

    const project = await ProjectService.createProject(req.user!.id, projectData);

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully',
    });
  })
);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *                 message:
 *                   type: string
 *                   example: "Project retrieved successfully"
 */
router.get('/:id',
  authenticate,
  requireProjectOwnership,
  asyncHandler(async (req, res) => {
    const project = await ProjectService.getProjectById(req.params.id, req.user!.id);

    res.json({
      success: true,
      data: project,
      message: 'Project retrieved successfully',
    });
  })
);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               slug:
 *                 type: string
 *                 pattern: "^[a-z0-9-]+$"
 *                 minLength: 1
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               is_private:
 *                 type: boolean
 *               custom_domain:
 *                 type: string
 *                 format: hostname
 *               branding:
 *                 $ref: '#/components/schemas/ProjectBranding'
 *     responses:
 *       200:
 *         description: Project updated successfully
 */
router.put('/:id',
  authenticate,
  requireProjectOwnership,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Name must be between 1 and 255 characters'),
    body('slug')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Slug must be between 1 and 100 characters')
      .matches(/^[a-z0-9-]+$/)
      .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters'),
    body('is_private')
      .optional()
      .isBoolean()
      .withMessage('is_private must be a boolean'),
    body('custom_domain')
      .optional()
      .trim()
      .isFQDN()
      .withMessage('Custom domain must be a valid domain name'),
    body('branding')
      .optional()
      .isObject()
      .withMessage('Branding must be an object')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validation failed', errors.array());
    }

    const updateData: UpdateProjectRequest = {};

    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.slug !== undefined) updateData.slug = req.body.slug;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.is_private !== undefined) updateData.is_private = req.body.is_private;
    if (req.body.custom_domain !== undefined) updateData.custom_domain = req.body.custom_domain;
    if (req.body.branding !== undefined) updateData.branding = req.body.branding;

    const project = await ProjectService.updateProject(
      req.params.id,
      req.user!.id,
      updateData
    );

    res.json({
      success: true,
      data: project,
      message: 'Project updated successfully',
    });
  })
);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Project deleted successfully
 */
router.delete('/:id',
  authenticate,
  requireProjectOwnership,
  asyncHandler(async (req, res) => {
    await ProjectService.deleteProject(req.params.id, req.user!.id);

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  })
);

/**
 * @swagger
 * /api/projects/{id}/stats:
 *   get:
 *     summary: Get project statistics
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Project statistics retrieved successfully
 */
router.get('/:id/stats',
  authenticate,
  requireProjectOwnership,
  asyncHandler(async (req, res) => {
    const stats = await ProjectService.getProjectStats(req.params.id);

    res.json({
      success: true,
      data: stats,
      message: 'Project statistics retrieved successfully',
    });
  })
);

/**
 * @swagger
 * /api/projects/{id}/components:
 *   get:
 *     summary: Get project components
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *     responses:
 *       200:
 *         description: Components retrieved successfully
 */
router.get('/:id/components',
  authenticate,
  requireProjectOwnership,
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validation failed', errors.array());
    }

    const page = req.query.page as number || 1;
    const limit = req.query.limit as number || 50;

    const result = await ComponentService.getProjectComponents(
      req.params.id,
      page,
      limit
    );

    res.json({
      success: true,
      data: result.components,
      pagination: result.pagination,
      message: 'Components retrieved successfully',
    });
  })
);

/**
 * @swagger
 * /api/projects/{id}/components:
 *   post:
 *     summary: Create a new component
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               status:
 *                 type: string
 *                 enum: [operational, degraded, partial_outage, major_outage, maintenance]
 *                 default: operational
 *     responses:
 *       201:
 *         description: Component created successfully
 */
router.post('/:id/components',
  authenticate,
  requireProjectOwnership,
  [
    body('name')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Name must be between 1 and 255 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters'),
    body('status')
      .optional()
      .isIn(['operational', 'degraded', 'partial_outage', 'major_outage', 'maintenance'])
      .withMessage('Invalid status value')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validation failed', errors.array());
    }

    const componentData = {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status
    };

    const component = await ComponentService.createComponent(
      req.params.id,
      componentData
    );

    res.status(201).json({
      success: true,
      data: component,
      message: 'Component created successfully',
    });
  })
);

export default router;
