# 📧 Setup EmailJS para Sweet Trip Candy

## Configuración Rápida (5 minutos)

### 1. Crear Cuenta EmailJS
- Ve a: https://www.emailjs.com/
- Crear cuenta gratuita (200 emails/mes gratis)
- No necesita verificar dominio

### 2. Configurar Servicio
1. **Dashboard** → **Email Services** → **Add New Service**
2. **Seleccionar:** Gmail, Outlook, Yahoo, etc.
3. **Conectar** tu cuenta de email personal
4. **Copiar Service ID**

### 3. Crear Template
1. **Email Templates** → **Create New Template**
2. **Template ID:** `order_confirmation`
3. **Template Content:**

```html
Subject: Confirmación de Orden #{{order_number}} - Sweet Trip Candy

Hola {{customer_name}},

¡Gracias por tu orden en Sweet Trip Candy!

Detalles de tu orden:
- Número de Orden: {{order_number}}
- Total: ${{total_amount}}
- Método de Pago: {{payment_method}}
- Referencia: {{payment_reference}}

Productos:
{{products_list}}

{{#if_shipping}}
Dirección de Envío:
{{shipping_address}}
{{/if_shipping}}

{{#if_pickup}}
Recoger en: 402 S El Paso St, El Paso, TX 79901
{{/if_pickup}}

¡Gracias por elegir Sweet Trip Candy!

Sweet Trip Candy
hello@sweettripcandy.com
402 S El Paso St, El Paso, TX 79901
```

### 4. Configurar en el Sistema
Actualizar `src/lib/emailService.ts` con:
- Service ID
- Template ID  
- Public Key

### 5. ¡Listo!
Los emails se enviarán automáticamente desde tu cuenta pero con el branding de Sweet Trip Candy.


