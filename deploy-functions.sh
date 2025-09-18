#!/bin/bash

echo "🚀 Deploying Supabase Edge Functions..."

# Deploy create-manual-order function
echo "📦 Deploying create-manual-order function..."
supabase functions deploy create-manual-order --project-ref pmqcegwfucfbwwmwumkk

# Deploy send-order-notification function  
echo "📧 Deploying send-order-notification function..."
supabase functions deploy send-order-notification --project-ref pmqcegwfucfbwwmwumkk

echo "✅ All functions deployed successfully!"
echo ""
echo "Functions available at:"
echo "  - https://pmqcegwfucfbwwmwumkk.supabase.co/functions/v1/create-manual-order"
echo "  - https://pmqcegwfucfbwwmwumkk.supabase.co/functions/v1/send-order-notification"


