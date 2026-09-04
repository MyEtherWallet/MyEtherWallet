import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import i18n from '@/i18n'
import TradeSelectAssetModal from '@/modules/trade/components/TradeSelectAssetModal.vue'
import { useChainsStore } from '@/stores/chainsStore'

const asset = (symbol: string, address: string, extra = {}) => ({
  symbol,
  address,
  name: `${symbol} Inc.`,
  decimals: 18,
  price: 100,
  logoURI: '',
  priceChangePercentage24h: 1,
  ...extra,
})

const AAPL = asset('AAPLON', '0x0000000000000000000000000000000000000001')
const ABNB = asset('ABNBON', '0x0000000000000000000000000000000000000002')
const ABT = asset('ABTON', '0x0000000000000000000000000000000000000003', {
  pauseReason: 'maintenance',
})
const ACN = asset('ACNON', '0x0000000000000000000000000000000000000004')

const mountOpenModal = async (props: Record<string, unknown> = {}) => {
  const pinia = createPinia()
  setActivePinia(pinia)
  useChainsStore().isLoaded = true

  const wrapper = mount(TradeSelectAssetModal, {
    props: {
      side: 'buy',
      chainTokens: [AAPL, ABNB, ABT, ACN],
      ...props,
    } as never,
    slots: {
      trigger: ({ open }: { open: () => void }) =>
        h('button', { 'data-testid': 'open', onClick: open }),
    },
    global: { plugins: [pinia, i18n] },
    attachTo: document.body,
  })
  await wrapper.find('[data-testid="open"]').trigger('click')
  await nextTick()
  return wrapper
}

const rowTickers = () =>
  Array.from(document.querySelectorAll('#app [role="dialog"] .h-\\[68px\\]'))
    .map(row => row.querySelector('p')?.textContent?.trim())
    .filter(Boolean)

describe('TradeSelectAssetModal (buy)', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>'
  })

  it('keeps the list flat when nothing is unavailable for the session', async () => {
    await mountOpenModal()

    expect(rowTickers()).toEqual(['aaplon', 'abnbon', 'abton', 'acnon'])
    expect(document.body.textContent).not.toContain('Unavailable assets')
  })

  it('moves session-unavailable assets below a subtitle, keeping paused ones inline', async () => {
    await mountOpenModal({ disabledTokens: [AAPL.address, ACN.address] })

    expect(rowTickers()).toEqual(['abnbon', 'abton', 'aaplon', 'acnon'])

    const dialogText = document.querySelector(
      '#app [role="dialog"]',
    )!.textContent!
    const subtitleAt = dialogText.indexOf('Unavailable assets')
    expect(subtitleAt).toBeGreaterThan(dialogText.indexOf('abton'))
    expect(subtitleAt).toBeLessThan(dialogText.indexOf('aaplon'))
    expect(dialogText.match(/Unavailable assets/g)).toHaveLength(1)
  })

  it('keeps every row at its fixed height even when the list overflows', async () => {
    await mountOpenModal()

    const rows = document.querySelectorAll('#app [role="dialog"] .h-\\[68px\\]')
    expect(rows.length).toBeGreaterThan(0)
    rows.forEach(row => expect(row.classList.contains('flex-none')).toBe(true))
  })

  it('renders the ticker suffix without the stock gradient', async () => {
    await mountOpenModal()

    expect(
      document.querySelector('#app [role="dialog"] .bg-stock-gradient'),
    ).toBeNull()
  })
})
