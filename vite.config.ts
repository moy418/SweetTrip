import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import sourceIdentifierPlugin from 'vite-plugin-source-identifier'

const isProd = process.env.BUILD_MODE === 'prod'
export default defineConfig({
  plugins: [
    react(), 
    sourceIdentifierPlugin({
      enabled: !isProd,
      attributePrefix: 'data-matrix',
      includeProps: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-accordion', '@radix-ui/react-toast'],
          'stripe-vendor': ['@stripe/react-stripe-js', '@stripe/stripe-js'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'query-vendor': ['@tanstack/react-query'],
          'chart-vendor': ['recharts'],
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority', 'zod', 'date-fns']
        }
      }
    },
    // Optimize chunk size limit
    chunkSizeWarningLimit: 600,
    // Use esbuild for minification (faster than terser)
    minify: 'esbuild',
    // Target modern browsers for better performance
    target: 'es2020',
    // Enable CSS minification
    cssMinify: true,
    // Source maps for debugging in production
    sourcemap: false
  },
  // Optimize dev server
  optimizeDeps: {
    include: ['react', 'react-dom', '@supabase/supabase-js']
  },
  // Performance optimizations
  esbuild: {
    drop: isProd ? ['console', 'debugger'] : [],
  }
})

