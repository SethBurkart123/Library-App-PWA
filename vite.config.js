import { defineConfig } from 'vite'
import postcss from './postcss.config.js'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'


// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  css: {
    postcss,
  },
  base: '/Library-App-PWA/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Library App',
        short_name: 'Library App',
        description: 'Library App',
        theme_color: '#24110a',
        icons: [
          {
            src: '192x192.png',
            sizes: '192x192',
            type: 'image/png',
            revision: '1',
          },
          {
            src: '512x512.png',
            sizes: '512x512',
            type: 'image/png',
            revision: '2',
          },
          {
            src: 'any-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
            revision: '3',
          }
        ]
      }
    })
  ],
  resolve: {
    alias: [
      {
        find: /^~.+/,
        replacement: (val) => {
          return val.replace(/^~/, "");
        },
      },
    ],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    outDir: 'build',
  }
})
