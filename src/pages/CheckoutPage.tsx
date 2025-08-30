import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Lock, Truck, Package } from 'lucide-react'
import { Elements } from '@stripe/react-stripe-js'
import { useCartStore } from '../store/cartStore'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { stripePromise, STRIPE_CONFIG } from '../lib/stripe'
import StripePaymentForm from '../components/StripePaymentForm'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })
  
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    sameAsShipping: true
  })
  


  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart')
    }
  }, [items, navigate])

  const subtotal = getTotalPrice()
  const shippingCost = subtotal >= 60 ? 0 : 5.99
  const total = subtotal - discount + shippingCost

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }

    try {
      const { data: coupons, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .maybeSingle()

      if (error) throw error

      if (!coupons) {
        toast.error('Invalid coupon code')
        return
      }

      // Check if coupon is expired
      if (coupons.expires_at && new Date(coupons.expires_at) < new Date()) {
        toast.error('Coupon has expired')
        return
      }

      // Check usage limit
      if (coupons.usage_limit && coupons.times_used >= coupons.usage_limit) {
        toast.error('Coupon usage limit exceeded')
        return
      }

      // Check minimum order amount
      if (coupons.minimum_order_amount && subtotal < coupons.minimum_order_amount) {
        toast.error(`Minimum order amount of ${formatPrice(coupons.minimum_order_amount)} required`)
        return
      }

      // Calculate discount
      let discountAmount = 0
      if (coupons.discount_type === 'percentage') {
        discountAmount = subtotal * (coupons.discount_value / 100)
      } else if (coupons.discount_type === 'fixed_amount') {
        discountAmount = Math.min(coupons.discount_value, subtotal)
      }

      setDiscount(discountAmount)
      setAppliedCoupon(couponCode.toUpperCase())
      toast.success(`Coupon applied! You saved ${formatPrice(discountAmount)}`)
    } catch (error) {
      console.error('Error applying coupon:', error)
      toast.error('Failed to apply coupon')
    }
  }

  const createPaymentIntent = async () => {
    setLoading(true)
    
    try {
      // Validate shipping information
      if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || !shippingInfo.address) {
        toast.error('Please fill in all required shipping information')
        return
      }

      // Create payment intent
      const paymentData = {
        amount: Math.round(total * 100), // Convert to cents
        currency: 'usd',
        cartItems: items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_image_url: item.product.image_urls?.[0],
          quantity: item.quantity,
          price: item.product.price
        })),
        customerInfo: {
          email: shippingInfo.email,
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          shippingAddress: shippingInfo,
          billingAddress: billingInfo.sameAsShipping ? shippingInfo : billingInfo
        },
        couponCode: appliedCoupon || null
      }

      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: paymentData
      })

      if (error) throw error

      setClientSecret(data.clientSecret)
      setOrderNumber(data.orderNumber)
      toast.success('Payment form ready!')
      
    } catch (error: any) {
      console.error('Error creating payment intent:', error)
      toast.error(error.message || 'Failed to prepare payment')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = (paymentIntentId: string) => {
    clearCart()
    toast.success('Payment successful!')
    navigate(`/order-confirmation/${orderNumber}`)
  }

  const handlePaymentError = (error: string) => {
    toast.error(error)
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-2">Complete your sweet journey</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-8">
                {/* Shipping Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Intent Setup */}
                {!clientSecret ? (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <h2 className="text-xl font-semibold text-gray-900">Payment Setup</h2>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Please complete your shipping information above, then click "Prepare Payment" to proceed with checkout.
                    </p>
                    <button
                      type="button"
                      onClick={createPaymentIntent}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Preparing...' : 'Prepare Payment'}
                    </button>
                  </div>
                ) : (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: STRIPE_CONFIG.appearance,
                      loader: STRIPE_CONFIG.loader
                    }}
                  >
                    <StripePaymentForm
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      isProcessing={paymentProcessing}
                      setIsProcessing={setPaymentProcessing}
                      orderNumber={orderNumber}
                      amount={total}
                    />
                  </Elements>
                )}

              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Package className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                </div>
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3">
                      <img
                        src={item.product.image_urls?.[0] || '/api/placeholder/60/60'}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon Code */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Coupon Code</h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-sm text-green-600 mt-2">
                    Coupon "{appliedCoupon}" applied!
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
                
                {subtotal >= 60 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      You qualify for free shipping!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}