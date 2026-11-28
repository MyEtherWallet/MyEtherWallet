import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'

// Importing the wallet transitively pulls in the store layer, which reaches the
// analytics module and its hardware-wallet SDK — unavailable under jsdom.
vi.mock('@/analytics', () => ({ analytics: {} }))
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

const signTransaction = vi.fn()
const sendTransaction = vi.fn()
vi.mock('@wagmi/core', () => ({
  signTransaction: (...args: unknown[]) => signTransaction(...args),
  sendTransaction: (...args: unknown[]) => sendTransaction(...args),
  signMessage: vi.fn(),
  signTypedData: vi.fn(),
}))

import WagmiWallet from '@/providers/ethereum/wagmiWallet'
import { commonGenerator } from '@/providers/ethereum/utils'
import { Hardfork } from '@ethereumjs/common'
import type { HexPrefixedString } from '@/providers/types'

const USER = '0x717ba71d4ea77d1b7c49a913c28c0bd538eecd41'
const TO = '0x2222222222222222222222222222222222222222'

const UNSIGNED = bytesToHex(
  FeeMarketEIP1559Transaction.fromTxData(
    {
      to: TO,
      value: 1000n,
      nonce: 7,
      gasLimit: 21000n,
      maxFeePerGas: 30n,
      maxPriorityFeePerGas: 2n,
      chainId: 1n,
    },
    { common: commonGenerator(1n, Hardfork.London) },
  ).serialize(),
) as HexPrefixedString

const CONFIG = {} as never

// `session` is what a WalletConnect provider carries; an extension has none.
const makeWallet = (provider: unknown) => {
  const connector = {
    getProvider: vi.fn(async () => provider),
    getAccounts: vi.fn(async () => [USER]),
  }
  const wallet = new WagmiWallet(connector as never, '1', CONFIG)
  wallet.address = USER
  return wallet
}
const walletConnectSession = (methods: string[]) => ({
  session: { namespaces: { eip155: { methods } } },
})
const signOnlyWallet = () =>
  makeWallet(
    walletConnectSession(['eth_sendTransaction', 'eth_signTransaction']),
  )

describe('WagmiWallet — signing without sending (MEW-2694)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reads the capability from the methods the WalletConnect session approved', async () => {
    expect(await signOnlyWallet().canSignWithoutSending()).toBe(true)
    expect(
      await makeWallet(
        walletConnectSession(['eth_sendTransaction', 'personal_sign']),
      ).canSignWithoutSending(),
    ).toBe(false)
  })

  it('reads an extension, which has no session to ask, as unable', async () => {
    expect(await makeWallet({ request: vi.fn() }).canSignWithoutSending()).toBe(
      false,
    )
    expect(await makeWallet(undefined).canSignWithoutSending()).toBe(false)
  })

  it('asks the wallet to sign the transaction MEW built and returns it unsent', async () => {
    signTransaction.mockResolvedValue('0x02signed')
    const wallet = signOnlyWallet()

    await expect(wallet.SignTransaction(UNSIGNED)).resolves.toEqual({
      signed: '0x02signed',
    })
    expect(signTransaction).toHaveBeenCalledWith(
      CONFIG,
      expect.objectContaining({
        account: USER,
        to: TO,
        value: 1000n,
        nonce: 7,
        gas: 21000n,
        chainId: 1,
        type: 'eip1559',
      }),
    )
    expect(sendTransaction).not.toHaveBeenCalled()
  })

  it('accepts the `{ raw }` shape some wallets answer with', async () => {
    signTransaction.mockResolvedValue({ raw: '0x02signed', tx: {} })

    await expect(signOnlyWallet().SignTransaction(UNSIGNED)).resolves.toEqual({
      signed: '0x02signed',
    })
  })

  it('stops offering the call once the wallet says it does not have it', async () => {
    signTransaction.mockRejectedValue(
      Object.assign(new Error('The method does not exist'), { code: -32601 }),
    )
    const wallet = signOnlyWallet()

    await expect(wallet.SignTransaction(UNSIGNED)).rejects.toThrow()
    expect(await wallet.canSignWithoutSending()).toBe(false)
  })

  it('keeps offering the call after the user simply said no', async () => {
    signTransaction.mockRejectedValue(
      Object.assign(new Error('User rejected the request.'), { code: 4001 }),
    )
    const wallet = signOnlyWallet()

    await expect(wallet.SignTransaction(UNSIGNED)).rejects.toThrow()
    expect(await wallet.canSignWithoutSending()).toBe(true)
  })

  it('rejects an answer that is not a signed transaction', async () => {
    signTransaction.mockResolvedValue(null)
    const wallet = signOnlyWallet()

    await expect(wallet.SignTransaction(UNSIGNED)).rejects.toThrow(
      'did not return a signed transaction',
    )
    expect(await wallet.canSignWithoutSending()).toBe(false)
  })
})
