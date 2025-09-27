#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔨 Rebuilding Sweet Trip application...');

try {
  // Clean dist directory
  console.log('📁 Cleaning dist directory...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Create new dist directory
  fs.mkdirSync('dist', { recursive: true });

  // Copy public files
  console.log('📋 Copying public files...');
  const publicFiles = [
    '_redirects',
    'anima.mp4', 
    'candy-fallback.jpg',
    'create-checkout.php',
    'products_export_1(2).csv',
    'sweet-trip-loggo.png',
    'sweet-trip-logo.png', 
    'sweet-trip-video-logo.mp4',
    'sweetland-logo.jpeg',
    'sweetlogo-removebg-preview.png',
    'sweetlogo.jpeg',
    'use.txt'
  ];

  publicFiles.forEach(file => {
    const srcPath = path.join('public', file);
    const destPath = path.join('dist', file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied ${file}`);
    }
  });

  // Create a simple HTML file with the logo changes
  console.log('📄 Creating updated HTML...');
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sweet Trip - Discover Candy from Around the World</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes fade-in-down {
      0% { opacity: 0; transform: translateY(-30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes fade-in-up {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes gradient-x {
      0%, 100% { background-size: 200% 200%; background-position: left center; }
      50% { background-size: 200% 200%; background-position: right center; }
    }
    @keyframes spin-slow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes spin-slow-reverse {
      0% { transform: rotate(360deg); }
      100% { transform: rotate(0deg); }
    }
    .animate-fade-in-down { animation: fade-in-down 0.6s ease-out; }
    .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
    .animate-gradient-x { animation: gradient-x 3s ease infinite; }
    .animate-spin-slow { animation: spin-slow 8s linear infinite; }
    .animate-spin-slow-reverse { animation: spin-slow-reverse 12s linear infinite; }
    .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  </style>
</head>
<body class="bg-gray-900 text-white">
  <!-- Header -->
  <header class="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg">
    <div class="container mx-auto px-4 py-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <img src="/sweetlogo-removebg-preview.png" alt="Sweet Trip Logo" class="h-16 w-16 hover:scale-105 transition-transform">
        </div>
        <nav class="hidden md:flex space-x-6">
          <a href="#" class="text-white hover:text-blue-400">Home</a>
          <a href="#" class="text-white hover:text-blue-400">Categories</a>
          <a href="#" class="text-white hover:text-blue-400">Countries</a>
          <a href="#" class="text-white hover:text-blue-400">Featured</a>
          <a href="#" class="text-white hover:text-blue-400">About</a>
        </nav>
        <div class="flex items-center space-x-4">
          <button class="text-white hover:text-blue-400">🔍</button>
          <button class="text-white hover:text-blue-400">🛒</button>
          <button class="text-white hover:text-blue-400">👤</button>
        </div>
      </div>
    </div>
  </header>

  <!-- Hero Section with Prominent Logo -->
  <section class="relative min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-600 text-white overflow-hidden flex items-center pt-24">
    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-20 left-20 w-20 h-20 bg-pink-300 rounded-full opacity-30 animate-bounce delay-100"></div>
      <div class="absolute top-40 right-32 w-16 h-16 bg-yellow-300 rounded-full opacity-25 animate-bounce delay-300"></div>
      <div class="absolute bottom-32 left-32 w-24 h-24 bg-purple-300 rounded-full opacity-20 animate-bounce delay-500"></div>
      <div class="absolute bottom-20 right-20 w-12 h-12 bg-blue-300 rounded-full opacity-30 animate-bounce delay-700"></div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 relative z-20 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[80vh]">
        <!-- Left Side - Logo and Content -->
        <div class="text-center lg:text-left space-y-6">
          <!-- Badge -->
          <div class="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 animate-fade-in-down">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-sm font-medium">🌍 50+ Countries • 🍭 1000+ Products</span>
          </div>

          <!-- Prominent Logo -->
          <div class="flex justify-center lg:justify-start mb-8">
            <div class="relative group">
              <!-- Glow effect behind logo -->
              <div class="absolute inset-0 bg-gradient-to-r from-pink-400/30 via-yellow-400/30 to-orange-400/30 rounded-full blur-2xl scale-110 animate-pulse"></div>
              
              <!-- Main logo -->
              <img 
                src="/sweetlogo-removebg-preview.png" 
                alt="Sweet Trip Logo" 
                class="relative z-10 h-32 md:h-40 lg:h-48 xl:h-56 w-auto object-contain animate-fade-in-down hover:scale-105 transition-transform duration-500 cursor-pointer"
                style="background-color: transparent"
              />
              
              <!-- Animated ring around logo -->
              <div class="absolute inset-0 rounded-full border-4 border-white/30 animate-spin-slow"></div>
              <div class="absolute inset-2 rounded-full border-2 border-yellow-300/50 animate-spin-slow-reverse"></div>
            </div>
          </div>

          <!-- Subtitle - Now more prominent since logo is the main focus -->
          <div class="text-center lg:text-left mb-6">
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 animate-fade-in-up delay-200">
              Discover Sweet Adventures
            </h2>
            <p class="text-xl md:text-2xl bg-gradient-to-r from-pink-300 via-yellow-300 to-orange-300 bg-clip-text text-transparent font-bold animate-gradient-x delay-300">
              From Around the World
            </p>
          </div>

          <!-- Description -->
          <p class="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl animate-fade-in-up delay-400">
            Embark on a <span class="font-bold text-yellow-300">sweet adventure</span> and discover exotic flavors, 
            unique treats, and authentic candies from every corner of the globe.
          </p>
          
          <!-- CTA Section -->
          <div class="text-center lg:text-left animate-fade-in-up delay-500">
            <div class="inline-flex items-center space-x-2 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-full px-4 py-2 mb-4 animate-pulse">
              <span class="text-red-300 text-sm font-bold">⚡ LIMITED TIME</span>
              <span class="text-yellow-300 text-sm">Free shipping on orders $60+</span>
            </div>
            
            <h3 class="text-2xl md:text-3xl font-bold text-white mb-2">
              Ready to <span class="text-yellow-300">explore</span>?
            </h3>
            <p class="text-lg text-white/80 mb-4">
              Choose your adventure and start discovering amazing treats!
            </p>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start animate-fade-in-up delay-600">
            <button class="group relative bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white px-10 py-6 rounded-3xl font-black text-xl hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 transition-all duration-500 flex items-center justify-center space-x-4 shadow-2xl hover:shadow-pink-500/40 hover:scale-110 transform border-2 border-white/20 hover:border-white/40">
              <span class="text-2xl">🍭</span>
              <div class="flex flex-col items-start">
                <span>Shop Featured</span>
                <span class="text-sm font-normal opacity-90">Limited Edition</span>
              </div>
              <span class="text-2xl">→</span>
            </button>
            
            <button class="group relative bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white px-10 py-6 rounded-3xl font-black text-xl hover:from-emerald-600 hover:via-teal-700 hover:to-cyan-700 transition-all duration-500 flex items-center justify-center space-x-4 shadow-2xl hover:shadow-emerald-500/40 hover:scale-110 transform border-2 border-white/20 hover:border-white/40">
              <span class="text-2xl">🌍</span>
              <div class="flex flex-col items-start">
                <span>Explore Categories</span>
                <span class="text-sm font-normal opacity-90">50+ Countries</span>
              </div>
              <span class="text-2xl">→</span>
            </button>
          </div>
        </div>

        <!-- Right Side - Visual Elements -->
        <div class="relative hidden lg:block h-full">
          <!-- Floating candy icons -->
          <div class="absolute top-5 left-5 text-5xl animate-bounce delay-100">🍬</div>
          <div class="absolute top-16 right-8 text-4xl animate-bounce delay-300">🍭</div>
          <div class="absolute top-32 left-2 text-3xl animate-bounce delay-500">🍫</div>
          <div class="absolute bottom-32 right-2 text-4xl animate-bounce delay-700">🍪</div>
          <div class="absolute bottom-16 left-16 text-3xl animate-bounce delay-900">🍩</div>
          <div class="absolute top-1/2 left-8 text-3xl animate-bounce delay-1100">🍰</div>
          
          <!-- Central visual -->
          <div class="relative mx-auto w-96 h-96 mt-8">
            <div class="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
            <div class="relative w-full h-full bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
              <div class="text-9xl animate-spin-slow">🌍</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <div class="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
        <div class="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-800 text-white py-12">
    <div class="container mx-auto px-4 text-center">
      <div class="flex justify-center mb-6">
        <img src="/sweetlogo-removebg-preview.png" alt="Sweet Trip Logo" class="h-12 w-12">
      </div>
      <p class="text-gray-400">&copy; 2024 Sweet Trip. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;

  fs.writeFileSync('dist/index.html', htmlContent);
  console.log('✅ Created updated HTML with prominent logo');

  // Create assets directory
  fs.mkdirSync('dist/assets', { recursive: true });

  console.log('🎉 Rebuild completed successfully!');
  console.log('📁 Files created in dist/ directory');

} catch (error) {
  console.error('❌ Error during rebuild:', error.message);
  process.exit(1);
}

