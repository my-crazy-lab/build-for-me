# Project Structure

```
reviewly-core/
├── README.md                    # Main documentation
├── PROJECT_STRUCTURE.md         # This file
├── Requirement.md              # Original requirements
│
├── backend/                    # Node.js Express Backend
│   ├── .env                   # Environment variables (OAuth credentials)
│   ├── .env.example          # Environment template
│   ├── package.json          # Backend dependencies
│   ├── index.js              # Main server file
│   │
│   ├── models/               # MongoDB Models
│   │   └── Token.js         # Token storage schema
│   │
│   ├── routes/              # API Routes
│   │   ├── auth.js         # OAuth callback routes
│   │   └── api.js          # Data API endpoints
│   │
│   └── utils/              # Utility Functions
│       └── oauth.js        # OAuth helper functions
│
└── frontend/               # React Frontend
    ├── .env               # Frontend environment variables
    ├── package.json       # Frontend dependencies
    ├── vite.config.js     # Vite configuration with proxy
    ├── index.html         # HTML template
    │
    ├── src/
    │   ├── main.jsx       # React entry point
    │   ├── App.jsx        # Main App component with routing
    │   ├── index.css      # Global styles with Tailwind
    │   │
    │   ├── components/    # React Components
    │   │   ├── Home.jsx           # Home page with connection cards
    │   │   ├── Dashboard.jsx      # Dashboard with issues/MRs
    │   │   ├── ConnectionCard.jsx # OAuth connection card
    │   │   ├── IssueCard.jsx      # Linear issue display
    │   │   └── MergeRequestCard.jsx # GitLab MR display
    │   │
    │   └── services/      # API Services
    │       └── api.js     # Centralized API calls
    │
    └── public/           # Static assets
```

## Key Features Implemented

### Backend (Node.js + Express)
✅ **OAuth Integration**
- Linear OAuth flow with GraphQL API
- GitLab OAuth flow with REST API
- Automatic token refresh handling
- Secure token storage in MongoDB

✅ **API Endpoints**
- `/auth/linear/url` - Get Linear OAuth URL
- `/auth/gitlab/url` - Get GitLab OAuth URL
- `/auth/linear/callback` - Handle Linear OAuth callback
- `/auth/gitlab/callback` - Handle GitLab OAuth callback
- `/api/status` - Check connection status
- `/api/linear/issues` - Fetch Linear issues
- `/api/gitlab/merge-requests` - Fetch GitLab merge requests

✅ **Database Integration**
- MongoDB with Mongoose
- Token schema with user data
- Automatic token refresh and updates

### Frontend (React + Vite)
✅ **Modern React Setup**
- React 19 with hooks
- Vite for fast development
- Tailwind CSS v4 for styling
- React Router for navigation

✅ **OAuth Flow**
- Connection cards for Linear and GitLab
- OAuth redirect handling
- Connection status tracking
- User session management

✅ **Dashboard**
- Real-time data fetching
- Linear issues display with priority and status
- GitLab merge requests with branch info
- Responsive design with loading states

✅ **API Integration**
- Centralized API service
- Error handling and loading states
- Automatic retries and token refresh

## Technology Stack

### Backend
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: OAuth 2.0 (Linear & GitLab)
- **HTTP Client**: Axios
- **Environment**: dotenv
- **Development**: Nodemon for auto-reload

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **State Management**: React hooks (useState, useEffect)

## Ports and URLs
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5666
- **MongoDB**: mongodb://localhost:27017/reviewly (configurable)

## OAuth Configuration
- **Linear Redirect**: http://localhost:5666/auth/linear/callback
- **GitLab Redirect**: http://localhost:5666/auth/gitlab/callback
