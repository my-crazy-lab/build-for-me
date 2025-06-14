import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { config } from './config/config';
import { logger } from './utils/logger';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { setupSwagger } from './config/swagger';
import { setupSocketIO } from './config/socket';

// Import routes
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import componentRoutes from './routes/components';
import incidentRoutes from './routes/incidents';
import subscriberRoutes from './routes/subscribers';
import uptimeRoutes from './routes/uptime';
import statusRoutes from './routes/status';
import notificationRoutes from './routes/notifications';
import userRoutes from './routes/users';

/**
 * Instatus Clone Backend Application
 * 
 * A comprehensive status page system backend built with:
 * - Express.js for REST API
 * - PostgreSQL for data persistence
 * - Redis for caching and queues
 * - Socket.IO for real-time updates
 * - JWT for authentication
 * - Bull for job queues
 */

class Application {
  public app: express.Application;
  public server: any;
  public io: SocketIOServer;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: config.frontend.url,
        credentials: true
      }
    });

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSwagger();
  }

  /**
   * Initialize Express middleware
   */
  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }));

    // CORS configuration
    this.app.use(cors({
      origin: config.cors.origin,
      credentials: config.cors.credentials,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Compression and parsing
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging
    if (config.app.env !== 'test') {
      this.app.use(morgan('combined', {
        stream: {
          write: (message: string) => logger.info(message.trim())
        }
      }));
    }

    // Rate limiting
    this.app.use('/api', rateLimiter);

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.app.env,
        version: process.env.npm_package_version || '1.0.0'
      });
    });
  }

  /**
   * Initialize API routes
   */
  private initializeRoutes(): void {
    const apiRouter = express.Router();

    // Mount route modules
    apiRouter.use('/auth', authRoutes);
    apiRouter.use('/users', userRoutes);
    apiRouter.use('/projects', projectRoutes);
    apiRouter.use('/components', componentRoutes);
    apiRouter.use('/incidents', incidentRoutes);
    apiRouter.use('/subscribers', subscriberRoutes);
    apiRouter.use('/uptime', uptimeRoutes);
    apiRouter.use('/status', statusRoutes);
    apiRouter.use('/notifications', notificationRoutes);

    // Mount API router
    this.app.use('/api', apiRouter);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        name: 'Instatus Clone API',
        version: '1.0.0',
        description: 'A comprehensive status page system API',
        documentation: '/api/docs',
        health: '/health',
        endpoints: {
          auth: '/api/auth',
          projects: '/api/projects',
          components: '/api/components',
          incidents: '/api/incidents',
          subscribers: '/api/subscribers',
          uptime: '/api/uptime',
          status: '/api/status',
          notifications: '/api/notifications'
        }
      });
    });
  }

  /**
   * Initialize error handling middleware
   */
  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  /**
   * Initialize Swagger documentation
   */
  private initializeSwagger(): void {
    if (config.swagger.enabled) {
      setupSwagger(this.app);
    }
  }

  /**
   * Start the server
   */
  public async start(): Promise<void> {
    try {
      // Connect to databases
      await connectDatabase();
      await connectRedis();

      // Setup Socket.IO
      setupSocketIO(this.io);

      // Start server
      this.server.listen(config.app.port, () => {
        logger.info(`🚀 Server running on port ${config.app.port}`);
        logger.info(`📖 API Documentation: http://localhost:${config.app.port}/api/docs`);
        logger.info(`🏥 Health Check: http://localhost:${config.app.port}/health`);
        logger.info(`🌍 Environment: ${config.app.env}`);
      });

      // Graceful shutdown
      this.setupGracefulShutdown();

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  /**
   * Setup graceful shutdown
   */
  private setupGracefulShutdown(): void {
    const gracefulShutdown = (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);
      
      this.server.close(() => {
        logger.info('HTTP server closed');
        
        // Close database connections
        // Note: Add database cleanup here
        
        logger.info('Graceful shutdown completed');
        process.exit(0);
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  }
}

// Create and start application
const app = new Application();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the application
if (require.main === module) {
  app.start().catch((error) => {
    logger.error('Failed to start application:', error);
    process.exit(1);
  });
}

export default app;
