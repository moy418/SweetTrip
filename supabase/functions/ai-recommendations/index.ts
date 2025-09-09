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
        const { userId, limit = 6 } = await req.json();

        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        let recommendations = [];

        if (userId) {
            // Personalized recommendations based on user data
            
            // Get user's purchase history
            const ordersResponse = await fetch(`${supabaseUrl}/rest/v1/order_items?select=*,orders!inner(user_id)&orders.user_id=eq.${userId}`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            });

            // Get user's country collections
            const collectionsResponse = await fetch(`${supabaseUrl}/rest/v1/user_country_collections?user_id=eq.${userId}`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            });

            // Get user's predictions to understand their interest
            const predictionsResponse = await fetch(`${supabaseUrl}/rest/v1/predictions?user_id=eq.${userId}`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            });

            const userOrders = ordersResponse.ok ? await ordersResponse.json() : [];
            const userCollections = collectionsResponse.ok ? await collectionsResponse.json() : [];
            const userPredictions = predictionsResponse.ok ? await predictionsResponse.json() : [];

            // Build recommendation logic
            const purchasedCountries = new Set(userOrders.map(item => item.country_code).filter(Boolean));
            const collectedCountries = new Set(userCollections.map(c => c.country_code));
            const predictedMatches = new Set();
            
            userPredictions.forEach(pred => {
                // Get teams from predictions to understand user's interests
                // This would require joining with matches table
            });

            // Get products from countries user hasn't tried yet
            const allCountriesResponse = await fetch(`${supabaseUrl}/rest/v1/countries?select=country_code`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            });

            if (allCountriesResponse.ok) {
                const allCountries = await allCountriesResponse.json();
                const unexploredCountries = allCountries
                    .map(c => c.country_code)
                    .filter(code => !collectedCountries.has(code))
                    .slice(0, 8); // Focus on a few countries

                if (unexploredCountries.length > 0) {
                    const recommendedProductsResponse = await fetch(`${supabaseUrl}/rest/v1/products?origin_country=in.(${unexploredCountries.join(',')})&is_active=eq.true&limit=${limit}`, {
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey
                        }
                    });

                    if (recommendedProductsResponse.ok) {
                        recommendations = await recommendedProductsResponse.json();
                    }
                }
            }

            // If no unexplored countries, recommend popular products
            if (recommendations.length === 0) {
                const popularProductsResponse = await fetch(`${supabaseUrl}/rest/v1/products?featured=eq.true&is_active=eq.true&limit=${limit}`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                });

                if (popularProductsResponse.ok) {
                    recommendations = await popularProductsResponse.json();
                }
            }
        } else {
            // Anonymous user recommendations - show World Cup special products
            const worldCupProductsResponse = await fetch(`${supabaseUrl}/rest/v1/products?world_cup_special=eq.true&is_active=eq.true&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            });

            if (worldCupProductsResponse.ok) {
                recommendations = await worldCupProductsResponse.json();
            }
        }

        // Enhance recommendations with reasoning
        const enhancedRecommendations = recommendations.map(product => {
            let reason = 'Recommended for you';
            
            if (product.world_cup_special) {
                reason = '🏆 World Cup 2026 Special';
            } else if (product.featured) {
                reason = '⭐ Popular choice';
            } else if (product.origin_country) {
                reason = `🌍 Discover ${product.origin_country} flavors`;
            }

            return {
                ...product,
                recommendation_reason: reason,
                recommendation_score: Math.random() * 0.3 + 0.7 // Score between 0.7-1.0
            };
        });

        // Sort by recommendation score
        enhancedRecommendations.sort((a, b) => b.recommendation_score - a.recommendation_score);

        return new Response(JSON.stringify({
            data: {
                recommendations: enhancedRecommendations,
                count: enhancedRecommendations.length,
                personalized: !!userId,
                algorithm: userId ? 'user_based' : 'world_cup_featured'
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('AI recommendations error:', error);

        const errorResponse = {
            error: {
                code: 'RECOMMENDATIONS_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});