import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const path = require('path');

// https://vitejs.dev/config/
export default defineConfig(mode => {
  return {
    plugins: [vue(), basicSsl(), nodePolyfills()],
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      port: 8080,
      host: 'localhost',
      https: {
        maxSessionMemory: 100
      }
    },
    define: {
      global: {},
      process: {
        env: process.env,
        version: process.version,
        browser: process.browser
      }
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      }
    }
  };
});
