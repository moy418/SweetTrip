#!/bin/bash

# Sweet Trip - Stripe Configuration Script
# This script will help you configure Stripe payments automatically

echo "🚀 Sweet Trip - Stripe Configuration Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if required tools are installed
echo -e "${BLUE}Checking dependencies...${NC}"
if ! command_exists curl; then
    echo -e "${RED}Error: curl is not installed${NC}"
    exit 1
fi

if ! command_exists jq; then
    echo -e "${YELLOW}Warning: jq is not installed. Installing...${NC}"
    if command_exists apt-get; then
        sudo apt-get update && sudo apt-get install -y jq
    elif command_exists yum; then
        sudo yum install -y jq
    elif command_exists brew; then
        brew install jq
    else
        echo -e "${RED}Please install jq manually${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ Dependencies checked${NC}"

# Create backup of current .env
if [ -f .env ]; then
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo -e "${GREEN}✓ Backup created: .env.backup.$(date +%Y%m%d_%H%M%S)${NC}"
fi

# Function to validate Stripe key
validate_stripe_key() {
    local key=$1
    if [[ $key == pk_test_* ]] || [[ $key == pk_live_* ]]; then
        return 0
    else
        return 1
    fi
}

# Function to validate Supabase URL
validate_supabase_url() {
    local url=$1
    if [[ $url == https://*.supabase.co ]]; then
        return 0
    else
        return 1
    fi
}

echo -e "${BLUE}Configuration Setup${NC}"
echo "===================="

# Get Stripe Publishable Key
while true; do
    echo -e "${YELLOW}Enter your Stripe Publishable Key (pk_test_... or pk_live_...):${NC}"
    read -r STRIPE_PUBLISHABLE_KEY
    
    if validate_stripe_key "$STRIPE_PUBLISHABLE_KEY"; then
        echo -e "${GREEN}✓ Valid Stripe key format${NC}"
        break
    else
        echo -e "${RED}✗ Invalid Stripe key format. Please enter a valid publishable key.${NC}"
    fi
done

# Get Stripe Secret Key
while true; do
    echo -e "${YELLOW}Enter your Stripe Secret Key (sk_test_... or sk_live_...):${NC}"
    read -r STRIPE_SECRET_KEY
    
    if [[ $STRIPE_SECRET_KEY == sk_test_* ]] || [[ $STRIPE_SECRET_KEY == sk_live_* ]]; then
        echo -e "${GREEN}✓ Valid Stripe secret key format${NC}"
        break
    else
        echo -e "${RED}✗ Invalid Stripe secret key format. Please enter a valid secret key.${NC}"
    fi
done

# Get Supabase URL
while true; do
    echo -e "${YELLOW}Enter your Supabase URL (https://your-project.supabase.co):${NC}"
    read -r SUPABASE_URL
    
    if validate_supabase_url "$SUPABASE_URL"; then
        echo -e "${GREEN}✓ Valid Supabase URL format${NC}"
        break
    else
        echo -e "${RED}✗ Invalid Supabase URL format. Please enter a valid URL.${NC}"
    fi
done

# Get Supabase Anon Key
echo -e "${YELLOW}Enter your Supabase Anon Key:${NC}"
read -r SUPABASE_ANON_KEY

# Get Supabase Service Role Key
echo -e "${YELLOW}Enter your Supabase Service Role Key:${NC}"
read -r SUPABASE_SERVICE_ROLE_KEY

# Create .env file
echo -e "${BLUE}Creating .env file...${NC}"
cat > .env << EOF
# Sweet Trip E-commerce Environment Variables
# Generated on $(date)

# Supabase Configuration
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY

# Application Configuration
VITE_APP_URL=http://localhost:5173
EOF

echo -e "${GREEN}✓ .env file created${NC}"

# Create .env.local for Next.js compatibility
cp .env .env.local
echo -e "${GREEN}✓ .env.local file created${NC}"

# Test Stripe connection
echo -e "${BLUE}Testing Stripe connection...${NC}"
STRIPE_TEST_RESPONSE=$(curl -s -u "$STRIPE_SECRET_KEY:" https://api.stripe.com/v1/charges?limit=1)
if echo "$STRIPE_TEST_RESPONSE" | jq -e '.data' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Stripe connection successful${NC}"
else
    echo -e "${RED}✗ Stripe connection failed. Please check your secret key.${NC}"
    echo "Response: $STRIPE_TEST_RESPONSE"
fi

# Test Supabase connection
echo -e "${BLUE}Testing Supabase connection...${NC}"
SUPABASE_TEST_RESPONSE=$(curl -s -H "apikey: $SUPABASE_ANON_KEY" "$SUPABASE_URL/rest/v1/")
if echo "$SUPABASE_TEST_RESPONSE" | grep -q "swagger"; then
    echo -e "${GREEN}✓ Supabase connection successful${NC}"
else
    echo -e "${RED}✗ Supabase connection failed. Please check your URL and keys.${NC}"
fi

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
if command_exists pnpm; then
    pnpm install
elif command_exists npm; then
    npm install
else
    echo -e "${RED}No package manager found. Please install pnpm or npm.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Dependencies installed${NC}"

# Create Supabase secrets configuration script
cat > configure-supabase-secrets.sh << 'EOF'
#!/bin/bash

# Supabase Edge Functions Secrets Configuration
# Run this script to configure secrets in your Supabase project

echo "🔧 Configuring Supabase Edge Functions Secrets"
echo "=============================================="

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Installing Supabase CLI..."
    if command -v npm &> /dev/null; then
        npm install -g supabase
    else
        echo "Please install Supabase CLI manually: https://supabase.com/docs/guides/cli"
        exit 1
    fi
fi

# Load environment variables
source .env

echo "Setting up secrets for Supabase Edge Functions..."

# Set Stripe secret key
supabase secrets set STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY"

# Set Supabase service role key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

# Set Supabase URL
supabase secrets set SUPABASE_URL="$SUPABASE_URL"

echo "✅ Secrets configured successfully!"
echo ""
echo "Next steps:"
echo "1. Deploy your Edge Functions: supabase functions deploy"
echo "2. Start your development server: npm run dev"
echo "3. Test the payment flow in your application"
EOF

chmod +x configure-supabase-secrets.sh

echo -e "${GREEN}✓ Supabase secrets configuration script created${NC}"

# Create test script
cat > test-stripe-integration.sh << 'EOF'
#!/bin/bash

# Test Stripe Integration
echo "🧪 Testing Stripe Integration"
echo "============================="

# Load environment variables
source .env

# Test payment intent creation
echo "Testing payment intent creation..."
RESPONSE=$(curl -s -X POST "$VITE_SUPABASE_URL/functions/v1/stripe-payment-intent" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
  -d '{
    "amount": 10.00,
    "currency": "usd",
    "cartItems": [
      {
        "product_id": 1,
        "product_name": "Test Product",
        "quantity": 1,
        "price": 10.00
      }
    ],
    "customerEmail": "test@example.com"
  }')

if echo "$RESPONSE" | jq -e '.data.clientSecret' > /dev/null 2>&1; then
    echo "✅ Payment intent creation successful!"
    echo "Client Secret: $(echo "$RESPONSE" | jq -r '.data.clientSecret')"
else
    echo "❌ Payment intent creation failed:"
    echo "$RESPONSE" | jq .
fi
EOF

chmod +x test-stripe-integration.sh

echo -e "${GREEN}✓ Test script created${NC}"

echo ""
echo -e "${GREEN}🎉 Configuration Complete!${NC}"
echo "================================"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Run: ${YELLOW}./configure-supabase-secrets.sh${NC} (to configure Supabase secrets)"
echo "2. Run: ${YELLOW}./test-stripe-integration.sh${NC} (to test the integration)"
echo "3. Start your app: ${YELLOW}npm run dev${NC}"
echo ""
echo -e "${BLUE}Test Cards:${NC}"
echo "• 4242 4242 4242 4242 (Visa)"
echo "• 5555 5555 5555 4444 (Mastercard)"
echo "• Use any future date and CVC"
echo ""
echo -e "${GREEN}Your Stripe integration is ready! 🚀${NC}"

