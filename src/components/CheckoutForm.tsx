import React, { useState } from 'react'
import {
  PaymentElement,
  AddressElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { Loader2, CreditCard, MapPin, User, Mail, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

interface CheckoutFormProps {
  onPaymentSuccess: (paymentIntent: any) => void
  customerInfo: {
    email: string
    firstName: string
    lastName: string
    phone: string
  }
  setCustomerInfo: (info: any) => void
  shippingAddress: any
  setShippingAddress: (address: any) => void
  billingAddress: any
  setBillingAddress: (address: any) => void
  sameBillingAddress: boolean
  setSameBillingAddress: (same: boolean) => void
  total: number
}

export default function CheckoutForm({
  onPaymentSuccess,
  customerInfo,
  setCustomerInfo,
  shippingAddress,
  setShippingAddress,
  billingAddress,
  setBillingAddress,
  sameBillingAddress,
  setSameBillingAddress,
  total
}: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      toast.error('Payment system not ready. Please try again.')
      return
    }

    // Validate customer info
    if (!customerInfo.email || !customerInfo.firstName || !customerInfo.lastName) {
      toast.error('Please fill in all required customer information')
      setCurrentStep(1)
      return
    }

    setLoading(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required'
      })

      if (error) {
        console.error('Payment failed:', error)
        toast.error(error.message || 'Payment failed. Please try again.')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent)
        toast.success('Payment successful!')
        
        // Confirm the payment on the backend
        try {
          await fetch('https://pmqcegwfucfbwwmwumkk.supabase.co/functions/v1/stripe-payment-confirm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id
            })
          })
        } catch (confirmError) {
          console.error('Payment confirmation error:', confirmError)
          // Payment succeeded but confirmation failed - still proceed
        }
        
        onPaymentSuccess(paymentIntent)
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!customerInfo.email || !customerInfo.firstName || !customerInfo.lastName) {
        toast.error('Please fill in all required fields')
        return
      }
    }
    setCurrentStep(currentStep + 1)
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${currentStep >= step 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
              }
            `}>
              {step}
            </div>
            {step < 3 && (
              <div className={`
                w-16 h-0.5 mx-2
                ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}
              `} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Customer Information */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Customer Information</h3>
          </div>
          
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
          
          <button
            type="button"
            onClick={handleNextStep}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue to Shipping
          </button>
        </div>
      )}

      {/* Step 2: Shipping Address */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Shipping Address</h3>
          </div>
          
          <AddressElement
            options={{
              mode: 'shipping',
              autocomplete: {
                mode: 'automatic'
              }
            }}
          />
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handlePrevStep}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Payment Information</h3>
          </div>
          
          <PaymentElement
            options={{
              layout: 'tabs'
            }}
          />
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Test Card Numbers</span>
            </div>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• 4242 4242 4242 4242 (Visa)</p>
              <p>• 5555 5555 5555 4444 (Mastercard)</p>
              <p>• Use any future date and CVC</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handlePrevStep}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!stripe || loading}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Complete Payment</span>
                  <span>{formatPrice(total)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  )
}