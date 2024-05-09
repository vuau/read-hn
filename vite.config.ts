import { defineConfig } from 'vite'
import vercel from 'vite-plugin-vercel'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
      }
    }
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        id: '/',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        name: 'Au read',
        short_name: 'Au read',
        description: 'a reader app by Au',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'images/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'images/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
        ],
        "screenshots": [
          {
            "src": "images/screenshot-mobile.png",
            "sizes": "461x821",
            "type": "image/png",
            "form_factor": "narrow",
            "label": "Au read"
          },
          {
            "src": "images/screenshot.png",
            "sizes": "805x547",
            "type": "image/png",
            "form_factor": "wide",
            "label": "Au read"
          }
        ]
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true
      }
    }),
    react(), vercel()],
})
