import { describe, expect, it } from 'vitest'
import { Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction, LegacyTransaction } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'
import { commonGenerator, parseSerializedTx } from '@/providers/ethereum/utils'

const TO = '0x2222222222222222222222222222222222222222'

/** An unsigned EIP-1559 transfer, serialized the way MEW's API hands it out. */
const eip1559 = (chainId: bigint) =>
  bytesToHex(
    FeeMarketEIP1559Transaction.fromTxData(
      {
        chainId,
        nonce: 7,
        to: TO,
        value: 1000n,
        data: '0xabcdef',
        gasLimit: 21000,
        maxFeePerGas: 30_000_000_000n,
        maxPriorityFeePerGas: 2_000_000_000n,
      },
      { common: commonGenerator(chainId, Hardfork.London) },
    ).serialize(),
  )

/** An unsigned legacy transfer, as chains without EIP-1559 (Rootstock) use. */
const legacy = (chainId: bigint) =>
  bytesToHex(
    LegacyTransaction.fromTxData(
      {
        nonce: 3,
        to: TO,
        value: 5n,
        data: '0x',
        gasLimit: 21000,
        gasPrice: 60_000_000n,
      },
      { common: commonGenerator(chainId, Hardfork.Berlin) },
    ).serialize(),
  )

describe('parseSerializedTx', () => {
  it('reads an EIP-1559 transaction with the fields it was built from', () => {
    const parsed = parseSerializedTx(eip1559(1n), '1')

    expect(parsed.kind).toBe('eip1559')
    expect(parsed.tx.toJSON()).toMatchObject({
      chainId: '0x1',
      nonce: '0x7',
      to: TO,
      value: '0x3e8',
      data: '0xabcdef',
      gasLimit: '0x5208',
      maxFeePerGas: '0x6fc23ac00',
      maxPriorityFeePerGas: '0x77359400',
    })
  })

  it('reads a legacy transaction, which has no type byte to announce itself', () => {
    const parsed = parseSerializedTx(legacy(30n), '30')

    expect(parsed.kind).toBe('legacy')
    expect(parsed.tx.toJSON()).toMatchObject({
      nonce: '0x3',
      to: TO,
      value: '0x5',
      gasLimit: '0x5208',
      gasPrice: '0x3938700',
    })
  })

  it('refuses bytes that are no transaction of either kind', () => {
    expect(() => parseSerializedTx('0x1234', '1')).toThrow()
  })
})
