import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, Package, Receipt, ArrowRight, Home } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface OrderDetails {
  id: string
  total_amount: number
  status: string
  created_at: string
  items: any[]
  order_items?: any[]
}

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  
  const paymentIntentId = searchParams.get('payment_intent')

  useEffect(() => {
    if (paymentIntentId) {
      fetchOrderDetails()
    } else {
      setLoading(false)
    }
  }, [paymentIntentId])

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          order_items (
            id,
            quantity,
            price,
            products (
              name,
              image_urls
            )
          )
        `)
        .eq('stripe_payment_intent_id', paymentIntentId)
        .single()

      if (error) {
        console.error('Error fetching order:', error)
      } else if (data) {
        setOrderDetails(data as any)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-lg text-gray-600">Thank you for your order. We'll get started on it right away.</p>
          </div>

          {/* Order Confirmation */}
          {orderDetails ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Order #{orderDetails.id}</h2>
                  <p className="text-gray-600">{formatDate(orderDetails.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(orderDetails.total_amount)}</p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {orderDetails.status}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {orderDetails.order_items && orderDetails.order_items.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Items Ordered</h3>
                  <div className="space-y-4">
                    {orderDetails.order_items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={item.products?.image_urls?.[0] || '/candy-fallback.jpg'}
                          alt={item.products?.name || 'Product'}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.products?.name || 'Product'}</h4>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6 text-center">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Confirmation</h2>
              <p className="text-gray-600 mb-4">Your payment was processed successfully. You should receive an email confirmation shortly.</p>
              {paymentIntentId && (
                <p className="text-sm text-gray-500">Payment ID: {paymentIntentId}</p>
              )}
            </div>
          )}

          {/* What's Next */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Package className="h-6 w-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">What happens next?</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>We'll prepare your Sweet Trip treats with care</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>You'll receive tracking information via email</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Enjoy your international snacks and treats!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center space-x-2 bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Support */}
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>Need help with your order? <Link to="/contact" className="text-blue-600 hover:text-blue-700">Contact us</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
