import { config as dotenvConfig } from 'dotenv';

// Load environment variables
dotenvConfig();

/**
 * Application Configuration
 * 
 * Centralized configuration management for the Instatus Clone backend.
 * All environment variables are validated and typed here.
 */

interface Config {
  app: {
    env: string;
    port: number;
    name: string;
    version: string;
  };
  database: {
    url: string;
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    ssl: boolean;
    pool: {
      min: number;
      max: number;
      idleTimeout: number;
    };
  };
  redis: {
    url: string;
    host: string;
    port: number;
    password?: string;
    db: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  oauth: {
    google: {
      clientId?: string;
      clientSecret?: string;
    };
    github: {
      clientId?: string;
      clientSecret?: string;
    };
  };
  email: {
    provider: 'sendgrid' | 'smtp';
    sendgrid: {
      apiKey?: string;
    };
    smtp: {
      host?: string;
      port?: number;
      secure?: boolean;
      user?: string;
      pass?: string;
    };
    from: {
      email: string;
      name: string;
    };
  };
  sms: {
    provider: 'twilio' | 'aws';
    twilio: {
      accountSid?: string;
      authToken?: string;
      phoneNumber?: string;
    };
    aws: {
      accessKeyId?: string;
      secretAccessKey?: string;
      region?: string;
    };
  };
  notifications: {
    slack: {
      webhookUrl?: string;
      botToken?: string;
    };
    discord: {
      webhookUrl?: string;
    };
    teams: {
      webhookUrl?: string;
    };
    queue: {
      name: string;
      maxRetries: number;
      retryDelay: number;
      batchSize: number;
    };
  };
  monitoring: {
    enabled: boolean;
    defaultInterval: number;
    maxRetries: number;
    timeout: number;
    batchSize: number;
  };
  storage: {
    provider: 'local' | 's3' | 'cloudinary';
    local: {
      uploadDir: string;
      maxFileSize: number;
    };
    s3: {
      bucket?: string;
      region?: string;
      accessKeyId?: string;
      secretAccessKey?: string;
    };
    cloudinary: {
      cloudName?: string;
      apiKey?: string;
      apiSecret?: string;
    };
  };
  security: {
    bcryptRounds: number;
    rateLimiting: {
      windowMs: number;
      maxRequests: number;
    };
    cors: {
      origin: string | string[];
      credentials: boolean;
    };
  };
  logging: {
    level: string;
    format: string;
    file: {
      enabled: boolean;
      path: string;
      maxSize: string;
      maxFiles: number;
    };
  };
  swagger: {
    enabled: boolean;
    path: string;
  };
  features: {
    oauthEnabled: boolean;
    smsEnabled: boolean;
    slackEnabled: boolean;
    webhookEnabled: boolean;
    customDomains: boolean;
    analytics: boolean;
    export: boolean;
  };
  limits: {
    maxProjectsPerUser: number;
    maxComponentsPerProject: number;
    maxUptimeChecksPerProject: number;
    maxSubscribersPerProject: number;
  };
  frontend: {
    url: string;
  };
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
}

// Helper function to parse boolean environment variables
const parseBoolean = (value: string | undefined, defaultValue: boolean = false): boolean => {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

// Helper function to parse number environment variables
const parseNumber = (value: string | undefined, defaultValue: number): number => {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Helper function to parse array environment variables
const parseArray = (value: string | undefined, defaultValue: string[] = []): string[] => {
  if (!value) return defaultValue;
  return value.split(',').map(item => item.trim());
};

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'FRONTEND_URL'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Required environment variable ${envVar} is not set`);
  }
}

export const config: Config = {
  app: {
    env: process.env.NODE_ENV || 'development',
    port: parseNumber(process.env.PORT, 3001),
    name: process.env.APP_NAME || 'Instatus Clone API',
    version: process.env.npm_package_version || '1.0.0',
  },

  database: {
    url: process.env.DATABASE_URL!,
    host: process.env.DB_HOST || 'localhost',
    port: parseNumber(process.env.DB_PORT, 5432),
    name: process.env.DB_NAME || 'instatus',
    user: process.env.DB_USER || 'instatus_user',
    password: process.env.DB_PASSWORD || 'instatus_password',
    ssl: parseBoolean(process.env.DB_SSL, false),
    pool: {
      min: parseNumber(process.env.DB_POOL_MIN, 2),
      max: parseNumber(process.env.DB_POOL_MAX, 10),
      idleTimeout: parseNumber(process.env.DB_POOL_IDLE_TIMEOUT, 30000),
    },
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseNumber(process.env.REDIS_PORT, 6379),
    password: process.env.REDIS_PASSWORD,
    db: parseNumber(process.env.REDIS_DB, 0),
  },

  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },

  email: {
    provider: (process.env.EMAIL_PROVIDER as 'sendgrid' | 'smtp') || 'sendgrid',
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
    },
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseNumber(process.env.SMTP_PORT, 587),
      secure: parseBoolean(process.env.SMTP_SECURE, false),
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    from: {
      email: process.env.FROM_EMAIL || 'noreply@instatus.local',
      name: process.env.FROM_NAME || 'Instatus Clone',
    },
  },

  sms: {
    provider: (process.env.SMS_PROVIDER as 'twilio' | 'aws') || 'twilio',
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    },
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    },
  },

  notifications: {
    slack: {
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
      botToken: process.env.SLACK_BOT_TOKEN,
    },
    discord: {
      webhookUrl: process.env.DISCORD_WEBHOOK_URL,
    },
    teams: {
      webhookUrl: process.env.TEAMS_WEBHOOK_URL,
    },
    queue: {
      name: process.env.NOTIFICATION_QUEUE_NAME || 'notifications',
      maxRetries: parseNumber(process.env.MAX_NOTIFICATION_RETRIES, 3),
      retryDelay: parseNumber(process.env.NOTIFICATION_RETRY_DELAY, 60),
      batchSize: parseNumber(process.env.NOTIFICATION_BATCH_SIZE, 50),
    },
  },

  monitoring: {
    enabled: parseBoolean(process.env.MONITORING_ENABLED, true),
    defaultInterval: parseNumber(process.env.DEFAULT_CHECK_INTERVAL, 300),
    maxRetries: parseNumber(process.env.MAX_RETRY_ATTEMPTS, 3),
    timeout: parseNumber(process.env.MONITORING_TIMEOUT, 30),
    batchSize: parseNumber(process.env.BATCH_SIZE, 10),
  },

  storage: {
    provider: (process.env.STORAGE_PROVIDER as 'local' | 's3' | 'cloudinary') || 'local',
    local: {
      uploadDir: process.env.UPLOAD_DIR || './uploads',
      maxFileSize: parseNumber(process.env.MAX_FILE_SIZE, 5242880), // 5MB
    },
    s3: {
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_S3_REGION,
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
  },

  security: {
    bcryptRounds: parseNumber(process.env.BCRYPT_ROUNDS, 12),
    rateLimiting: {
      windowMs: parseNumber(process.env.API_RATE_LIMIT_WINDOW, 900000), // 15 minutes
      maxRequests: parseNumber(process.env.API_RATE_LIMIT_MAX, 100),
    },
    cors: {
      origin: parseArray(process.env.CORS_ORIGIN, [process.env.FRONTEND_URL || 'http://localhost:3000']),
      credentials: parseBoolean(process.env.CORS_CREDENTIALS, true),
    },
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
    file: {
      enabled: parseBoolean(process.env.LOG_FILE_ENABLED, true),
      path: process.env.LOG_FILE_PATH || './logs/app.log',
      maxSize: process.env.LOG_FILE_MAX_SIZE || '10m',
      maxFiles: parseNumber(process.env.LOG_FILE_MAX_FILES, 5),
    },
  },

  swagger: {
    enabled: parseBoolean(process.env.SWAGGER_ENABLED, true),
    path: process.env.SWAGGER_PATH || '/api/docs',
  },

  features: {
    oauthEnabled: parseBoolean(process.env.FEATURE_OAUTH_ENABLED, true),
    smsEnabled: parseBoolean(process.env.FEATURE_SMS_ENABLED, true),
    slackEnabled: parseBoolean(process.env.FEATURE_SLACK_ENABLED, true),
    webhookEnabled: parseBoolean(process.env.FEATURE_WEBHOOK_ENABLED, true),
    customDomains: parseBoolean(process.env.FEATURE_CUSTOM_DOMAINS, true),
    analytics: parseBoolean(process.env.FEATURE_ANALYTICS, true),
    export: parseBoolean(process.env.FEATURE_EXPORT, true),
  },

  limits: {
    maxProjectsPerUser: parseNumber(process.env.MAX_PROJECTS_PER_USER, 10),
    maxComponentsPerProject: parseNumber(process.env.MAX_COMPONENTS_PER_PROJECT, 50),
    maxUptimeChecksPerProject: parseNumber(process.env.MAX_UPTIME_CHECKS_PER_PROJECT, 20),
    maxSubscribersPerProject: parseNumber(process.env.MAX_SUBSCRIBERS_PER_PROJECT, 1000),
  },

  frontend: {
    url: process.env.FRONTEND_URL!,
  },

  cors: {
    origin: parseArray(process.env.CORS_ORIGIN, [process.env.FRONTEND_URL || 'http://localhost:3000']),
    credentials: parseBoolean(process.env.CORS_CREDENTIALS, true),
  },
};

// Validate configuration
export const validateConfig = (): void => {
  const errors: string[] = [];

  // Validate JWT secret length
  if (config.jwt.secret.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long');
  }

  // Validate email configuration
  if (config.email.provider === 'sendgrid' && !config.email.sendgrid.apiKey) {
    errors.push('SENDGRID_API_KEY is required when using SendGrid');
  }

  if (config.email.provider === 'smtp') {
    if (!config.email.smtp.host || !config.email.smtp.user || !config.email.smtp.pass) {
      errors.push('SMTP configuration is incomplete');
    }
  }

  // Validate SMS configuration if enabled
  if (config.features.smsEnabled) {
    if (config.sms.provider === 'twilio') {
      if (!config.sms.twilio.accountSid || !config.sms.twilio.authToken) {
        errors.push('Twilio configuration is incomplete');
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
};

// Validate configuration on import
if (process.env.NODE_ENV !== 'test') {
  validateConfig();
}
