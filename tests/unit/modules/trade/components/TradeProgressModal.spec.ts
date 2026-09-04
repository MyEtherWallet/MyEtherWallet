import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import i18n from '@/i18n'
import TradeProgressModal from '@/modules/trade/components/TradeProgressModal.vue'
import { useWalletStore } from '@/stores/walletStore'
import {
  useTradeOrdersStore,
  type SavedTradeOrder,
} from '@/stores/tradeOrdersStore'
import type { NewTokenInfo } from '@/composables/useSwap'

const AppDialogStub = {
  props: { isOpen: { type: Boolean, default: false } },
  template:
    '<div v-if="isOpen"><slot name="title" /><slot name="content" /></div>',
}

const ADDRESS = '0x717ba71d4ea77d1b7c49a913c28c0bd538eecd41'
const HASH = '0x' + 'ab'.repeat(32)
const TX_HASH = '0x' + 'cd'.repeat(32)

const usdt = {
  symbol: 'USDT',
  decimals: 6,
  address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  logoURI: '',
} as NewTokenInfo

const aalon = {
  symbol: 'AALON',
  decimals: 18,
  address: '0x0000000000000000000000000000000000000002',
  logoURI: '',
} as NewTokenInfo

const makeOrder = (over: Partial<SavedTradeOrder> = {}): SavedTradeOrder => ({
  hash: HASH,
  status: 'pending',
  fromAmount: '12.947536',
  fromSymbol: 'USDT',
  fromDecimals: 6,
  fromTokenAddress: usdt.address,
  expectedToAmount: '0.8952',
  toSymbol: 'AALON',
  toDecimals: 18,
  toTokenAddress: aalon.address,
  createdAt: 1755700000,
  duration: 180,
  fills: [],
  chainId: 1,
  chainName: 'Ethereum',
  fromAddress: ADDRESS,
  seen: false,
  ...over,
})

let pinia: Pinia

const mountModal = (order: SavedTradeOrder | null = makeOrder()) => {
  const walletStore = useWalletStore()
  walletStore.walletAddress = ADDRESS
  if (order) {
    useTradeOrdersStore().addOrder(order)
  }
  return mount(TradeProgressModal, {
    props: {
      isOpen: true,
      orderHash: HASH,
      fromToken: usdt,
      toToken: aalon,
    },
    global: {
      plugins: [i18n, pinia],
      stubs: { AppDialog: AppDialogStub },
    },
  })
}

describe('TradeProgressModal', () => {
  beforeEach(() => {
    localStorage.clear()
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('shows the processing state while the order is pending', () => {
    const modal = mountModal()
    expect(modal.text()).toContain('Processing trade...')
    expect(modal.text()).toContain('It may take a moment to complete the trade')
    expect(modal.text()).toContain(
      'The trade will be processed in the background',
    )
    expect(modal.find('a').exists()).toBe(false)
  })

  it('shows the completed state with the received amount and explorer link', () => {
    const modal = mountModal(
      makeOrder({
        status: 'filled',
        finalToAmount: '0.8952',
        fills: [{ txHash: TX_HASH }],
      }),
    )
    expect(modal.text()).toContain('Trade completed')
    expect(modal.text()).toContain('You received 0.8952 AALON')
    const link = modal.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toContain(`/tx/${TX_HASH}`)
    expect(link.text()).toContain('Show in Etherscan')
  })

  it('omits the explorer link when the order has no fills', () => {
    const modal = mountModal(
      makeOrder({ status: 'filled', finalToAmount: '0.8952' }),
    )
    expect(modal.text()).toContain('Trade completed')
    expect(modal.find('a').exists()).toBe(false)
  })

  it('shows the failure state for an expired order', () => {
    const modal = mountModal(makeOrder({ status: 'expired' }))
    expect(modal.text()).toContain('Trade not completed')
    expect(modal.text()).toContain('The order expired without being filled')
  })

  it('closes through the close pill', async () => {
    const modal = mountModal()
    const close = modal
      .findAll('button')
      .find(button => button.text().includes('Close this screen'))
    await close!.trigger('click')
    expect(modal.emitted('update:isOpen')).toEqual([[false]])
  })
})
