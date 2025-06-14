# 🛠 Development Guide

This document provides detailed information for developers working on the Instatus Clone project.

## 📋 Table of Contents

- [Project Architecture](#project-architecture)
- [Development Setup](#development-setup)
- [Code Structure](#code-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Real-time Features](#real-time-features)
- [Testing Strategy](#testing-strategy)
- [Deployment Guide](#deployment-guide)
- [Contributing Guidelines](#contributing-guidelines)

## 🏗 Project Architecture

### Overview

The Instatus Clone is built using a microservices architecture with the following components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │     Backend     │    │   Monitoring    │
│   (Next.js)     │◄──►│   (Express)     │◄──►│   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │  Notifications  │              │
         │              │   (Node.js)     │              │
         │              └─────────────────┘              │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │     Redis       │
                    └─────────────────┘
```

### Technology Stack

#### Frontend
- **Next.js 14** - React framework with SSR/SSG
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **Socket.IO Client** - Real-time communication
- **React Hook Form** - Form management
- **Zod** - Schema validation

#### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Primary database
- **Redis** - Caching and queue management
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Bull** - Job queue system

#### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy (production)

## 🚀 Development Setup

### Prerequisites

Ensure you have the following installed:
- **Node.js** 18+ and npm
- **Docker** and Docker Compose
- **Git**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/instatus-clone.git
   cd instatus-clone
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker (Recommended)**
   ```bash
   # Start all services
   docker-compose up -d
   
   # View logs
   docker-compose logs -f
   ```

4. **Manual setup (Alternative)**
   ```bash
   # Install dependencies
   npm run install:all
   
   # Start databases
   npm run db:setup
   
   # Run migrations and seed data
   npm run db:migrate
   npm run db:seed
   
   # Start all services
   npm run dev
   ```

### Development URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **PgAdmin**: http://localhost:5050 (admin/admin)
- **Redis Commander**: http://localhost:8081

## 📁 Code Structure

### Frontend Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Basic UI components
│   │   ├── forms/          # Form components
│   │   ├── charts/         # Chart components
│   │   └── layout/         # Layout components
│   ├── pages/              # Next.js pages
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard pages
│   │   └── status/         # Public status pages
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── store/              # State management
│   ├── styles/             # Global styles
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── package.json
```

### Backend Structure

```
backend/
├── src/
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types
│   └── index.ts            # Application entry point
├── tests/                  # Test files
└── package.json
```

### Shared Structure

```
shared/
├── types/                  # Common TypeScript types
├── utils/                  # Shared utilities
├── constants/              # Application constants
└── package.json
```

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

For detailed API documentation with examples, visit `/api/docs` when the server is running.

## 🗄 Database Schema

### Core Tables

- **users** - User accounts and authentication
- **projects** - Status page projects
- **components** - System components to monitor
- **incidents** - Service incidents and updates
- **incident_updates** - Incident timeline updates
- **subscribers** - Notification subscribers
- **uptime_checks** - Monitoring configurations
- **uptime_logs** - Historical uptime data
- **notifications** - Notification history

### Key Relationships

```sql
users (1) ──── (many) projects
projects (1) ──── (many) components
projects (1) ──── (many) incidents
projects (1) ──── (many) subscribers
projects (1) ──── (many) uptime_checks
uptime_checks (1) ──── (many) uptime_logs
incidents (1) ──── (many) incident_updates
```

## ⚡ Real-time Features

### WebSocket Events

The application uses Socket.IO for real-time updates:

- **Component Status Changes** - Live status updates
- **Incident Updates** - Real-time incident notifications
- **Uptime Monitoring** - Live monitoring results
- **New Subscribers** - Subscription notifications

### Event Broadcasting

```typescript
// Broadcast to project room
broadcastToProject(projectId, {
  type: 'COMPONENT_STATUS_CHANGED',
  data: { componentId, status },
  timestamp: new Date().toISOString()
});

// Broadcast to status page viewers
broadcastToStatusPage(slug, {
  type: 'INCIDENT_CREATED',
  data: incident,
  timestamp: new Date().toISOString()
});
```

## 🧪 Testing Strategy

### Frontend Testing

```bash
# Run all tests
npm run test:frontend

# Run tests in watch mode
npm run test:frontend -- --watch

# Run tests with coverage
npm run test:frontend -- --coverage
```

### Backend Testing

```bash
# Run all tests
npm run test:backend

# Run specific test file
npm run test:backend -- auth.test.ts

# Run tests with coverage
npm run test:backend -- --coverage
```

### Test Structure

- **Unit Tests** - Individual functions and components
- **Integration Tests** - API endpoints and database operations
- **E2E Tests** - Complete user workflows
- **Performance Tests** - Load and stress testing

## 🚀 Deployment Guide

### Docker Deployment

1. **Build production images**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Start production services**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Run database migrations**
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend npm run db:migrate
   ```

### Environment Configuration

#### Development
- Hot reload enabled
- Debug logging
- Local database
- Development API keys

#### Staging
- Production-like environment
- Limited logging
- Staging database
- Test API keys

#### Production
- Optimized builds
- Error tracking
- Production database
- Live API keys

### Monitoring and Logging

- **Application Logs** - Winston logging with multiple transports
- **Error Tracking** - Sentry integration
- **Performance Monitoring** - Custom metrics and alerts
- **Uptime Monitoring** - Built-in monitoring system

## 🤝 Contributing Guidelines

### Code Style

- **TypeScript** for type safety
- **ESLint** and **Prettier** for code formatting
- **Conventional Commits** for commit messages
- **Husky** for pre-commit hooks

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests for new functionality**
5. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Pull Request Guidelines

- Include a clear description of changes
- Add tests for new features
- Update documentation if needed
- Ensure all tests pass
- Follow the existing code style

## 📞 Support

- **Documentation**: [docs.instatus-clone.com](https://docs.instatus-clone.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/instatus-clone/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/instatus-clone/discussions)
- **Email**: support@instatus-clone.com

---

**Happy coding! 🎉**
