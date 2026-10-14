import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Hoisted so the mock factories below (which vitest lifts above this file's
// top-level statements) can reference them.
const { HELP_URL, isTradingRestricted } = vi.hoisted(() => ({
  HELP_URL: 'https://help.example.test/restrictions',
  // Implementation is swapped per test rather than using mockResolvedValue,
  // whose vitest typings infer `never` for this signature.
  isTradingRestricted: vi.fn((): Promise<boolean> => Promise.resolve(false)),
}))

vi.mock('@/modules/trade/providers/ondoHelpers', () => ({
  isTradingRestricted: () => isTradingRestricted(),
  TRADING_RESTRICTED_HELP_URL: HELP_URL,
}))

// globalStore (which now owns the geo check) pulls in analytics and Sentry;
// @/analytics transitively resolves the hardware-wallet SDK, unavailable here.
vi.mock('@/analytics', () => ({
  analytics: { setNetwork: vi.fn(), setIsRegionRestricted: vi.fn() },
}))
vi.mock('@sentry/vue', () => ({ setTag: vi.fn() }))
vi.mock('@/utils/reportModuleError', () => ({ reportModuleError: vi.fn() }))

const resolvesTo = (value: boolean) =>
  isTradingRestricted.mockImplementation(() => Promise.resolve(value))

import {
  usePerpsRestriction,
  resolvePerpsRestricted,
} from '@/modules/perps/composables/usePerpsRestriction'

describe('usePerpsRestriction', () => {
  // The geo check and its dedupe live in the store, so each case needs a fresh
  // pinia rather than a fresh module graph.
  beforeEach(() => {
    setActivePinia(createPinia())
    isTradingRestricted.mockReset()
    resolvesTo(false)
  })

  it('starts restricted before the geo check resolves', () => {
    // Never settles: this is the pre-resolution window.
    isTradingRestricted.mockImplementation(() => new Promise<boolean>(() => {}))

    const { isPerpsRestricted } = usePerpsRestriction()

    // Fail-closed. A permissive default would flash a tradeable form at a user
    // who turns out to be blocked, which is the worse of the two failures.
    expect(isPerpsRestricted.value).toBe(true)
  })

  it('clears the restriction once the check reports the region is allowed', async () => {
    resolvesTo(false)

    const { isPerpsRestricted } = usePerpsRestriction()
    await resolvePerpsRestricted()

    expect(isPerpsRestricted.value).toBe(false)
  })

  it('stays restricted when the check reports the region is blocked', async () => {
    resolvesTo(true)

    const { isPerpsRestricted } = usePerpsRestriction()
    await resolvePerpsRestricted()

    expect(isPerpsRestricted.value).toBe(true)
  })

  it('stays restricted when the check fails', async () => {
    isTradingRestricted.mockImplementation(() =>
      Promise.reject(new Error('network down')),
    )

    const { isPerpsRestricted } = usePerpsRestriction()
    await resolvePerpsRestricted()

    expect(isPerpsRestricted.value).toBe(true)
  })

  it('exposes the help url used by the Learn more links', () => {
    expect(usePerpsRestriction().perpsHelpUrl).toBe(HELP_URL)
  })

  describe('resolvePerpsRestricted', () => {
    // This is the contract `tryRestoreAuth` depends on: it runs at app boot from
    // an `immediate: true` watcher, so reading the fail-closed ref would skip a
    // legitimate user's stored token — and that watcher only re-fires on an
    // address change, stranding them signed out for the whole session.
    it('resolves to the real value rather than the fail-closed default', async () => {
      resolvesTo(false)

      await expect(resolvePerpsRestricted()).resolves.toBe(false)
    })

    it('resolves to true when blocked', async () => {
      resolvesTo(true)

      await expect(resolvePerpsRestricted()).resolves.toBe(true)
    })

    it('hits the network once per session no matter how many callers await it', async () => {
      resolvesTo(false)

      usePerpsRestriction()
      usePerpsRestriction()
      await Promise.all([
        resolvePerpsRestricted(),
        resolvePerpsRestricted(),
        resolvePerpsRestricted(),
      ])

      expect(isTradingRestricted).toHaveBeenCalledTimes(1)
    })
  })
})
