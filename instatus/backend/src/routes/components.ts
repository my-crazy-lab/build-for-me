import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireComponentOwnership } from '../middleware/auth';
import { asyncHandler, ValidationError } from '../middleware/errorHandler';
import { ComponentService } from '../services/ComponentService';

/**
 * Component Routes
 *
 * Handles:
 * - Component CRUD operations
 * - Component status management
 * - Component ordering
 */

const router = Router();

/**
 * @swagger
 * /api/components/{id}:
 *   get:
 *     summary: Get component by ID
 *     tags: [Components]
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
 *         description: Component retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Component'
 */
router.get('/:id',
  authenticate,
  requireComponentOwnership,
  asyncHandler(async (req, res) => {
    const component = await ComponentService.getComponentById(req.params.id);

    res.json({
      success: true,
      data: component,
      message: 'Component retrieved successfully'
    });
  })
);

/**
 * @swagger
 * /api/components/{id}:
 *   put:
 *     summary: Update component
 *     tags: [Components]
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
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               status:
 *                 type: string
 *                 enum: [operational, degraded, partial_outage, major_outage, maintenance]
 *               position:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Component updated successfully
 */
router.put('/:id',
  authenticate,
  requireComponentOwnership,
  [
    body('name')
      .optional()
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
      .withMessage('Invalid status value'),
    body('position')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Position must be a positive integer')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validation failed', errors.array());
    }

    const updateData: any = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.position !== undefined) updateData.position = req.body.position;

    const component = await ComponentService.updateComponent(req.params.id, updateData);

    res.json({
      success: true,
      data: component,
      message: 'Component updated successfully'
    });
  })
);

/**
 * @swagger
 * /api/components/{id}:
 *   delete:
 *     summary: Delete component
 *     tags: [Components]
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
 *         description: Component deleted successfully
 */
router.delete('/:id',
  authenticate,
  requireComponentOwnership,
  asyncHandler(async (req, res) => {
    await ComponentService.deleteComponent(req.params.id);

    res.json({
      success: true,
      message: 'Component deleted successfully'
    });
  })
);

/**
 * @swagger
 * /api/components/{id}/status:
 *   patch:
 *     summary: Update component status
 *     tags: [Components]
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
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [operational, degraded, partial_outage, major_outage, maintenance]
 *     responses:
 *       200:
 *         description: Component status updated successfully
 */
router.patch('/:id/status',
  authenticate,
  requireComponentOwnership,
  [
    body('status')
      .isIn(['operational', 'degraded', 'partial_outage', 'major_outage', 'maintenance'])
      .withMessage('Invalid status value')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validation failed', errors.array());
    }

    const component = await ComponentService.updateComponentStatus(
      req.params.id,
      req.body.status
    );

    res.json({
      success: true,
      data: component,
      message: 'Component status updated successfully'
    });
  })
);

export default router;
