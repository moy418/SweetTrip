import React from 'react'
import { generateOrderEmailHTML } from '../lib/emailService'

interface OrderEmailPreviewProps {
  orderData: {
    orderNumber: string
    customerName: string
    customerEmail: string
    customerPhone: string
    paymentMethod: string
    paymentReference: string
    deliveryMethod: string
    shippingAddress?: any
    orderItems: Array<{
      product_name: string
      quantity: number
      price: number
    }>
    totalAmount: number
    shippingCost: number
  }
}

export default function OrderEmailPreview({ orderData }: OrderEmailPreviewProps) {
  const emailHTML = generateOrderEmailHTML(orderData)

  const handleSendTestEmail = async () => {
    try {
      // Here you could implement actual email sending
      console.log('Test email would be sent with this HTML:', emailHTML)
      alert('Vista previa del email generada. Revisa la consola del navegador para ver el HTML.')
    } catch (error) {
      console.error('Error generating email preview:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          📧 Vista Previa del Email de Confirmación
        </h3>
        <button
          onClick={handleSendTestEmail}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ver HTML del Email
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <iframe
          srcDoc={emailHTML}
          className="w-full h-96 border-0"
          title="Email Preview"
        />
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Información del Email:</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Para:</span> {orderData.customerEmail}
          </div>
          <div>
            <span className="font-medium">Asunto:</span> Confirmación de Orden #{orderData.orderNumber}
          </div>
          <div>
            <span className="font-medium">Cliente:</span> {orderData.customerName}
          </div>
          <div>
            <span className="font-medium">Total:</span> ${orderData.totalAmount.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}


