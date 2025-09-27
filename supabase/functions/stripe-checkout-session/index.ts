import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Stripe with secret key
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const { cartItems, successUrl, cancelUrl } = await req.json()

    // Validate required fields
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error('Cart items are required')
    }

    console.log('Creating Checkout Session with:', { cartItems, itemCount: cartItems.length })

    // Create line items for Stripe Checkout Sessions API
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product_name,
          images: item.product_image_url ? [item.product_image_url] : [],
          metadata: {
            product_id: item.product_id.toString(),
          }
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents for Stripe
      },
      quantity: item.quantity,
    }))

    // Calculate subtotal for shipping
    const subtotal = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    
    // Add shipping if needed (free shipping over $60)
    if (subtotal < 60) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            description: 'Standard shipping (Free on orders $60+)'
          },
          unit_amount: 599, // $5.99 in cents
        },
        quantity: 1,
      })
    }

    // Create Checkout Session using official Stripe API
    const sessionData: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'MX'],
      },
      billing_address_collection: 'required',
      automatic_tax: {
        enabled: false,
      },
      metadata: {
        source: 'sweet_trip_checkout'
      }
    }

    // Let Stripe collect all customer information
    const session = await stripe.checkout.sessions.create(sessionData)

    console.log('Checkout Session created:', session.id)

    // Return the session data
    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url,
        status: 'success'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ 
        error: {
          message: error.message || 'Failed to create checkout session',
          code: 'CHECKOUT_SESSION_ERROR'
        }
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
