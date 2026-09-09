import { describe, it, expect } from 'vitest'
import {
  isAssetTradableInSession,
  getSessionDisabledAddresses,
  getActivePauseReason,
  pickFirstAvailableToken,
} from '@/modules/trade/common/tradeSession'
import type { GetWebSwapOndoAssetsResponse } from '@/mew_api/types'

type TradableAsset = GetWebSwapOndoAssetsResponse[number]

const asset = (over: {
  symbol?: string
  tradable?: boolean
  sessions?: string[]
  address?: string
}): TradableAsset =>
  ({
    symbol: over.symbol ?? 'AAPLon',
    tradable: over.tradable ?? true,
    pause: null,
    primaryMarket: {
      price: '100',
      sharesMultiplier: '1',
      ...(over.sessions !== undefined
        ? { tradableSessions: over.sessions }
        : {}),
    },
    underlyingMarket: { name: 'x', price: '100' },
    addresses: [
      {
        chainName: 'ETHEREUM',
        ondoGmNetworkChainId: 'eth-1',
        address: over.address ?? '0xAAA',
        decimals: 18,
      },
    ],
  }) as TradableAsset

describe('isAssetTradableInSession', () => {
  it('is false when currentSession is null', () => {
    expect(
      isAssetTradableInSession(asset({ sessions: ['regular'] }), null),
    ).toBe(false)
  })

  it('is true when the session is in tradableSessions', () => {
    expect(
      isAssetTradableInSession(
        asset({ sessions: ['regular', 'offhours'] }),
        'offhours',
      ),
    ).toBe(true)
  })

  it('is false when the session is not in tradableSessions', () => {
    expect(
      isAssetTradableInSession(asset({ sessions: ['regular'] }), 'offhours'),
    ).toBe(false)
  })

  it('is not session-gated when tradableSessions is missing', () => {
    expect(isAssetTradableInSession(asset({}), 'offhours')).toBe(true)
  })
})

describe('getSessionDisabledAddresses', () => {
  it('returns empty set for null assets', () => {
    expect(getSessionDisabledAddresses(null, 'regular').size).toBe(0)
  })

  it('disables tradable assets whose session is not allowed (lowercased)', () => {
    const assets = [
      asset({ symbol: 'A', sessions: ['regular'], address: '0xAaA' }),
      asset({ symbol: 'B', sessions: ['offhours'], address: '0xBbB' }),
    ]
    const disabled = getSessionDisabledAddresses(assets, 'offhours')
    expect(disabled.has('0xaaa')).toBe(true) // A not tradable offhours
    expect(disabled.has('0xbbb')).toBe(false) // B is offhours-tradable
  })

  it('disables globally paused assets (tradable === false)', () => {
    const assets = [
      asset({
        symbol: 'P',
        tradable: false,
        sessions: ['regular'],
        address: '0xPpP',
      }),
    ]
    const disabled = getSessionDisabledAddresses(assets, 'offhours')
    expect(disabled.has('0xppp')).toBe(true)
  })

  it('off-hours override: paused asset that explicitly lists offhours stays enabled', () => {
    const assets = [
      asset({
        symbol: 'P',
        tradable: false,
        sessions: ['offhours'],
        address: '0xPpP',
      }),
    ]
    const disabled = getSessionDisabledAddresses(assets, 'offhours')
    expect(disabled.has('0xppp')).toBe(false)
  })

  it('paused asset with missing tradableSessions is NOT enabled by the fallback during offhours', () => {
    const assets = [asset({ tradable: false, address: '0xPpP' })] // no sessions
    const disabled = getSessionDisabledAddresses(assets, 'offhours')
    expect(disabled.has('0xppp')).toBe(true)
  })

  it('disables everything tradable when currentSession is null', () => {
    const assets = [asset({ sessions: ['regular'], address: '0xAaA' })]
    expect(getSessionDisabledAddresses(assets, null).has('0xaaa')).toBe(true)
  })

  // Regression: Sentry APP-MEW-WEB-1CE — the Ondo assets API can return an
  // array containing a null element; reading `.tradable` off it threw
  // "Cannot read properties of null (reading 'tradable')" and crashed <ModuleTrade>.
  it('skips null asset elements without throwing and still processes valid ones', () => {
    const assets = [
      null,
      asset({
        symbol: 'A',
        tradable: false,
        sessions: ['regular'],
        address: '0xAaA',
      }),
    ] as unknown as TradableAsset[]
    let disabled: Set<string> | undefined
    expect(() => {
      disabled = getSessionDisabledAddresses(assets, 'regular')
    }).not.toThrow()
    expect(disabled?.has('0xaaa')).toBe(true)
  })

  it('skips non-null malformed assets (missing addresses) and still processes valid ones', () => {
    const assets = [
      { tradable: false } as unknown as TradableAsset, // no addresses array
      asset({
        symbol: 'A',
        tradable: false,
        sessions: ['regular'],
        address: '0xAaA',
      }),
    ]
    let disabled: Set<string> | undefined
    expect(() => {
      disabled = getSessionDisabledAddresses(assets, 'regular')
    }).not.toThrow()
    expect(disabled?.has('0xaaa')).toBe(true)
  })

  it('skips malformed address members (null / non-string) without throwing', () => {
    const assets = [
      // paused asset whose addresses array has a null member and a
      // non-string address alongside one valid string address
      {
        symbol: 'M',
        tradable: false,
        pause: null,
        primaryMarket: { price: '1', sharesMultiplier: '1' },
        underlyingMarket: { name: 'x', price: '1' },
        addresses: [
          null,
          { chainName: 'ETHEREUM', address: 123 },
          { chainName: 'ETHEREUM', address: '0xVaLiD' },
        ],
      } as unknown as TradableAsset,
    ]
    let disabled: Set<string> | undefined
    expect(() => {
      disabled = getSessionDisabledAddresses(assets, 'regular')
    }).not.toThrow()
    expect(disabled?.has('0xvalid')).toBe(true)
    expect(disabled?.size).toBe(1) // null + non-string members ignored
  })

  it('skips null asset elements during offhours and still disables valid paused assets', () => {
    const assets = [
      null,
      asset({
        symbol: 'A',
        tradable: false,
        sessions: ['regular'],
        address: '0xAaA',
      }),
    ] as unknown as TradableAsset[]
    let disabled: Set<string> | undefined
    expect(() => {
      disabled = getSessionDisabledAddresses(assets, 'offhours')
    }).not.toThrow()
    // Paused asset that does not opt into offhours must still be disabled.
    expect(disabled?.has('0xaaa')).toBe(true)
  })
})

describe('getActivePauseReason', () => {
  const pause = (over: {
    message?: string
    code?: string
    start?: string | null
    end?: string | null
  }) =>
    ({
      pause: {
        status: 'upcoming',
        type: 'scheduled',
        reason: {
          code: over.code ?? 'ASSET_PAUSED',
          message: over.message ?? 'cash_dividend',
        },
        start: over.start === undefined ? '2026-09-03T23:52:00Z' : over.start,
        end: over.end === undefined ? '2026-09-04T08:10:00Z' : over.end,
      },
    }) as unknown as TradableAsset

  const INSIDE = Date.parse('2026-09-04T00:00:00Z')
  const BEFORE = Date.parse('2026-09-01T00:00:00Z')
  const AFTER = Date.parse('2026-09-05T00:00:00Z')

  it('returns the reason while the window covers now', () => {
    expect(getActivePauseReason(pause({}), INSIDE)).toBe('cash_dividend')
  })

  it('returns null before the window starts', () => {
    expect(getActivePauseReason(pause({}), BEFORE)).toBeNull()
  })

  it('returns null after the window ends', () => {
    expect(getActivePauseReason(pause({}), AFTER)).toBeNull()
  })

  it('includes both window bounds', () => {
    const start = Date.parse('2026-09-03T23:52:00Z')
    const end = Date.parse('2026-09-04T08:10:00Z')
    expect(getActivePauseReason(pause({}), start)).toBe('cash_dividend')
    expect(getActivePauseReason(pause({}), end)).toBe('cash_dividend')
  })

  it('treats ASSET_LIMITED like ASSET_PAUSED', () => {
    expect(
      getActivePauseReason(
        pause({ code: 'ASSET_LIMITED', message: 'earnings' }),
        INSIDE,
      ),
    ).toBe('earnings')
  })

  it('returns null for a slug the design does not map', () => {
    expect(
      getActivePauseReason(pause({ message: 'rocket_launch' }), INSIDE),
    ).toBeNull()
  })

  it('normalizes casing and surrounding whitespace', () => {
    expect(
      getActivePauseReason(pause({ message: '  Stock_Split  ' }), INSIDE),
    ).toBe('stock_split')
  })

  it('returns null when the asset has no pause (SHVon in the live payload)', () => {
    expect(
      getActivePauseReason({ pause: null } as TradableAsset, INSIDE),
    ).toBeNull()
  })

  // A missing or unparseable bound is open on that side: an indefinite halt
  // (start set, no end) is the normal API shape for "paused until further
  // notice" and must keep surfacing its reason.
  it('treats a missing start as open-ended from the past', () => {
    expect(getActivePauseReason(pause({ start: null }), INSIDE)).toBe(
      'cash_dividend',
    )
  })

  it('treats a missing or unparseable end as an indefinite halt', () => {
    expect(getActivePauseReason(pause({ end: null }), AFTER)).toBe(
      'cash_dividend',
    )
    expect(getActivePauseReason(pause({ end: 'not-a-date' }), AFTER)).toBe(
      'cash_dividend',
    )
  })

  it('still respects the one bound that is present', () => {
    expect(getActivePauseReason(pause({ end: null }), BEFORE)).toBeNull()
    expect(getActivePauseReason(pause({ start: null }), AFTER)).toBeNull()
  })

  it('reads a timezone-naive timestamp as UTC, not viewer-local', () => {
    const naive = pause({
      start: '2026-09-03 23:52:00',
      end: '2026-09-04 08:10:00',
    })
    expect(
      getActivePauseReason(naive, Date.parse('2026-09-04T00:00:00Z')),
    ).toBe('cash_dividend')
    expect(
      getActivePauseReason(naive, Date.parse('2026-09-04T09:00:00Z')),
    ).toBeNull()
  })

  it('returns null for null or undefined assets', () => {
    expect(getActivePauseReason(null, INSIDE)).toBeNull()
    expect(getActivePauseReason(undefined, INSIDE)).toBeNull()
  })
})

describe('pickFirstAvailableToken', () => {
  const tokens = [
    { symbol: 'AALON', address: '0xA' },
    { symbol: 'AAONON', address: '0xB' },
    { symbol: 'AAPLON', address: '0xC' },
  ]

  it('skips tokens disabled for the session and returns the first enabled one', () => {
    expect(pickFirstAvailableToken(tokens, ['0xa', '0xb'])).toEqual(tokens[2])
  })

  it('returns the first token when nothing is disabled', () => {
    expect(pickFirstAvailableToken(tokens, [])).toEqual(tokens[0])
  })

  it('falls back to the first token when every token is disabled', () => {
    expect(pickFirstAvailableToken(tokens, ['0xa', '0xb', '0xc'])).toEqual(
      tokens[0],
    )
  })

  it('returns null for an empty list', () => {
    expect(pickFirstAvailableToken([], ['0xa'])).toBeNull()
  })
})
