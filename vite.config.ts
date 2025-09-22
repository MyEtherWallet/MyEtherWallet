import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import nightwatchPlugin from 'vite-plugin-nightwatch'
import vueDevTools from 'vite-plugin-vue-devtools'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [
    vue(),
    viteCommonjs({ skipPreBuild: true }),
    nightwatchPlugin(),
    vueDevTools(),
    nodePolyfills({
      include: [
        'crypto',
        'buffer',
        'util',
        'stream',
        'url',
        'http',
        'https',
        'path',
      ],
      protocolImports: true,
    }),
    basicSsl(),
  ],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ['vue', '@vueuse/core', 'crypto', '@enkryptcom/hw-wallets'],
    exclude: ['@trezor/connect', '@trezor/connect-web']
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@view-default': fileURLToPath(
        new URL('./src/views/default', import.meta.url),
      ),
      '@view-wallet': fileURLToPath(
        new URL('./src/views/wallet', import.meta.url),
      ),
      '@components': fileURLToPath(
        new URL('./src/components', import.meta.url),
      ),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@modules': fileURLToPath(new URL('./src/modules', import.meta.url)),
    },
  },
})
