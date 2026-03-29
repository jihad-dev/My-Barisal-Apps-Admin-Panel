import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'E-Commerce Shop',
        short_name: 'Shop',
        description: 'আমাদের অনলাইন শপ',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
  {
    src: '/icon-192.png',
    sizes: '192x192',
    type: 'image/png'
  },
  {
    src: '/icon-512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any'           // ← 'any maskable' এর বদলে শুধু 'any'
  },
  {
    src: '/icon-512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable'      // ← আলাদা entry
  }
]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24
              }
            }
          }
        ]
      }
    })
  ]
})