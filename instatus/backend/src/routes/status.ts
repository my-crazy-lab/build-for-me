import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { optionalAuthenticate } from '../middleware/auth';
import { asyncHandler, ValidationError } from '../middleware/errorHandler';
import { StatusService } from '../services/StatusService';
import { SubscriberService } from '../services/SubscriberService';

/**
 * Public Status Routes
 *
 * Handles:
 * - Public status page data
 * - Subscription management
 * - Historical data access
 * - Status summaries
 */

const router = Router();

/**
 * @swagger
 * /api/status/{slug}:
 *   get:
 *     summary: Get public status page data
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Project slug
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 365
 *           default: 90
 *         description: Number of days for historical data
 *     responses:
 *       200:
 *         description: Status page data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     project:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         name:
 *                           type: string
 *                         description:
 *                           type: string
 *                         branding:
 *                           $ref: '#/components/schemas/ProjectBranding'
 *                     components:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Component'
 *                     incidents:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Incident'
 *                     overall_status:
 *                       type: string
 *                       enum: [operational, degraded, partial_outage, major_outage, maintenance]
 *                     uptime_stats:
 *                       type: object
 *       404:
 *         description: Status page not found
 */
router.get('/:slug',
  optionalAuthenticate,
  [
    query('days')
      .optional()
      .isInt({ min: 1, max: 365 })
      .toInt()
      .withMessage('Days must be between 1 and 365')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validation failed', errors.array());
    }

    const slug = req.params.slug;
    const days = req.query.days as number || 90;

    // Get status page data
    const statusData = await StatusService.getStatusPageData(slug);

    // If days parameter is different from default, get custom uptime stats
    if (days !== 90) {
      statusData.uptime_stats = await StatusService.getUptimeStatistics(
        statusData.project.id,
        days
      );
    }

    res.json({
      success: true,
      data: statusData,
      message: 'Status page retrieved successfully'
    });
  })
);

/**
 * @swagger
 * /api/status/{slug}/summary:
 *   get:
 *     summary: Get status page summary
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status summary retrieved successfully
 */
router.get('/:slug/summary',
  optionalAuthenticate,
  asyncHandler(async (req, res) => {
    const project = await StatusService.validateProjectAccess(req.params.slug);
    const summary = await StatusService.getStatusSummary(project.id);

    res.json({
      success: true,
      data: summary,
      message: 'Status summary retrieved successfully'
    });
  })
);

/**
 * @swagger
 * /api/status/{slug}/incidents:
 *   get:
 *     summary: Get incident history
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 365
 *           default: 90
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *     responses:
 *       200:
 *         description: Incident history retrieved successfully
 */
router.get('/:slug/incidents',
  optionalAuthenticate,
  [
    query('days')
      .optional()
      .isInt({ min: 1, max: 365 })
      .toInt()
      .withMessage('Days must be between 1 and 365'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .toInt()
      .withMessage('Limit must be between 1 and 100')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validation failed', errors.array());
    }

    const project = await StatusService.validateProjectAccess(req.params.slug);
    const days = req.query.days as number || 90;
    const limit = req.query.limit as number || 50;

    const incidents = await StatusService.getIncidentHistory(project.id, days, limit);

    res.json({
      success: true,
      data: incidents,
      message: 'Incident history retrieved successfully'
    });
  })
);

/**
 * @swagger
 * /api/status/{slug}/subscribe:
 *   post:
 *     summary: Subscribe to status page notifications
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - notify_by
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "subscriber@example.com"
 *               phone:
 *                 type: string
 *                 pattern: "^\\+[1-9]\\d{1,14}$"
 *                 example: "+1234567890"
 *               notify_by:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [email, sms]
 *                 example: ["email"]
 *               notify_on:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [incident_created, incident_updated, incident_resolved, maintenance_scheduled]
 *                 example: ["incident_created", "incident_resolved"]
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     email:
 *                       type: string
 *                       format: email
 *                     verified:
 *                       type: boolean
 *                       example: false
 *                 message:
 *                   type: string
 *                   example: "Subscription created successfully. Please check your email to verify."
 */
router.post('/:slug/subscribe',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('phone')
      .optional()
      .matches(/^\+[1-9]\d{1,14}$/)
      .withMessage('Phone number must be in E.164 format (e.g., +1234567890)'),
    body('notify_by')
      .isArray({ min: 1 })
      .withMessage('At least one notification method is required'),
    body('notify_by.*')
      .isIn(['email', 'sms'])
      .withMessage('Invalid notification method'),
    body('notify_on')
      .optional()
      .isArray()
      .withMessage('Notify on must be an array'),
    body('notify_on.*')
      .optional()
      .isIn(['incident_created', 'incident_updated', 'incident_resolved', 'maintenance_scheduled'])
      .withMessage('Invalid notification event')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validation failed', errors.array());
    }

    // Validate that SMS notification has phone number
    if (req.body.notify_by.includes('sms') && !req.body.phone) {
      throw new ValidationError('Phone number is required for SMS notifications');
    }

    const project = await StatusService.validateProjectAccess(req.params.slug);

    const subscriptionData = {
      email: req.body.email,
      phone: req.body.phone,
      notify_by: req.body.notify_by,
      notify_on: req.body.notify_on || ['incident_created', 'incident_resolved']
    };

    const subscription = await SubscriberService.createSubscription(
      project.id,
      subscriptionData
    );

    res.status(201).json({
      success: true,
      data: subscription,
      message: 'Subscription created successfully. Please check your email to verify.'
    });
  })
);

/**
 * @swagger
 * /api/status/{slug}/unsubscribe:
 *   post:
 *     summary: Unsubscribe from status page notifications
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Unsubscribed successfully
 */
router.post('/:slug/unsubscribe',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validation failed', errors.array());
    }

    const project = await StatusService.validateProjectAccess(req.params.slug);

    await SubscriberService.unsubscribe(project.id, req.body.email);

    res.json({
      success: true,
      message: 'Unsubscribed successfully'
    });
  })
);

export default router;
