#!/bin/bash
cd /opt/apps/SweetTrip
echo "🔨 Building Sweet Trip with Stripe integration..."

# Try to build with different methods
if command -v pnpm &> /dev/null; then
    echo "Using pnpm..."
    pnpm exec vite build
elif command -v npx &> /dev/null; then
    echo "Using npx..."
    npx vite build
elif [ -f "node_modules/.bin/vite" ]; then
    echo "Using local vite..."
    ./node_modules/.bin/vite build
else
    echo "❌ No build tool found"
    exit 1
fi

echo "✅ Build completed!"
ls -la dist/


