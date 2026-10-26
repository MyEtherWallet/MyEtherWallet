import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

// Plain ref holders so the mocked stores stay reactive; storeToRefs is stubbed
// to a passthrough below.
const h = vi.hoisted(() => ({
  wallet: null as unknown as { value: unknown },
  walletAddress: null as unknown as { value: string | null },
}))

const SIGNER = '0x1111111111111111111111111111111111111111'
const TO = '0x2222222222222222222222222222222222222222'
const OTHER = '0x3333333333333333333333333333333333333333'

vi.mock('@/stores/walletStore', async () => {
  const { ref, computed } = await import('vue')
  h.wallet = ref(null)
  h.walletAddress = ref(null)
  return {
    MAIN_TOKEN_CONTRACT: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    useWalletStore: () => ({
      wallet: h.wallet,
      walletAddress: h.walletAddress,
      isWalletConnected: computed(
        () => h.wallet.value !== null && h.walletAddress.value !== null,
      ),
      isLoadingBalances: ref(false),
      balanceWei: ref('10000000000000000000'),
      isWatchOnly: ref(false),
      hasChainBalance: ref(true),
      getTokenBalance: (contract: string) => ({
        contract,
        symbol: 'ETH',
        decimals: 18,
        balance: '10',
        balanceWei: '10000000000000000000',
        price: 1,
      }),
    }),
  }
})
vi.mock('@/stores/globalStore', async () => {
  const { ref } = await import('vue')
  const gasPriceType = ref('ECONOMY')
  return { useGlobalStore: () => ({ gasPriceType }) }
})
vi.mock('@/stores/chainsStore', async () => {
  const { ref } = await import('vue')
  const store = {
    selectedChain: ref({ name: 'ETHEREUM', chainID: '1', type: 'EVM' }),
    isEvmChain: ref(true),
    isBitcoinChain: ref(false),
  }
  return { useChainsStore: () => store }
})
vi.mock('@/stores/inputStore', async () => {
  const { ref } = await import('vue')
  return {
    useInputStore: () => ({
      storeSendValues: vi.fn(),
      clearSendValues: vi.fn(),
      hasSendValues: ref(false),
      sendValues: ref({}),
    }),
  }
})
vi.mock('@/stores/addressBook', () => ({
  useAddressBookStore: () => ({
    inAddressBook: () => false,
    addRecentAddress: vi.fn(),
  }),
}))
vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({ addToastMessage: vi.fn() }),
}))
vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => ({ openAccessDialog: vi.fn() }),
}))
vi.mock('@/composables/useAddressInput', async () => {
  const { ref } = await import('vue')
  return {
    useAddressInput: () => ({
      adrInput: ref(TO),
      adrError: ref(''),
      resolvedAddress: ref(TO),
      isValidAdrInput: ref(true),
      onInput: vi.fn(),
      validateAddressInput: vi.fn(),
      clearAddressInput: vi.fn(),
    }),
  }
})
vi.mock('@/composables/useMaxAmount', async () => {
  const { ref } = await import('vue')
  return {
    useMaxAmount: () => ({
      setMaxAmount: vi.fn(),
      resetMaxState: vi.fn(),
      isInternalWallet: () => true,
      isMaxSelected: ref(false),
    }),
  }
})
vi.mock('@/analytics', () => ({
  analytics: { trackSendEvent: vi.fn(), trackConnectWalletEvent: vi.fn() },
  ConnectWalletEvent: {},
  SendEvent: {},
  SendEventError: {},
}))
vi.mock('vue-i18n', async importOriginal => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return { ...actual, useI18n: () => ({ t: (k: string) => k }) }
})
vi.mock('pinia', async importOriginal => {
  const actual = await importOriginal<typeof import('pinia')>()
  return { ...actual, storeToRefs: (store: Record<string, unknown>) => store }
})

import ModuleSend from '@/modules/send/ModuleSend.vue'

const AppEnterAmount = {
  name: 'AppEnterAmount',
  props: ['amount'],
  emits: ['update:amount'],
  template: '<div />',
}
const AppSelectTxFee = {
  name: 'AppSelectTxFee',
  props: ['txRequestBody'],
  emits: ['fee-is-loading'],
  template: '<div />',
}
const AppBaseButton = {
  name: 'AppBaseButton',
  props: ['disabled', 'isLoading'],
  emits: ['click'],
  template:
    '<button :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
}
const stubs = {
  AppBaseButton,
  AppEnterAmount,
  AddressInput: { template: '<div />' },
  AppSelectTxFee,
  AppNoChainBalance: { template: '<div />' },
  AppNeedHelp: { template: '<div />' },
  EvmTransactionConfirmation: { template: '<div />' },
  SendInitiatedModal: { template: '<div />' },
}

const makeWallet = () => ({
  getAddress: vi.fn(() => Promise.resolve(SIGNER)),
  getWalletType: () => 'KEYSTORE',
  getGasFee: vi.fn(() =>
    Promise.resolve({
      quoteId: 'q1',
      fees: { ECONOMY: { nativeValue: '0x1' } },
    }),
  ),
  getSignableTransaction: vi.fn(() => Promise.resolve({ serialized: '0x02' })),
})

const clickSend = async (w: ReturnType<typeof mount>) => {
  const btn = w.findAll('button').find(b => b.text().trim() === 'common.send')
  expect(btn).toBeDefined()
  await btn!.trigger('click')
  await flushPromises()
}

describe('ModuleSend quote request', () => {
  beforeEach(() => {
    h.wallet.value = null
    h.walletAddress.value = null
  })

  // APP-MEW-WEB-PJ: the Send panel stays mounted while the user connects a
  // wallet. The from-address was read once on mount, so the quote went out for
  // 0x0 and the API built the tx with 0x0's nonce (0) → "nonce too low".
  it('quotes for the wallet connected after the panel mounted', async () => {
    const w = mount(ModuleSend, {
      global: { stubs, mocks: { $t: (k: string) => k } },
    })
    await flushPromises()

    const wallet = makeWallet()
    h.wallet.value = wallet
    h.walletAddress.value = SIGNER
    w.findComponent(AppEnterAmount).vm.$emit('update:amount', '0.1')
    w.findComponent(AppSelectTxFee).vm.$emit('fee-is-loading', false)
    await flushPromises()

    await clickSend(w)

    expect(wallet.getGasFee).toHaveBeenCalled()
    expect(wallet.getGasFee.mock.calls[0][0]).toMatchObject({
      address: SIGNER,
      to: TO,
    })
  })

  it('rebuilds the fee estimate when the sender changes on a filled form', async () => {
    const w = mount(ModuleSend, {
      global: { stubs, mocks: { $t: (k: string) => k } },
    })
    h.wallet.value = makeWallet()
    h.walletAddress.value = SIGNER
    w.findComponent(AppEnterAmount).vm.$emit('update:amount', '0.1')
    // let the debounced estimate watcher run for the first sender
    await new Promise(r => setTimeout(r, 600))
    const fee = w.findComponent(AppSelectTxFee)
    expect(fee.props('txRequestBody')).toMatchObject({ address: SIGNER })

    h.walletAddress.value = OTHER
    await flushPromises()

    expect(fee.props('txRequestBody')).toMatchObject({ address: OTHER })
  })
})
