import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
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

/**
 * GEO / AI-crawler assets.
 *
 * AI search engines (ChatGPT, Perplexity, Google AI) weight freshness, so
 * index.html declares `dateModified` and the sitemap declares `lastmod`. Both
 * are stamped at build time here instead of being hardcoded, so they can never
 * silently go stale.
 *
 * Only routes registered with `meta.noAuth` in src/router/routesDefault.ts are
 * listed in the sitemap — every other path redirects to `/` for a visitor
 * without a wallet, so it is not a valid crawl target.
 */
const SITE_ORIGIN = 'https://app.myetherwallet.com'
const PUBLIC_ROUTES = [
  { path: '/', priority: '1.0' },
  { path: '/crypto', priority: '0.8' },
  { path: '/stocks', priority: '0.8' },
  { path: '/perps', priority: '0.8' },
  { path: '/earn', priority: '0.8' },
  { path: '/sign', priority: '0.5' },
  { path: '/verify', priority: '0.5' },
]

function geoAssetsPlugin(): Plugin {
  const isoDate = new Date().toISOString()
  const dayDate = isoDate.slice(0, 10)

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PUBLIC_ROUTES.map(
  ({ path, priority }) => `  <url>
    <loc>${SITE_ORIGIN}${path}</loc>
    <lastmod>${dayDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`,
).join('\n')}
</urlset>
`

  return {
    name: 'mew-geo-assets',
    transformIndexHtml(html) {
      return html
        .replaceAll('__BUILD_DATE__', isoDate)
        .replaceAll('__BUILD_DAY__', dayDate)
    },
    // Serve the generated sitemap in dev so it can be verified without a build.
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] !== '/sitemap.xml') return next()
        res.setHeader('Content-Type', 'application/xml')
        res.end(sitemap)
      })
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: sitemap,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [
    geoAssetsPlugin(),
    tailwindcss(),
    vue(),
    viteCommonjs({ skipPreBuild: true }),
    nightwatchPlugin(),
    basicSsl(),
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
