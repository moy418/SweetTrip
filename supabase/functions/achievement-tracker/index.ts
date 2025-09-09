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
        const { userId, eventType, eventData } = await req.json();

        if (!userId || !eventType) {
            throw new Error('User ID and event type are required');
        }

        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        const achievementsEarned = [];
        const notifications = [];

        // Check for different types of achievements based on event
        switch (eventType) {
            case 'first_purchase':
                // Award first purchase achievement
                const firstPurchaseAchievement = {
                    user_id: userId,
                    achievement_type: 'first_purchase',
                    achievement_name: 'Sweet Beginning',
                    achievement_description: 'Made your first candy purchase on Sweet Trip!',
                    badge_image_url: '/images/badges/first-purchase.png',
                    points_awarded: 50,
                    earned_at: new Date().toISOString(),
                    metadata: eventData
                };

                achievementsEarned.push(firstPurchaseAchievement);
                
                notifications.push({
                    user_id: userId,
                    notification_type: 'achievement_earned',
                    title: '🎉 Achievement Unlocked!',
                    message: 'Congratulations! You earned the "Sweet Beginning" badge for your first purchase!',
                    data: { achievement: firstPurchaseAchievement }
                });
                break;

            case 'country_collection':
                // Check if user collected candies from a new country
                const countryCode = eventData?.countryCode;
                if (countryCode) {
                    const countryAchievement = {
                        user_id: userId,
                        achievement_type: 'country_collector',
                        achievement_name: `${countryCode} Explorer`,
                        achievement_description: `Discovered the sweet traditions of ${countryCode}!`,
                        badge_image_url: `/images/badges/country-${countryCode.toLowerCase()}.png`,
                        points_awarded: 25,
                        earned_at: new Date().toISOString(),
                        metadata: { country_code: countryCode, ...eventData }
                    };

                    achievementsEarned.push(countryAchievement);
                    
                    notifications.push({
                        user_id: userId,
                        notification_type: 'achievement_earned',
                        title: '🌍 New Country Unlocked!',
                        message: `You've discovered the sweet traditions of ${countryCode}! Keep collecting from more countries!`,
                        data: { achievement: countryAchievement }
                    });

                    // Check for milestone achievements
                    const collectionsResponse = await fetch(`${supabaseUrl}/rest/v1/user_country_collections?user_id=eq.${userId}&select=country_code`, {
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey
                        }
                    });

                    if (collectionsResponse.ok) {
                        const collections = await collectionsResponse.json();
                        const countryCount = collections.length;

                        if (countryCount === 5) {
                            const explorerAchievement = {
                                user_id: userId,
                                achievement_type: 'milestone',
                                achievement_name: 'World Explorer',
                                achievement_description: 'Collected candies from 5 different countries!',
                                badge_image_url: '/images/badges/world-explorer.png',
                                points_awarded: 100,
                                earned_at: new Date().toISOString(),
                                metadata: { countries_collected: countryCount }
                            };

                            achievementsEarned.push(explorerAchievement);
                            
                            notifications.push({
                                user_id: userId,
                                notification_type: 'achievement_earned',
                                title: '🗺️ World Explorer Badge Earned!',
                                message: 'Amazing! You\'ve collected candies from 5 different countries!',
                                data: { achievement: explorerAchievement }
                            });
                        } else if (countryCount === 10) {
                            const ambassadorAchievement = {
                                user_id: userId,
                                achievement_type: 'milestone',
                                achievement_name: 'Sweet Ambassador',
                                achievement_description: 'Collected candies from 10 different countries!',
                                badge_image_url: '/images/badges/sweet-ambassador.png',
                                points_awarded: 200,
                                earned_at: new Date().toISOString(),
                                metadata: { countries_collected: countryCount }
                            };

                            achievementsEarned.push(ambassadorAchievement);
                            
                            notifications.push({
                                user_id: userId,
                                notification_type: 'achievement_earned',
                                title: '👑 Sweet Ambassador Status!',
                                message: 'Incredible! You\'re now a Sweet Ambassador with 10+ countries!',
                                data: { achievement: ambassadorAchievement }
                            });
                        }
                    }
                }
                break;

            case 'prediction_streak':
                const streakLength = eventData?.streakLength || 1;
                if (streakLength >= 3) {
                    const streakAchievement = {
                        user_id: userId,
                        achievement_type: 'prediction_streak',
                        achievement_name: 'Prediction Master',
                        achievement_description: `Achieved a ${streakLength}-match prediction streak!`,
                        badge_image_url: '/images/badges/prediction-master.png',
                        points_awarded: streakLength * 25,
                        earned_at: new Date().toISOString(),
                        metadata: { streak_length: streakLength }
                    };

                    achievementsEarned.push(streakAchievement);
                    
                    notifications.push({
                        user_id: userId,
                        notification_type: 'achievement_earned',
                        title: '🎯 Prediction Master!',
                        message: `Incredible! You predicted ${streakLength} matches correctly in a row!`,
                        data: { achievement: streakAchievement }
                    });
                }
                break;
        }

        // Save achievements to database
        for (const achievement of achievementsEarned) {
            await fetch(`${supabaseUrl}/rest/v1/user_achievements`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(achievement)
            });
        }

        // Send notifications
        for (const notification of notifications) {
            await fetch(`${supabaseUrl}/rest/v1/notifications`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...notification,
                    is_read: false,
                    is_sent: true,
                    scheduled_for: new Date().toISOString(),
                    created_at: new Date().toISOString()
                })
            });
        }

        return new Response(JSON.stringify({
            data: {
                achievementsEarned,
                notificationsSent: notifications.length,
                pointsAwarded: achievementsEarned.reduce((sum, a) => sum + a.points_awarded, 0)
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Achievement tracker error:', error);

        const errorResponse = {
            error: {
                code: 'ACHIEVEMENT_TRACKER_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});