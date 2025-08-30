import React, { useState } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { Lock, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'

interface StripePaymentFormProps {
  onPaymentSuccess: (paymentIntentId: string) => void
  onPaymentError: (error: string) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
  orderNumber: string
  amount: number
}

export default function StripePaymentForm({
  onPaymentSuccess,
  onPaymentError,
  isProcessing,
  setIsProcessing,
  orderNumber,
  amount
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [message, setMessage] = useState<string | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded
      return
    }

    setIsProcessing(true)
    setMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?order=${orderNumber}`,
      },
      redirect: 'if_required'
    })

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'An unexpected error occurred.')
        onPaymentError(error.message || 'Payment failed')
      } else {
        setMessage('An unexpected error occurred.')
        onPaymentError('An unexpected error occurred')
      }
      setIsProcessing(false)
    } else {
      // Payment succeeded
      onPaymentSuccess('payment_succeeded')
      toast.success('Payment successful!')
    }
  }

  const paymentElementOptions = {
    layout: 'tabs' as const
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-6">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
          <Lock className="h-4 w-4 text-gray-400" />
        </div>
        
        {/* Order Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Order #{orderNumber}</span>
            <span className="text-lg font-bold text-blue-600">{formatPrice(amount)}</span>
          </div>
        </div>
        
        {/* Payment Element */}
        <div className="mb-6">
          <PaymentElement 
            options={paymentElementOptions}
            className="stripe-payment-element"
          />
        </div>
        
        {/* Error Message */}
        {message && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{message}</p>
          </div>
        )}
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              <span>Processing Payment...</span>
            </div>
          ) : (
            `Pay ${formatPrice(amount)}`
          )}
        </button>
        
        {/* Security Notice */}
        <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Lock className="h-4 w-4" />
          <span>Secure payment powered by Stripe</span>
        </div>
      </div>
    </form>
  )
}