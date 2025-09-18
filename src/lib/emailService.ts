import emailjs from '@emailjs/browser'

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_sweettrip'
const EMAILJS_TEMPLATE_ID = 'template_order_confirmation'
const EMAILJS_PUBLIC_KEY = 'your_emailjs_public_key'

interface OrderNotificationData {
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

export const sendOrderConfirmationEmail = async (data: OrderNotificationData): Promise<boolean> => {
  try {
    console.log('📧 Sending order confirmation via Zapier webhook...')
    console.log('Order details:', data)
    
    // Send customer confirmation email
    const customerSuccess = await sendOrderNotificationWebhook(data, 'customer')
    
    // Send admin notification email
    const adminSuccess = await sendAdminNotificationWebhook(data)
    
    if (customerSuccess) {
      console.log('✅ Customer email notification sent successfully')
    } else {
      console.log('⚠️ Customer email failed')
    }
    
    if (adminSuccess) {
      console.log('✅ Admin email notification sent successfully')
    } else {
      console.log('⚠️ Admin email failed')
    }
    
    // Return true if at least customer email succeeded
    return customerSuccess
    
  } catch (error) {
    console.error('❌ Failed to send email notification:', error)
    return false
  }
}

// Function specifically for resending emails to customers only
export const resendCustomerEmail = async (data: OrderNotificationData): Promise<boolean> => {
  try {
    console.log('📧 Resending customer confirmation email...')
    console.log('Order details:', data)
    
    // Send only customer confirmation email (no admin notification)
    const customerSuccess = await sendOrderNotificationWebhook(data, 'customer')
    
    if (customerSuccess) {
      console.log('✅ Customer email resent successfully')
    } else {
      console.log('⚠️ Customer email resend failed')
    }
    
    return customerSuccess
    
  } catch (error) {
    console.error('❌ Failed to resend customer email:', error)
    return false
  }
}

// Send notification via Zapier webhook
export const sendOrderNotificationWebhook = async (data: OrderNotificationData, type: 'customer' | 'admin' = 'customer'): Promise<boolean> => {
  try {
    // Zapier webhook URL provided by user
    const webhookUrl = 'https://hooks.zapier.com/hooks/catch/23096000/umwdeto/'
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // ✅ SOLO LOS CAMPOS ESENCIALES
        customer_email: data.customerEmail,
        customer_name: data.customerName,
        order_number: data.orderNumber,
        email_subject: `Confirmación de Orden #${data.orderNumber} - Sweet Trip Candy`,
        email_html: generateOrderEmailHTML(data)
      })
    })
    
    if (response.ok) {
      console.log('✅ Webhook notification sent successfully')
      return true
    } else {
      console.error('❌ Webhook failed:', response.status)
      return false
    }
    
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return false
  }
}

// Send admin notification via Zapier webhook
export const sendAdminNotificationWebhook = async (data: OrderNotificationData): Promise<boolean> => {
  try {
    // Admin-specific webhook URL (updated)
    const webhookUrl = 'https://hooks.zapier.com/hooks/catch/23096000/umctn6y/'
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // ✅ SOLO LOS CAMPOS ESENCIALES PARA ADMIN
        admin_email: 'orders@sweettripcandy.com',
        customer_name: data.customerName,
        order_number: data.orderNumber,
        email_subject: `🔔 Nueva Orden #${data.orderNumber} - Verificar Pago`,
        email_html: generateAdminNotificationHTML(data)
      })
    })
    
    if (response.ok) {
      console.log('✅ Admin webhook notification sent successfully')
      return true
    } else {
      console.error('❌ Admin webhook failed:', response.status)
      return false
    }
    
  } catch (error) {
    console.error('❌ Admin webhook error:', error)
    return false
  }
}

// Simple email template generator
export const generateOrderEmailHTML = (data: OrderNotificationData): string => {
  const itemsHTML = data.orderItems.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">
        <strong>${item.product_name}</strong>
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
        $${item.price.toFixed(2)}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
        $${(item.quantity * item.price).toFixed(2)}
      </td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmación de Orden - Sweet Trip Candy</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1>🍭 ¡Gracias por tu orden!</h1>
        <h2>Sweet Trip Candy</h2>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h3>Hola ${data.customerName},</h3>
        
        <p>¡Hemos recibido tu orden exitosamente! Aquí están los detalles:</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4>📋 Información de la Orden</h4>
          <p><strong>Número de Orden:</strong> ${data.orderNumber}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Teléfono:</strong> ${data.customerPhone}</p>
          <p><strong>Método de Pago:</strong> ${data.paymentMethod}</p>
          <p><strong>Referencia de Pago:</strong> ${data.paymentReference}</p>
          <p><strong>Método de Entrega:</strong> ${data.deliveryMethod === 'shipping' ? 'Envío a Domicilio' : 'Recoger en Tienda'}</p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4>🛒 Productos Ordenados</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 10px; text-align: left;">Producto</th>
                <th style="padding: 10px; text-align: center;">Cantidad</th>
                <th style="padding: 10px; text-align: right;">Precio</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; text-align: right;">
            <p><strong>Subtotal: $${(data.totalAmount - data.shippingCost).toFixed(2)}</strong></p>
            ${data.shippingCost > 0 ? `<p><strong>Envío: $${data.shippingCost.toFixed(2)}</strong></p>` : ''}
            <p style="font-size: 18px; color: #667eea;"><strong>Total: $${data.totalAmount.toFixed(2)}</strong></p>
          </div>
        </div>

        ${data.deliveryMethod === 'shipping' ? `
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4>📦 Dirección de Envío</h4>
            <p>${data.shippingAddress?.line1 || 'N/A'}</p>
            <p>${data.shippingAddress?.city || ''}, ${data.shippingAddress?.state || ''} ${data.shippingAddress?.postal_code || ''}</p>
          </div>
        ` : `
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4>🏪 Recoger en Tienda</h4>
            <p><strong>Dirección:</strong> 402 S El Paso St, El Paso, TX 79901</p>
            <p><strong>Horarios:</strong> Lunes a Sábado 10:00 AM - 8:00 PM</p>
          </div>
        `}

        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4>📞 Próximos Pasos</h4>
          <p>1. Verificaremos tu pago en las próximas 24 horas</p>
          <p>2. Te enviaremos una confirmación una vez verificado</p>
          <p>3. ${data.deliveryMethod === 'shipping' ? 'Prepararemos tu orden para envío' : 'Te notificaremos cuando esté lista para recoger'}</p>
          <p><strong>¿Preguntas?</strong> Contáctanos en: <a href="mailto:payments@sweettripcandy.com">payments@sweettripcandy.com</a></p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #666;">
        <p>Sweet Trip Candy - Discover Candy from Around the World</p>
        <p>402 S El Paso St, El Paso, TX 79901</p>
      </div>
    </body>
    </html>
  `
}

// Admin notification email template
export const generateAdminNotificationHTML = (data: OrderNotificationData): string => {
  const itemsHTML = data.orderItems.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">
        <strong>${item.product_name}</strong>
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
        $${item.price.toFixed(2)}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
        $${(item.quantity * item.price).toFixed(2)}
      </td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>🔔 Nueva Orden - Sweet Trip Candy Admin</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1>🔔 ¡Nueva Orden Recibida!</h1>
        <h2>Sweet Trip Candy - Admin</h2>
        <p style="font-size: 16px; margin: 0;">Requiere verificación de pago</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 2px solid #dc2626;">
        
        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin-bottom: 20px;">
          <h3 style="margin: 0; color: #dc2626;">⚡ ACCIÓN REQUERIDA</h3>
          <p style="margin: 5px 0 0 0;">Verificar el pago y confirmar la orden en el panel de admin</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
          <h4>📋 Información de la Orden</h4>
          <p><strong>Número de Orden:</strong> <span style="color: #dc2626; font-family: monospace;">${data.orderNumber}</span></p>
          <p><strong>Cliente:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Teléfono:</strong> ${data.customerPhone}</p>
          <p><strong>Método de Pago:</strong> <span style="background: #fbbf24; padding: 2px 8px; border-radius: 4px; color: white; font-weight: bold;">${data.paymentMethod}</span></p>
          <p><strong>Referencia de Pago:</strong> <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${data.paymentReference}</span></p>
          <p><strong>Método de Entrega:</strong> ${data.deliveryMethod === 'shipping' ? '📦 Envío a Domicilio' : '🏪 Recoger en Tienda'}</p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
          <h4>🛒 Productos Ordenados</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dc2626;">Producto</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dc2626;">Cantidad</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dc2626;">Precio</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dc2626;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; text-align: right; border-top: 2px solid #dc2626; padding-top: 15px;">
            <p><strong>Subtotal: $${(data.totalAmount - data.shippingCost).toFixed(2)}</strong></p>
            ${data.shippingCost > 0 ? `<p><strong>Envío: $${data.shippingCost.toFixed(2)}</strong></p>` : ''}
            <p style="font-size: 20px; color: #dc2626;"><strong>TOTAL A VERIFICAR: $${data.totalAmount.toFixed(2)}</strong></p>
          </div>
        </div>

        ${data.deliveryMethod === 'shipping' ? `
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <h4>📦 Dirección de Envío</h4>
            <div style="background: #eff6ff; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
              <p style="margin: 0;"><strong>${data.shippingAddress?.line1 || 'N/A'}</strong></p>
              <p style="margin: 5px 0 0 0;">${data.shippingAddress?.city || ''}, ${data.shippingAddress?.state || ''} ${data.shippingAddress?.postal_code || ''}</p>
            </div>
          </div>
        ` : `
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <h4>🏪 Recoger en Tienda</h4>
            <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #22c55e;">
              <p style="margin: 0;"><strong>El cliente recogerá en:</strong></p>
              <p style="margin: 5px 0 0 0;">402 S El Paso St, El Paso, TX 79901</p>
            </div>
          </div>
        `}

        <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h4 style="margin: 0 0 15px 0;">⚡ Próximos Pasos:</h4>
          <div style="text-align: left;">
            <p>1. 🔍 <strong>Verificar el pago</strong> en ${data.paymentMethod} con referencia: ${data.paymentReference}</p>
            <p>2. 💻 <strong>Ir al panel de admin</strong> y confirmar/rechazar la orden</p>
            <p>3. 📧 <strong>El cliente recibirá</strong> notificación automática del estado</p>
            <p>4. 📦 <strong>Preparar productos</strong> para ${data.deliveryMethod === 'shipping' ? 'envío' : 'pickup'}</p>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #666;">
        <p><strong>Sweet Trip Candy - Panel de Administración</strong></p>
        <p>Este email se envía automáticamente para cada nueva orden</p>
      </div>
    </body>
    </html>
  `
}
