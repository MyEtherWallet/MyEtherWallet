import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import nightwatchPlugin from 'vite-plugin-nightwatch'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), nightwatchPlugin(), vueDevTools()],
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
    }
  }
})
