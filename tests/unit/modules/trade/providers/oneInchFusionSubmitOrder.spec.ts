import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

// Records the order in which the wallet, the chain and the relayer are hit.
// The bug this guards against is the relayer being called before the deposit.
const calls: string[] = []

const ORDER_HASH = '0x' + 'ab'.repeat(32)
const DEPOSIT_TX = '0x' + 'cd'.repeat(32)
const CANCEL_TX = '0x' + 'ef'.repeat(32)
const USER = '0x717ba71d4ea77d1b7c49a913c28c0bd538eecd41'
const PROXY = '0x1111111111111111111111111111111111111111'
const QUOTER_FACTORY = '0x2222222222222222222222222222222222222222'
const DEFAULT_FACTORY = '0xe12e0f117d23a5ccc57f8935cd8c4e80cd91ff01'
const NATIVE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

const NATIVE_ORDER = {
  salt: '1',
  maker: PROXY,
  receiver: USER,
  makerAsset: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  takerAsset: USDC,
  makingAmount: '1000000000000000000',
  takingAmount: '3000000000',
  makerTraits: '0',
}

const createOrder = vi.fn()
const submitOrder = vi.fn()
const submitNativeOrder = vi.fn()
const factoryCreate = vi.fn()
const factoryCtor = vi.fn()
const implCtor = vi.fn()
const implCancel = vi.fn()

vi.mock('@1inch/fusion-sdk', () => {
  class Address {
    constructor(private readonly value: string) {}
    toString() {
      return this.value
    }
  }
  class FusionSDK {
    createOrder = createOrder
    submitOrder = submitOrder
    submitNativeOrder = (...args: unknown[]) => {
      calls.push('relayer')
      return submitNativeOrder(...args)
    }
  }
  class NativeOrdersFactory {
    constructor(readonly address: Address) {
      factoryCtor(address.toString())
    }
    static default() {
      return new NativeOrdersFactory(new Address(DEFAULT_FACTORY))
    }
    create(maker: Address, order: typeof NATIVE_ORDER) {
      factoryCreate(maker.toString(), order)
      return {
        to: this.address,
        data: '0xcreate',
        value: BigInt(order.makingAmount),
      }
    }
  }
  class NativeOrdersImpl {
    constructor(readonly address: Address) {
      implCtor(address.toString())
    }
    cancel(maker: Address, order: typeof NATIVE_ORDER) {
      implCancel(maker.toString(), order)
      return { to: this.address, data: '0xcancel', value: 0n }
    }
  }
  return {
    Address,
    FusionSDK,
    NativeOrdersFactory,
    NativeOrdersImpl,
    NetworkEnum: { ETHEREUM: 1, BINANCE: 56 },
  }
})

const sendRawTransaction = vi.fn()
const waitForTransactionReceipt = vi.fn()
vi.mock('viem', async importOriginal => ({
  ...(await importOriginal<typeof import('viem')>()),
  createPublicClient: () => ({
    sendRawTransaction: (...args: unknown[]) => {
      calls.push('send')
      return sendRawTransaction(...args)
    },
    waitForTransactionReceipt: (...args: unknown[]) => {
      calls.push('receipt')
      return waitForTransactionReceipt(...args)
    },
    readContract: vi.fn(),
    call: vi.fn(),
  }),
  webSocket: () => ({}),
  serializeTransaction: () => '0xserialized',
}))
vi.mock('viem/actions', () => ({
  prepareTransactionRequest: vi.fn(async (_client, tx) => tx),
}))

vi.mock('@/utils/walletUtils', async importOriginal => ({
  ...(await importOriginal<typeof import('@/utils/walletUtils')>()),
  isSignableWallet: () => true,
}))

import OneInchFusion, {
  NativeOrderUnsubmittedError,
} from '@/modules/trade/providers/oneinch_fusion/oneInchFusion'
import type { WalletInterface } from '@/providers/common/walletInterface'

const axiosError = (status: number) =>
  Object.assign(new Error(`Request failed with status code ${status}`), {
    response: { status, data: {} },
  })

const networkError = () =>
  Object.assign(new Error('Network Error'), {
    isAxiosError: true,
    code: 'ERR_NETWORK',
  })

const makeWallet = () =>
  ({
    getWalletType: () => 'PRIVATE_KEY',
    SignTransaction: vi.fn(async () => {
      calls.push('sign')
      return { signed: '0xsigned' }
    }),
  }) as unknown as WalletInterface

const nativeConfig = (fromTokenAddress = NATIVE) => ({
  fromTokenAddress,
  toTokenAddress: USDC,
  amount: NATIVE_ORDER.makingAmount,
  fromAddress: USER,
  fromTokenDecimals: 18,
  toTokenDecimals: 6,
})

const preparedOrder = async (over: Record<string, unknown> = {}) => {
  const { Address } = await import('@1inch/fusion-sdk')
  return {
    order: { build: () => NATIVE_ORDER },
    hash: ORDER_HASH,
    quoteId: 'quote-1',
    nativeOrderFactory: new Address(QUOTER_FACTORY),
    ...over,
  }
}

describe('OneInchFusion.submitOrder', () => {
  beforeEach(async () => {
    calls.length = 0
    OneInchFusion.RELAYER_RETRY_DELAYS_MS = [0, 0]
    createOrder.mockResolvedValue(await preparedOrder())
    submitOrder.mockResolvedValue({ orderHash: ORDER_HASH })
    submitNativeOrder.mockResolvedValue({ orderHash: ORDER_HASH })
    sendRawTransaction.mockResolvedValue(DEPOSIT_TX)
    waitForTransactionReceipt.mockResolvedValue({
      status: 'success',
      transactionHash: DEPOSIT_TX,
    })
  })

  describe('native (ETH) orders', () => {
    it('broadcasts the escrow deposit before handing the order to the relayer', async () => {
      const fusion = new OneInchFusion(makeWallet(), 1)
      const onDepositSent = vi.fn(() => calls.push('hook'))

      const result = await fusion.submitOrder(nativeConfig(), { onDepositSent })

      expect(calls).toEqual(['sign', 'send', 'hook', 'relayer', 'receipt'])
      expect(onDepositSent).toHaveBeenCalledWith(DEPOSIT_TX)
      expect(result).toEqual({ hash: ORDER_HASH, depositTxHash: DEPOSIT_TX })
    })

    it('funds the proxy through the factory the quoter bound the order to', async () => {
      const fusion = new OneInchFusion(makeWallet(), 1)
      await fusion.submitOrder(nativeConfig())

      expect(factoryCtor).toHaveBeenCalledWith(QUOTER_FACTORY)
      expect(factoryCtor).not.toHaveBeenCalledWith(DEFAULT_FACTORY)
      expect(factoryCreate).toHaveBeenCalledWith(USER, NATIVE_ORDER)
    })

    it('falls back to the SDK default factory when the quoter did not name one', async () => {
      createOrder.mockResolvedValue(
        await preparedOrder({ nativeOrderFactory: undefined }),
      )
      const fusion = new OneInchFusion(makeWallet(), 1)
      await fusion.submitOrder(nativeConfig())

      expect(factoryCtor).toHaveBeenCalledWith(DEFAULT_FACTORY)
    })

    it('detects the native sentinel regardless of address casing', async () => {
      const fusion = new OneInchFusion(makeWallet(), 1)
      await fusion.submitOrder(
        nativeConfig(NATIVE.toUpperCase().replace('0X', '0x')),
      )

      expect(submitOrder).not.toHaveBeenCalled()
      expect(submitNativeOrder).toHaveBeenCalledTimes(1)
    })

    it('never reaches the relayer when the user rejects the deposit', async () => {
      const wallet = makeWallet()
      ;(wallet.SignTransaction as ReturnType<typeof vi.fn>).mockRejectedValue(
        Object.assign(new Error('User rejected the request'), { code: 4001 }),
      )
      const fusion = new OneInchFusion(wallet, 1)

      await expect(fusion.submitOrder(nativeConfig())).rejects.toMatchObject({
        code: 4001,
      })
      expect(submitNativeOrder).not.toHaveBeenCalled()
      expect(sendRawTransaction).not.toHaveBeenCalled()
    })

    it('never reaches the relayer when the deposit broadcast fails', async () => {
      sendRawTransaction.mockRejectedValue(new Error('insufficient funds'))
      const fusion = new OneInchFusion(makeWallet(), 1)

      await expect(fusion.submitOrder(nativeConfig())).rejects.toThrow(
        'insufficient funds',
      )
      expect(submitNativeOrder).not.toHaveBeenCalled()
    })

    it('reports an unsubmitted order with everything needed to reclaim the deposit', async () => {
      submitNativeOrder.mockRejectedValue(axiosError(400))
      const fusion = new OneInchFusion(makeWallet(), 1)

      const error = await fusion.submitOrder(nativeConfig()).catch(e => e)

      expect(error).toBeInstanceOf(NativeOrderUnsubmittedError)
      expect(error).toMatchObject({
        orderHash: ORDER_HASH,
        depositTxHash: DEPOSIT_TX,
        proxyAddress: PROXY,
        nativeOrder: NATIVE_ORDER,
      })
      expect((error as NativeOrderUnsubmittedError).cause).toMatchObject({
        response: { status: 400 },
      })
      // A 4xx is the relayer's verdict on the order itself: no retry.
      expect(submitNativeOrder).toHaveBeenCalledTimes(1)
    })

    it('retries transient relayer failures before giving up', async () => {
      submitNativeOrder
        .mockRejectedValueOnce(axiosError(503))
        .mockRejectedValueOnce(networkError())
        .mockResolvedValueOnce({ orderHash: ORDER_HASH })
      const fusion = new OneInchFusion(makeWallet(), 1)

      const result = await fusion.submitOrder(nativeConfig())

      expect(submitNativeOrder).toHaveBeenCalledTimes(3)
      expect(result.hash).toBe(ORDER_HASH)
    })

    it('stops retrying once the delays are exhausted', async () => {
      submitNativeOrder.mockRejectedValue(axiosError(502))
      const fusion = new OneInchFusion(makeWallet(), 1)

      await expect(fusion.submitOrder(nativeConfig())).rejects.toBeInstanceOf(
        NativeOrderUnsubmittedError,
      )
      // RELAYER_RETRY_DELAYS_MS has two entries: first try plus two retries.
      expect(submitNativeOrder).toHaveBeenCalledTimes(3)
    })

    it('fails the trade when the deposit reverts on-chain', async () => {
      waitForTransactionReceipt.mockResolvedValue({
        status: 'reverted',
        transactionHash: DEPOSIT_TX,
      })
      const fusion = new OneInchFusion(makeWallet(), 1)

      await expect(fusion.submitOrder(nativeConfig())).rejects.toThrow(
        'Native Transaction Failed',
      )
    })
  })

  describe('ERC-20 orders', () => {
    it('submits straight to the relayer with no on-chain step', async () => {
      const fusion = new OneInchFusion(makeWallet(), 1)

      const result = await fusion.submitOrder(nativeConfig(USDC))

      expect(submitOrder).toHaveBeenCalledTimes(1)
      expect(submitNativeOrder).not.toHaveBeenCalled()
      expect(calls).toEqual([])
      expect(result).toEqual({ hash: ORDER_HASH })
    })
  })
})

describe('OneInchFusion.cancelNativeOrder', () => {
  beforeEach(() => {
    calls.length = 0
    sendRawTransaction.mockResolvedValue(CANCEL_TX)
    waitForTransactionReceipt.mockResolvedValue({
      status: 'success',
      transactionHash: CANCEL_TX,
    })
  })

  it('cancels the order on its proxy as the real maker and returns the mined tx', async () => {
    const fusion = new OneInchFusion(makeWallet(), 1)

    const hash = await fusion.cancelNativeOrder({
      proxyAddress: PROXY,
      nativeOrder: NATIVE_ORDER,
      fromAddress: USER,
    })

    expect(implCtor).toHaveBeenCalledWith(PROXY)
    expect(implCancel).toHaveBeenCalledWith(USER, NATIVE_ORDER)
    expect(calls).toEqual(['sign', 'send', 'receipt'])
    expect(hash).toBe(CANCEL_TX)
  })

  it('throws when the cancel transaction reverts', async () => {
    waitForTransactionReceipt.mockResolvedValue({
      status: 'reverted',
      transactionHash: CANCEL_TX,
    })
    const fusion = new OneInchFusion(makeWallet(), 1)

    await expect(
      fusion.cancelNativeOrder({
        proxyAddress: PROXY,
        nativeOrder: NATIVE_ORDER,
        fromAddress: USER,
      }),
    ).rejects.toThrow('Could not recover the deposit')
  })
})
