import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { version } from './package.json'
import vue from '@vitejs/plugin-vue'
import nightwatchPlugin from 'vite-plugin-nightwatch'
import vueDevTools from 'vite-plugin-vue-devtools'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import wasm from 'vite-plugin-wasm'
import tailwindcss from '@tailwindcss/vite'

process.env.VITE_APP_VERSION = version

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [
    tailwindcss(),
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
    wasm(),
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
    target: 'esnext',
  },
  optimizeDeps: {
    include: ['vue', '@vueuse/core', 'crypto', '@enkryptcom/hw-wallets'],
  },
  resolve: {
    alias: [
      {
        find: /^@ledgerhq\/hw-app-eth\/lib\/services\/ledger$/,
        replacement: fileURLToPath(
          new URL(
            './node_modules/@ledgerhq/hw-app-eth/lib/services/ledger/index.js',
            import.meta.url,
          ),
        ),
      },
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      {
        find: '@view-default',
        replacement: fileURLToPath(new URL('./src/views/default', import.meta.url)),
      },
      {
        find: '@view-wallet',
        replacement: fileURLToPath(new URL('./src/views/wallet', import.meta.url)),
      },
      {
        find: '@components',
        replacement: fileURLToPath(new URL('./src/components', import.meta.url)),
      },
      {
        find: '@assets',
        replacement: fileURLToPath(new URL('./src/assets', import.meta.url)),
      },
      {
        find: '@modules',
        replacement: fileURLToPath(new URL('./src/modules', import.meta.url)),
      },
    ],
  },
})
