#!/bin/bash

echo "🔧 Installing Supabase CLI..."

# Download and install Supabase CLI
wget -qO- https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar -xz

# Move to a directory in PATH
sudo mv supabase /usr/local/bin/

# Verify installation
echo "✅ Supabase CLI installed successfully!"
supabase --version

echo ""
echo "🚀 Now deploying functions..."

# Login to Supabase (using the service role key)
export SUPABASE_ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtcWNlZ3dmdWNmYnd3bXd1bWtrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzM1Nzc3MywiZXhwIjoyMDcyOTMzNzczfQ.pot5CZbduD_utBRXA8VkjHp-q_QlvHDl0tPMN5RHNAI"

# Deploy functions
echo "📦 Deploying create-manual-order function..."
supabase functions deploy create-manual-order --project-ref pmqcegwfucfbwwmwumkk

echo "📧 Deploying send-order-notification function..."
supabase functions deploy send-order-notification --project-ref pmqcegwfucfbwwmwumkk

echo "✅ All functions deployed successfully!"


