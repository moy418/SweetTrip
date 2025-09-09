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
        const { notificationType, userId, title, message, data, scheduledFor } = await req.json();

        if (!notificationType || !title || !message) {
            throw new Error('Notification type, title, and message are required');
        }

        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Create notification in database
        const notificationData = {
            user_id: userId,
            notification_type: notificationType,
            title: title,
            message: message,
            data: data || {},
            is_read: false,
            is_sent: false,
            scheduled_for: scheduledFor || new Date().toISOString(),
            created_at: new Date().toISOString()
        };

        const insertResponse = await fetch(`${supabaseUrl}/rest/v1/notifications`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(notificationData)
        });

        if (!insertResponse.ok) {
            const errorText = await insertResponse.text();
            throw new Error(`Failed to create notification: ${errorText}`);
        }

        const notification = await insertResponse.json();

        // For immediate notifications, simulate sending
        if (!scheduledFor || new Date(scheduledFor) <= new Date()) {
            // Mark as sent
            await fetch(`${supabaseUrl}/rest/v1/notifications?id=eq.${notification[0].id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_sent: true })
            });

            console.log(`Notification sent: ${title} to user ${userId}`);
        }

        return new Response(JSON.stringify({
            data: {
                notification: notification[0],
                status: 'created',
                sent: !scheduledFor || new Date(scheduledFor) <= new Date()
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Notification system error:', error);

        const errorResponse = {
            error: {
                code: 'NOTIFICATION_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});