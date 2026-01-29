#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Starting Holdings & Trades Chatbot Setup..."

# Function to handle errors
handle_error() {
    echo "❌ Error: $1"
    exit 1
}

# 1. Backend Setup
echo "📦 Installing Backend Dependencies..."
cd backend || handle_error "Backend directory not found"
npm install || handle_error "Backend npm install failed"
echo "✅ Backend installed."

# Start backend in background
echo "🔌 Starting Backend Server..."
npm start &
BACKEND_PID=$!
cd ..

# 2. Frontend Setup
echo "📦 Installing Frontend Dependencies..."
cd frontend || handle_error "Frontend directory not found"
npm install || handle_error "Frontend npm install failed"
echo "✅ Frontend installed."

# Start frontend
echo "💻 Starting Frontend Development Server..."
echo "------------------------------------------------"
echo "🌐 Apps are launching!"
echo "➡️  Open http://localhost:5173 (or similar) in your browser"
echo "------------------------------------------------"
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
