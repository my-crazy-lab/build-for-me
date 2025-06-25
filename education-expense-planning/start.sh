#!/bin/bash

# Education Expense Dashboard Startup Script
# This script helps you start the application in development mode

echo "🎓 Education Expense Dashboard - Startup Script"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   On macOS: brew services start mongodb-community"
    echo "   On Ubuntu: sudo systemctl start mongod"
    echo "   On Windows: net start MongoDB"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Function to start backend
start_backend() {
    echo "🚀 Starting backend server..."
    cd backend
    
    # Check if .env exists
    if [ ! -f .env ]; then
        echo "📝 Creating .env file from template..."
        cp .env.example .env
        echo "⚠️  Please edit backend/.env with your configuration"
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d node_modules ]; then
        echo "📦 Installing backend dependencies..."
        npm install
    fi
    
    # Start the server
    npm run dev &
    BACKEND_PID=$!
    echo "✅ Backend server started (PID: $BACKEND_PID)"
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting frontend development server..."
    cd frontend
    
    # Check if .env exists
    if [ ! -f .env ]; then
        echo "📝 Creating .env file from template..."
        cp .env.example .env
        echo "⚠️  Please edit frontend/.env with your configuration"
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d node_modules ]; then
        echo "📦 Installing frontend dependencies..."
        npm install
    fi
    
    # Start the development server
    npm run dev &
    FRONTEND_PID=$!
    echo "✅ Frontend server started (PID: $FRONTEND_PID)"
    cd ..
}

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "✅ Backend server stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "✅ Frontend server stopped"
    fi
    echo "👋 Goodbye!"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start both servers
start_backend
sleep 3
start_frontend

echo ""
echo "🎉 Application is starting up!"
echo "📊 Backend API: http://localhost:5000"
echo "🌐 Frontend: http://localhost:3000"
echo "💡 Demo login: admin / 123456"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
wait
