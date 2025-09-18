#!/bin/bash

# SweetTrip Auto-Start Script
# This script will automatically start the SweetTrip application

# Set the project directory
PROJECT_DIR="/opt/apps/SweetTrip"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> /var/log/sweettrip.log
}

# Change to project directory
cd "$PROJECT_DIR" || {
    log_message "ERROR: Cannot change to project directory $PROJECT_DIR"
    exit 1
}

log_message "Starting SweetTrip application..."

# Kill any existing processes on port 4001
log_message "Checking for existing processes on port 4001..."
if lsof -Pi :4001 -sTCP:LISTEN -t >/dev/null ; then
    log_message "Killing existing processes on port 4001..."
    pkill -f "vite.*4001" || true
    sleep 2
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    log_message "Installing dependencies..."
    npm install
fi

# Start the application
log_message "Starting Vite development server..."
nohup npm run dev > /var/log/sweettrip-app.log 2>&1 &

# Wait a moment for the server to start
sleep 5

# Check if the server is running
if curl -s http://localhost:4001 > /dev/null; then
    log_message "SweetTrip started successfully on http://localhost:4001"
    echo "✅ SweetTrip is now running on http://localhost:4001"
else
    log_message "ERROR: Failed to start SweetTrip"
    echo "❌ Failed to start SweetTrip. Check logs at /var/log/sweettrip.log"
    exit 1
fi


