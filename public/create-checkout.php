<?php
// Stripe Checkout Sessions API - OFICIAL
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Configuración de Stripe
$stripe_secret_key = 'sk_test_51S5YNVB5apkz5DMEhGJW2X7tmEBzqxF2Bk0WuU2rqciIJEgMb9NjzQHvSg53Jnxj00uB9WunWI6gshWuCIJZkWHz00QRG1b9Lu';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['cartItems']) || empty($input['cartItems'])) {
        throw new Exception('Cart items are required');
    }

    $cartItems = $input['cartItems'];
    $customerEmail = $input['customerEmail'] ?? '';
    $successUrl = $input['successUrl'] ?? 'https://www.sweettripcandy.com/checkout/success';
    $cancelUrl = $input['cancelUrl'] ?? 'https://www.sweettripcandy.com/cart';

    // Crear line_items según API oficial de Stripe
    $lineItems = [];
    $subtotal = 0;
    
    foreach ($cartItems as $item) {
        $lineItems[] = [
            'price_data' => [
                'currency' => 'usd',
                'product_data' => [
                    'name' => $item['product_name'],
                    'images' => $item['product_image_url'] ? [$item['product_image_url']] : [],
                ],
                'unit_amount' => round($item['price'] * 100), // Convertir a centavos
            ],
            'quantity' => $item['quantity'],
        ];
        $subtotal += $item['price'] * $item['quantity'];
    }

    // Agregar envío si es necesario
    if ($subtotal < 60) {
        $lineItems[] = [
            'price_data' => [
                'currency' => 'usd',
                'product_data' => [
                    'name' => 'Shipping',
                    'description' => 'Standard shipping (Free on orders $60+)'
                ],
                'unit_amount' => 599, // $5.99 en centavos
            ],
            'quantity' => 1,
        ];
    }

    // Crear Checkout Session usando API oficial de Stripe
    $postData = [
        'payment_method_types' => ['card'],
        'line_items' => $lineItems,
        'mode' => 'payment',
        'success_url' => $successUrl . '?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url' => $cancelUrl,
        'customer_email' => $customerEmail,
        'shipping_address_collection' => [
            'allowed_countries' => ['US', 'CA', 'MX'],
        ],
        'billing_address_collection' => 'required',
    ];

    $ch = curl_init('https://api.stripe.com/v1/checkout/sessions');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $stripe_secret_key,
        'Content-Type: application/x-www-form-urlencoded'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        throw new Exception('Error creating Stripe session: ' . $response);
    }

    $session = json_decode($response, true);

    echo json_encode([
        'sessionId' => $session['id'],
        'url' => $session['url']
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => [
            'message' => $e->getMessage()
        ]
    ]);
}
?>

