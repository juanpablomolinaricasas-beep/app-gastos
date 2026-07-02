import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Repo name used as the GitHub Pages base path (https://<user>.github.io/app-gastos/).
// Override locally with BASE_PATH=/ if you deploy to a domain root instead.
const base = process.env.BASE_PATH ?? '/app-gastos/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Gastos — control personal',
        short_name: 'Gastos',
        description: 'App de gastos personales con rachas e insignias, 100% local.',
        start_url: base,
        scope: base,
        display: 'standalone',
        background_color: '#f2f1ef',
        theme_color: '#3b6fdb',
        lang: 'es',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      },
    }),
  ],
});
