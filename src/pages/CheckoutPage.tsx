import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Lock, CreditCard, ArrowLeft, Loader2 } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import MockPaymentForm from '../components/MockPaymentForm'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [orderCreated, setOrderCreated] = useState(false)
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
  }, [items])

  const createOrder = async () => {
    try {
      setLoading(true)
      
      // Generate unique order number
      const orderNumber = 'ST-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase()
      
      // Prepare order data
      const orderData = {
        user_id: user?.id || null,
        order_number: orderNumber,
        status: 'pending',
        total_amount: total,
        currency: 'usd',
        shipping_cost: shippingCost,
        shipping_address: shippingAddress,
        billing_address: sameBillingAddress ? shippingAddress : billingAddress,
        customer_email: customerInfo.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single()
      
      if (orderError) {
        throw new Error(`Failed to create order: ${orderError.message}`)
      }
      
      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price_at_time: item.product.price,
        product_name: item.product.name,
        product_image_url: item.product.image_urls?.[0] || null,
        country_code: item.product.origin_country || null,
        created_at: new Date().toISOString()
      }))
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
      
      if (itemsError) {
        console.error('Failed to create order items:', itemsError)
        // Don't fail the entire operation for this
      }
      
      setOrderCreated(true)
      toast.success('Order created successfully!')
      
    } catch (error: any) {
      console.error('Error creating order:', error)
      toast.error(error.message || 'Failed to create order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = (paymentResult: any) => {
    // Clear cart and redirect to success page
    clearCart()
    navigate(`/checkout/success?order=${paymentResult.orderNumber}&payment=${paymentResult.paymentId}`)
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    toast.error(error)
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

                {!orderCreated ? (
                  <div className="space-y-6">
                    {/* Customer Information Form */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Customer Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={customerInfo.firstName}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="John"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={customerInfo.lastName}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="john@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Shipping Address</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 1 *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.line1}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="123 Main St"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.line2}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, line2: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Apt 4B"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            required
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="New York"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            required
                            value={shippingAddress.state}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="NY"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            required
                            value={shippingAddress.postal_code}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, postal_code: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="10001"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Create Order Button */}
                    <button
                      onClick={createOrder}
                      disabled={loading || !customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postal_code}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Creating Order...</span>
                        </>
                      ) : (
                        <span>Continue to Payment</span>
                      )}
                    </button>
                  </div>
                ) : (
                  <MockPaymentForm
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    customerInfo={customerInfo}
                    shippingAddress={shippingAddress}
                    total={total}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}