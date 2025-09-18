#!/bin/bash

# SweetTrip Service Installation Script
echo "🍭 Installing SweetTrip Auto-Start Service..."

# Copy service file to systemd directory
echo "📋 Copying service file..."
sudo cp /opt/apps/SweetTrip/sweettrip.service /etc/systemd/system/

# Set proper permissions
echo "🔐 Setting permissions..."
sudo chmod 644 /etc/systemd/system/sweettrip.service

# Create log directory
echo "📁 Creating log directory..."
sudo mkdir -p /var/log
sudo touch /var/log/sweettrip.log
sudo touch /var/log/sweettrip-app.log
sudo chown epfs1:epfs1 /var/log/sweettrip.log
sudo chown epfs1:epfs1 /var/log/sweettrip-app.log

# Reload systemd
echo "🔄 Reloading systemd..."
sudo systemctl daemon-reload

# Enable the service
echo "✅ Enabling SweetTrip service..."
sudo systemctl enable sweettrip.service

# Start the service
echo "🚀 Starting SweetTrip service..."
sudo systemctl start sweettrip.service

# Check status
echo "📊 Checking service status..."
sudo systemctl status sweettrip.service --no-pager

echo ""
echo "🎉 Installation complete!"
echo ""
echo "Commands you can use:"
echo "  sudo systemctl start sweettrip    # Start the service"
echo "  sudo systemctl stop sweettrip     # Stop the service"
echo "  sudo systemctl restart sweettrip  # Restart the service"
echo "  sudo systemctl status sweettrip   # Check service status"
echo "  tail -f /var/log/sweettrip.log    # View logs"
echo ""
echo "The service will now start automatically on boot! 🎯"


