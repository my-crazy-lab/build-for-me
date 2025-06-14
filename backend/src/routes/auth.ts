import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { query } from '../config/database';
import { 
  asyncHandler, 
  ValidationError, 
  AuthenticationError, 
  ConflictError 
} from '../middleware/errorHandler';
import { 
  authenticate, 
  generateToken, 
  generateRefreshToken, 
  verifyRefreshToken 
} from '../middleware/auth';
import { authRateLimiter, passwordResetRateLimiter } from '../middleware/rateLimiter';
import { User, UserRole, DEFAULT_USER_PREFERENCES } from '../../../shared/types';

/**
 * Authentication Routes
 * 
 * Handles:
 * - User registration
 * - User login
 * - Token refresh
 * - Password reset
 * - User profile management
 */

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       description: JWT access token
 *                     refreshToken:
 *                       type: string
 *                       description: JWT refresh token
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       429:
 *         $ref: '#/components/responses/RateLimitError'
 */
router.post('/register', 
  authRateLimiter,
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  ],
  asyncHandler(async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validation failed', errors.array());
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await query<User>(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, config.security.bcryptRounds);

    // Create user
    const userResult = await query<User>(
      `INSERT INTO users (email, name, password_hash, role, preferences) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, name, role, email_verified, avatar_url, preferences, created_at, updated_at`,
      [email, name, passwordHash, UserRole.USER, DEFAULT_USER_PREFERENCES]
    );

    const user = userResult.rows[0];

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Log registration
    logger.auth('User registered', user.id, user.email, req.ip);

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
        refreshToken,
      },
      message: 'User registered successfully',
    });
  })
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       description: JWT access token
 *                     refreshToken:
 *                       type: string
 *                       description: JWT refresh token
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       429:
 *         $ref: '#/components/responses/RateLimitError'
 */
router.post('/login',
  authRateLimiter,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  asyncHandler(async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validation failed', errors.array());
    }

    const { email, password } = req.body;

    // Find user with password
    const userResult = await query<User & { password_hash: string }>(
      'SELECT id, email, name, password_hash, role, email_verified, avatar_url, preferences, created_at, updated_at FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      throw new AuthenticationError('Invalid email or password');
    }

    const userWithPassword = userResult.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userWithPassword.password_hash);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Remove password from user object
    const { password_hash, ...user } = userWithPassword;

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Log login
    logger.auth('User logged in', user.id, user.email, req.ip);

    res.json({
      success: true,
      data: {
        user,
        token,
        refreshToken,
      },
      message: 'Login successful',
    });
  })
);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: JWT refresh token
 *     responses:
 *       200:
 *         description: Token refreshed successfully
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
 *                     token:
 *                       type: string
 *                       description: New JWT access token
 *                     refreshToken:
 *                       type: string
 *                       description: New JWT refresh token
 *       401:
 *         description: Invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/refresh',
  [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validation failed', errors.array());
    }

    const { refreshToken } = req.body;

    // Verify refresh token
    const { userId } = verifyRefreshToken(refreshToken);

    // Get user
    const userResult = await query<User>(
      'SELECT id, email, name, role, email_verified, avatar_url, preferences, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw new AuthenticationError('User not found');
    }

    const user = userResult.rows[0];

    // Generate new tokens
    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    logger.auth('Token refreshed', user.id, user.email, req.ip);

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  })
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/me',
  authenticate,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: req.user,
    });
  })
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/logout',
  authenticate,
  asyncHandler(async (req, res) => {
    // In a more sophisticated implementation, you might want to:
    // 1. Blacklist the token
    // 2. Remove refresh token from database
    // 3. Clear any session data

    logger.auth('User logged out', req.user!.id, req.user!.email, req.ip);

    res.json({
      success: true,
      message: 'Logout successful',
    });
  })
);

export default router;
