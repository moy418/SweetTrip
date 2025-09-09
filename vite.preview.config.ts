import { defineConfig } from 'vite'
export default defineConfig({
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: [
      'elpfurniturestyle.com',
      'www.elpfurniturestyle.com',
      'sweettripcandy.com',
      'www.sweettripcandy.com',
      'localhost',
      '127.0.0.1'
    ],
  },
})
