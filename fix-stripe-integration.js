#!/usr/bin/env node

/**
 * Sweet Trip - Stripe Integration Fixer
 * This script automatically fixes common Stripe integration issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Sweet Trip - Stripe Integration Fixer');
console.log('========================================');

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check if file exists
function fileExists(filePath) {
    return fs.existsSync(filePath);
}

// Read environment file
function readEnvFile() {
    const envPath = '.env';
    if (!fileExists(envPath)) {
        log('❌ .env file not found', 'red');
        return null;
    }
    return fs.readFileSync(envPath, 'utf8');
}

// Fix Stripe configuration in stripe.ts
function fixStripeConfig() {
    log('🔧 Fixing Stripe configuration...', 'blue');
    
    const stripeConfigPath = 'src/lib/stripe.ts';
    if (!fileExists(stripeConfigPath)) {
        log('❌ stripe.ts not found', 'red');
        return false;
    }

    const stripeConfig = `import { loadStripe } from '@stripe/stripe-js'

// Get the publishable key from environment variables
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found. Make sure VITE_STRIPE_PUBLISHABLE_KEY is set in your environment variables.')
}

// Initialize Stripe with error handling
export const stripePromise = loadStripe(stripePublishableKey || '')

// Stripe configuration
export const stripeConfig = {
  publishableKey: stripePublishableKey,
  currency: 'usd',
  country: 'US'
}

// Validate Stripe configuration
export const validateStripeConfig = () => {
  if (!stripePublishableKey) {
    console.error('❌ Stripe publishable key is missing')
    return false
  }
  
  if (!stripePublishableKey.startsWith('pk_')) {
    console.error('❌ Invalid Stripe publishable key format')
    return false
  }
  
  console.log('✅ Stripe configuration is valid')
  return true
}

export default stripePromise`;

    fs.writeFileSync(stripeConfigPath, stripeConfig);
    log('✅ Stripe configuration fixed', 'green');
    return true;
}

// Fix CheckoutPage to handle errors better
function fixCheckoutPage() {
    log('🔧 Fixing CheckoutPage error handling...', 'blue');
    
    const checkoutPath = 'src/pages/CheckoutPage.tsx';
    if (!fileExists(checkoutPath)) {
        log('❌ CheckoutPage.tsx not found', 'red');
        return false;
    }

    let checkoutContent = fs.readFileSync(checkoutPath, 'utf8');
    
    // Add better error handling for payment intent creation
    const improvedErrorHandling = `
  const createPaymentIntent = async () => {
    try {
      setLoading(true)
      
      // Validate Stripe configuration
      if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
        throw new Error('Stripe publishable key not configured')
      }
      
      // Prepare cart items for the backend
      const cartItems = items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        product_image_url: item.product.image_urls?.[0] || null,
        origin_country: item.product.origin_country || null
      }))
      
      console.log('Creating payment intent with:', { total, cartItems })
      
      const response = await fetch('https://pmqcegwfucfbwwmwumkk.supabase.co/functions/v1/stripe-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${import.meta.env.VITE_SUPABASE_ANON_KEY}\`
        },
        body: JSON.stringify({
          amount: total,
          currency: 'usd',
          cartItems,
          customerEmail: customerInfo.email,
          shippingAddress: sameBillingAddress ? shippingAddress : shippingAddress,
          billingAddress: sameBillingAddress ? shippingAddress : billingAddress
        })
      })
      
      console.log('Payment intent response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Payment intent error response:', errorText)
        throw new Error(\`Payment intent creation failed: \${response.status} - \${errorText}\`)
      }
      
      const data = await response.json()
      console.log('Payment intent data:', data)
      
      if (data.error) {
        throw new Error(data.error.message || 'Payment intent creation failed')
      }
      
      if (!data.data || !data.data.clientSecret) {
        throw new Error('Invalid response: missing client secret')
      }
      
      setClientSecret(data.data.clientSecret)
      console.log('✅ Payment intent created successfully')
    } catch (error) {
      console.error('Error creating payment intent:', error)
      toast.error(\`Failed to initialize payment: \${error.message}\`)
      
      // Show detailed error for debugging
      if (error.message.includes('Stripe publishable key')) {
        toast.error('Please configure your Stripe publishable key in the environment variables')
      } else if (error.message.includes('401')) {
        toast.error('Authentication failed. Please check your Supabase configuration')
      } else if (error.message.includes('500')) {
        toast.error('Server error. Please check your Supabase Edge Functions configuration')
      }
    } finally {
      setLoading(false)
    }
  }`;

    // Replace the existing createPaymentIntent function
    checkoutContent = checkoutContent.replace(
      /const createPaymentIntent = async \(\) => \{[\s\S]*?\n  \}/,
      improvedErrorHandling
    );

    fs.writeFileSync(checkoutPath, checkoutContent);
    log('✅ CheckoutPage error handling improved', 'green');
    return true;
}

// Create environment validation script
function createEnvValidator() {
    log('🔧 Creating environment validator...', 'blue');
    
    const validatorScript = `#!/usr/bin/env node

/**
 * Environment Variables Validator
 * Validates that all required environment variables are set correctly
 */

const fs = require('fs');

console.log('🔍 Validating Environment Variables');
console.log('===================================');

function validateEnv() {
    const envPath = '.env';
    
    if (!fs.existsSync(envPath)) {
        console.error('❌ .env file not found');
        return false;
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    // Parse environment variables
    envContent.split('\\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            envVars[key.trim()] = valueParts.join('=').trim();
        }
    });
    
    const requiredVars = [
        'VITE_SUPABASE_URL',
        'VITE_SUPABASE_ANON_KEY',
        'VITE_STRIPE_PUBLISHABLE_KEY'
    ];
    
    let allValid = true;
    
    requiredVars.forEach(varName => {
        const value = envVars[varName];
        
        if (!value) {
            console.error(\`❌ \${varName} is missing\`);
            allValid = false;
        } else {
            // Validate specific formats
            if (varName === 'VITE_STRIPE_PUBLISHABLE_KEY') {
                if (!value.startsWith('pk_')) {
                    console.error(\`❌ \${varName} has invalid format (should start with pk_)\`);
                    allValid = false;
                } else {
                    console.log(\`✅ \${varName} is valid\`);
                }
            } else if (varName === 'VITE_SUPABASE_URL') {
                if (!value.startsWith('https://') || !value.includes('.supabase.co')) {
                    console.error(\`❌ \${varName} has invalid format\`);
                    allValid = false;
                } else {
                    console.log(\`✅ \${varName} is valid\`);
                }
            } else {
                console.log(\`✅ \${varName} is set\`);
            }
        }
    });
    
    if (allValid) {
        console.log('\\n🎉 All environment variables are valid!');
    } else {
        console.log('\\n❌ Some environment variables are invalid. Please fix them.');
    }
    
    return allValid;
}

validateEnv();`;

    fs.writeFileSync('validate-env.js', validatorScript);
    
    // Make it executable
    try {
        execSync('chmod +x validate-env.js', { stdio: 'ignore' });
    } catch (error) {
        // Ignore chmod errors on Windows
    }
    
    log('✅ Environment validator created', 'green');
    return true;
}

// Create a comprehensive test script
function createTestScript() {
    log('🔧 Creating comprehensive test script...', 'blue');
    
    const testScript = `#!/usr/bin/env node

/**
 * Comprehensive Stripe Integration Test
 * Tests all aspects of the Stripe integration
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🧪 Comprehensive Stripe Integration Test');
console.log('========================================');

// Load environment variables
function loadEnv() {
    const envPath = '.env';
    if (!fs.existsSync(envPath)) {
        console.error('❌ .env file not found');
        process.exit(1);
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            envVars[key.trim()] = valueParts.join('=').trim();
        }
    });
    
    return envVars;
}

async function testStripeConnection() {
    console.log('\\n🔍 Testing Stripe Connection...');
    
    const env = loadEnv();
    const stripeKey = env.VITE_STRIPE_PUBLISHABLE_KEY;
    
    if (!stripeKey) {
        console.error('❌ Stripe publishable key not found');
        return false;
    }
    
    if (!stripeKey.startsWith('pk_')) {
        console.error('❌ Invalid Stripe key format');
        return false;
    }
    
    console.log('✅ Stripe key format is valid');
    return true;
}

async function testSupabaseConnection() {
    console.log('\\n🔍 Testing Supabase Connection...');
    
    const env = loadEnv();
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Supabase configuration missing');
        return false;
    }
    
    try {
        const response = await fetch(\`\${supabaseUrl}/rest/v1/\`, {
            headers: {
                'apikey': supabaseKey
            }
        });
        
        if (response.ok) {
            console.log('✅ Supabase connection successful');
            return true;
        } else {
            console.error(\`❌ Supabase connection failed: \${response.status}\`);
            return false;
        }
    } catch (error) {
        console.error(\`❌ Supabase connection error: \${error.message}\`);
        return false;
    }
}

async function testPaymentIntentCreation() {
    console.log('\\n🔍 Testing Payment Intent Creation...');
    
    const env = loadEnv();
    
    try {
        const response = await fetch(\`\${env.VITE_SUPABASE_URL}/functions/v1/stripe-payment-intent\`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${env.VITE_SUPABASE_ANON_KEY}\`
            },
            body: JSON.stringify({
                amount: 10.00,
                currency: 'usd',
                cartItems: [{
                    product_id: 1,
                    product_name: 'Test Product',
                    quantity: 1,
                    price: 10.00
                }],
                customerEmail: 'test@example.com'
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.data && data.data.clientSecret) {
            console.log('✅ Payment intent creation successful');
            return true;
        } else {
            console.error(\`❌ Payment intent creation failed: \${JSON.stringify(data)}\`);
            return false;
        }
    } catch (error) {
        console.error(\`❌ Payment intent creation error: \${error.message}\`);
        return false;
    }
}

async function runAllTests() {
    const results = await Promise.all([
        testStripeConnection(),
        testSupabaseConnection(),
        testPaymentIntentCreation()
    ]);
    
    const allPassed = results.every(result => result);
    
    console.log('\\n📊 Test Results');
    console.log('===============');
    console.log(\`Stripe Connection: \${results[0] ? '✅ PASS' : '❌ FAIL'}\`);
    console.log(\`Supabase Connection: \${results[1] ? '✅ PASS' : '❌ FAIL'}\`);
    console.log(\`Payment Intent Creation: \${results[2] ? '✅ PASS' : '❌ FAIL'}\`);
    
    if (allPassed) {
        console.log('\\n🎉 All tests passed! Your Stripe integration is working correctly.');
    } else {
        console.log('\\n❌ Some tests failed. Please check the configuration.');
    }
    
    return allPassed;
}

// Run tests
runAllTests().catch(console.error);`;

    fs.writeFileSync('test-stripe-comprehensive.js', testScript);
    
    // Make it executable
    try {
        execSync('chmod +x test-stripe-comprehensive.js', { stdio: 'ignore' });
    } catch (error) {
        // Ignore chmod errors on Windows
    }
    
    log('✅ Comprehensive test script created', 'green');
    return true;
}

// Main execution
async function main() {
    try {
        log('Starting Stripe integration fixes...', 'blue');
        
        // Fix Stripe configuration
        fixStripeConfig();
        
        // Fix CheckoutPage
        fixCheckoutPage();
        
        // Create environment validator
        createEnvValidator();
        
        // Create test script
        createTestScript();
        
        log('\\n🎉 Stripe integration fixes completed!', 'green');
        log('\\nNext steps:', 'blue');
        log('1. Run: node validate-env.js (to validate environment variables)', 'yellow');
        log('2. Run: node test-stripe-comprehensive.js (to test the integration)', 'yellow');
        log('3. Start your app: npm run dev', 'yellow');
        
    } catch (error) {
        log(\`❌ Error: \${error.message}\`, 'red');
        process.exit(1);
    }
}

main();

