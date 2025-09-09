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
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Get upcoming matches in the next 24 hours
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const matchesResponse = await fetch(`${supabaseUrl}/rest/v1/matches?match_date=gte.${now.toISOString()}&match_date=lte.${tomorrow.toISOString()}&status=eq.scheduled`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        if (!matchesResponse.ok) {
            throw new Error('Failed to fetch matches');
        }

        const matches = await matchesResponse.json();
        const notificationsSent = [];

        for (const match of matches) {
            const matchTime = new Date(match.match_date);
            const timeDiff = matchTime.getTime() - now.getTime();
            const hoursUntilMatch = Math.floor(timeDiff / (1000 * 60 * 60));

            // Send notifications for matches starting in 2 hours
            if (hoursUntilMatch <= 2 && hoursUntilMatch >= 1) {
                // Get all users to notify about the match
                const usersResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?select=id`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                });

                if (usersResponse.ok) {
                    const users = await usersResponse.json();
                    
                    const countryFlags = {
                        'USA': '🇺🇸', 'MEX': '🇲🇽', 'CAN': '🇨🇦', 'ARG': '🇦🇷', 'BRA': '🇧🇷',
                        'FRA': '🇫🇷', 'GER': '🇩🇪', 'ESP': '🇪🇸', 'ENG': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'JPN': '🇯🇵'
                    };

                    const homeFlag = countryFlags[match.home_team_code] || '🏳️';
                    const awayFlag = countryFlags[match.away_team_code] || '🏳️';

                    for (const user of users) {
                        const notificationData = {
                            user_id: user.id,
                            notification_type: 'match_reminder',
                            title: `⚽ Match Starting Soon!`,
                            message: `${homeFlag} ${match.home_team_code} vs ${match.away_team_code} ${awayFlag} starts in ${hoursUntilMatch} hour${hoursUntilMatch > 1 ? 's' : ''}! Don't forget to make your prediction!`,
                            data: {
                                match_id: match.id,
                                home_team: match.home_team_code,
                                away_team: match.away_team_code,
                                match_time: match.match_date,
                                venue: match.venue
                            },
                            is_read: false,
                            is_sent: true,
                            scheduled_for: now.toISOString(),
                            created_at: now.toISOString()
                        };

                        const insertResponse = await fetch(`${supabaseUrl}/rest/v1/notifications`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${serviceRoleKey}`,
                                'apikey': serviceRoleKey,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(notificationData)
                        });

                        if (insertResponse.ok) {
                            notificationsSent.push({
                                userId: user.id,
                                matchId: match.id,
                                status: 'sent'
                            });
                        }
                    }
                }
            }
        }

        return new Response(JSON.stringify({
            data: {
                matchesProcessed: matches.length,
                notificationsSent: notificationsSent.length,
                notifications: notificationsSent
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Match notifications error:', error);

        const errorResponse = {
            error: {
                code: 'MATCH_NOTIFICATIONS_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});