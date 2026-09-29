import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import i18n from '@/i18n'
import TradeOrderContainer from '@/modules/notifications/components/TradeOrderContainer.vue'
import type { SavedTradeOrder } from '@/stores/tradeOrdersStore'

const HASH = '0x' + 'ab'.repeat(32)
const DEPOSIT_TX = '0x' + 'cd'.repeat(32)
const RECOVERY_TX = '0x' + 'ef'.repeat(32)

const makeOrder = (over: Partial<SavedTradeOrder> = {}): SavedTradeOrder => ({
  hash: HASH,
  status: 'pending',
  fromAmount: '1',
  fromSymbol: 'ETH',
  fromDecimals: 18,
  fromTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  expectedToAmount: '3000',
  toSymbol: 'USDC',
  toDecimals: 6,
  toTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  createdAt: 1755700000,
  duration: 180,
  fills: [],
  chainId: 1,
  chainName: 'ETHEREUM',
  fromAddress: '0x717ba71d4ea77d1b7c49a913c28c0bd538eecd41',
  ...over,
})

const mountCard = (order: SavedTradeOrder, recovering = false) =>
  mount(TradeOrderContainer, {
    props: { order, remainingTime: 120, recovering },
    global: { plugins: [i18n, createPinia()] },
  })

const recoverButton = (card: ReturnType<typeof mountCard>) =>
  card
    .findAll('button')
    .find(
      button =>
        button.text().includes('Recover funds') ||
        button.text().includes('Recovering...'),
    )

describe('TradeOrderContainer', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('offers to recover the deposit of an unsubmitted native order', async () => {
    const order = makeOrder({
      status: 'unsubmitted',
      depositTxHash: DEPOSIT_TX,
      proxyAddress: '0x1111111111111111111111111111111111111111',
    })
    const card = mountCard(order)

    expect(card.text()).toContain('Not placed')
    expect(card.text()).toContain('deposit reached 1inch escrow')
    const button = recoverButton(card)
    expect(button).toBeDefined()
    await button!.trigger('click')
    expect(card.emitted('recover')).toEqual([[order]])
  })

  it('disables the recovery action while a recovery is in flight', () => {
    const card = mountCard(makeOrder({ status: 'unsubmitted' }), true)
    const button = recoverButton(card)
    expect(button!.text()).toContain('Recovering...')
    expect(button!.attributes('disabled')).toBeDefined()
  })

  it('shows no recovery action for ordinary order states', () => {
    for (const status of ['pending', 'filled', 'cancelled', 'expired']) {
      expect(recoverButton(mountCard(makeOrder({ status })))).toBeUndefined()
    }
  })

  it('links the deposit and recovery transactions in the details', async () => {
    const card = mountCard(
      makeOrder({
        status: 'recovered',
        depositTxHash: DEPOSIT_TX,
        recoveryTxHash: RECOVERY_TX,
      }),
    )
    expect(card.text()).toContain('Funds recovered')
    const links = card.findAll('a').map(a => a.attributes('href'))
    expect(links).toEqual([
      expect.stringContaining(`/tx/${DEPOSIT_TX}`),
      expect.stringContaining(`/tx/${RECOVERY_TX}`),
    ])
    expect(recoverButton(card)).toBeUndefined()
  })
})
