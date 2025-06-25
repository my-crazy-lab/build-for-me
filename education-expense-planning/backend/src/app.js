/**
 * Express Application Configuration
 * 
 * This file configures the Express application with:
 * - Middleware setup
 * - Route configuration
 * - Error handling
 * - Security measures
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { logger } from './utils/logger.js';

// Import routes
import authRoutes from './routes/auth.js';
import studentsRoutes from './routes/students.js';
import plansRoutes from './routes/plans.js';
import expensesRoutes from './routes/expenses.js';
import remindersRoutes from './routes/reminders.js';
import shareRoutes from './routes/share.js';
import categoriesRoutes from './routes/categories.js';
import goalsRoutes from './routes/goals.js';

const createApp = () => {
  const app = express();
  const NODE_ENV = process.env.NODE_ENV || 'development';

  // Trust proxy for production deployments
  if (NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // CORS configuration
  const corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://education-expense-dashboard.vercel.app',
        process.env.FRONTEND_URL
      ].filter(Boolean);

      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.logSecurity('cors_blocked', { origin, allowedOrigins });
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  };

  app.use(cors(corsOptions));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: NODE_ENV === 'production' ? 100 : 1000,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests from this IP, please try again later.'
      }
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      return req.path === '/health' || req.path === '/api/health';
    }
  });

  app.use(limiter);

  // Compression middleware
  app.use(compression());

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      touchAfter: 24 * 3600
    }),
    cookie: {
      secure: NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Request logging middleware
  app.use(requestLogger);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      version: process.env.npm_package_version || '1.0.0'
    });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentsRoutes);
  app.use('/api/plans', plansRoutes);
  app.use('/api/expenses', expensesRoutes);
  app.use('/api/reminders', remindersRoutes);
  app.use('/api/share', shareRoutes);
  app.use('/api/categories', categoriesRoutes);
  app.use('/api/goals', goalsRoutes);

  // API info endpoint
  app.get('/api', (req, res) => {
    res.json({
      success: true,
      message: 'Education Expense Dashboard API',
      version: '1.0.0',
      documentation: '/api/docs',
      endpoints: {
        auth: '/api/auth',
        students: '/api/students',
        plans: '/api/plans',
        expenses: '/api/expenses',
        reminders: '/api/reminders',
        share: '/api/share',
        categories: '/api/categories',
        goals: '/api/goals'
      }
    });
  });

  // 404 handler for API routes
  app.use('/api/*', notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
};

export default createApp;
