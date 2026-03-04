#!/bin/bash

# Smart OPD Queue System - Start All Services
# This script starts backend, AI model, and frontend

echo "=================================="
echo "Starting Smart OPD Queue System"
echo "=================================="

# Function to start backend
start_backend() {
    echo "Starting Backend Server..."
    cd backend
    npm install
    npm start &
    BACKEND_PID=$!
    echo "Backend started (PID: $BACKEND_PID)"
    sleep 3
}

# Function to start AI model
start_ai() {
    echo "Starting AI Model Server..."
    cd ../ai-model
    python -m venv venv
    source venv/Scripts/activate
    pip install -r requirements.txt
    python app.py &
    AI_PID=$!
    echo "AI Model started (PID: $AI_PID)"
    sleep 3
}

# Function to start frontend
start_frontend() {
    echo "Starting Frontend Server..."
    cd ../frontend
    npm install
    npm run dev &
    FRONTEND_PID=$!
    echo "Frontend started (PID: $FRONTEND_PID)"
    sleep 3
}

# Main execution
echo "Setting up databases..."
mysql -u root -p < database/opd_system_schema.sql

echo ""
echo "Starting services..."
start_backend
start_ai
start_frontend

echo ""
echo "=================================="
echo "All services started successfully!"
echo "=================================="
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend API: http://localhost:5000/api"
echo "📍 AI Model: http://localhost:5001/api"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for all background processes
wait $BACKEND_PID $AI_PID $FRONTEND_PID
