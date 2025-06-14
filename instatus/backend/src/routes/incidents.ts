import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { authenticate, requireIncidentOwnership, requireProjectOwnership } from '../middleware/auth';
import { asyncHandler, ValidationError } from '../middleware/errorHandler';
import { IncidentService } from '../services/IncidentService';
import { IncidentStatus, IncidentImpact } from '../../../shared/types';

/**
 * Incident Routes
 *
 * Handles:
 * - Incident CRUD operations
 * - Incident timeline management
 * - Status updates and notifications
 */

const router = Router();

/**
 * @swagger
 * /api/incidents/{id}:
 *   get:
 *     summary: Get incident by ID
 *     tags: [Incidents]
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
 *         description: Incident retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Incident'
 */
router.get('/:id',
  authenticate,
  requireIncidentOwnership,
  asyncHandler(async (req, res) => {
    const incident = await IncidentService.getIncidentById(req.params.id);

    res.json({
      success: true,
      data: incident,
      message: 'Incident retrieved successfully'
    });
  })
);

/**
 * @swagger
 * /api/incidents/{id}:
 *   put:
 *     summary: Update incident
 *     tags: [Incidents]
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
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               content:
 *                 type: string
 *                 minLength: 1
 *               status:
 *                 type: string
 *                 enum: [investigating, identified, monitoring, resolved]
 *               impact:
 *                 type: string
 *                 enum: [none, minor, major, critical]
 *               affected_components:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *               end_time:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Incident updated successfully
 */
router.put('/:id',
  authenticate,
  requireIncidentOwnership,
  [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Title must be between 1 and 255 characters'),
    body('content')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Content is required'),
    body('status')
      .optional()
      .isIn(['investigating', 'identified', 'monitoring', 'resolved'])
      .withMessage('Invalid status value'),
    body('impact')
      .optional()
      .isIn(['none', 'minor', 'major', 'critical'])
      .withMessage('Invalid impact value'),
    body('affected_components')
      .optional()
      .isArray()
      .withMessage('Affected components must be an array'),
    body('affected_components.*')
      .optional()
      .isUUID()
      .withMessage('Each affected component must be a valid UUID'),
    body('end_time')
      .optional()
      .isISO8601()
      .withMessage('End time must be a valid ISO 8601 date')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validation failed', errors.array());
    }

    const updateData: any = {};
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.content !== undefined) updateData.content = req.body.content;
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.impact !== undefined) updateData.impact = req.body.impact;
    if (req.body.affected_components !== undefined) updateData.affected_components = req.body.affected_components;
    if (req.body.end_time !== undefined) updateData.end_time = new Date(req.body.end_time);

    const incident = await IncidentService.updateIncident(req.params.id, updateData);

    res.json({
      success: true,
      data: incident,
      message: 'Incident updated successfully'
    });
  })
);

/**
 * @swagger
 * /api/incidents/{id}:
 *   delete:
 *     summary: Delete incident
 *     tags: [Incidents]
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
 *         description: Incident deleted successfully
 */
router.delete('/:id',
  authenticate,
  requireIncidentOwnership,
  asyncHandler(async (req, res) => {
    await IncidentService.deleteIncident(req.params.id);

    res.json({
      success: true,
      message: 'Incident deleted successfully'
    });
  })
);

/**
 * @swagger
 * /api/incidents/{id}/updates:
 *   post:
 *     summary: Add incident update
 *     tags: [Incidents]
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
 *               - status
 *               - content
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [investigating, identified, monitoring, resolved]
 *               content:
 *                 type: string
 *                 minLength: 1
 *     responses:
 *       201:
 *         description: Incident update added successfully
 */
router.post('/:id/updates',
  authenticate,
  requireIncidentOwnership,
  [
    body('status')
      .isIn(['investigating', 'identified', 'monitoring', 'resolved'])
      .withMessage('Invalid status value'),
    body('content')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Content is required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validation failed', errors.array());
    }

    const update = await IncidentService.addIncidentUpdate(
      req.params.id,
      req.body.status,
      req.body.content
    );

    res.status(201).json({
      success: true,
      data: update,
      message: 'Incident update added successfully'
    });
  })
);

export default router;
