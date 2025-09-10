import React, { useState } from 'react'
import { CreditCard, Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { processMockPayment, validatePaymentData, MockPaymentData } from '../lib/mock-payment'
import toast from 'react-hot-toast'

interface MockPaymentFormProps {
  onPaymentSuccess: (result: any) => void
  onPaymentError: (error: string) => void
  customerInfo: {
    email: string
    firstName: string
    lastName: string
    phone: string
  }
  shippingAddress: any
  total: number
}

export default function MockPaymentForm({
  onPaymentSuccess,
  onPaymentError,
  customerInfo,
  shippingAddress,
  total
}: MockPaymentFormProps) {
  const [loading, setLoading] = useState(false)
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (loading) return

    // Validar información de la tarjeta
    if (!cardInfo.number || !cardInfo.expiry || !cardInfo.cvc || !cardInfo.name) {
      toast.error('Please fill in all card information')
      return
    }

    // Validar formato de tarjeta (básico)
    const cardNumber = cardInfo.number.replace(/\s/g, '')
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      toast.error('Please enter a valid card number')
      return
    }

    setLoading(true)

    try {
      // Preparar datos de pago
      const paymentData: MockPaymentData = {
        amount: total,
        currency: 'usd',
        customerEmail: customerInfo.email,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        cartItems: [], // Se llenará desde el contexto
        shippingAddress: shippingAddress
      }

      // Validar datos
      const validationErrors = validatePaymentData(paymentData)
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '))
      }

      // Procesar pago simulado
      const result = await processMockPayment(paymentData)
      
      toast.success('Payment successful!')
      onPaymentSuccess(result)

    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Payment failed. Please try again.')
      onPaymentError(error.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ')
    setCardInfo({ ...cardInfo, number: value })
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4)
    }
    setCardInfo({ ...cardInfo, expiry: value })
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
            <span className="text-sm font-medium text-gray-600">Total Amount</span>
            <span className="text-lg font-bold text-blue-600">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Mock Payment Notice */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Demo Payment System</span>
          </div>
          <p className="text-xs text-yellow-700">
            This is a mock payment system for demonstration. No real charges will be made.
            Use any card number, expiry date, and CVC to test the checkout flow.
          </p>
        </div>
        
        {/* Card Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number *
            </label>
            <input
              type="text"
              value={cardInfo.number}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date *
              </label>
              <input
                type="text"
                value={cardInfo.expiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVC *
              </label>
              <input
                type="text"
                value={cardInfo.cvc}
                onChange={(e) => setCardInfo({ ...cardInfo, cvc: e.target.value.replace(/\D/g, '').substring(0, 4) })}
                placeholder="123"
                maxLength={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name *
            </label>
            <input
              type="text"
              value={cardInfo.name}
              onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing Payment...</span>
            </div>
          ) : (
            `Pay ${formatPrice(total)}`
          )}
        </button>
        
        {/* Security Notice */}
        <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Lock className="h-4 w-4" />
          <span>Secure demo payment system</span>
        </div>
      </div>
    </form>
  )
}
