Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
        // Get environment variables
        const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!stripeWebhookSecret || !serviceRoleKey || !supabaseUrl) {
            throw new Error('Missing required environment variables');
        }

        // Get the raw body and signature
        const body = await req.text();
        const signature = req.headers.get('stripe-signature');

        if (!signature) {
            throw new Error('Missing Stripe signature');
        }

        // Verify webhook signature (simplified version)
        // In production, you should use a proper Stripe webhook verification library
        console.log('Received webhook with signature:', signature);

        // Parse the webhook event
        const event = JSON.parse(body);
        console.log('Webhook event received:', event.type, event.id);

        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentSuccess(event.data.object, supabaseUrl, serviceRoleKey);
                break;

            case 'payment_intent.payment_failed':
                await handlePaymentFailure(event.data.object, supabaseUrl, serviceRoleKey);
                break;

            case 'payment_intent.canceled':
                await handlePaymentCancellation(event.data.object, supabaseUrl, serviceRoleKey);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Webhook error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

async function handlePaymentSuccess(paymentIntent: any, supabaseUrl: string, serviceRoleKey: string) {
    console.log('Handling successful payment:', paymentIntent.id);

    try {
        // Update order status to 'paid'
        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/orders?stripe_payment_intent_id=eq.${paymentIntent.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'paid',
                updated_at: new Date().toISOString()
            })
        });

        if (!updateResponse.ok) {
            throw new Error(`Failed to update order status: ${await updateResponse.text()}`);
        }

        // Get order details for further processing
        const orderResponse = await fetch(`${supabaseUrl}/rest/v1/orders?stripe_payment_intent_id=eq.${paymentIntent.id}&select=*`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        if (orderResponse.ok) {
            const orders = await orderResponse.json();
            if (orders.length > 0) {
                const order = orders[0];
                console.log(`Order ${order.order_number} marked as paid`);

                // Here you could trigger additional actions like:
                // - Send order confirmation email
                // - Update inventory (if not already reserved)
                // - Trigger fulfillment process
                // - Update analytics
            }
        }

        console.log('Payment success handled successfully');
    } catch (error) {
        console.error('Error handling payment success:', error);
        throw error;
    }
}

async function handlePaymentFailure(paymentIntent: any, supabaseUrl: string, serviceRoleKey: string) {
    console.log('Handling failed payment:', paymentIntent.id);

    try {
        // Update order status to 'payment_failed'
        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/orders?stripe_payment_intent_id=eq.${paymentIntent.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'payment_failed',
                updated_at: new Date().toISOString()
            })
        });

        if (!updateResponse.ok) {
            throw new Error(`Failed to update order status: ${await updateResponse.text()}`);
        }

        // Release reserved inventory
        await releaseInventoryForOrder(paymentIntent.id, supabaseUrl, serviceRoleKey);

        console.log('Payment failure handled successfully');
    } catch (error) {
        console.error('Error handling payment failure:', error);
        throw error;
    }
}

async function handlePaymentCancellation(paymentIntent: any, supabaseUrl: string, serviceRoleKey: string) {
    console.log('Handling cancelled payment:', paymentIntent.id);

    try {
        // Update order status to 'cancelled'
        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/orders?stripe_payment_intent_id=eq.${paymentIntent.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'cancelled',
                updated_at: new Date().toISOString()
            })
        });

        if (!updateResponse.ok) {
            throw new Error(`Failed to update order status: ${await updateResponse.text()}`);
        }

        // Release reserved inventory
        await releaseInventoryForOrder(paymentIntent.id, supabaseUrl, serviceRoleKey);

        console.log('Payment cancellation handled successfully');
    } catch (error) {
        console.error('Error handling payment cancellation:', error);
        throw error;
    }
}

async function releaseInventoryForOrder(paymentIntentId: string, supabaseUrl: string, serviceRoleKey: string) {
    try {
        // Get order and order items
        const orderResponse = await fetch(`${supabaseUrl}/rest/v1/orders?stripe_payment_intent_id=eq.${paymentIntentId}&select=id`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        if (!orderResponse.ok) return;

        const orders = await orderResponse.json();
        if (orders.length === 0) return;

        const orderId = orders[0].id;

        // Get order items
        const itemsResponse = await fetch(`${supabaseUrl}/rest/v1/order_items?order_id=eq.${orderId}&select=product_id,quantity`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        if (!itemsResponse.ok) return;

        const items = await itemsResponse.json();

        // Release inventory for each item
        for (const item of items) {
            try {
                await fetch(`${supabaseUrl}/functions/v1/inventory-management`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'release',
                        productId: item.product_id,
                        quantity: item.quantity,
                        orderId: orderId
                    })
                });
            } catch (error) {
                console.error(`Failed to release inventory for product ${item.product_id}:`, error);
            }
        }

        console.log('Inventory released for cancelled/failed order');
    } catch (error) {
        console.error('Error releasing inventory:', error);
    }
}