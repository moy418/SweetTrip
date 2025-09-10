// Mock Payment System - Para desarrollo sin Stripe
export interface MockPaymentResult {
  success: boolean
  paymentId: string
  orderId: string
  orderNumber: string
  message: string
}

export interface MockPaymentData {
  amount: number
  currency: string
  customerEmail: string
  customerName: string
  cartItems: any[]
  shippingAddress: any
}

// Simular procesamiento de pago
export const processMockPayment = async (paymentData: MockPaymentData): Promise<MockPaymentResult> => {
  // Simular delay de procesamiento
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Generar IDs únicos
  const paymentId = `mock_pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const orderNumber = `ST-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
  
  // Simular éxito del pago (90% de éxito)
  const isSuccess = Math.random() > 0.1
  
  if (isSuccess) {
    return {
      success: true,
      paymentId,
      orderId,
      orderNumber,
      message: 'Payment processed successfully!'
    }
  } else {
    throw new Error('Payment failed. Please try again.')
  }
}

// Validar datos de pago
export const validatePaymentData = (paymentData: MockPaymentData): string[] => {
  const errors: string[] = []
  
  if (!paymentData.amount || paymentData.amount <= 0) {
    errors.push('Invalid amount')
  }
  
  if (!paymentData.customerEmail || !paymentData.customerEmail.includes('@')) {
    errors.push('Valid email is required')
  }
  
  if (!paymentData.customerName || paymentData.customerName.trim().length < 2) {
    errors.push('Valid customer name is required')
  }
  
  if (!paymentData.cartItems || paymentData.cartItems.length === 0) {
    errors.push('Cart cannot be empty')
  }
  
  return errors
}
