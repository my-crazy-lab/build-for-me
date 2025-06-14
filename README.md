# 🚀 Instatus Clone - Status Page System

A comprehensive status page system clone inspired by Instatus, built with modern web technologies.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

This project is a full-featured status page system that allows organizations to:

- **Create and manage status pages** for their services and systems
- **Monitor uptime** automatically with built-in monitoring tools
- **Manage incidents** with detailed timeline updates
- **Send notifications** across multiple channels (Email, SMS, Slack, Webhook)
- **Customize branding** and use custom domains
- **Real-time updates** for status changes and incidents
- **Public and private** status pages with access control

## ✨ Features

### Core Features
- ✅ **User Authentication** - JWT + OAuth2 (Google)
- ✅ **Project Management** - Multiple status pages per user
- ✅ **Component Management** - Track individual system components
- ✅ **Incident Management** - Create, update, and resolve incidents
- ✅ **Public Status Pages** - Clean, responsive status pages
- ✅ **Real-time Updates** - WebSocket-based live updates
- ✅ **Monitoring System** - Automated uptime checks
- ✅ **Notification System** - Multi-channel notifications
- ✅ **Custom Branding** - Logo, colors, and custom domains
- ✅ **Subscriber Management** - Email/SMS subscription system

### Advanced Features
- 🔄 **API Access** - RESTful API for integrations
- 📊 **Analytics & Reports** - Uptime statistics and reports
- 🌐 **Multi-language Support** - i18n ready
- 🔐 **Access Control** - Public, private, and selective access
- 📱 **Mobile Responsive** - Works on all devices
- 🎨 **Customizable UI** - Tailwind CSS with theme support

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with SSR/SSG
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time communication
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Chart.js** - Data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Primary database
- **Redis** - Caching and queue management
- **Socket.IO** - Real-time communication
- **Bull** - Job queue for notifications
- **JWT** - Authentication
- **Prisma** - Database ORM

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy (production)
- **Let's Encrypt** - SSL certificates
- **Cloudflare** - CDN and DNS management

### External Services
- **SendGrid** - Email notifications
- **Twilio** - SMS notifications
- **Slack API** - Slack notifications
- **Google OAuth** - Social authentication

## 📁 Project Structure

```
instatus-clone/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Next.js pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript types
│   │   └── styles/         # CSS and styling
│   ├── public/             # Static assets
│   └── package.json
├── backend/                  # Express.js backend API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript types
│   └── package.json
├── monitoring/               # Uptime monitoring service
│   ├── src/
│   │   ├── jobs/           # Cron jobs
│   │   ├── checkers/       # Health check logic
│   │   └── utils/          # Monitoring utilities
│   └── package.json
├── notifications/            # Notification service
│   ├── src/
│   │   ├── queues/         # Job queues
│   │   ├── providers/      # Notification providers
│   │   └── templates/      # Message templates
│   └── package.json
├── database/                 # Database related files
│   ├── migrations/         # Database migrations
│   ├── seeds/              # Seed data
│   └── schema.sql          # Database schema
├── shared/                   # Shared code and types
│   ├── types/              # Common TypeScript types
│   ├── utils/              # Shared utilities
│   └── constants/          # Application constants
├── docker-compose.yml        # Docker services configuration
├── docker-compose.prod.yml   # Production Docker configuration
├── .env.example             # Environment variables template
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Docker** and Docker Compose
- **PostgreSQL** 14+
- **Redis** 6+

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/instatus-clone.git
cd instatus-clone
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### 3. Start with Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Manual Setup (Alternative)

```bash
# Install dependencies for all services
npm run install:all

# Start database
docker-compose up -d postgres redis

# Run database migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Start all services in development mode
npm run dev
```

## 🔧 Installation

### Detailed Installation Steps

1. **Clone and Setup**
   ```bash
   git clone https://github.com/yourusername/instatus-clone.git
   cd instatus-clone
   cp .env.example .env
   ```

2. **Configure Environment Variables**
   ```bash
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/instatus"
   REDIS_URL="redis://localhost:6379"
   
   # Authentication
   JWT_SECRET="your-super-secret-jwt-key"
   GOOGLE_CLIENT_ID="your-google-oauth-client-id"
   GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
   
   # Notifications
   SENDGRID_API_KEY="your-sendgrid-api-key"
   TWILIO_ACCOUNT_SID="your-twilio-account-sid"
   TWILIO_AUTH_TOKEN="your-twilio-auth-token"
   
   # Application
   FRONTEND_URL="http://localhost:3000"
   BACKEND_URL="http://localhost:3001"
   ```

3. **Install Dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend && npm install && cd ..
   
   # Install backend dependencies
   cd backend && npm install && cd ..
   
   # Install monitoring dependencies
   cd monitoring && npm install && cd ..
   
   # Install notifications dependencies
   cd notifications && npm install && cd ..
   ```

4. **Database Setup**
   ```bash
   # Start PostgreSQL and Redis
   docker-compose up -d postgres redis
   
   # Run migrations
   npm run db:migrate
   
   # Seed with sample data
   npm run db:seed
   ```

5. **Start Development Servers**
   ```bash
   # Start all services
   npm run dev
   
   # Or start individually
   npm run dev:frontend    # http://localhost:3000
   npm run dev:backend     # http://localhost:3001
   npm run dev:monitoring  # Background service
   npm run dev:notifications # Background service
   ```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | - | ✅ |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` | ✅ |
| `JWT_SECRET` | JWT signing secret | - | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | - | ❌ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | - | ❌ |
| `SENDGRID_API_KEY` | SendGrid API key for emails | - | ❌ |
| `TWILIO_ACCOUNT_SID` | Twilio account SID for SMS | - | ❌ |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | - | ❌ |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:3000` | ✅ |
| `BACKEND_URL` | Backend API URL | `http://localhost:3001` | ✅ |

### Database Configuration

The application uses PostgreSQL as the primary database. The schema includes:

- **Users** - User accounts and authentication
- **Projects** - Status page projects
- **Components** - System components to monitor
- **Incidents** - Service incidents and updates
- **Subscribers** - Notification subscribers
- **UptimeChecks** - Monitoring configurations
- **UptimeLogs** - Historical uptime data
- **Notifications** - Notification history

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register     # Register new user
POST /api/auth/login        # User login
POST /api/auth/logout       # User logout
POST /api/auth/refresh      # Refresh JWT token
GET  /api/auth/me          # Get current user
```

### Project Management

```
GET    /api/projects        # List user projects
POST   /api/projects        # Create new project
GET    /api/projects/:id    # Get project details
PUT    /api/projects/:id    # Update project
DELETE /api/projects/:id    # Delete project
```

### Component Management

```
GET    /api/projects/:id/components     # List project components
POST   /api/projects/:id/components     # Create component
PUT    /api/components/:id              # Update component
DELETE /api/components/:id              # Delete component
```

### Incident Management

```
GET    /api/projects/:id/incidents      # List project incidents
POST   /api/projects/:id/incidents      # Create incident
GET    /api/incidents/:id               # Get incident details
PUT    /api/incidents/:id               # Update incident
DELETE /api/incidents/:id               # Delete incident
```

### Public Status Page

```
GET /api/status/:slug                   # Get public status page data
POST /api/status/:slug/subscribe        # Subscribe to notifications
```

### Monitoring

```
GET    /api/projects/:id/uptime-checks  # List uptime checks
POST   /api/projects/:id/uptime-checks  # Create uptime check
PUT    /api/uptime-checks/:id           # Update uptime check
DELETE /api/uptime-checks/:id           # Delete uptime check
GET    /api/uptime-checks/:id/logs      # Get uptime logs
```

For detailed API documentation with request/response examples, visit `/api/docs` when the server is running.

## 🚀 Deployment

### Docker Deployment (Recommended)

1. **Production Environment Setup**
   ```bash
   # Copy production environment
   cp .env.example .env.production
   
   # Edit production variables
   nano .env.production
   ```

2. **Build and Deploy**
   ```bash
   # Build production images
   docker-compose -f docker-compose.prod.yml build
   
   # Start production services
   docker-compose -f docker-compose.prod.yml up -d
   
   # Run migrations in production
   docker-compose -f docker-compose.prod.yml exec backend npm run db:migrate
   ```

### Manual Deployment

1. **Build Applications**
   ```bash
   # Build frontend
   cd frontend && npm run build && cd ..
   
   # Build backend
   cd backend && npm run build && cd ..
   ```

2. **Deploy to Server**
   ```bash
   # Copy built files to server
   rsync -av --exclude node_modules . user@server:/path/to/app
   
   # Install production dependencies
   npm ci --production
   
   # Start with PM2
   pm2 start ecosystem.config.js
   ```

### Environment-Specific Configurations

- **Development**: Hot reload, debug logging, local database
- **Staging**: Production-like environment for testing
- **Production**: Optimized builds, error tracking, monitoring

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- **TypeScript** for type safety
- **ESLint** and **Prettier** for code formatting
- **Conventional Commits** for commit messages
- **Jest** for testing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Instatus](https://instatus.com)
- Built with amazing open-source technologies
- Community feedback and contributions

## 📞 Support

- 📧 Email: support@yourcompany.com
- 💬 Discord: [Join our community](https://discord.gg/yourserver)
- 📖 Documentation: [docs.yourcompany.com](https://docs.yourcompany.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/instatus-clone/issues)

---

**Made with ❤️ by [Your Name](https://github.com/yourusername)**
