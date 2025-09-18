import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, Clock, Mail, Package, ArrowRight, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface OrderData {
  customer_email: string
  customer_first_name: string
  customer_last_name: string
  customer_phone: string
  shipping_address: any
  items: Array<{
    product_name: string
    quantity: number
    price: number
  }>
  total_amount: number
  payment_method: string
  payment_reference: string
  payment_notes: string
}

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams()
  const orderNumber = searchParams.get('order_number')
  const paymentMethod = searchParams.get('payment_method')
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (orderNumber) {
      const storedOrder = localStorage.getItem(`order_${orderNumber}`)
      if (storedOrder) {
        setOrderData(JSON.parse(storedOrder))
      }
    }
  }, [orderNumber])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copiado al portapapeles')
    setTimeout(() => setCopied(false), 2000)
  }

  const getPaymentMethodInfo = (method: string) => {
    const methods: Record<string, { name: string; color: string; instructions: string[] }> = {
      zelle: {
        name: 'Zelle',
        color: 'bg-purple-50 border-purple-200 text-purple-700',
        instructions: ['Envía el pago a: payments@swetttripcandy.com', 'Incluye el número de orden en la descripción']
      },
      cashapp: {
        name: 'Cash App',
        color: 'bg-green-50 border-green-200 text-green-700',
        instructions: ['Envía a: $SweetTripCandy', 'Menciona el número de orden']
      },
      applepay: {
        name: 'Apple Pay',
        color: 'bg-gray-50 border-gray-200 text-gray-700',
        instructions: ['Usa Apple Pay para enviar a: payments@swetttripcandy.com', 'Añade el número de orden como memo']
      },
    }
    return methods[method] || { name: method, color: 'bg-gray-50 border-gray-200 text-gray-700', instructions: [] }
  }

  if (!orderNumber || !orderData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Orden no encontrada</h1>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <span>Volver al inicio</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const paymentInfo = getPaymentMethodInfo(paymentMethod || orderData.payment_method)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Orden Creada Exitosamente!</h1>
            <p className="text-gray-600">Tu orden #{orderNumber} ha sido creada y está pendiente de verificación de pago.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Resumen de la Orden</h2>
                
                {/* Order Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Número de Orden:</span>
                    <span className="font-medium">{orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-lg">{formatPrice(orderData.total_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Pendiente de Pago
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Productos:</h3>
                  <div className="space-y-2">
                    {orderData.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.product_name} x{item.quantity}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Información del Cliente</h2>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Nombre:</span> {orderData.customer_first_name} {orderData.customer_last_name}
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span> {orderData.customer_email}
                  </div>
                  {orderData.customer_phone && (
                    <div>
                      <span className="text-gray-600">Teléfono:</span> {orderData.customer_phone}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Instrucciones de Pago</h2>
                
                <div className={`p-4 rounded-lg border mb-4 ${paymentInfo.color}`}>
                  <h3 className="font-semibold mb-2">Método: {paymentInfo.name}</h3>
                  <div className="space-y-2">
                    {paymentInfo.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-xs font-bold mt-1">{index + 1}.</span>
                        <span className="text-sm">{instruction}</span>
                        {instruction.includes('@') && (
                          <button
                            onClick={() => copyToClipboard(instruction.split(': ')[1])}
                            className="ml-2 p-1 hover:bg-black hover:bg-opacity-10 rounded"
                          >
                            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Referencia del Pago:</h4>
                  <div className="flex items-center space-x-2">
                    <code className="bg-blue-100 px-2 py-1 rounded text-sm font-mono">
                      {orderData.payment_reference}
                    </code>
                    <button
                      onClick={() => copyToClipboard(orderData.payment_reference)}
                      className="p-1 hover:bg-blue-200 rounded"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  {orderData.payment_notes && (
                    <div className="mt-2">
                      <span className="text-blue-700 text-sm">Notas: {orderData.payment_notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Próximos Pasos</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">1. Envía el Pago</h4>
                      <p className="text-sm text-gray-600">Usa las instrucciones arriba para enviar tu pago.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-yellow-100 rounded-full p-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">2. Espera Verificación</h4>
                      <p className="text-sm text-gray-600">Revisaremos tu pago en 24-48 horas.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <Package className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">3. Recibe tu Pedido</h4>
                      <p className="text-sm text-gray-600">Una vez verificado, procesaremos tu envío.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">¿Necesitas ayuda?</h4>
                  <p className="text-sm text-gray-600">
                    Contacta nuestro soporte en: <strong>support@sweettrip.com</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <span>Continuar Comprando</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            
            <Link
              to="/orders"
              className="inline-flex items-center justify-center space-x-2 bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              <Package className="h-4 w-4" />
              <span>Ver Mis Órdenes</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}