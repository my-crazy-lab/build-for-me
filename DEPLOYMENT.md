# 🚀 Deployment Guide

Complete guide for deploying the Instatus Clone to various environments.

## 📋 Table of Contents

- [Overview](#overview)
- [Environment Setup](#environment-setup)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Database Setup](#database-setup)
- [SSL Configuration](#ssl-configuration)
- [Monitoring & Logging](#monitoring--logging)
- [Backup Strategy](#backup-strategy)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The Instatus Clone can be deployed in multiple ways:

1. **Docker Compose** (Recommended for development/staging)
2. **Kubernetes** (Recommended for production)
3. **Cloud Platforms** (AWS, GCP, Azure)
4. **VPS/Dedicated Servers**

## ⚙️ Environment Setup

### Environment Variables

Create production environment files:

```bash
# Copy and customize environment files
cp .env.example .env.production
cp .env.example .env.staging
```

### Required Environment Variables

```bash
# Application
NODE_ENV=production
FRONTEND_URL=https://status.yourdomain.com
BACKEND_URL=https://api.yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/instatus_prod
REDIS_URL=redis://redis-host:6379

# Security
JWT_SECRET=your-super-secure-jwt-secret-min-32-chars
NEXTAUTH_SECRET=your-nextauth-secret

# Email (Choose one)
SENDGRID_API_KEY=your-sendgrid-api-key
# OR
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS (Optional)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

## 🐳 Docker Deployment

### Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: instatus_prod
      POSTGRES_USER: instatus_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - instatus_network

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - instatus_network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://instatus_user:${DB_PASSWORD}@postgres:5432/instatus_prod
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      JWT_SECRET: ${JWT_SECRET}
      SENDGRID_API_KEY: ${SENDGRID_API_KEY}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - instatus_network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: ${BACKEND_URL}
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - instatus_network

  monitoring:
    build:
      context: ./monitoring
      dockerfile: Dockerfile.prod
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://instatus_user:${DB_PASSWORD}@postgres:5432/instatus_prod
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - instatus_network

  notifications:
    build:
      context: ./notifications
      dockerfile: Dockerfile.prod
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://instatus_user:${DB_PASSWORD}@postgres:5432/instatus_prod
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      SENDGRID_API_KEY: ${SENDGRID_API_KEY}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - instatus_network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
    networks:
      - instatus_network

volumes:
  postgres_data:
  redis_data:

networks:
  instatus_network:
    driver: bridge
```

### Deployment Commands

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Run database migrations
docker-compose -f docker-compose.prod.yml exec backend npm run db:migrate

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Update services
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## ☁️ Cloud Deployment

### AWS Deployment

#### Using AWS ECS

1. **Create ECR repositories**
   ```bash
   aws ecr create-repository --repository-name instatus-frontend
   aws ecr create-repository --repository-name instatus-backend
   aws ecr create-repository --repository-name instatus-monitoring
   aws ecr create-repository --repository-name instatus-notifications
   ```

2. **Build and push images**
   ```bash
   # Get login token
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

   # Build and tag images
   docker build -t instatus-backend ./backend
   docker tag instatus-backend:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/instatus-backend:latest

   # Push images
   docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/instatus-backend:latest
   ```

3. **Create ECS task definition**
   ```json
   {
     "family": "instatus-task",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "1024",
     "memory": "2048",
     "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
     "containerDefinitions": [
       {
         "name": "backend",
         "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/instatus-backend:latest",
         "portMappings": [
           {
             "containerPort": 3001,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "NODE_ENV",
             "value": "production"
           }
         ],
         "logConfiguration": {
           "logDriver": "awslogs",
           "options": {
             "awslogs-group": "/ecs/instatus",
             "awslogs-region": "us-east-1",
             "awslogs-stream-prefix": "ecs"
           }
         }
       }
     ]
   }
   ```

#### Using AWS App Runner

```yaml
# apprunner.yaml
version: 1.0
runtime: nodejs18
build:
  commands:
    build:
      - npm ci
      - npm run build
run:
  runtime-version: 18
  command: npm start
  network:
    port: 3001
    env: PORT
  env:
    - name: NODE_ENV
      value: production
```

### Google Cloud Platform

#### Using Cloud Run

```bash
# Build and deploy backend
gcloud builds submit --tag gcr.io/PROJECT_ID/instatus-backend ./backend
gcloud run deploy instatus-backend \
  --image gcr.io/PROJECT_ID/instatus-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Build and deploy frontend
gcloud builds submit --tag gcr.io/PROJECT_ID/instatus-frontend ./frontend
gcloud run deploy instatus-frontend \
  --image gcr.io/PROJECT_ID/instatus-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Azure Container Instances

```bash
# Create resource group
az group create --name instatus-rg --location eastus

# Create container group
az container create \
  --resource-group instatus-rg \
  --name instatus-backend \
  --image your-registry/instatus-backend:latest \
  --dns-name-label instatus-api \
  --ports 3001 \
  --environment-variables NODE_ENV=production
```

## 🗄 Database Setup

### PostgreSQL Production Setup

1. **Create production database**
   ```sql
   CREATE DATABASE instatus_prod;
   CREATE USER instatus_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE instatus_prod TO instatus_user;
   ```

2. **Run migrations**
   ```bash
   npm run db:migrate
   ```

3. **Create database backup**
   ```bash
   pg_dump -h localhost -U instatus_user instatus_prod > backup.sql
   ```

### Redis Production Setup

1. **Configure Redis**
   ```bash
   # redis.conf
   bind 127.0.0.1
   port 6379
   requirepass your_secure_password
   maxmemory 256mb
   maxmemory-policy allkeys-lru
   save 900 1
   save 300 10
   save 60 10000
   ```

2. **Start Redis with config**
   ```bash
   redis-server /path/to/redis.conf
   ```

## 🔒 SSL Configuration

### Using Let's Encrypt with Certbot

1. **Install Certbot**
   ```bash
   sudo apt update
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain SSL certificate**
   ```bash
   sudo certbot --nginx -d status.yourdomain.com -d api.yourdomain.com
   ```

3. **Auto-renewal**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/instatus
server {
    listen 80;
    server_name status.yourdomain.com api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name status.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/status.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/status.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io/ {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 Monitoring & Logging

### Application Monitoring

1. **Sentry for Error Tracking**
   ```bash
   # Add to environment
   SENTRY_DSN=your-sentry-dsn
   ```

2. **Prometheus Metrics**
   ```javascript
   // Add to backend
   const prometheus = require('prom-client');
   const register = new prometheus.Registry();
   
   const httpRequestDuration = new prometheus.Histogram({
     name: 'http_request_duration_seconds',
     help: 'Duration of HTTP requests in seconds',
     labelNames: ['method', 'route', 'status_code'],
     buckets: [0.1, 0.5, 1, 2, 5]
   });
   
   register.registerMetric(httpRequestDuration);
   ```

3. **Health Check Endpoints**
   ```javascript
   app.get('/health', (req, res) => {
     res.json({
       status: 'OK',
       timestamp: new Date().toISOString(),
       uptime: process.uptime(),
       memory: process.memoryUsage(),
       version: process.env.npm_package_version
     });
   });
   ```

### Log Management

1. **Structured Logging**
   ```javascript
   const winston = require('winston');
   
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.combine(
       winston.format.timestamp(),
       winston.format.errors({ stack: true }),
       winston.format.json()
     ),
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   });
   ```

2. **Log Aggregation**
   ```yaml
   # docker-compose.yml
   logging:
     driver: "json-file"
     options:
       max-size: "10m"
       max-file: "3"
   ```

## 💾 Backup Strategy

### Database Backups

1. **Automated PostgreSQL Backups**
   ```bash
   #!/bin/bash
   # backup.sh
   DATE=$(date +%Y%m%d_%H%M%S)
   BACKUP_DIR="/backups"
   DB_NAME="instatus_prod"
   
   pg_dump -h localhost -U instatus_user $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz
   
   # Keep only last 7 days
   find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
   ```

2. **Cron Job for Backups**
   ```bash
   # Add to crontab
   0 2 * * * /path/to/backup.sh
   ```

### File Backups

1. **Application Files**
   ```bash
   # Backup uploads and logs
   tar -czf app_backup_$(date +%Y%m%d).tar.gz uploads/ logs/
   ```

2. **Configuration Backups**
   ```bash
   # Backup environment and config files
   tar -czf config_backup_$(date +%Y%m%d).tar.gz .env* nginx/ docker-compose*.yml
   ```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check database connectivity
   docker-compose exec backend npm run db:test
   
   # Check database logs
   docker-compose logs postgres
   ```

2. **Memory Issues**
   ```bash
   # Check memory usage
   docker stats
   
   # Increase memory limits in docker-compose.yml
   deploy:
     resources:
       limits:
         memory: 1G
   ```

3. **SSL Certificate Issues**
   ```bash
   # Check certificate status
   sudo certbot certificates
   
   # Renew certificates
   sudo certbot renew --dry-run
   ```

### Performance Optimization

1. **Database Optimization**
   ```sql
   -- Add indexes for better performance
   CREATE INDEX idx_projects_user_id ON projects(user_id);
   CREATE INDEX idx_components_project_id ON components(project_id);
   CREATE INDEX idx_incidents_project_id ON incidents(project_id);
   ```

2. **Redis Optimization**
   ```bash
   # Monitor Redis performance
   redis-cli --latency-history
   
   # Check memory usage
   redis-cli info memory
   ```

3. **Application Optimization**
   ```javascript
   // Enable compression
   app.use(compression());
   
   // Cache static assets
   app.use(express.static('public', {
     maxAge: '1d',
     etag: true
   }));
   ```

### Monitoring Commands

```bash
# Check service status
docker-compose ps

# View real-time logs
docker-compose logs -f

# Check resource usage
docker stats

# Database health check
docker-compose exec postgres pg_isready

# Redis health check
docker-compose exec redis redis-cli ping

# Application health check
curl -f http://localhost:3001/health || exit 1
```

---

For additional support, please refer to the [troubleshooting section](TROUBLESHOOTING.md) or open an issue on GitHub.
