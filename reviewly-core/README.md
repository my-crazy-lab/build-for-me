# 🔧 React OAuth Integration Demo — Linear & GitLab

A full-stack application demonstrating OAuth integration with Linear and GitLab APIs. Users can connect their accounts and view their assigned issues and merge requests in a unified dashboard.

## 🎯 Features

- **OAuth Integration**: Secure authentication with Linear and GitLab
- **Dashboard**: View assigned Linear issues and GitLab merge requests
- **Real-time Data**: Fetch and display live data from both platforms
- **Responsive UI**: Modern interface built with React and Tailwind CSS
- **Token Management**: Automatic token refresh and secure storage

## 🏗️ Architecture

### Backend (Node.js + Express)
- OAuth callback handling for Linear and GitLab
- MongoDB for token storage
- GraphQL integration with Linear API
- REST API integration with GitLab API
- Automatic token refresh

### Frontend (React + Vite)
- Modern React with hooks
- Tailwind CSS v4 for styling
- React Router for navigation
- Axios for API communication
- Responsive design

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or remote)
- Linear account with OAuth app
- GitLab account with OAuth app

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd reviewly-core

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Set up OAuth Applications

#### Linear OAuth App
1. Go to https://linear.app/settings/developers
2. Create a new OAuth App with:
   - **Redirect URI**: `http://localhost:5666/auth/linear/callback`
   - **Scopes**: `read`
3. Copy the `Client ID` and `Client Secret`

#### GitLab OAuth App
1. Go to https://gitlab.com/-/profile/applications
2. Create a new Application with:
   - **Redirect URI**: `http://localhost:5666/auth/gitlab/callback`
   - **Scopes**: `read_user`, `api`
3. Copy the `Application ID` and `Secret`

### 3. Configure Environment Variables

The backend `.env` file is already configured with sample credentials. Update it with your OAuth app credentials:

```bash
# Backend environment (backend/.env)
PORT=5666
MONGO_URI=mongodb://localhost:27017/reviewly

# Update these with your OAuth app credentials
LINEAR_CLIENT_ID=your_linear_client_id
LINEAR_CLIENT_SECRET=your_linear_client_secret
LINEAR_REDIRECT_URI=http://localhost:5666/auth/linear/callback

GITLAB_CLIENT_ID=your_gitlab_client_id
GITLAB_CLIENT_SECRET=your_gitlab_client_secret
GITLAB_REDIRECT_URI=http://localhost:5666/auth/gitlab/callback

FRONTEND_URL=http://localhost:5173
```

### 4. Start the Application

```bash
# Start MongoDB (if running locally)
mongod

# Start the backend server
cd backend
npm run dev

# In a new terminal, start the frontend
cd frontend
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5666

## 📱 Usage

1. **Connect Accounts**: Click on the Linear or GitLab cards to connect your accounts
2. **OAuth Flow**: You'll be redirected to the respective platform for authorization
3. **View Dashboard**: After successful connection, access the dashboard to see your data
4. **Real-time Updates**: Data is fetched live from the APIs

## 🔧 API Endpoints

### Authentication
- `GET /auth/linear/url` - Get Linear OAuth URL
- `GET /auth/gitlab/url` - Get GitLab OAuth URL
- `GET /auth/linear/callback` - Handle Linear OAuth callback
- `GET /auth/gitlab/callback` - Handle GitLab OAuth callback

### Data
- `GET /api/status?userId={id}` - Check connection status
- `GET /api/linear/issues?userId={id}` - Get Linear issues
- `GET /api/gitlab/merge-requests?userId={id}` - Get GitLab merge requests

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server with HMR
```

### Building for Production
```bash
# Build frontend
cd frontend
npm run build

# Start backend in production mode
cd backend
npm start
```

## 🔒 Security Notes

- OAuth tokens are stored securely in MongoDB
- Automatic token refresh prevents expired tokens
- CORS is configured for frontend-backend communication
- Environment variables protect sensitive credentials

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the `MONGO_URI` in your `.env` file

2. **OAuth Redirect Mismatch**
   - Verify redirect URIs match exactly in your OAuth app settings
   - Check that ports match (5666 for backend, 5173 for frontend)

3. **CORS Issues**
   - Ensure frontend URL is correctly set in `FRONTEND_URL`
   - Check that proxy configuration in `vite.config.js` points to correct backend port

4. **Token Refresh Errors**
   - Some OAuth providers may not issue refresh tokens
   - Users may need to reconnect their accounts periodically

## 📄 License

MIT License - see LICENSE file for details
