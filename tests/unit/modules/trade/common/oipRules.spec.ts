import { describe, it, expect } from 'vitest'
import { mainnet, bsc, polygon } from 'viem/chains'
import {
  OIP_MIN_TRADE_USD,
  buildOipIndex,
  classifyTradeToken,
  filterToTokensForFrom,
  isBelowOipMinimum,
  isCashClass,
  isOipChain,
  isOipPairAllowed,
  type TradeTokenClass,
} from '@/modules/trade/common/oipRules'
import { NATIVE_ADDRESS } from '@/modules/trade/providers/oneinch_fusion/configs'

const OIP_ETH = '0x00000000000000000000000000000000000000a1'
const OIP_BSC = '0x00000000000000000000000000000000000000b1'
const STOCK = '0x00000000000000000000000000000000000000a2'
const USDT = '0x00000000000000000000000000000000000000c1'
const USDC = '0x00000000000000000000000000000000000000c2'
const OTHER = '0x00000000000000000000000000000000000000e9'

const tradable = [
  {
    isPortfolio: true,
    addresses: [{ address: OIP_ETH.toUpperCase() }, { address: OIP_BSC }],
  },
  { isPortfolio: false, addresses: [{ address: STOCK }] },
]
const supporting = [
  { isPortfolio: null, addresses: [{ address: USDT }] },
  { isPortfolio: null, addresses: [{ address: USDC }] },
]

const index = buildOipIndex(tradable, supporting)

describe('isOipChain', () => {
  it('is on for Ethereum and BNB, as a number or the API string', () => {
    expect(isOipChain(mainnet.id)).toBe(true)
    expect(isOipChain(bsc.id)).toBe(true)
    expect(isOipChain(String(mainnet.id))).toBe(true)
    expect(isOipChain(String(bsc.id))).toBe(true)
  })

  it('is off for any other chain and for a missing id', () => {
    expect(isOipChain(polygon.id)).toBe(false)
    expect(isOipChain(String(polygon.id))).toBe(false)
    expect(isOipChain(undefined)).toBe(false)
    expect(isOipChain(null)).toBe(false)
    expect(isOipChain('')).toBe(false)
    expect(isOipChain('not-a-chain')).toBe(false)
  })
})

describe('buildOipIndex', () => {
  it('indexes OIP addresses on every chain, lowercased', () => {
    expect([...index.oipAddresses].sort()).toEqual([OIP_ETH, OIP_BSC].sort())
  })

  it('indexes the unflagged supporting assets as stables', () => {
    expect([...index.stableAddresses].sort()).toEqual([USDT, USDC].sort())
  })

  it('treats a supporting asset flagged as portfolio as OIP, not stable', () => {
    const flagged = buildOipIndex(
      [],
      [{ isPortfolio: true, addresses: [{ address: USDT }] }],
    )
    expect(flagged.oipAddresses.has(USDT)).toBe(true)
    expect(flagged.stableAddresses.has(USDT)).toBe(false)
  })

  it('finds no OIP token when the flag is missing, null or false', () => {
    const legacy = buildOipIndex(
      [
        { addresses: [{ address: OIP_ETH }] },
        { isPortfolio: null, addresses: [{ address: OIP_BSC }] },
        { isPortfolio: false, addresses: [{ address: STOCK }] },
      ],
      [{ addresses: [{ address: USDT }] }],
    )
    expect(legacy.oipAddresses.size).toBe(0)
    expect(legacy.stableAddresses.has(USDT)).toBe(true)
  })

  it('tolerates null lists and malformed members', () => {
    expect(buildOipIndex(null, undefined)).toEqual({
      oipAddresses: new Set(),
      stableAddresses: new Set(),
    })

    const malformed = buildOipIndex(
      [
        null,
        { isPortfolio: true, addresses: [null, { address: '' }, {}] },
        { isPortfolio: true, addresses: undefined as never },
        { isPortfolio: true, addresses: [{ address: OIP_ETH }] },
      ],
      [null],
    )
    expect([...malformed.oipAddresses]).toEqual([OIP_ETH])
  })
})

describe('classifyTradeToken', () => {
  it('classifies each kind of token, case-insensitively', () => {
    expect(classifyTradeToken(OIP_ETH, index)).toBe('oip')
    expect(classifyTradeToken(OIP_BSC.toUpperCase(), index)).toBe('oip')
    expect(classifyTradeToken(NATIVE_ADDRESS, index)).toBe('native')
    expect(classifyTradeToken(NATIVE_ADDRESS.toUpperCase(), index)).toBe(
      'native',
    )
    expect(classifyTradeToken(USDT, index)).toBe('stable')
    expect(classifyTradeToken(STOCK, index)).toBe('other')
    expect(classifyTradeToken(OTHER, index)).toBe('other')
  })

  it('classifies a missing address as other', () => {
    expect(classifyTradeToken(undefined, index)).toBe('other')
    expect(classifyTradeToken(null, index)).toBe('other')
    expect(classifyTradeToken('', index)).toBe('other')
  })

  it('counts native and stable as cash, nothing else', () => {
    expect(isCashClass('native')).toBe(true)
    expect(isCashClass('stable')).toBe(true)
    expect(isCashClass('oip')).toBe(false)
    expect(isCashClass('other')).toBe(false)
  })
})

describe('isOipPairAllowed', () => {
  const classes: TradeTokenClass[] = ['oip', 'native', 'stable', 'other']

  it('allows an OIP token only against native or a stable, in either direction', () => {
    const allowed = classes.flatMap(from =>
      classes
        .filter(to => isOipPairAllowed(from, to))
        .map(to => `${from}>${to}`),
    )
    expect(allowed).toEqual([
      'oip>native',
      'oip>stable',
      'native>oip',
      'native>native',
      'native>stable',
      'native>other',
      'stable>oip',
      'stable>native',
      'stable>stable',
      'stable>other',
      'other>native',
      'other>stable',
      'other>other',
    ])
  })
})

describe('filterToTokensForFrom', () => {
  const tokens = [OIP_ETH, STOCK, USDT, USDC, NATIVE_ADDRESS, OTHER].map(
    address => ({ address }),
  )
  const addresses = (list: { address: string }[]) =>
    list.map(token => token.address)

  it('keeps only native and stable tokens when From is OIP', () => {
    expect(addresses(filterToTokensForFrom(tokens, 'oip', index))).toEqual([
      USDT,
      USDC,
      NATIVE_ADDRESS,
    ])
  })

  it('returns the list untouched when From is native or a stable', () => {
    expect(filterToTokensForFrom(tokens, 'native', index)).toBe(tokens)
    expect(filterToTokensForFrom(tokens, 'stable', index)).toBe(tokens)
  })

  it('hides only the OIP tokens for any other From', () => {
    expect(addresses(filterToTokensForFrom(tokens, 'other', index))).toEqual([
      STOCK,
      USDT,
      USDC,
      NATIVE_ADDRESS,
      OTHER,
    ])
  })
})

describe('isBelowOipMinimum', () => {
  const below = (amount: string, price: number | undefined, stable = false) =>
    isBelowOipMinimum({ amount, price, isStableFrom: stable })

  it('uses a $10 minimum', () => {
    expect(OIP_MIN_TRADE_USD).toBe(10)
  })

  it('is below under $10 and not at $10 or more', () => {
    expect(below('9.99', 1)).toBe(true)
    expect(below('10', 1)).toBe(false)
    expect(below('0.004', 2500)).toBe(false)
    expect(below('0.0039', 2500)).toBe(true)
  })

  it('compares the USD value at cent precision', () => {
    // 10 × 0.9995 = 9.995, which is $10.00 to the cent.
    expect(below('10', 0.9995)).toBe(false)
    // 10 × 0.999 = 9.99.
    expect(below('10', 0.999)).toBe(true)
  })

  it('passes 10 or more stable tokens whatever their price', () => {
    expect(below('10', 0.999, true)).toBe(false)
    expect(below('10', 0.9, true)).toBe(false)
    expect(below('25', 0.5, true)).toBe(false)
  })

  it('still judges fewer than 10 stable tokens by their USD value', () => {
    expect(below('9.99', 0.999, true)).toBe(true)
    expect(below('9.99', 1, true)).toBe(true)
    // A stable priced above its peg reaches $10 with fewer than 10 tokens.
    expect(below('8.7', 1.15, true)).toBe(false)
  })

  it('does not apply the token-count rule to a non-stable', () => {
    expect(below('10', 0.999, false)).toBe(true)
  })

  it('cannot judge an unknown price', () => {
    expect(below('1', 0)).toBe(false)
    expect(below('1', undefined)).toBe(false)
    expect(below('1', -5)).toBe(false)
  })

  it('leaves an empty, invalid or non-positive amount to the other checks', () => {
    expect(below('', 1)).toBe(false)
    expect(below('abc', 1)).toBe(false)
    expect(below('0', 1)).toBe(false)
    expect(below('-3', 1)).toBe(false)
  })
})
