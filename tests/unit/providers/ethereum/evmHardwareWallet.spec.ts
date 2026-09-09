import { describe, it, expect, vi } from 'vitest'
import {
  FeeMarketEIP1559Transaction,
  LegacyTransaction,
} from '@ethereumjs/tx'
import { Common } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'
import { HWwalletType } from '@enkryptcom/types'

// Importing the wallet transitively pulls in the store/analytics layer, whose
// hardware-wallet SDK is unavailable under jsdom (mirrors baseEvmWallet.spec).
vi.mock('@/analytics', () => ({ analytics: {} }))
vi.mock('@/mew_api/fetchWithRetry', () => ({ fetchWithRetry: vi.fn() }))

import EvmHardwareWallet from '@/providers/ethereum/evmHardwareWallet'
import type { HexPrefixedString } from '@/providers/types'
import type { HWManager } from '@/providers/hw/types'

// A syntactically valid 65-byte signature (r || s || v). r/s are well below the
// secp256k1 order so ethereumjs accepts them; only the shape matters here.
const FAKE_SIG = ('0x' + '11'.repeat(32) + '22'.repeat(32) + '1c') as HexPrefixedString

// Build an unsigned serialized tx of each type, as the MEW API would hand it.
const legacySerialized = (chainId: number): HexPrefixedString =>
  bytesToHex(
    LegacyTransaction.fromTxData(
      { nonce: 1, gasPrice: 1_000_000_000, gasLimit: 21_000, to: `0x${'ab'.repeat(20)}`, value: 1 },
      { common: Common.custom({ chainId }) },
    ).serialize(),
  ) as HexPrefixedString

const eip1559Serialized = (chainId: number): HexPrefixedString =>
  bytesToHex(
    FeeMarketEIP1559Transaction.fromTxData(
      { nonce: 1, maxFeePerGas: 1_000_000_000, maxPriorityFeePerGas: 1, gasLimit: 21_000, to: `0x${'ab'.repeat(20)}`, value: 1 },
      { common: Common.custom({ chainId }) },
    ).serialize(),
  ) as HexPrefixedString

const makeWallet = (chainId: string) => {
  const signTransaction = vi.fn().mockResolvedValue(FAKE_SIG)
  const hwWalletInstance = { signTransaction } as unknown as HWManager
  const wallet = new EvmHardwareWallet(
    chainId,
    `0x${'cd'.repeat(20)}` as HexPrefixedString,
    'ROOTSTOCK',
    '0',
    { path: "m/44'/137'/0'/0/0", label: 'test', basePath: "m/44'/137'/0'/0" },
    HWwalletType.trezor,
    hwWalletInstance,
  )
  return { wallet, signTransaction }
}

describe('EvmHardwareWallet.SignTransaction — legacy tx fallback (MEW-2256)', () => {
  it('signs a legacy (type-0) tx on a non-EIP-1559 chain like Rootstock (chainId 30)', async () => {
    const { wallet, signTransaction } = makeWallet('30')

    const result = await wallet.SignTransaction(legacySerialized(30))

    // Regression: previously threw "not an EIP-1559 transaction (…received: 0xeb)".
    expect(result.signed).toMatch(/^0x/)
    // The device must receive a LegacyTransaction, not the EIP-1559 class.
    expect(signTransaction).toHaveBeenCalledTimes(1)
    const dispatched = signTransaction.mock.calls[0][0].transaction
    expect(dispatched).toBeInstanceOf(LegacyTransaction)
    expect(dispatched.type).toBe(0)
  })

  it('still signs an EIP-1559 (type-2) tx on chains that support it (chainId 1)', async () => {
    const { wallet, signTransaction } = makeWallet('1')

    const result = await wallet.SignTransaction(eip1559Serialized(1))

    expect(result.signed).toMatch(/^0x/)
    const dispatched = signTransaction.mock.calls[0][0].transaction
    expect(dispatched).toBeInstanceOf(FeeMarketEIP1559Transaction)
    expect(dispatched.type).toBe(2)
  })
})
