import { describe, expect, it, vi } from 'vitest'

// Importing a wallet transitively pulls in the store layer, which reaches the
// analytics module and its hardware-wallet SDK — unavailable under jsdom.
vi.mock('@/analytics', () => ({ analytics: {} }))

import { Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction, LegacyTransaction } from '@ethereumjs/tx'
import {
  bytesToHex,
  hexToBytes,
  privateToAddress,
  toChecksumAddress,
} from '@ethereumjs/util'
import i18n from '@/i18n'
import PrivyWallet from '@/providers/ethereum/privyWallet'
import {
  PrivyLoginExpiredError,
  PrivySignatureError,
} from '@/providers/privy/errors'
import { commonGenerator } from '@/providers/ethereum/utils'
import { WalletType, type HexPrefixedString } from '@/providers/types'

const ADDRESS = '0x1111111111111111111111111111111111111111'
const TO = '0x2222222222222222222222222222222222222222'

/** A throwaway key standing in for the one Privy holds for the user. */
const PRIVY_KEY = hexToBytes(`0x${'11'.repeat(32)}`)
const PRIVY_ADDRESS = toChecksumAddress(
  bytesToHex(privateToAddress(PRIVY_KEY)),
) as HexPrefixedString
const OTHER_KEY = hexToBytes(`0x${'22'.repeat(32)}`)

const build = (
  overrides: {
    request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>
    logout?: () => Promise<void>
    address?: HexPrefixedString
    chainId?: string
    loginLost?: () => Promise<boolean>
  } = {},
) => {
  const request = vi.fn(overrides.request ?? (async () => null))
  const logout = vi.fn(overrides.logout ?? (async () => undefined))
  const loginLost = vi.fn(overrides.loginLost ?? (async () => false))
  const wallet = new PrivyWallet({
    provider: { request },
    address: overrides.address ?? ADDRESS,
    chainId: overrides.chainId ?? '1',
    logout,
    loginLost,
  })
  return { wallet, request, logout, loginLost }
}

/** An unsigned EIP-1559 transfer on Ethereum, as MEW's API builds it. */
const eip1559Tx = (value = 1000n) =>
  FeeMarketEIP1559Transaction.fromTxData(
    {
      chainId: 1n,
      nonce: 7,
      to: TO,
      value,
      data: '0xabcdef',
      gasLimit: 21000,
      maxFeePerGas: 30_000_000_000n,
      maxPriorityFeePerGas: 2_000_000_000n,
    },
    { common: commonGenerator(1n, Hardfork.London) },
  )

/** An unsigned legacy transfer on Rootstock, which has no EIP-1559. */
const legacyTx = () =>
  LegacyTransaction.fromTxData(
    {
      nonce: 3,
      to: TO,
      value: 5n,
      data: '0x',
      gasLimit: 21000,
      gasPrice: 60_000_000n,
    },
    { common: commonGenerator(30n, Hardfork.Berlin) },
  )

type Signable = {
  serialize: () => Uint8Array
  sign: (key: Uint8Array) => { serialize: () => Uint8Array }
}
const serialized = (tx: Pick<Signable, 'serialize'>) =>
  bytesToHex(tx.serialize()) as HexPrefixedString
/** The signed bytes Privy would answer with for `tx`. */
const signedBy = (key: Uint8Array, tx: Signable) => serialized(tx.sign(key))

describe('PrivyWallet', () => {
  it('reports the embedded wallet address and the Privy wallet type', async () => {
    const { wallet } = build()

    expect(await wallet.getAddress()).toBe(ADDRESS)
    expect(wallet.getWalletType()).toBe(WalletType.PRIVY)
  })

  it('logs out of Privy when disconnected', async () => {
    const { wallet, logout } = build()

    expect(await wallet.disconnect()).toBe(true)
    expect(logout).toHaveBeenCalledTimes(1)
  })

  it('resolves false instead of rejecting when the logout fails', async () => {
    const { wallet } = build({
      logout: async () => {
        throw new Error('offline')
      },
    })

    await expect(wallet.disconnect()).resolves.toBe(false)
  })

  it('signs a message through the embedded wallet provider', async () => {
    const { wallet, request } = build({ request: async () => '0xsigned' })

    expect(await wallet.SignMessage({ message: 'hello' })).toBe('0xsigned')
    expect(request).toHaveBeenCalledWith({
      method: 'personal_sign',
      params: ['hello', ADDRESS],
    })
  })

  it('signs typed data through the embedded wallet provider', async () => {
    const { wallet, request } = build({ request: async () => '0xtyped' })
    const typedData = {
      primaryType: 'Order',
      domain: {},
      types: {},
      message: {},
    }

    expect(await wallet.SignTypedMessage(typedData as never)).toBe('0xtyped')
    expect(request).toHaveBeenCalledWith({
      method: 'eth_signTypedData_v4',
      params: [ADDRESS, JSON.stringify(typedData)],
    })
  })

  it("moves to a chain outside Privy's own list without asking Privy", async () => {
    // The SDK rejects a switch to any chain it was not configured with
    // (Gnosis here). Signing carries its own chain id, so none is needed.
    const { wallet, request } = build({
      request: async () => {
        throw new Error('Unsupported chainId 0x64')
      },
    })

    expect(await wallet.changeNetwork(100)).toBe(true)
    expect(wallet.chainId).toBe('100')
    expect(request).not.toHaveBeenCalled()
  })

  describe('a request Privy fails', () => {
    const failing = async () => {
      throw new Error('Missing privy token. User must be logged in')
    }

    it('is reported as an expired login when the login behind the wallet is gone', async () => {
      const { wallet } = build({
        request: failing,
        loginLost: async () => true,
      })

      await expect(
        wallet.SignMessage({ message: 'hello' }),
      ).rejects.toBeInstanceOf(PrivyLoginExpiredError)
      await expect(wallet.SignTypedMessage({} as never)).rejects.toBeInstanceOf(
        PrivyLoginExpiredError,
      )
      await expect(
        wallet.SignTransaction(serialized(eip1559Tx())),
      ).rejects.toBeInstanceOf(PrivyLoginExpiredError)
    })

    it("tells the user to log in again in the app's language, in every flow that shows the error", async () => {
      const { wallet } = build({
        request: failing,
        loginLost: async () => true,
      })
      const locale = i18n.global.locale as unknown as { value: string }
      const before = locale.value

      try {
        await expect(wallet.SignMessage({ message: 'hello' })).rejects.toThrow(
          'Your login has expired. Log in again to continue.',
        )
        locale.value = 'es'
        await expect(wallet.SignMessage({ message: 'hello' })).rejects.toThrow(
          'Tu sesión ha caducado. Inicia sesión de nuevo para continuar.',
        )
      } finally {
        locale.value = before
      }
    })

    it("is passed on as Privy's own error while the login is still there", async () => {
      const { wallet } = build({
        request: async () => {
          throw new Error('rate limited')
        },
        loginLost: async () => false,
      })

      await expect(wallet.SignMessage({ message: 'hello' })).rejects.toThrow(
        'rate limited',
      )
    })

    it('leaves the login unchecked when the request succeeds', async () => {
      const { wallet, loginLost } = build({ request: async () => '0xsigned' })

      await wallet.SignMessage({ message: 'hello' })

      expect(loginLost).not.toHaveBeenCalled()
    })
  })

  describe('signing a transaction', () => {
    it('asks Privy to sign the EIP-1559 transaction MEW built and returns the signed bytes', async () => {
      const unsigned = eip1559Tx()
      const signed = signedBy(PRIVY_KEY, unsigned)
      const { wallet, request } = build({
        address: PRIVY_ADDRESS,
        request: async () => signed,
      })

      expect(await wallet.SignTransaction(serialized(unsigned))).toEqual({
        signed,
      })
      expect(request).toHaveBeenCalledTimes(1)
      expect(request).toHaveBeenCalledWith({
        method: 'eth_signTransaction',
        params: [
          {
            from: PRIVY_ADDRESS,
            to: TO,
            value: '0x3e8',
            data: '0xabcdef',
            nonce: '0x7',
            gasLimit: '0x5208',
            maxFeePerGas: '0x6fc23ac00',
            maxPriorityFeePerGas: '0x77359400',
            chainId: 1,
            type: 2,
          },
        ],
      })
    })

    it('asks Privy to sign a legacy transaction with its gas price', async () => {
      const unsigned = legacyTx()
      const signed = signedBy(PRIVY_KEY, unsigned)
      const { wallet, request } = build({
        address: PRIVY_ADDRESS,
        chainId: '30',
        request: async () => signed,
      })

      expect(await wallet.SignTransaction(serialized(unsigned))).toEqual({
        signed,
      })
      expect(request).toHaveBeenCalledWith({
        method: 'eth_signTransaction',
        params: [
          {
            from: PRIVY_ADDRESS,
            to: TO,
            value: '0x5',
            data: '0x',
            nonce: '0x3',
            gasLimit: '0x5208',
            gasPrice: '0x3938700',
            chainId: 30,
            type: 0,
          },
        ],
      })
    })

    it('refuses signed bytes for a transaction other than the one it asked for', async () => {
      const { wallet } = build({
        address: PRIVY_ADDRESS,
        request: async () => signedBy(PRIVY_KEY, eip1559Tx(999_999n)),
      })

      await expect(
        wallet.SignTransaction(serialized(eip1559Tx())),
      ).rejects.toMatchObject({
        name: 'PrivySignatureError',
        code: 'different_transaction',
      })
    })

    it("refuses a transaction signed with a key that is not this wallet's", async () => {
      const unsigned = eip1559Tx()
      const { wallet } = build({
        address: PRIVY_ADDRESS,
        request: async () => signedBy(OTHER_KEY, unsigned),
      })

      await expect(
        wallet.SignTransaction(serialized(unsigned)),
      ).rejects.toMatchObject({
        name: 'PrivySignatureError',
        code: 'different_transaction',
      })
    })

    it('refuses the unsigned transaction handed back as if it were signed', async () => {
      const unsigned = eip1559Tx()
      const { wallet } = build({
        address: PRIVY_ADDRESS,
        request: async () => serialized(unsigned),
      })

      await expect(
        wallet.SignTransaction(serialized(unsigned)),
      ).rejects.toMatchObject({
        name: 'PrivySignatureError',
        code: 'different_transaction',
      })
    })

    it("says in the app's language that nothing was sent", async () => {
      const { wallet } = build({
        address: PRIVY_ADDRESS,
        request: async () => null,
      })

      const failure = await wallet
        .SignTransaction(serialized(eip1559Tx()))
        .catch((error: unknown) => error)

      expect(failure).toBeInstanceOf(PrivySignatureError)
      expect((failure as Error).message).toBe(
        'The signature could not be verified, so nothing was sent. Please try again.',
      )
    })

    it('refuses an answer that is not a transaction at all', async () => {
      const { wallet } = build({
        address: PRIVY_ADDRESS,
        request: async () => null,
      })

      await expect(
        wallet.SignTransaction(serialized(eip1559Tx())),
      ).rejects.toMatchObject({
        name: 'PrivySignatureError',
        code: 'not_a_transaction',
      })
    })
  })
})
