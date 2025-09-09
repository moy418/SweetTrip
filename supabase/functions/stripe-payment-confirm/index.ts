Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { paymentIntentId } = await req.json();

        console.log('Payment confirmation request received:', paymentIntentId);

        if (!paymentIntentId) {
            throw new Error('Payment intent ID is required');
        }

        // Get environment variables
        const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!stripeSecretKey || !serviceRoleKey || !supabaseUrl) {
            throw new Error('Required environment variables not configured');
        }

        // Retrieve payment intent from Stripe
        const stripeResponse = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}`, {
            headers: {
                'Authorization': `Bearer ${stripeSecretKey}`
            }
        });

        if (!stripeResponse.ok) {
            throw new Error('Failed to retrieve payment intent from Stripe');
        }

        const paymentIntent = await stripeResponse.json();
        console.log('Payment intent status:', paymentIntent.status);

        // Update order status based on payment intent status
        let orderStatus = 'pending';
        if (paymentIntent.status === 'succeeded') {
            orderStatus = 'confirmed';
        } else if (paymentIntent.status === 'canceled') {
            orderStatus = 'cancelled';
        } else if (paymentIntent.status === 'payment_failed') {
            orderStatus = 'failed';
        }

        // Update order in database
        const updateData = {
            status: orderStatus,
            updated_at: new Date().toISOString()
        };

        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/orders?stripe_payment_intent_id=eq.${paymentIntentId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(updateData)
        });

        if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            console.error('Failed to update order:', errorText);
            throw new Error('Failed to update order status');
        }

        const updatedOrder = await updateResponse.json();
        console.log('Order updated successfully:', updatedOrder[0]?.id);

        // If payment succeeded, we might want to trigger additional actions
        if (orderStatus === 'confirmed') {
            console.log('Payment confirmed - order processed successfully');
            // Here you could trigger:
            // - Email confirmation
            // - Inventory updates
            // - Shipping notifications
            // - Analytics tracking
        }

        const result = {
            data: {
                paymentIntentId: paymentIntentId,
                status: paymentIntent.status,
                orderStatus: orderStatus,
                order: updatedOrder[0] || null
            }
        };

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Payment confirmation error:', error);

        const errorResponse = {
            error: {
                code: 'PAYMENT_CONFIRMATION_FAILED',
                message: error.message,
                timestamp: new Date().toISOString()
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});