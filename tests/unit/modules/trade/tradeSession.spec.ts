import { describe, it, expect } from 'vitest'
import {
  isAssetTradableInSession,
  getSessionDisabledAddresses,
} from '@/modules/trade/composables/tradeSession'
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
      ...(over.sessions !== undefined ? { tradableSessions: over.sessions } : {}),
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
      isAssetTradableInSession(asset({ sessions: ['regular', 'offhours'] }), 'offhours'),
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
      asset({ symbol: 'P', tradable: false, sessions: ['regular'], address: '0xPpP' }),
    ]
    const disabled = getSessionDisabledAddresses(assets, 'offhours')
    expect(disabled.has('0xppp')).toBe(true)
  })

  it('off-hours override: paused asset that explicitly lists offhours stays enabled', () => {
    const assets = [
      asset({ symbol: 'P', tradable: false, sessions: ['offhours'], address: '0xPpP' }),
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
      asset({ symbol: 'A', tradable: false, sessions: ['regular'], address: '0xAaA' }),
    ] as unknown as TradableAsset[]
    let disabled: Set<string> | undefined
    expect(() => {
      disabled = getSessionDisabledAddresses(assets, 'regular')
    }).not.toThrow()
    expect(disabled?.has('0xaaa')).toBe(true)
  })

  it('skips null asset elements during offhours without throwing', () => {
    const assets = [
      null,
      asset({ symbol: 'A', sessions: ['offhours'], address: '0xAaA' }),
    ] as unknown as TradableAsset[]
    expect(() =>
      getSessionDisabledAddresses(assets, 'offhours'),
    ).not.toThrow()
  })
})
