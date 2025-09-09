import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Lock, CreditCard, ArrowLeft, Loader2 } from 'lucide-react'
import { Elements } from '@stripe/react-stripe-js'
import { useCartStore } from '../store/cartStore'
import { useAuth } from '../contexts/AuthContext'
import { stripePromise } from '../lib/stripe'
import CheckoutForm from '../components/CheckoutForm'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [clientSecret, setClientSecret] = useState<string>('')
  const [loading, setLoading] = useState(false)
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
  const [billingAddress, setBillingAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US'
  })
  const [sameBillingAddress, setSameBillingAddress] = useState(true)
  
  const subtotal = getTotalPrice()
  const shippingCost = subtotal >= 60 ? 0 : 5.99
  const total = subtotal + shippingCost

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart')
      return
    }
    createPaymentIntent()
  }, [items, total])

  const createPaymentIntent = async () => {
    try {
      setLoading(true)
      
      // Prepare cart items for the backend
      const cartItems = items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        product_image_url: item.product.image_urls?.[0] || null,
        origin_country: item.product.origin_country || null
      }))
      
      const response = await fetch('https://pmqcegwfucfbwwmwumkk.supabase.co/functions/v1/stripe-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error.message)
      }
      
      setClientSecret(data.data.clientSecret)
    } catch (error) {
      console.error('Error creating payment intent:', error)
      toast.error('Failed to initialize payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = (paymentIntent: any) => {
    // Clear cart and redirect to success page
    clearCart()
    navigate(`/checkout/success?payment_intent=${paymentIntent.id}`)
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

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Setting up secure payment...</span>
                  </div>
                ) : clientSecret && stripePromise ? (
                  <Elements 
                    stripe={stripePromise} 
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#2563eb',
                          colorBackground: '#ffffff',
                          colorText: '#1f2937',
                          colorDanger: '#dc2626',
                          fontFamily: 'system-ui, sans-serif',
                          spacingUnit: '4px',
                          borderRadius: '8px'
                        }
                      }
                    }}
                  >
                    <CheckoutForm
                      onPaymentSuccess={handlePaymentSuccess}
                      customerInfo={customerInfo}
                      setCustomerInfo={setCustomerInfo}
                      shippingAddress={shippingAddress}
                      setShippingAddress={setShippingAddress}
                      billingAddress={billingAddress}
                      setBillingAddress={setBillingAddress}
                      sameBillingAddress={sameBillingAddress}
                      setSameBillingAddress={setSameBillingAddress}
                      total={total}
                    />
                  </Elements>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Unable to load payment form. Please refresh the page.</p>
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