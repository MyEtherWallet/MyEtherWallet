import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const HELP_URL = 'https://help.example.test/restrictions'

// Implementation is swapped per test rather than using mockResolvedValue, whose
// vitest typings infer `never` for this signature.
const isTradingRestricted = vi.fn(
  (): Promise<boolean> => Promise.resolve(false),
)

vi.mock('@/modules/trade/providers/ondoHelpers', () => ({
  isTradingRestricted: () => isTradingRestricted(),
  TRADING_RESTRICTED_HELP_URL: HELP_URL,
}))

const resolvesTo = (value: boolean) =>
  isTradingRestricted.mockImplementation(() => Promise.resolve(value))

// The geo check lives in module scope and caches its promise for the session, so
// every case needs a freshly imported module graph.
const freshImport = async () => {
  vi.resetModules()
  return import('@/modules/perps/composables/usePerpsRestriction')
}

describe('usePerpsRestriction', () => {
  beforeEach(() => {
    isTradingRestricted.mockReset()
    resolvesTo(false)
  })

  afterEach(() => {
    vi.resetModules()
  })

  it('starts restricted before the geo check resolves', async () => {
    // Never settles: this is the pre-resolution window.
    isTradingRestricted.mockImplementation(() => new Promise<boolean>(() => {}))
    const { usePerpsRestriction } = await freshImport()

    const { isPerpsRestricted } = usePerpsRestriction()

    // Fail-closed. A permissive default would flash a tradeable form at a user
    // who turns out to be blocked, which is the worse of the two failures.
    expect(isPerpsRestricted.value).toBe(true)
  })

  it('clears the restriction once the check reports the region is allowed', async () => {
    resolvesTo(false)
    const { usePerpsRestriction, resolvePerpsRestricted } = await freshImport()

    const { isPerpsRestricted } = usePerpsRestriction()
    await resolvePerpsRestricted()

    expect(isPerpsRestricted.value).toBe(false)
  })

  it('stays restricted when the check reports the region is blocked', async () => {
    resolvesTo(true)
    const { usePerpsRestriction, resolvePerpsRestricted } = await freshImport()

    const { isPerpsRestricted } = usePerpsRestriction()
    await resolvePerpsRestricted()

    expect(isPerpsRestricted.value).toBe(true)
  })

  it('stays restricted when the check fails', async () => {
    isTradingRestricted.mockImplementation(() =>
      Promise.reject(new Error('network down')),
    )
    // The composable logs the failure in dev mode; expected here, so keep it
    // out of the suite output.
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)
    const { usePerpsRestriction, resolvePerpsRestricted } = await freshImport()

    const { isPerpsRestricted } = usePerpsRestriction()
    await resolvePerpsRestricted()

    expect(isPerpsRestricted.value).toBe(true)
    consoleError.mockRestore()
  })

  it('exposes the help url used by the Learn more links', async () => {
    const { usePerpsRestriction } = await freshImport()

    expect(usePerpsRestriction().perpsHelpUrl).toBe(HELP_URL)
  })

  describe('resolvePerpsRestricted', () => {
    // This is the contract `tryRestoreAuth` depends on: it runs at app boot from
    // an `immediate: true` watcher, so reading the fail-closed ref would skip a
    // legitimate user's stored token — and that watcher only re-fires on an
    // address change, stranding them signed out for the whole session.
    it('resolves to the real value rather than the fail-closed default', async () => {
      resolvesTo(false)
      const { resolvePerpsRestricted } = await freshImport()

      await expect(resolvePerpsRestricted()).resolves.toBe(false)
    })

    it('resolves to true when blocked', async () => {
      resolvesTo(true)
      const { resolvePerpsRestricted } = await freshImport()

      await expect(resolvePerpsRestricted()).resolves.toBe(true)
    })

    it('hits the network once per session no matter how many callers await it', async () => {
      resolvesTo(false)
      const { usePerpsRestriction, resolvePerpsRestricted } =
        await freshImport()

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
