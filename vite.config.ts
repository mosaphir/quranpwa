import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(),
    VitePWA({
        registerType: 'autoUpdate',
        workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
            runtimeCaching: [{
                handler: 'CacheFirst',
                urlPattern: /.*\.json$/,
                options: { cacheName: 'jsonData' }
            }, {
                handler: 'CacheFirst',
                urlPattern: /.*\.mp3$/,
                options: { cacheName: 'audioData', rangeRequests: true }
            }]
        },
        manifest: {
            name: 'Quran Majid',
            short_name: 'Quran',
            description: 'Quran Majid',
            theme_color: '#000',
            display: 'standalone',
            icons: [
                {
                    src: '/images/quran-rehal.svg',
                    sizes: "48x48 72x72 96x96 128x128 144x144 256x256",
                    type: "image/svg+xml",
                    purpose: "any"
                }
            ]
        }
    })],
})
