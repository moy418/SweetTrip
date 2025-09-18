# 📧 Setup Email Notifications for Sweet Trip Candy

## Option 1: EmailJS (Recommended for quick setup)

1. **Create EmailJS Account:**
   - Go to https://www.emailjs.com/
   - Create a free account
   - Create a new service (Gmail, Outlook, etc.)

2. **Create Email Template:**
   - Go to Email Templates
   - Create new template with ID: `template_order_confirmation`
   - Use variables: `{{order_number}}`, `{{customer_name}}`, `{{customer_email}}`, etc.

3. **Update Configuration:**
   ```typescript
   // In src/lib/emailService.ts
   const EMAILJS_SERVICE_ID = 'your_service_id'
   const EMAILJS_TEMPLATE_ID = 'template_order_confirmation'
   const EMAILJS_PUBLIC_KEY = 'your_public_key'
   ```

## Option 2: Zapier Webhook (No coding required)

1. **Create Zapier Account:**
   - Go to https://zapier.com/
   - Create a new Zap
   - Trigger: Webhooks by Zapier - "Catch Hook"

2. **Set Action:**
   - Action: Gmail/Outlook - "Send Email"
   - Configure email template with order details

3. **Update Webhook URL:**
   ```typescript
   // In src/lib/emailService.ts
   const webhookUrl = 'YOUR_ZAPIER_WEBHOOK_URL'
   ```

## Option 3: Simple SMTP Service

1. **Use a service like:**
   - Resend (https://resend.com/)
   - SendGrid (https://sendgrid.com/)
   - Postmark (https://postmarkapp.com/)

2. **Create API endpoint:**
   - Create simple server endpoint
   - Or use Supabase Edge Function (when CLI is available)

## Current Implementation

The system is already integrated and will:

1. ✅ **Capture Order Data** - All customer and order information
2. ✅ **Generate HTML Email** - Beautiful email template
3. ✅ **Log Email Data** - For debugging and testing
4. 🔄 **Send Email** - Ready to connect to any service above

## Testing

The email system will log all data to the browser console for now. You can:

1. **Place a test order**
2. **Check browser console** - See all email data
3. **View email HTML** - Copy and test in email client
4. **Configure service** - Choose option above and update config

## Next Steps

1. Choose an email service from the options above
2. Get API keys/webhook URLs
3. Update `src/lib/emailService.ts` with your configuration
4. Test with a real order

The email will include:
- ✅ Order confirmation details
- ✅ Customer information
- ✅ Product list with prices
- ✅ Payment method and reference
- ✅ Shipping/pickup information
- ✅ Next steps and contact info


