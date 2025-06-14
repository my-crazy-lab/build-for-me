import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import { config } from './config';

/**
 * Swagger API Documentation Configuration
 * 
 * Generates interactive API documentation using OpenAPI 3.0 specification
 */

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Instatus Clone API',
      version: '1.0.0',
      description: `
        A comprehensive status page system API that allows you to:
        - Create and manage status pages
        - Monitor system uptime
        - Manage incidents and updates
        - Send notifications across multiple channels
        - Customize branding and domains
        
        ## Authentication
        
        Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
        \`Authorization: Bearer <your-jwt-token>\`
        
        ## Rate Limiting
        
        API requests are rate limited to prevent abuse. Rate limit headers are included in responses:
        - \`X-RateLimit-Limit\`: Maximum requests allowed
        - \`X-RateLimit-Remaining\`: Remaining requests in current window
        - \`X-RateLimit-Reset\`: Time when rate limit resets
        
        ## Error Handling
        
        All errors follow a consistent format:
        \`\`\`json
        {
          "success": false,
          "error": {
            "code": "ERROR_CODE",
            "message": "Human readable error message",
            "details": {}
          },
          "timestamp": "2023-01-01T00:00:00.000Z"
        }
        \`\`\`
      `,
      contact: {
        name: 'API Support',
        email: 'support@instatus-clone.com',
        url: 'https://github.com/yourusername/instatus-clone',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: config.app.env === 'production' 
          ? 'https://api.instatus-clone.com' 
          : `http://localhost:${config.app.port}`,
        description: config.app.env === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from login endpoint',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique user identifier',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            name: {
              type: 'string',
              description: 'User full name',
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              description: 'User role',
            },
            email_verified: {
              type: 'boolean',
              description: 'Whether email is verified',
            },
            avatar_url: {
              type: 'string',
              format: 'uri',
              description: 'User avatar URL',
            },
            preferences: {
              $ref: '#/components/schemas/UserPreferences',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        UserPreferences: {
          type: 'object',
          properties: {
            language: {
              type: 'string',
              enum: ['en', 'vi'],
              description: 'Preferred language',
            },
            theme: {
              type: 'string',
              enum: ['light', 'dark'],
              description: 'UI theme preference',
            },
            timezone: {
              type: 'string',
              description: 'User timezone',
            },
            email_notifications: {
              type: 'boolean',
              description: 'Email notification preference',
            },
            sms_notifications: {
              type: 'boolean',
              description: 'SMS notification preference',
            },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique project identifier',
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'Project owner ID',
            },
            name: {
              type: 'string',
              description: 'Project name',
            },
            slug: {
              type: 'string',
              description: 'URL-friendly project identifier',
            },
            description: {
              type: 'string',
              description: 'Project description',
            },
            is_private: {
              type: 'boolean',
              description: 'Whether project is private',
            },
            custom_domain: {
              type: 'string',
              description: 'Custom domain for status page',
            },
            branding: {
              $ref: '#/components/schemas/ProjectBranding',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ProjectBranding: {
          type: 'object',
          properties: {
            logo_url: {
              type: 'string',
              format: 'uri',
              description: 'Logo URL',
            },
            primary_color: {
              type: 'string',
              description: 'Primary brand color (hex)',
            },
            secondary_color: {
              type: 'string',
              description: 'Secondary brand color (hex)',
            },
            background_color: {
              type: 'string',
              description: 'Background color (hex)',
            },
            text_color: {
              type: 'string',
              description: 'Text color (hex)',
            },
            font_family: {
              type: 'string',
              description: 'Font family',
            },
            custom_css: {
              type: 'string',
              description: 'Custom CSS styles',
            },
            favicon_url: {
              type: 'string',
              format: 'uri',
              description: 'Favicon URL',
            },
          },
        },
        Component: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            project_id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
              description: 'Component name',
            },
            description: {
              type: 'string',
              description: 'Component description',
            },
            status: {
              type: 'string',
              enum: ['operational', 'degraded', 'partial_outage', 'major_outage', 'maintenance'],
              description: 'Current component status',
            },
            position: {
              type: 'integer',
              description: 'Display order position',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Incident: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            project_id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
              description: 'Incident title',
            },
            content: {
              type: 'string',
              description: 'Incident description',
            },
            status: {
              type: 'string',
              enum: ['investigating', 'identified', 'monitoring', 'resolved'],
              description: 'Incident status',
            },
            impact: {
              type: 'string',
              enum: ['none', 'minor', 'major', 'critical'],
              description: 'Incident impact level',
            },
            start_time: {
              type: 'string',
              format: 'date-time',
              description: 'Incident start time',
            },
            end_time: {
              type: 'string',
              format: 'date-time',
              description: 'Incident resolution time',
            },
            affected_components: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uuid',
              },
              description: 'IDs of affected components',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the request was successful',
            },
            data: {
              description: 'Response data (varies by endpoint)',
            },
            message: {
              type: 'string',
              description: 'Optional success message',
            },
            pagination: {
              $ref: '#/components/schemas/PaginationInfo',
            },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: 'Error code',
                },
                message: {
                  type: 'string',
                  description: 'Error message',
                },
                details: {
                  description: 'Additional error details',
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            path: {
              type: 'string',
              description: 'Request path',
            },
            method: {
              type: 'string',
              description: 'HTTP method',
            },
          },
        },
        PaginationInfo: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              description: 'Current page number',
            },
            limit: {
              type: 'integer',
              description: 'Items per page',
            },
            total: {
              type: 'integer',
              description: 'Total number of items',
            },
            total_pages: {
              type: 'integer',
              description: 'Total number of pages',
            },
            has_next: {
              type: 'boolean',
              description: 'Whether there is a next page',
            },
            has_prev: {
              type: 'boolean',
              description: 'Whether there is a previous page',
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
              example: {
                success: false,
                error: {
                  code: 'AUTHENTICATION_ERROR',
                  message: 'Authentication token required',
                },
                timestamp: '2023-01-01T00:00:00.000Z',
                path: '/api/projects',
                method: 'GET',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
              example: {
                success: false,
                error: {
                  code: 'AUTHORIZATION_ERROR',
                  message: 'Insufficient permissions',
                },
                timestamp: '2023-01-01T00:00:00.000Z',
                path: '/api/projects/123',
                method: 'DELETE',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
              example: {
                success: false,
                error: {
                  code: 'NOT_FOUND',
                  message: 'Resource not found',
                },
                timestamp: '2023-01-01T00:00:00.000Z',
                path: '/api/projects/123',
                method: 'GET',
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
              example: {
                success: false,
                error: {
                  code: 'VALIDATION_ERROR',
                  message: 'Invalid input data',
                  details: {
                    field: 'email',
                    message: 'Invalid email format',
                  },
                },
                timestamp: '2023-01-01T00:00:00.000Z',
                path: '/api/auth/register',
                method: 'POST',
              },
            },
          },
        },
        RateLimitError: {
          description: 'Rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
              example: {
                success: false,
                error: {
                  code: 'RATE_LIMIT_EXCEEDED',
                  message: 'Too many requests. Please try again later.',
                },
                retryAfter: 900,
                timestamp: '2023-01-01T00:00:00.000Z',
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization',
      },
      {
        name: 'Users',
        description: 'User management',
      },
      {
        name: 'Projects',
        description: 'Status page project management',
      },
      {
        name: 'Components',
        description: 'System component management',
      },
      {
        name: 'Incidents',
        description: 'Incident management',
      },
      {
        name: 'Status',
        description: 'Public status page endpoints',
      },
      {
        name: 'Monitoring',
        description: 'Uptime monitoring',
      },
      {
        name: 'Notifications',
        description: 'Notification management',
      },
      {
        name: 'Subscribers',
        description: 'Subscriber management',
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
  ],
};

/**
 * Setup Swagger documentation
 */
export const setupSwagger = (app: Application): void => {
  const specs = swaggerJsdoc(swaggerOptions);
  
  // Swagger UI options
  const swaggerUiOptions = {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #3b82f6 }
    `,
    customSiteTitle: 'Instatus Clone API Documentation',
  };
  
  app.use(config.swagger.path, swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));
  
  // JSON endpoint for the OpenAPI spec
  app.get(`${config.swagger.path}.json`, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};
