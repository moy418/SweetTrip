// Centralized Order Processor (GPT-5 style)
// - Normalizes order payload
// - Sends structured webhook to Zapier
// - Provides a single entrypoint for checkout and admin re-send

export interface OrderItemPayload {
  product_name: string
  quantity: number
  price: number
}

export interface OrderWebhookPayload {
  order_id: string
  customer_name: string
  customer_email: string
  total: number
  shipping_address: string
  delivery_method?: 'shipping' | 'pickup'
  items: OrderItemPayload[]
}

// Build a normalized payload from various order shapes used in the app
export function buildOrderWebhookPayload(params: {
  orderNumber: string
  customerFirstName?: string
  customerLastName?: string
  customerEmail: string
  totalAmount: number
  deliveryMethod?: 'shipping' | 'pickup'
  shippingAddress?: any
  items: Array<{ product_name: string; quantity: number; price: number }>
}): OrderWebhookPayload {
  const {
    orderNumber,
    customerFirstName,
    customerLastName,
    customerEmail,
    totalAmount,
    deliveryMethod = 'shipping',
    shippingAddress,
    items
  } = params

  const fullName = `${customerFirstName || 'Guest'} ${customerLastName || 'Customer'}`.trim()

  const address = deliveryMethod === 'shipping'
    ? [
        shippingAddress?.line1,
        shippingAddress?.line2,
        shippingAddress?.city,
        shippingAddress?.state,
        shippingAddress?.postal_code
      ]
        .filter(Boolean)
        .join(', ')
    : '402 S El Paso St, El Paso, TX (Pickup)'

  // Build items_list explicitly using a loop as requested
  const items_list: OrderItemPayload[] = []
  for (const product of items) {
    items_list.push({
      product_name: product.product_name,
      quantity: product.quantity,
      price: Number(Number(product.price).toFixed(2))
    })
  }

  return {
    order_id: orderNumber,
    customer_name: fullName,
    customer_email: customerEmail,
    total: Number(Number(totalAmount).toFixed(2)),
    shipping_address: address,
    delivery_method: deliveryMethod,
    items: items_list
  }
}

export async function sendOrderWebhookToZapier(payload: OrderWebhookPayload, webhookUrl?: string) {
  const url = webhookUrl || (typeof window !== 'undefined' ? (window as any).ZAPIER_WEBHOOK_URL : undefined) || process.env.ZAPIER_WEBHOOK_URL || 'https://hooks.zapier.com/hooks/catch/23096000/umwdeto/'

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Zapier webhook failed with status ${response.status}`)
  }
}


