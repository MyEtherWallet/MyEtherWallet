import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Every page that hosts the connect/create overlay routes must render a <router-view/>,
 * or the overlay silently never mounts and the CTA dead-ends with no error anywhere.
 * That failure is invisible to the shape and navigation specs — hence this cheap check.
 */
const HOST_VIEWS = [
  'ViewHome.vue',
  'ViewPortfolio.vue',
  'ViewCrypto.vue',
  'ViewStocks.vue',
  'ViewPerps.vue',
  'ViewSignMessage.vue',
  'ViewVerifyMessage.vue',
  'ViewTemp.vue', // the /earn route
  'ViewTokenInfo.vue',
  'ViewStockInfo.vue',
  'ViewPerpInfo.vue',
]

describe('wallet-flow host views', () => {
  it.each(HOST_VIEWS)('%s renders a <router-view/> outlet', name => {
    const source = readFileSync(
      resolve(__dirname, '../../../src/views', name),
      'utf8',
    )
    expect(source).toMatch(/<router-view|<RouterView/)
  })
})
