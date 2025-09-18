import React, { useState } from 'react'
import { CreditCard, Smartphone, Zap, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import AddressAutocomplete from './AddressAutocomplete'

interface ManualPaymentFormProps {
  onPaymentSubmitted: (paymentMethod: string, paymentDetails: any) => void
  orderNumber: string
  amount: number
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
  customerInfo?: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  setCustomerInfo?: (info: any) => void
  shippingAddress?: any
  setShippingAddress?: (address: any) => void
  isGuestCheckout?: boolean
}

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  instructions: string[]
  color: string
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'zelle',
    name: 'Zelle',
    icon: <Zap className="h-6 w-6" />,
    description: 'Transferencia instantánea',
    instructions: [
      'Envía el pago a: payments@swetttripcandy.com',
      'Incluye el número de orden en la descripción',
      'El pago se procesará en 5-10 minutos'
    ],
    color: 'bg-purple-50 border-purple-200 text-purple-700'
  },
  {
    id: 'cashapp',
    name: 'Cash App',
    icon: <DollarSign className="h-6 w-6" />,
    description: 'Pago rápido y seguro',
    instructions: [
      'Envía a: $SweetTripCandy',
      'Menciona el número de orden',
      'Recibirás confirmación inmediata'
    ],
    color: 'bg-green-50 border-green-200 text-green-700'
  },
  {
    id: 'applepay',
    name: 'Apple Pay',
    icon: <Smartphone className="h-6 w-6" />,
    description: 'Pago con tu iPhone',
    instructions: [
      'Usa Apple Pay para enviar a: payments@swetttripcandy.com',
      'Añade el número de orden como memo',
      'Envíanos captura de pantalla del pago'
    ],
    color: 'bg-gray-50 border-gray-200 text-gray-700'
  },
]

export default function ManualPaymentForm({
  onPaymentSubmitted,
  orderNumber,
  amount,
  isProcessing,
  setIsProcessing,
  customerInfo,
  setCustomerInfo,
  shippingAddress,
  setShippingAddress,
  isGuestCheckout = false
}: ManualPaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [paymentReference, setPaymentReference] = useState<string>('')
  const [customerNotes, setCustomerNotes] = useState<string>('')
  const [deliveryMethod, setDeliveryMethod] = useState<'shipping' | 'pickup'>('shipping')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    // Validate customer information (always required)
    if (customerInfo) {
      if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone) {
        toast.error('Por favor completa toda la información del cliente (nombre, apellido, email y teléfono)')
        return
      }
    } else {
      toast.error('Información del cliente requerida')
      return
    }
      
    // Only validate shipping address if shipping is selected
    if (deliveryMethod === 'shipping' && shippingAddress && (!shippingAddress.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postal_code)) {
      toast.error('Por favor completa toda la dirección de envío')
      return
    }

    if (!selectedMethod) {
      toast.error('Por favor selecciona un método de pago')
      return
    }

    if (!paymentReference.trim()) {
      toast.error('Por favor proporciona una referencia del pago (número de transacción, captura de pantalla, etc.)')
      return
    }

    setIsProcessing(true)

    try {
      // Simular envío del pago
      await new Promise(resolve => setTimeout(resolve, 1000))

      const paymentData = {
        method: selectedMethod,
        reference: paymentReference,
        notes: customerNotes,
        deliveryMethod: deliveryMethod,
        customerInfo: isGuestCheckout ? customerInfo : undefined,
        shippingAddress: deliveryMethod === 'shipping' ? shippingAddress : undefined,
        timestamp: new Date().toISOString(),
        status: 'pending_verification'
      }

      onPaymentSubmitted(selectedMethod, paymentData)
      toast.success('¡Información de pago enviada! Revisaremos tu pago en breve.')
      
    } catch (error) {
      console.error('Error submitting payment:', error)
      toast.error('Error al enviar la información de pago. Inténtalo de nuevo.')
    } finally {
      setIsProcessing(false)
    }
  }

  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod)

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-6">
        <CreditCard className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Información de Pago</h2>
      </div>
      
      {/* Order Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Orden #{orderNumber}</span>
          <span className="text-lg font-bold text-blue-600">{formatPrice(amount)}</span>
        </div>
      </div>

      {/* Stripe Coming Soon Notice */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-blue-800">Pagos con Tarjeta - Próximamente</span>
        </div>
        <p className="text-sm text-blue-700">
          Estamos trabajando en integrar pagos con tarjeta de crédito. Mientras tanto, puedes pagar usando cualquiera de los métodos abajo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information - Always show */}
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Información del Cliente</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={customerInfo?.firstName || ''}
                  onChange={(e) => {
                    if (customerInfo && setCustomerInfo) {
                      setCustomerInfo({ ...customerInfo, firstName: e.target.value })
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={customerInfo?.lastName || ''}
                  onChange={(e) => {
                    if (customerInfo && setCustomerInfo) {
                      setCustomerInfo({ ...customerInfo, lastName: e.target.value })
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tu apellido"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={customerInfo?.email || ''}
                  onChange={(e) => {
                    if (customerInfo && setCustomerInfo) {
                      setCustomerInfo({ ...customerInfo, email: e.target.value })
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  required
                  value={customerInfo?.phone || ''}
                  onChange={(e) => {
                    if (customerInfo && setCustomerInfo) {
                      setCustomerInfo({ ...customerInfo, phone: e.target.value })
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

        {/* Delivery Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Método de Entrega</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                deliveryMethod === 'shipping' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setDeliveryMethod('shipping')}
            >
              <div className="flex items-center space-x-3">
                <div className="text-current">
                  📦
                </div>
                <div>
                  <h4 className="font-medium">Envío a Domicilio</h4>
                  <p className="text-sm opacity-75">Recibe en tu dirección</p>
                  <p className="text-sm font-medium mt-1">$5.99 (Gratis en órdenes +$60)</p>
                </div>
              </div>
            </div>
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                deliveryMethod === 'pickup' 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setDeliveryMethod('pickup')}
            >
              <div className="flex items-center space-x-3">
                <div className="text-current">
                  🏪
                </div>
                <div>
                  <h4 className="font-medium">Recoger en Tienda</h4>
                  <p className="text-sm opacity-75">402 S El Paso St</p>
                  <p className="text-sm font-medium mt-1 text-green-600">GRATIS</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address - only if shipping selected */}
        {deliveryMethod === 'shipping' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Dirección de Envío</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección * (Empieza a escribir para autocompletar)
                </label>
                <AddressAutocomplete
                  value={shippingAddress?.line1 || ''}
                  onChange={(value) => {
                    if (shippingAddress && setShippingAddress) {
                      setShippingAddress({ ...shippingAddress, line1: value })
                    }
                  }}
                  onAddressSelect={(address) => {
                    if (setShippingAddress) {
                      setShippingAddress({
                        line1: address.line1,
                        line2: '',
                        city: address.city,
                        state: address.state,
                        postal_code: address.postal_code,
                        country: address.country
                      })
                    }
                  }}
                  placeholder="123 Main Street, El Paso, TX"
                  required
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    required
                  value={shippingAddress?.city || ''}
                  onChange={(e) => {
                    if (shippingAddress && setShippingAddress) {
                      setShippingAddress({ ...shippingAddress, city: e.target.value })
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <input
                    type="text"
                    required
                  value={shippingAddress?.state || ''}
                  onChange={(e) => {
                    if (shippingAddress && setShippingAddress) {
                      setShippingAddress({ ...shippingAddress, state: e.target.value })
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    required
                  value={shippingAddress?.postal_code || ''}
                  onChange={(e) => {
                    if (shippingAddress && setShippingAddress) {
                      setShippingAddress({ ...shippingAddress, postal_code: e.target.value })
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10001"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Selecciona tu método de pago preferido *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`
                  p-4 border-2 rounded-lg cursor-pointer transition-all
                  ${selectedMethod === method.id 
                    ? `${method.color} border-current ring-2 ring-current ring-opacity-50` 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={selectedMethod === method.id ? 'text-current' : 'text-gray-500'}>
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{method.name}</h3>
                    <p className="text-sm opacity-75">{method.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Instructions */}
        {selectedPaymentMethod && (
          <div className={`p-4 rounded-lg border ${selectedPaymentMethod.color}`}>
            <h4 className="font-semibold mb-2">Instrucciones para {selectedPaymentMethod.name}:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              {selectedPaymentMethod.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Payment Reference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Referencia del Pago *
          </label>
          <input
            type="text"
            required
            value={paymentReference}
            onChange={(e) => setPaymentReference(e.target.value)}
            placeholder="Número de transacción, captura de pantalla, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Proporciona cualquier información que nos ayude a identificar tu pago
          </p>
        </div>

        {/* Customer Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas Adicionales (Opcional)
          </label>
          <textarea
            value={customerNotes}
            onChange={(e) => setCustomerNotes(e.target.value)}
            placeholder="Cualquier información adicional sobre tu pago..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Important Notice */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800">Importante:</h4>
              <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                <li>• Tu orden será confirmada una vez que verifiquemos el pago</li>
                <li>• Recibirás un email de confirmación en 24 horas</li>
                <li>• Si tienes preguntas, contacta: payments@swetttripcandy.com</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || !selectedMethod || !paymentReference.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              <span>Enviando Información...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>Confirmar Información de Pago</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
