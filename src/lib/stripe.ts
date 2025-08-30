import { loadStripe } from '@stripe/stripe-js'

// Replace with your actual Stripe publishable key
// For demo purposes, using a test key placeholder
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'

export const stripePromise = loadStripe(stripePublishableKey)

export const STRIPE_CONFIG = {
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#2563EB',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px'
    }
  },
  loader: 'auto' as const
}

export interface PaymentIntentResponse {
  clientSecret: string
  paymentIntentId: string
  orderId: number
  orderNumber: string
  amount: number
  currency: string
  status: string
}

export interface CreatePaymentIntentRequest {
  amount: number
  currency?: string
  cartItems: Array<{
    product_id: number
    product_name: string
    product_image_url?: string
    quantity: number
    price: number
  }>
  customerInfo: {
    email: string
    firstName: string
    lastName: string
    shippingAddress: any
    billingAddress: any
  }
  couponCode?: string | null
}