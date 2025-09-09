# Sweet Trip E-commerce - Linux Server Deployment Guide

Complete guide for deploying the Sweet Trip candy store e-commerce platform on a Linux server.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Server Setup](#server-setup)
- [Application Deployment](#application-deployment)
- [Database Configuration](#database-configuration)
- [Environment Configuration](#environment-configuration)
- [SSL Setup](#ssl-setup)
- [Process Management](#process-management)
- [Monitoring](#monitoring)
- [Backup Strategy](#backup-strategy)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- Ubuntu 20.04 LTS or newer (or equivalent Linux distribution)
- 2+ CPU cores
- 4GB+ RAM
- 20GB+ storage
- Root or sudo access

### Required Software
- Node.js 18+
- PostgreSQL 14+
- Nginx
- PM2 (Process Manager)
- Certbot (for SSL)

## Server Setup

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js
```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 3. Install PostgreSQL
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
```

```sql
-- In PostgreSQL console
CREATE DATABASE sweet_trip_db;
CREATE USER sweet_trip_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE sweet_trip_db TO sweet_trip_user;
\q
```

### 4. Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 5. Install PM2
```bash
sudo npm install -g pm2
```

## Application Deployment

### 1. Clone Repository
```bash
# Create application directory
sudo mkdir -p /var/www/sweet-trip
sudo chown $USER:$USER /var/www/sweet-trip

# Clone the repository
cd /var/www/sweet-trip
git clone <your-repository-url> .

# Or upload your built files
# Upload the entire sweet-trip-ecommerce folder to /var/www/sweet-trip/
```

### 2. Install Dependencies
```bash
# Install PNPM
npm install -g pnpm

# Install project dependencies
pnpm install
```

### 3. Build Application
```bash
# Build for production
pnpm run build
```

## Database Configuration

### 1. Database Schema Setup
The application uses Supabase, but for self-hosted deployment, you can set up PostgreSQL locally:

```sql
-- Connect to your database
psql -U sweet_trip_user -d sweet_trip_db -h localhost

-- Create tables (copy from the Supabase schema)
-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  category_id INTEGER,
  sku VARCHAR(100) UNIQUE,
  stock_quantity INTEGER DEFAULT 0,
  weight_grams INTEGER,
  origin_country VARCHAR(100),
  brand VARCHAR(255),
  image_urls TEXT[],
  slug VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Continue with other tables...
-- (Copy all table definitions from the Supabase setup)
```

### 2. Sample Data
```bash
# Import sample data
psql -U sweet_trip_user -d sweet_trip_db -h localhost < sample_data.sql
```

## Environment Configuration

### 1. Create Environment File
```bash
# Create .env file
cp .env.example .env
```

### 2. Configure Environment Variables
```bash
# Edit .env file
vim .env
```

```env
# Database Configuration
DATABASE_URL=postgresql://sweet_trip_user:your_secure_password@localhost:5432/sweet_trip_db

# Application Settings
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Email Configuration (for order confirmations)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASS=your_email_password

# File Upload
UPLOAD_DIR=/var/www/sweet-trip/uploads
MAX_FILE_SIZE=5242880

# Payment Configuration (Stripe)
STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# CORS Settings
CORS_ORIGIN=https://yourdomain.com
```

## SSL Setup

### 1. Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Obtain SSL Certificate
```bash
# Replace yourdomain.com with your actual domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Nginx Configuration

### 1. Create Nginx Configuration
```bash
sudo vim /etc/nginx/sites-available/sweet-trip
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL configuration (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Serve static files
    location / {
        root /var/www/sweet-trip/dist;
        try_files $uri $uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API routes (if you have a backend API)
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Handle uploads
    location /uploads {
        alias /var/www/sweet-trip/uploads;
        expires 1y;
        add_header Cache-Control "public";
    }

    # Block access to sensitive files
    location ~ /\. {
        deny all;
    }

    location ~ \.(env|json|yml|yaml)$ {
        deny all;
    }
}
```

### 2. Enable Site
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/sweet-trip /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Process Management

### 1. PM2 Configuration
Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'sweet-trip-frontend',
    script: 'serve',
    args: '-s dist -l 3000',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
```

### 2. Install serve package
```bash
npm install -g serve
```

### 3. Start Application
```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

## Monitoring

### 1. PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart sweet-trip-frontend
```

### 2. System Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# Monitor system resources
htop
```

### 3. Log Management
```bash
# Setup log rotation
sudo vim /etc/logrotate.d/sweet-trip
```

```
/var/www/sweet-trip/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}
```

## Backup Strategy

### 1. Database Backup
```bash
# Create backup script
vim /home/$USER/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/$USER/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U sweet_trip_user -h localhost sweet_trip_db > $BACKUP_DIR/sweet_trip_db_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/sweet_trip_db_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

### 2. Application Backup
```bash
# Create application backup script
vim /home/$USER/backup-app.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/$USER/backups"
APP_DIR="/var/www/sweet-trip"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/sweet_trip_app_$DATE.tar.gz -C $APP_DIR .

# Remove backups older than 7 days
find $BACKUP_DIR -name "sweet_trip_app_*.tar.gz" -mtime +7 -delete
```

### 3. Setup Cron Jobs
```bash
# Edit crontab
crontab -e

# Add backup jobs
# Daily database backup at 2 AM
0 2 * * * /home/$USER/backup-db.sh

# Weekly application backup at 3 AM on Sundays
0 3 * * 0 /home/$USER/backup-app.sh
```

## Troubleshooting

### Common Issues

#### 1. Application Won't Start
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs sweet-trip-frontend

# Check system resources
free -h
df -h
```

#### 2. Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test database connection
psql -U sweet_trip_user -d sweet_trip_db -h localhost

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

#### 3. Nginx Issues
```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

#### 4. SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew --dry-run
```

### Performance Optimization

#### 1. Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

#### 2. Application Caching
```bash
# Install Redis for caching
sudo apt install redis-server -y
sudo systemctl enable redis-server
```

#### 3. CDN Setup
Consider using a CDN like Cloudflare for static assets to improve global performance.

### Security Hardening

#### 1. Firewall Configuration
```bash
# Setup UFW firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 5432  # PostgreSQL (only if needed externally)
```

#### 2. Fail2Ban
```bash
# Install Fail2Ban
sudo apt install fail2ban -y

# Configure for Nginx
sudo vim /etc/fail2ban/jail.local
```

```ini
[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
```

#### 3. Regular Updates
```bash
# Setup automatic security updates
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Conclusion

This deployment guide provides a comprehensive setup for hosting the Sweet Trip e-commerce platform on a Linux server. The configuration includes:

- Production-ready web server setup
- Database optimization
- SSL encryption
- Process management
- Monitoring and logging
- Backup strategies
- Security hardening

For additional support or customization, refer to the main documentation or contact the development team.

---

**Note**: Replace all placeholder values (domain names, passwords, API keys) with your actual production values before deployment.