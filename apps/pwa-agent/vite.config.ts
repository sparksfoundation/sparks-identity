import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  appType: 'spa',
  base: '/',
  publicDir: 'public',
  envDir: './src/config',
  envPrefix: 'PUBLIC_',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['fonts/*.ttf', '*.svg'],
      manifest: {
        name: 'sparks-id',
        short_name: 'sparks-id',
        description: 'sparks identity wallet',
        start_url: '/',
        display: 'standalone',
        background_color: '#151515',
        theme_color: '#151515',
        lang: 'en',
        scope: '/',
        icons: [
          {
            src: "icons/manifest-icon-192.maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "icons/manifest-icon-192.maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "icons/manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "icons/manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      }
    }),
    tsconfigPaths(),
  ],
})