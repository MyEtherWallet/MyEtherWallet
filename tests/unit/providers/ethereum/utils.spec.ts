import { describe, expect, it } from 'vitest'
import { Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction, LegacyTransaction } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'
import {
  commonGenerator,
  matchesReviewedTransfer,
  parseSerializedTx,
} from '@/providers/ethereum/utils'

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

// MEW's API builds the transaction; the user reviewed a form. Before an
// in-app wallet signs, the two must be the same transfer.
describe('matchesReviewedTransfer', () => {
  const OTHER = '0x3333333333333333333333333333333333333333'
  const TOKEN = '0x4444444444444444444444444444444444444444'
  /** An unsigned EIP-1559 transaction on Ethereum, as the API hands it out. */
  const built = (fields: {
    to?: string
    value?: bigint
    data?: string
    chainId?: bigint
  }) => {
    const chainId = fields.chainId ?? 1n
    return bytesToHex(
      FeeMarketEIP1559Transaction.fromTxData(
        {
          chainId,
          nonce: 7,
          to: fields.to,
          value: fields.value ?? 0n,
          data: fields.data ?? '0x',
          gasLimit: 21000,
          maxFeePerGas: 30_000_000_000n,
          maxPriorityFeePerGas: 2_000_000_000n,
        },
        { common: commonGenerator(chainId, Hardfork.London) },
      ).serialize(),
    )
  }
  const reviewed = { to: TO, value: '0x3e8', data: '0x' }
  const matches = (serialized: string, form = reviewed) =>
    matchesReviewedTransfer(serialized as `0x${string}`, '1', form)

  it('holds for the transfer the user reviewed', () => {
    expect(matches(built({ to: TO, value: 1000n }))).toBe(true)
  })

  it('holds whatever the letter case of the addresses', () => {
    const mixedCase = '0xAbCdEf2222222222222222222222222222222222'
    expect(
      matches(built({ to: mixedCase.toLowerCase(), value: 1000n }), {
        ...reviewed,
        to: mixedCase,
      }),
    ).toBe(true)
  })

  it('holds for a token transfer: the token as destination, the call as data', () => {
    const transfer =
      '0xa9059cbb' +
      '0000000000000000000000002222222222222222222222222222222222222222' +
      '00000000000000000000000000000000000000000000000000000000000003e8'
    expect(
      matches(built({ to: TOKEN, data: transfer }), {
        to: TOKEN,
        value: '0x0',
        data: transfer.toUpperCase().replace('0X', '0x'),
      }),
    ).toBe(true)
  })

  it('holds for a legacy transaction too', () => {
    const serialized = bytesToHex(
      LegacyTransaction.fromTxData(
        { nonce: 7, to: TO, value: 1000n, gasLimit: 21000, gasPrice: 1n },
        { common: commonGenerator(1n, Hardfork.Berlin) },
      ).serialize(),
    )
    expect(matches(serialized)).toBe(true)
  })

  it('fails for another recipient', () => {
    expect(matches(built({ to: OTHER, value: 1000n }))).toBe(false)
  })

  it('fails for another amount', () => {
    expect(matches(built({ to: TO, value: 1001n }))).toBe(false)
  })

  it('fails for call data the user did not review', () => {
    expect(matches(built({ to: TO, value: 1000n, data: '0xdeadbeef' }))).toBe(
      false,
    )
  })

  it('fails for a token transfer to someone else, though the token is the same', () => {
    const to = (who: string) =>
      '0xa9059cbb' +
      '000000000000000000000000' +
      who.slice(2) +
      '00000000000000000000000000000000000000000000000000000000000003e8'
    expect(
      matches(built({ to: TOKEN, data: to(OTHER) }), {
        to: TOKEN,
        value: '0x0',
        data: to(TO),
      }),
    ).toBe(false)
  })

  it('fails for a transaction with no recipient', () => {
    expect(matches(built({ value: 1000n }))).toBe(false)
  })

  it('fails for a transaction of another chain', () => {
    expect(matches(built({ to: TO, value: 1000n, chainId: 137n }))).toBe(false)
  })

  it('fails for bytes that are no transaction', () => {
    expect(matches('0x02')).toBe(false)
    expect(matches('0xzz')).toBe(false)
  })

  it('fails for a reviewed amount that is no number', () => {
    expect(
      matches(built({ to: TO, value: 1000n }), { ...reviewed, value: 'abc' }),
    ).toBe(false)
  })
})
