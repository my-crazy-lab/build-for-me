# 📡 API Documentation

Complete API reference for the Instatus Clone status page system.

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
- [WebSocket Events](#websocket-events)
- [Examples](#examples)

## 🎯 Overview

The Instatus Clone API is a RESTful API that provides comprehensive status page management capabilities. All API endpoints return JSON responses and follow consistent patterns for success and error handling.

### Base URL

- **Development**: `http://localhost:3001/api`
- **Production**: `https://api.your-domain.com/api`

### Content Type

All requests should include the `Content-Type: application/json` header when sending JSON data.

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Obtaining a Token

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

## ⚡ Rate Limiting

API requests are rate limited to prevent abuse:

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **Password Reset**: 3 attempts per hour
- **Email Sending**: 10 emails per hour
- **SMS Sending**: 5 SMS per hour

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when rate limit resets

## ❌ Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  },
  "timestamp": "2023-01-01T00:00:00.000Z",
  "path": "/api/endpoint",
  "method": "POST"
}
```

### Common Error Codes

- `VALIDATION_ERROR` (400) - Invalid input data
- `AUTHENTICATION_ERROR` (401) - Authentication required
- `AUTHORIZATION_ERROR` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `CONFLICT` (409) - Resource already exists
- `RATE_LIMIT_EXCEEDED` (429) - Too many requests
- `INTERNAL_SERVER_ERROR` (500) - Server error

## 🛠 Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  },
  "message": "User registered successfully"
}
```

#### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "refresh-token"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Projects

#### List Projects
```http
GET /api/projects
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "My Status Page",
      "slug": "my-status-page",
      "description": "Status page for my services",
      "is_private": false,
      "custom_domain": null,
      "branding": {
        "primary_color": "#3b82f6",
        "secondary_color": "#1e40af",
        "background_color": "#ffffff",
        "text_color": "#1f2937",
        "font_family": "Inter, sans-serif"
      },
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

#### Create Project
```http
POST /api/projects
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "My Status Page",
  "slug": "my-status-page",
  "description": "Status page for my services",
  "is_private": false,
  "branding": {
    "primary_color": "#3b82f6",
    "secondary_color": "#1e40af"
  }
}
```

#### Get Project
```http
GET /api/projects/:id
Authorization: Bearer <token>
```

#### Update Project
```http
PUT /api/projects/:id
Authorization: Bearer <token>
```

#### Delete Project
```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

### Components

#### List Project Components
```http
GET /api/projects/:projectId/components
Authorization: Bearer <token>
```

#### Create Component
```http
POST /api/projects/:projectId/components
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "API Server",
  "description": "Main API backend service",
  "status": "operational"
}
```

#### Update Component
```http
PUT /api/components/:id
Authorization: Bearer <token>
```

#### Delete Component
```http
DELETE /api/components/:id
Authorization: Bearer <token>
```

### Incidents

#### List Project Incidents
```http
GET /api/projects/:projectId/incidents
Authorization: Bearer <token>
```

#### Create Incident
```http
POST /api/projects/:projectId/incidents
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "API Server Outage",
  "content": "We are experiencing issues with our API server",
  "status": "investigating",
  "impact": "major",
  "affected_components": ["component-uuid-1", "component-uuid-2"]
}
```

#### Get Incident
```http
GET /api/incidents/:id
Authorization: Bearer <token>
```

#### Update Incident
```http
PUT /api/incidents/:id
Authorization: Bearer <token>
```

#### Add Incident Update
```http
POST /api/incidents/:id/updates
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "identified",
  "content": "We have identified the issue and are working on a fix"
}
```

### Public Status Page

#### Get Status Page
```http
GET /api/status/:slug
```

**Response:**
```json
{
  "success": true,
  "data": {
    "project": {
      "name": "My Status Page",
      "description": "Status page for my services",
      "branding": { /* branding object */ }
    },
    "components": [
      {
        "id": "uuid",
        "name": "API Server",
        "status": "operational",
        "description": "Main API backend service"
      }
    ],
    "incidents": [
      {
        "id": "uuid",
        "title": "API Server Outage",
        "status": "resolved",
        "impact": "major",
        "start_time": "2023-01-01T00:00:00.000Z",
        "end_time": "2023-01-01T01:00:00.000Z",
        "updates": [
          {
            "status": "resolved",
            "content": "Issue has been resolved",
            "created_at": "2023-01-01T01:00:00.000Z"
          }
        ]
      }
    ],
    "overall_status": "operational"
  }
}
```

#### Subscribe to Notifications
```http
POST /api/status/:slug/subscribe
```

**Request Body:**
```json
{
  "email": "subscriber@example.com",
  "notify_by": ["email"]
}
```

### Monitoring

#### List Uptime Checks
```http
GET /api/projects/:projectId/uptime-checks
Authorization: Bearer <token>
```

#### Create Uptime Check
```http
POST /api/projects/:projectId/uptime-checks
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "API Health Check",
  "url": "https://api.example.com/health",
  "method": "GET",
  "interval": 300,
  "timeout": 30,
  "expected_status_codes": [200],
  "component_id": "component-uuid"
}
```

#### Get Uptime Logs
```http
GET /api/uptime-checks/:id/logs
Authorization: Bearer <token>
```

**Query Parameters:**
- `from` (optional): Start date (ISO string)
- `to` (optional): End date (ISO string)
- `limit` (optional): Number of logs to return

## 🔄 WebSocket Events

Connect to WebSocket for real-time updates:

```javascript
import io from 'socket.io-client';

const socket = io('ws://localhost:3001', {
  auth: {
    token: 'your-jwt-token'
  }
});

// Join project room
socket.emit('join_project', 'project-uuid');

// Listen for events
socket.on('project_event', (event) => {
  console.log('Project event:', event);
});

socket.on('status_event', (event) => {
  console.log('Status page event:', event);
});
```

### Event Types

- `COMPONENT_STATUS_CHANGED` - Component status updated
- `INCIDENT_CREATED` - New incident created
- `INCIDENT_UPDATED` - Incident updated
- `INCIDENT_RESOLVED` - Incident resolved
- `UPTIME_CHECK_FAILED` - Uptime check failed
- `UPTIME_CHECK_RECOVERED` - Uptime check recovered
- `NEW_SUBSCRIBER` - New subscriber added

## 📝 Examples

### Complete Workflow Example

```javascript
// 1. Register/Login
const authResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data: { token } } = await authResponse.json();

// 2. Create a project
const projectResponse = await fetch('/api/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'My Service Status',
    slug: 'my-service-status',
    description: 'Status page for my service'
  })
});

const { data: project } = await projectResponse.json();

// 3. Add components
const componentResponse = await fetch(`/api/projects/${project.id}/components`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'API Server',
    description: 'Main API backend',
    status: 'operational'
  })
});

// 4. Create an incident
const incidentResponse = await fetch(`/api/projects/${project.id}/incidents`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'API Performance Issues',
    content: 'We are experiencing slow response times',
    status: 'investigating',
    impact: 'minor'
  })
});

// 5. View public status page
const statusResponse = await fetch(`/api/status/${project.slug}`);
const statusData = await statusResponse.json();
```

### Error Handling Example

```javascript
try {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: '', // Invalid: empty name
      slug: 'test'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error.error.message);
    
    if (error.error.code === 'VALIDATION_ERROR') {
      // Handle validation errors
      console.log('Validation details:', error.error.details);
    }
  }
} catch (error) {
  console.error('Network error:', error);
}
```

---

For interactive API documentation, visit `/api/docs` when the server is running.
