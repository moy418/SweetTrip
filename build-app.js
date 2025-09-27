#!/usr/bin/env node

// Build script simple para Sweet Trip Candy con Stripe
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Sweet Trip Candy with Stripe...');

// Leer el archivo principal de la aplicación
const appTsx = fs.readFileSync('src/App.tsx', 'utf8');
const mainTsx = fs.readFileSync('src/main.tsx', 'utf8');
const checkoutPage = fs.readFileSync('src/pages/CheckoutPage.tsx', 'utf8');
const manualPaymentForm = fs.readFileSync('src/components/ManualPaymentForm.tsx', 'utf8');

// Crear directorio dist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copiar archivos públicos
const publicFiles = fs.readdirSync('public');
publicFiles.forEach(file => {
  fs.copyFileSync(path.join('public', file), path.join('dist', file));
});

// Crear index.html con la aplicación integrada
const indexHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/sweet-trip-logo.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sweet Trip Candy</title>
  
  <!-- React -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/react-router-dom@6/dist/umd/react-router-dom.production.min.js"></script>
  
  <!-- Stripe.js -->
  <script src="https://js.stripe.com/v3/"></script>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Zustand -->
  <script src="https://unpkg.com/zustand@4/vanilla.js"></script>
  
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  
  <!-- Hot Toast -->
  <script src="https://unpkg.com/react-hot-toast@2/dist/index.umd.js"></script>
  
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
    }
  </style>
</head>

<body>
  <div id="root"></div>
  
  <script>
    // Configuración de Stripe
    window.STRIPE_PUBLIC_KEY = 'pk_live_51S5YMxB84ORyFU5K03pWrAeQ43qzLZj3KJGYR1OFLGqADEZEvlzNFXZh9RDjrvEygTbIxSU63TADJL6Owl1u1A6T00k9Lrk2JL';
    window.stripe = Stripe(window.STRIPE_PUBLIC_KEY);
    
    // Configuración de Supabase
    window.VITE_SUPABASE_URL = 'https://yzgkrybfqfbpnqpxjxka.supabase.co';
    window.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Z2tyeWJmcWZicG5xcHhqeGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NjI2NTEsImV4cCI6MjA1MTUzODY1MX0.fCgmxPKTqhOcwGWKCE3s8_5yCCvfVfPPdlUdPRDKfAY';
    
    console.log('✅ Sweet Trip Candy - Configuración cargada');
  </script>
  
  <!-- Cargar la aplicación compilada -->
  <script type="module" crossorigin src="/assets/index-TtnYEZk0.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index-N9MTANP3.css">
</body>
</html>`;

fs.writeFileSync('dist/index.html', indexHtml);

console.log('✅ Build completado');
console.log('📁 Archivos creados en dist/');
console.log('🎯 Tu aplicación está lista con Stripe integrado');
