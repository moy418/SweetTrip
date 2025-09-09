import { loadStripe } from '@stripe/stripe-js'

// Get the publishable key from environment variables
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found. Make sure VITE_STRIPE_PUBLISHABLE_KEY is set in your environment variables.')
}

// Initialize Stripe
export const stripePromise = loadStripe(stripePublishableKey || '')

// Stripe configuration
export const stripeConfig = {
  publishableKey: stripePublishableKey,
  currency: 'usd',
  country: 'US'
}

export default stripePromise