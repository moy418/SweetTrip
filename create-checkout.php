<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'vendor/autoload.php';

\Stripe\Stripe::setApiKey('sk_test_51S5YNVB5apkz5DMEhGJW2X7tmEBzqxF2Bk0WuU2rqciIJEgMb9NjzQHvSg53Jnxj00uB9WunWI6gshWuCIJZkWHz00QRG1b9Lu');

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['cartItems']) || empty($input['cartItems'])) {
        throw new Exception('Cart items are required');
    }

    $cartItems = $input['cartItems'];
    $customerEmail = $input['customerEmail'] ?? '';
    $successUrl = $input['successUrl'] ?? 'https://www.sweettripcandy.com/checkout/success';
    $cancelUrl = $input['cancelUrl'] ?? 'https://www.sweettripcandy.com/cart';

    // Create line items for Stripe
    $lineItems = [];
    $subtotal = 0;
    
    foreach ($cartItems as $item) {
        $lineItems[] = [
            'price_data' => [
                'currency' => 'usd',
                'product_data' => [
                    'name' => $item['product_name'],
                    'images' => $item['product_image_url'] ? [$item['product_image_url']] : [],
                    'metadata' => [
                        'product_id' => (string)$item['product_id']
                    ]
                ],
                'unit_amount' => round($item['price'] * 100), // Convert to cents
            ],
            'quantity' => $item['quantity'],
        ];
        $subtotal += $item['price'] * $item['quantity'];
    }

    // Add shipping if needed
    if ($subtotal < 60) {
        $lineItems[] = [
            'price_data' => [
                'currency' => 'usd',
                'product_data' => [
                    'name' => 'Shipping',
                    'description' => 'Standard shipping (Free on orders $60+)'
                ],
                'unit_amount' => 599, // $5.99 in cents
            ],
            'quantity' => 1,
        ];
    }

    // Create Checkout Session - OFFICIAL STRIPE METHOD
    $session = \Stripe\Checkout\Session::create([
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
    ]);

    echo json_encode([
        'sessionId' => $session->id,
        'url' => $session->url
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

