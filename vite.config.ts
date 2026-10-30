import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import laravel from 'laravel-vite-plugin'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const installedPackageJson = resolve(import.meta.dirname, 'node_modules/@axolotesource/ui/package.json')
const localPackageJson = resolve(import.meta.dirname, '../ui/package.json')

const axoloteUiPackage = JSON.parse(readFileSync(existsSync(installedPackageJson) ? installedPackageJson : localPackageJson, 'utf8'))

const sharedDependencies = Array.from(
  new Set([...Object.keys(axoloteUiPackage.dependencies ?? {}), ...Object.keys(axoloteUiPackage.peerDependencies ?? {})])
)

export default defineConfig(({ command }) => ({
  plugins: [
    laravel({
      input: ['resources/js/main.tsx'],
      refresh: ['resources/js/**', 'resources/views/**', 'routes/**']
    }),
    react(),
    tailwindcss()
  ],
  server: {
    // Vite bloquea el WebSocket de HMR si el Host no está permitido. Con Herd/Valet
    // el dev server vive en https://<sitio>.test, así que aceptamos esos hosts.
    allowedHosts: ['.test'],
    watch: {
      ignored: ['**/storage/**', 'app/**'],
      usePolling: true
    }
  },
  resolve: {
    dedupe: sharedDependencies,
    alias: [
      ...(command === 'serve'
        ? [
            {
              find: '@axolotesource/ui/styles.css',
              replacement: resolve(import.meta.dirname, '../ui/src/styles/index.css')
            },
            {
              find: /^@axolotesource\/ui$/,
              replacement: resolve(import.meta.dirname, '../ui/src/index.ts')
            },
            {
              find: /^@axolotesource\/ui\//,
              replacement: resolve(import.meta.dirname, '../ui/src') + '/'
            }
          ]
        : []),
      {
        find: '@',
        replacement: resolve(import.meta.dirname, 'resources/js')
      }
    ]
  },
  build: {
    target: ['chrome111', 'edge111', 'firefox113', 'safari16.4'],
    reportCompressedSize: false,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
            return 'react-vendor'
          }

          if (id.includes('@mantine') || id.includes('mantine-datatable')) {
            return 'mantine'
          }

          if (id.includes('@radix-ui')) {
            return 'radix'
          }

          if (id.includes('@headlessui')) {
            return 'headlessui'
          }

          if (id.includes('@tanstack')) {
            return 'tanstack'
          }

          if (id.includes('react-router') || id.includes('i18next') || id.includes('react-i18next')) {
            return 'router-i18n'
          }

          if (id.includes('@reduxjs') || id.includes('/redux/') || id.includes('reselect')) {
            return 'redux'
          }

          if (id.includes('formik') || id.includes('yup')) {
            return 'formik'
          }

          if (id.includes('lucide-react')) {
            // Los iconos de `lucide-react/dynamic` se importan bajo demanda. Si se
            // agrupan aquí, los ~4.5k iconos terminan en un chunk de ~860 kB que la
            // entrada carga siempre. Dejarlos fuera mantiene solo los estáticos.
            if (/[\\/]lucide-react[\\/]dist[\\/]esm[\\/]icons[\\/]/.test(id)) {
              return
            }

            return 'icons'
          }

          if (id.includes('/axios/') || id.includes('axios')) {
            return 'axios'
          }

          return undefined
        }
      }
    }
  }
}))
