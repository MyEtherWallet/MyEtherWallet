import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'
import { commonGenerator } from '@/providers/ethereum/utils'

// Plain ref holders so the mocked stores stay reactive; storeToRefs is stubbed
// to a passthrough below.
const h = vi.hoisted(() => ({
  wallet: null as unknown as { value: unknown },
  walletAddress: null as unknown as { value: string | null },
  isMaxSelected: null as unknown as { value: boolean },
  applyMaxAmount: vi.fn(),
  /** Moves the form's amount the way the MAX composable does. */
  setAmount: (() => undefined) as (value: string) => void,
  addToastMessage: vi.fn(),
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
  useToastStore: () => ({ addToastMessage: h.addToastMessage }),
}))
vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => ({ openAccessDialog: vi.fn() }),
}))
// Only the confirmation dialog (stubbed below) reads this store; importing the
// real one pulls in the hardware-wallet configs, which Vitest can't load.
vi.mock('@/stores/watchOnlyStore', () => ({ useWatchOnlyStore: () => ({}) }))
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
  h.isMaxSelected = ref(false)
  return {
    useMaxAmount: (options: { onAmountChange: (value: string) => void }) => {
      h.setAmount = options.onAmountChange
      return {
        setMaxAmount: vi.fn(),
        resetMaxState: vi.fn(),
        applyMaxAmount: h.applyMaxAmount,
        canUseMax: () => true,
        isMaxSelected: h.isMaxSelected,
      }
    },
  }
})
vi.mock('@/analytics', () => ({
  analytics: {
    trackSendEvent: vi.fn(),
    trackSendErrorEvent: vi.fn(),
    trackConnectWalletEvent: vi.fn(),
  },
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
const EvmTransactionConfirmation = {
  name: 'EvmTransactionConfirmation',
  props: ['signedTx', 'modelValue'],
  template: '<div />',
}
const stubs = {
  AppBaseButton,
  AppEnterAmount,
  AddressInput: { template: '<div />' },
  AppSelectTxFee,
  AppNoChainBalance: { template: '<div />' },
  AppNeedHelp: { template: '<div />' },
  EvmTransactionConfirmation,
  SendInitiatedModal: { template: '<div />' },
}

type QuoteBody = { to: string; value: string; data: string }
/** The transaction MEW's API builds for a quoted request, as real bytes. */
const unsignedFor = (body: QuoteBody): string =>
  bytesToHex(
    FeeMarketEIP1559Transaction.fromTxData(
      {
        chainId: 1n,
        nonce: 7,
        to: body.to,
        value: BigInt(body.value),
        data: body.data,
        gasLimit: 21000,
        maxFeePerGas: 30_000_000_000n,
        maxPriorityFeePerGas: 2_000_000_000n,
      },
      { common: commonGenerator(1n, Hardfork.London) },
    ).serialize(),
  )
/** 0.1 ETH to TO: what `reviewWith` fills in. */
const REVIEWED_TX = unsignedFor({
  to: TO,
  value: '0x16345785d8a0000',
  data: '0x',
})

/**
 * A wallet backed by an API that behaves: the transaction it hands out is
 * built from the request it last quoted.
 */
const makeWallet = () => {
  let quoted: QuoteBody | undefined
  const getGasFee = vi.fn((body: QuoteBody) => {
    quoted = body
    return Promise.resolve({
      quoteId: 'q1',
      fees: { ECONOMY: { nativeValue: '0x1' } },
    })
  })
  return {
    getAddress: vi.fn(() => Promise.resolve(SIGNER)),
    getWalletType: () => 'KEYSTORE',
    getGasFee,
    getSignableTransaction: vi.fn(() =>
      Promise.resolve({ serialized: quoted ? unsignedFor(quoted) : '0x02' }),
    ),
  }
}

const clickSend = async (w: ReturnType<typeof mount>) => {
  // The CTA reads "Review send" once an amount is entered.
  const btn = w
    .findAll('button')
    .find(b => b.text().trim() === 'send.review-send')
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

describe('ModuleSend review', () => {
  beforeEach(() => {
    h.wallet.value = null
    h.walletAddress.value = null
    h.isMaxSelected.value = false
    h.applyMaxAmount.mockReset()
    h.addToastMessage.mockReset()
  })

  /** Fill the form with `wallet` connected and press "Review send". */
  const reviewWith = async (wallet: ReturnType<typeof makeWallet>) => {
    const w = mount(ModuleSend, {
      global: { stubs, mocks: { $t: (k: string) => k } },
    })
    await flushPromises()
    h.wallet.value = wallet
    h.walletAddress.value = SIGNER
    w.findComponent(AppEnterAmount).vm.$emit('update:amount', '0.1')
    w.findComponent(AppSelectTxFee).vm.$emit('fee-is-loading', false)
    await flushPromises()
    await clickSend(w)
    return w
  }

  it('has a private key wallet sign while the review is built', async () => {
    const SignTransaction = vi.fn(() => Promise.resolve({ signed: '0xsigned' }))
    const wallet = {
      ...makeWallet(),
      getWalletType: () => 'PRIVATE_KEY',
      SignTransaction,
    }

    const w = await reviewWith(wallet)

    expect(SignTransaction).toHaveBeenCalledTimes(1)
    expect(SignTransaction).toHaveBeenCalledWith(REVIEWED_TX)
    expect(w.findComponent(EvmTransactionConfirmation).props('signedTx')).toBe(
      '0xsigned',
    )
  })

  it('leaves a Privy wallet to sign on confirm, so nothing is signed before the user has seen the review', async () => {
    const SignTransaction = vi.fn(() => Promise.resolve({ signed: '0xsigned' }))
    const wallet = {
      ...makeWallet(),
      getWalletType: () => 'PRIVY',
      SignTransaction,
    }

    const w = await reviewWith(wallet)

    expect(SignTransaction).not.toHaveBeenCalled()
    const review = w.findComponent(EvmTransactionConfirmation)
    expect(review.props('modelValue')).toBe(true)
    expect(review.props('signedTx')).toBe(REVIEWED_TX)
  })

  it('leaves a wallet the user approves on elsewhere to sign on confirm', async () => {
    const SignTransaction = vi.fn(() => Promise.resolve({ signed: '0xsigned' }))
    const wallet = {
      ...makeWallet(),
      getWalletType: () => 'LEDGER',
      SignTransaction,
    }

    const w = await reviewWith(wallet)

    expect(SignTransaction).not.toHaveBeenCalled()
    expect(w.findComponent(EvmTransactionConfirmation).props('signedTx')).toBe(
      REVIEWED_TX,
    )
  })

  describe('while the wallet is still signing for the review', () => {
    /** A wallet that signs for the review; its signature arrives when the test says so. */
    const slowWallet = () => {
      let answer: (value: { signed: string }) => void = () => undefined
      const SignTransaction = vi.fn(
        () =>
          new Promise<{ signed: string }>(resolve => {
            answer = resolve
          }),
      )
      const wallet = {
        ...makeWallet(),
        getWalletType: () => 'PRIVATE_KEY',
        SignTransaction,
      }
      return {
        wallet,
        SignTransaction,
        sign: () => answer({ signed: '0xold' }),
      }
    }

    it('does not open the review over a transaction built for an amount changed since', async () => {
      const { wallet, SignTransaction, sign } = slowWallet()
      const w = await reviewWith(wallet)
      expect(SignTransaction).toHaveBeenCalledTimes(1)

      w.findComponent(AppEnterAmount).vm.$emit('update:amount', '5')
      await flushPromises()
      sign()
      await flushPromises()

      expect(
        w.findComponent(EvmTransactionConfirmation).props('modelValue'),
      ).toBe(false)
    })

    it('opens the review once the signature is in when nothing was changed', async () => {
      const { wallet, sign } = slowWallet()
      const w = await reviewWith(wallet)

      sign()
      await flushPromises()

      const review = w.findComponent(EvmTransactionConfirmation)
      expect(review.props('modelValue')).toBe(true)
      expect(review.props('signedTx')).toBe('0xold')
    })

    it('shows the send button as busy', async () => {
      const { wallet } = slowWallet()
      const w = await reviewWith(wallet)

      const sendButton = w
        .findAllComponents(AppBaseButton)
        .find(button => button.text().trim() === 'send.review-send')
      expect(sendButton?.props('isLoading')).toBe(true)
    })
  })

  // MEW's API builds the transaction; the user reviews the form. A wallet
  // that signs inside the app has no screen of its own to catch a difference.
  describe('a transaction that is not the one the form describes', () => {
    /** The API hands out a transaction paying someone else, or another sum. */
    const tampered = (
      walletType: string,
      body: QuoteBody = { to: OTHER, value: '0x16345785d8a0000', data: '0x' },
    ) => {
      const SignTransaction = vi.fn(() => Promise.resolve({ signed: '0xsig' }))
      const wallet = {
        ...makeWallet(),
        getWalletType: () => walletType,
        getSignableTransaction: vi.fn(() =>
          Promise.resolve({ serialized: unsignedFor(body) }),
        ),
        SignTransaction,
      }
      return { wallet, SignTransaction }
    }
    const review = (w: ReturnType<typeof mount>) =>
      w.findComponent(EvmTransactionConfirmation)

    it('is never signed by a private key wallet, and no review opens over it', async () => {
      const { wallet, SignTransaction } = tampered('PRIVATE_KEY')

      const w = await reviewWith(wallet)

      expect(SignTransaction).not.toHaveBeenCalled()
      expect(review(w).props('modelValue')).toBe(false)
      expect(review(w).props('signedTx')).toBe('')
      expect(h.addToastMessage).toHaveBeenCalledWith(
        expect.objectContaining({ text: 'send.toast.tx_mismatch' }),
      )
    })

    it('is refused for a recovery phrase wallet and for a Privy wallet alike', async () => {
      for (const type of ['MNEMONIC', 'PRIVY']) {
        const { wallet, SignTransaction } = tampered(type)

        const w = await reviewWith(wallet)

        expect(SignTransaction).not.toHaveBeenCalled()
        expect(review(w).props('modelValue')).toBe(false)
        w.unmount()
      }
    })

    it('is refused when only the amount differs', async () => {
      const { wallet } = tampered('PRIVATE_KEY', {
        to: TO,
        value: '0x16345785d8a0001',
        data: '0x',
      })

      const w = await reviewWith(wallet)

      expect(review(w).props('modelValue')).toBe(false)
    })

    it('is refused when it carries a call the form does not', async () => {
      const { wallet } = tampered('PRIVY', {
        to: TO,
        value: '0x16345785d8a0000',
        data: '0xdeadbeef',
      })

      const w = await reviewWith(wallet)

      expect(review(w).props('modelValue')).toBe(false)
    })

    it('is left to the wallet’s own screen when the wallet has one', async () => {
      // A hardware wallet or an extension shows what it is asked to sign.
      const { wallet } = tampered('LEDGER')

      const w = await reviewWith(wallet)

      expect(review(w).props('modelValue')).toBe(true)
    })
  })

  // MAX of the native token is the balance minus the fee, and the fee comes
  // from the quote taken at submit: that quote can move the amount by itself.
  describe('sending the maximum of the native token', () => {
    const quotedWallet = () => {
      let quotes = 0
      const wallet = makeWallet()
      const quote = wallet.getGasFee.getMockImplementation()!
      wallet.getGasFee.mockImplementation(async (body: QuoteBody) => ({
        ...(await quote(body)),
        quoteId: `q${++quotes}`,
      }))
      return wallet
    }
    const reviewOf = (w: ReturnType<typeof mount>) =>
      w.findComponent(EvmTransactionConfirmation)

    it('quotes again for the amount the new fee leaves, and reviews that amount', async () => {
      h.isMaxSelected.value = true
      // The first quote's fee is lower than the estimate the amount was
      // worked out with; after that the amount holds.
      h.applyMaxAmount.mockImplementationOnce(async () => h.setAmount('0.2'))
      const wallet = quotedWallet()

      const w = await reviewWith(wallet)

      expect(wallet.getGasFee).toHaveBeenCalledTimes(2)
      expect(wallet.getSignableTransaction.mock.calls).toEqual([
        [expect.objectContaining({ quoteId: 'q2' })],
      ])
      expect(reviewOf(w).props('modelValue')).toBe(true)
    })

    it('builds again, instead of ending in silence, when the amount moves while the transaction is built', async () => {
      h.isMaxSelected.value = true
      let answer: (value: { signed: string }) => void = () => undefined
      const SignTransaction = vi
        .fn<() => Promise<{ signed: string }>>()
        .mockImplementationOnce(
          () => new Promise(resolve => (answer = resolve)),
        )
        .mockResolvedValue({ signed: '0xnew' })
      const wallet = {
        ...quotedWallet(),
        getWalletType: () => 'PRIVATE_KEY',
        SignTransaction,
      }
      const w = await reviewWith(wallet)

      h.setAmount('0.2')
      await flushPromises()
      answer({ signed: '0xold' })
      await flushPromises()

      expect(reviewOf(w).props('modelValue')).toBe(true)
      expect(reviewOf(w).props('signedTx')).toBe('0xnew')
    })

    it('says so when the amount will not settle, and opens no review', async () => {
      h.isMaxSelected.value = true
      let amount = 0.2
      h.applyMaxAmount.mockImplementation(async () =>
        h.setAmount(String((amount += 0.01))),
      )
      const wallet = quotedWallet()

      const w = await reviewWith(wallet)

      expect(reviewOf(w).props('modelValue')).toBe(false)
      expect(h.addToastMessage).toHaveBeenCalledWith(
        expect.objectContaining({ text: 'send.toast.max_amount_changed' }),
      )
      expect(wallet.getGasFee).toHaveBeenCalledTimes(3)
      expect(wallet.getSignableTransaction).not.toHaveBeenCalled()
    })

    it('leaves the amount alone when the maximum is not what is being sent', async () => {
      const wallet = quotedWallet()

      const w = await reviewWith(wallet)

      expect(h.applyMaxAmount).not.toHaveBeenCalled()
      expect(wallet.getGasFee).toHaveBeenCalledTimes(1)
      expect(reviewOf(w).props('modelValue')).toBe(true)
    })
  })
})
