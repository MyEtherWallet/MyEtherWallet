import { describe, it, expect } from 'vitest'
import { fuzzySearchByKeys, searchArrayByKeysStr } from '@/utils/searchArray'

// ---------------------------------------------------------------------------
// Test data — mirrors real token / stock shapes used in the app
// ---------------------------------------------------------------------------

interface Token {
  name: string
  symbol: string
  address?: string
}

const tokens: Token[] = [
  { name: 'Ethereum', symbol: 'ETH', address: '0xeeee' },
  { name: 'Tether USD', symbol: 'USDT', address: '0xdac1' },
  { name: 'USD Coin', symbol: 'USDC', address: '0xa0b8' },
  { name: 'Bitcoin', symbol: 'BTC', address: '0xbtc0' },
  { name: 'Wrapped Bitcoin', symbol: 'WBTC', address: '0x2260' },
  { name: 'Chainlink', symbol: 'LINK', address: '0x514a' },
  { name: 'Uniswap', symbol: 'UNI', address: '0x1f98' },
  { name: 'Aave', symbol: 'AAVE', address: '0x7fc6' },
  { name: 'Polygon', symbol: 'MATIC', address: '0x7d1a' },
  { name: 'Shiba Inu', symbol: 'SHIB', address: '0x95ad' },
  { name: 'Dogecoin', symbol: 'DOGE', address: '0xdoge' },
  { name: 'Solana', symbol: 'SOL', address: '0xsol0' },
  { name: 'Polkadot', symbol: 'DOT', address: '0xdot0' },
  { name: 'Ethereum Name Service', symbol: 'ENS', address: '0xens0' },
  { name: 'Lido Staked Ether', symbol: 'stETH', address: '0xae7a' },
]

interface Stock {
  primaryMarket: { symbol: string }
  underlyingMarket: { name: string }
}

const stocks: Stock[] = [
  { primaryMarket: { symbol: 'AAPL' }, underlyingMarket: { name: 'Apple Inc' } },
  { primaryMarket: { symbol: 'GOOGL' }, underlyingMarket: { name: 'Alphabet Inc' } },
  { primaryMarket: { symbol: 'MSFT' }, underlyingMarket: { name: 'Microsoft Corporation' } },
  { primaryMarket: { symbol: 'AMZN' }, underlyingMarket: { name: 'Amazon.com Inc' } },
  { primaryMarket: { symbol: 'TSLA' }, underlyingMarket: { name: 'Tesla Inc' } },
  { primaryMarket: { symbol: 'META' }, underlyingMarket: { name: 'Meta Platforms Inc' } },
  { primaryMarket: { symbol: 'NVDA' }, underlyingMarket: { name: 'NVIDIA Corporation' } },
]

// ---------------------------------------------------------------------------
// fuzzySearchByKeys
// ---------------------------------------------------------------------------

describe('fuzzySearchByKeys', () => {
  // -- Exact & prefix matches -----------------------------------------------

  describe('prefix matches', () => {
    it('finds token by exact symbol', () => {
      const results = fuzzySearchByKeys(tokens, ['name', 'symbol'], 'ETH')
      expect(results[0].symbol).toBe('ETH')
    })

    it('finds token by name prefix', () => {
      const results = fuzzySearchByKeys(tokens, ['name', 'symbol'], 'Ether')
      expect(results[0].name).toBe('Ethereum')
    })

    it('is case-insensitive', () => {
      const results = fuzzySearchByKeys(tokens, ['name', 'symbol'], 'eth')
      expect(results[0].symbol).toBe('ETH')
    })

    it('prefix matches come before contains matches', () => {
      // "ETH" should match Ethereum (prefix on symbol) before stETH (contains)
      const results = fuzzySearchByKeys(tokens, ['name', 'symbol'], 'eth')
      const ethIdx = results.findIndex(t => t.symbol === 'ETH')
      const stethIdx = results.findIndex(t => t.symbol === 'stETH')
      expect(ethIdx).toBeLessThan(stethIdx)
    })
  })

  // -- Contains matches -----------------------------------------------------

  describe('contains matches', () => {
    it('finds token where search term is in the middle of name', () => {
      const results = fuzzySearchByKeys(tokens, ['name', 'symbol'], 'coin')
      const names = results.map(t => t.name)
      expect(names).toContain('USD Coin')
      expect(names).toContain('Dogecoin')
    })

    it('finds "Bitcoin" when searching "itcoin"', () => {
      const results = fuzzySearchByKeys(tokens, ['name', 'symbol'], 'itcoin')
      const names = results.map(t => t.name)
      expect(names).toContain('Bitcoin')
      expect(names).toContain('Wrapped Bitcoin')
    })
  })

  // -- Fuzzy / typo tolerance -----------------------------------------------

  describe('typo tolerance', () => {
    it('finds Ethereum with common misspelling "etherium"', () => {
      const results = fuzzySearchByKeys(tokens, ['name', 'symbol'], 'etherium')
      const names = results.map(t => t.name)
      expect(names).toContain('Ethereum')
    })

    it('finds Tether with typo "teter"', () => {
      const results = fuzzySearchByKeys(tokens, ['name', 'symbol'], 'teter')
      const names = results.map(t => t.name)
      expect(names).toContain('Tether USD')
    })

    it('finds Bitcoin with typo "bitcon"', () => {
      const results = fuzzySearchByKeys(tokens, ['name', 'symbol'], 'bitcon')
      const names = results.map(t => t.name)
      expect(names).toContain('Bitcoin')
    })

    it('finds Chainlink with typo "chainlik"', () => {
      const results = fuzzySearchByKeys(tokens, ['name', 'symbol'], 'chainlik')
      const names = results.map(t => t.name)
      expect(names).toContain('Chainlink')
    })

    it('tolerates 1 edit for short queries (≤3 chars)', () => {
      // "UDT" is 1 edit from "USDT"
      const results = fuzzySearchByKeys(tokens, ['name', 'symbol'], 'UDT')
      const symbols = results.map(t => t.symbol)
      expect(symbols).toContain('USDT')
    })

    it('does not match wildly different strings', () => {
      const results = fuzzySearchByKeys(tokens, ['name', 'symbol'], 'zzzzz')
      expect(results).toHaveLength(0)
    })

    it('does not match with too many typos', () => {
      // "xyzrium" is 3+ edits from "Ethereum"
      const results = fuzzySearchByKeys(tokens, ['name', 'symbol'], 'xyzrium')
      const names = results.map(t => t.name)
      expect(names).not.toContain('Ethereum')
    })
  })

  // -- Result ordering ------------------------------------------------------

  describe('result ordering', () => {
    it('orders: prefix > contains > fuzzy', () => {
      // Search "sol" — Solana is prefix match on symbol
      const results = fuzzySearchByKeys(tokens, ['name', 'symbol'], 'sol')
      expect(results[0].symbol).toBe('SOL')
    })

    it('fuzzy matches are sorted by edit distance', () => {
      const items = [
        { name: 'abcde', symbol: 'X1' },  // dist 2 from "abcXX"
        { name: 'abcXe', symbol: 'X2' },  // dist 1 from "abcXX"
      ]
      const results = fuzzySearchByKeys(items, ['name'], 'abcXX')
      // closer match first
      expect(results[0].symbol).toBe('X2')
    })
  })

  // -- Nested keys (stock data) ---------------------------------------------

  describe('nested keys', () => {
    it('searches nested stock symbol', () => {
      const results = fuzzySearchByKeys(
        stocks,
        ['primaryMarket.symbol', 'underlyingMarket.name'],
        'AAPL',
      )
      expect(results[0].primaryMarket.symbol).toBe('AAPL')
    })

    it('searches nested stock name', () => {
      const results = fuzzySearchByKeys(
        stocks,
        ['primaryMarket.symbol', 'underlyingMarket.name'],
        'Tesla',
      )
      expect(results[0].underlyingMarket.name).toBe('Tesla Inc')
    })

    it('finds stock with typo "Tesle"', () => {
      const results = fuzzySearchByKeys(
        stocks,
        ['primaryMarket.symbol', 'underlyingMarket.name'],
        'Tesle',
      )
      const names = results.map(s => s.underlyingMarket.name)
      expect(names).toContain('Tesla Inc')
    })

    it('finds stock with typo "Gogle"', () => {
      const results = fuzzySearchByKeys(
        stocks,
        ['primaryMarket.symbol', 'underlyingMarket.name'],
        'Gogle',
      )
      const symbols = results.map(s => s.primaryMarket.symbol)
      expect(symbols).toContain('GOOGL')
    })

    it('finds typos in later words of stock names', () => {
      const results = fuzzySearchByKeys(
        stocks,
        ['primaryMarket.symbol', 'underlyingMarket.name'],
        'Corporaton',
      )
      const names = results.map(s => s.underlyingMarket.name)
      expect(names).toContain('Microsoft Corporation')
    })
  })

  // -- Edge cases -----------------------------------------------------------

  describe('edge cases', () => {
    it('returns full array for empty search term', () => {
      const results = fuzzySearchByKeys(tokens, ['name', 'symbol'], '')
      expect(results).toHaveLength(tokens.length)
    })

    it('returns full array for whitespace-only search term', () => {
      const results = fuzzySearchByKeys(tokens, ['name', 'symbol'], '   ')
      expect(results).toHaveLength(tokens.length)
    })

    it('trims whitespace from search term', () => {
      const results = fuzzySearchByKeys(tokens, ['name', 'symbol'], '  ETH  ')
      expect(results[0].symbol).toBe('ETH')
    })

    it('returns empty array when searching empty array', () => {
      const results = fuzzySearchByKeys([], ['name'], 'test')
      expect(results).toHaveLength(0)
    })

    it('handles single key as string', () => {
      const results = fuzzySearchByKeys(tokens, 'symbol', 'ETH')
      expect(results[0].symbol).toBe('ETH')
    })

    it('handles items with missing key values', () => {
      const items = [
        { name: 'Ethereum', symbol: 'ETH' },
        { name: undefined as unknown as string, symbol: 'UNKNOWN' },
      ]
      const results = fuzzySearchByKeys(items, ['name', 'symbol'], 'Ether')
      expect(results).toHaveLength(1)
      expect(results[0].symbol).toBe('ETH')
    })

    it('does not return duplicates', () => {
      // "ETH" matches both name (Ethereum) and symbol (ETH) — should appear once
      const results = fuzzySearchByKeys(tokens, ['name', 'symbol'], 'ETH')
      const ethCount = results.filter(t => t.symbol === 'ETH').length
      expect(ethCount).toBe(1)
    })

    it('handles single-character search', () => {
      const results = fuzzySearchByKeys(tokens, ['symbol'], 'E')
      const symbols = results.map(t => t.symbol)
      expect(symbols).toContain('ETH')
      expect(symbols).toContain('ENS')
    })
  })
})

// ---------------------------------------------------------------------------
// searchArrayByKeysStr (existing function — regression tests)
// ---------------------------------------------------------------------------

describe('searchArrayByKeysStr', () => {
  it('finds by prefix match', () => {
    const results = searchArrayByKeysStr(tokens, ['name', 'symbol'], 'ETH')
    expect(results[0].symbol).toBe('ETH')
  })

  it('finds by contains match', () => {
    const results = searchArrayByKeysStr(tokens, ['name', 'symbol'], 'coin')
    const names = results.map(t => t.name)
    expect(names).toContain('USD Coin')
    expect(names).toContain('Bitcoin')
  })

  it('is case-insensitive', () => {
    const results = searchArrayByKeysStr(tokens, ['name', 'symbol'], 'eth')
    expect(results[0].symbol).toBe('ETH')
  })

  it('prefix matches come before contains', () => {
    const results = searchArrayByKeysStr(tokens, ['name', 'symbol'], 'eth')
    const ethIdx = results.findIndex(t => t.symbol === 'ETH')
    const stethIdx = results.findIndex(t => t.symbol === 'stETH')
    expect(ethIdx).toBeLessThan(stethIdx)
  })

  it('does not return duplicates', () => {
    const results = searchArrayByKeysStr(tokens, ['name', 'symbol'], 'ETH')
    const ethCount = results.filter(t => t.symbol === 'ETH').length
    expect(ethCount).toBe(1)
  })

  it('handles single key', () => {
    const results = searchArrayByKeysStr(tokens, 'symbol', 'BTC')
    expect(results[0].symbol).toBe('BTC')
  })
})
