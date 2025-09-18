import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Lock, CreditCard, ArrowLeft, Loader2 } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useAuth } from '../contexts/AuthContext'
import ManualPaymentForm from '../components/ManualPaymentForm'
import { sendOrderConfirmationEmail } from '../lib/emailService'
import toast from 'react-hot-toast'
import { buildOrderWebhookPayload, sendOrderWebhookToZapier } from '../lib/orderProcessor'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [orderProcessing, setOrderProcessing] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    phone: ''
  })
  const [shippingAddress, setShippingAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US'
  })

  const subtotal = getTotalPrice()
  const shippingCost = subtotal >= 60 ? 0 : 5.99
  const total = subtotal + shippingCost

  useEffect(() => {
    if (items.length === 0 && !window.location.pathname.includes('success')) {
      navigate('/cart')
      return
    }
    
    // Update email if user is logged in
    if (user?.email) {
      setCustomerInfo(prev => ({ ...prev, email: user.email || '' }))
    }
  }, [items, user])


  const handleManualPayment = async (paymentMethod: string, paymentDetails: any) => {
    // Prevent duplicate orders
    if (orderProcessing) {
      console.log('Order already processing, ignoring duplicate request')
      return
    }

    try {
      setOrderProcessing(true)
      
      // Create order directly without Stripe
      const orderNumber = `ST-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
      
      // Prepare cart items for the backend
      const cartItems = items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        product_image_url: item.product.image_urls?.[0] || null,
        origin_country: item.product.origin_country || null
      }))

      // Calculate correct total based on delivery method
      const finalShippingCost = paymentDetails.deliveryMethod === 'pickup' ? 0 : shippingCost
      const finalTotal = subtotal + finalShippingCost

      // Create order in Supabase - using only existing columns
      const orderData = {
        user_id: user?.id || null,
        order_number: orderNumber,
        status: 'pending',
        total_amount: finalTotal,
        currency: 'usd',
        shipping_cost: finalShippingCost,
        shipping_address: paymentDetails.deliveryMethod === 'shipping' ? JSON.stringify(paymentDetails.shippingAddress) : null,
        customer_email: paymentDetails.customerInfo?.email || user?.email || 'guest@sweettripcandy.com',
        customer_first_name: paymentDetails.customerInfo?.firstName || '',
        customer_last_name: paymentDetails.customerInfo?.lastName || '',
        customer_phone: paymentDetails.customerInfo?.phone || '',
        payment_method: paymentMethod,
        payment_reference: paymentDetails.reference || null,
        payment_notes: paymentDetails.notes || null,
        delivery_method: paymentDetails.deliveryMethod || 'shipping'
      }

      console.log('Creating manual payment order:', orderData)
      console.log('Payment details received:', paymentDetails)

      const response = await fetch('https://pmqcegwfucfbwwmwumkk.supabase.co/rest/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_SERVICE_KEY}`,
          'apikey': `${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(orderData)
      })

      console.log('Order creation response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Failed to create order:', errorText)
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      const orderResult = await response.json()
      console.log('Order creation result:', orderResult)
      
      if (!orderResult || !Array.isArray(orderResult) || orderResult.length === 0) {
        throw new Error('Invalid order response from server')
      }

      const orderId = orderResult[0].id
      console.log('Order created successfully:', orderId)

      // Create order items
      const orderItemsData = cartItems.map(item => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_time: item.price,
        product_name: item.product_name,
        product_image_url: item.product_image_url,
        country_code: item.origin_country || null
      }))

      const itemsResponse = await fetch('https://pmqcegwfucfbwwmwumkk.supabase.co/rest/v1/order_items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_SERVICE_KEY}`,
          'apikey': `${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(orderItemsData)
      })

      if (!itemsResponse.ok) {
        console.error('Failed to create order items, but continuing...')
      } else {
        console.log('Order items created successfully')
      }
      
      // Save full order details to local storage for success page
      const fullOrderForSuccessPage = {
        ...orderData,
        items: cartItems
      }
      localStorage.setItem(`order_${orderNumber}`, JSON.stringify(fullOrderForSuccessPage))

      // ✅ SEND STRUCTURED WEBHOOK TO ZAPIER (centralized module)
      try {
        const webhookPayload = buildOrderWebhookPayload(
          orderData,
          cartItems,
          paymentDetails.customerInfo,
          paymentDetails
        )
        await sendOrderWebhookToZapier(webhookPayload)
        console.log('✅ Webhook sent to Zapier successfully for customer')

        // Send a separate one for admin if needed
        const adminWebhookPayload = buildOrderWebhookPayload(
          orderData,
          cartItems,
          paymentDetails.customerInfo,
          paymentDetails,
          true // isAdminNotification = true
        )
        await sendOrderWebhookToZapier(adminWebhookPayload)
        console.log('✅ Webhook sent to Zapier successfully for admin')

      } catch (webhookError) {
        console.error('❌ Error sending webhook to Zapier:', webhookError)
      }
      
      // Clear cart and redirect
      clearCart()
      navigate(`/checkout/success?order_number=${orderNumber}&payment_method=${paymentMethod}`)
      
    } catch (error) {
      console.error('Error submitting manual payment:', error)
      toast.error('Error al crear la orden. Por favor intenta de nuevo.')
    } finally {
      setOrderProcessing(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Link
              to="/cart"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Cart</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">Secure Checkout</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-4">
                      <img
                        src={item.product.image_urls?.[0] || '/candy-fallback.jpg'}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                  </div>
                  {shippingCost > 0 && (
                    <p className="text-sm text-gray-500">Free shipping on orders over $60</p>
                  )}
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Payment Information</h2>
                </div>

                {!user && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-medium mb-4 text-blue-900">Guest Checkout</h3>
                    <p className="text-blue-800 text-sm">
                      You're checking out as a guest. Please fill out all required information in the form below.
                    </p>
                  </div>
                )}
                
                <ManualPaymentForm
                  onPaymentSubmitted={handleManualPayment}
                  isProcessing={orderProcessing}
                  customerInfo={customerInfo}
                  setCustomerInfo={setCustomerInfo}
                  shippingAddress={shippingAddress}
                  setShippingAddress={setShippingAddress}
                  isGuestCheckout={!user}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}