import { describe, it, expect, vi, beforeEach } from 'vitest'

const captureExceptionSpy = vi.fn()
vi.mock('@sentry/vue', () => ({
  captureException: (...args: unknown[]) => captureExceptionSpy(...args),
}))

// `sentry.ts` reads `Configs.IS_DEV_MODE` once at module load, so the mock
// exposes it through a getter and each `load()` re-imports a fresh graph with
// the desired value.
let devMode = false
vi.mock('@/configs', () => ({
  default: {
    get IS_DEV_MODE() {
      return devMode
    },
  },
}))

// The noise gate narrows with `instanceof`, so the error classes must come from
// the SAME module graph as `sentry.ts` — a class imported once at the top would
// be a different identity after `resetModules`. Hence both are re-imported here.
const load = async (isDev = false) => {
  devMode = isDev
  vi.resetModules()
  captureExceptionSpy.mockReset()
  const { PerpsHttpError, PerpsServiceUnavailableError } = await import(
    '@/modules/perps/sdk/client'
  )
  const sentry = await import('@/modules/perps/sentry')
  const { PERPS_FEATURE, perpsTags } = await import('@/sentry/constants')
  return { ...sentry, PerpsHttpError, PerpsServiceUnavailableError, PERPS_FEATURE, perpsTags }
}

describe('perps sentry helper', () => {
  beforeEach(() => {
    captureExceptionSpy.mockReset()
  })

  describe('perpsTags', () => {
    it('keeps module:perps intact and adds the feature axis', async () => {
      const { perpsTags, PERPS_FEATURE } = await load()
      expect(perpsTags(PERPS_FEATURE.ORDER)).toEqual({
        tags: { module: 'perps', feature: 'order' },
      })
    })
  })

  describe('isPerpsNoise', () => {
    it('gates user rejections (EIP-1193 4001 and message patterns)', async () => {
      const { isPerpsNoise } = await load()
      expect(isPerpsNoise({ code: 4001, message: 'User rejected' })).toBe(true)
      expect(isPerpsNoise(new Error('User denied transaction signature'))).toBe(
        true,
      )
    })

    it('gates the service-unavailable sentinel (already surfaced by the status banner)', async () => {
      const { isPerpsNoise, PerpsServiceUnavailableError } = await load()
      expect(isPerpsNoise(new PerpsServiceUnavailableError())).toBe(true)
    })

    it('gates 401s (handled by the re-auth path)', async () => {
      const { isPerpsNoise, PerpsHttpError } = await load()
      expect(isPerpsNoise(new PerpsHttpError(401, 'Unauthorized'))).toBe(true)
    })

    it('does NOT gate real failures (5xx, generic errors)', async () => {
      const { isPerpsNoise, PerpsHttpError } = await load()
      expect(isPerpsNoise(new PerpsHttpError(500, 'Internal error'))).toBe(false)
      expect(isPerpsNoise(new PerpsHttpError(400, 'Bad request'))).toBe(false)
      expect(isPerpsNoise(new Error('boom'))).toBe(false)
    })
  })

  describe('capturePerps (production)', () => {
    it('reports a real failure to Sentry with module + feature tags and extra', async () => {
      const { capturePerps, PERPS_FEATURE, PerpsHttpError } = await load(false)
      const err = new PerpsHttpError(500, 'Internal error')
      capturePerps(PERPS_FEATURE.ORDER, err, {
        title: 'PERPS: Order creation failed',
        extra: { market: 'BTC-USD' },
      })
      expect(captureExceptionSpy).toHaveBeenCalledTimes(1)
      const [reported, ctx] = captureExceptionSpy.mock.calls[0]
      expect(reported).toBe(err)
      expect(ctx.tags).toEqual({ module: 'perps', feature: 'order' })
      expect(ctx.extra.title).toBe('PERPS: Order creation failed')
      expect(ctx.extra.errorMessage).toBe('Internal error')
      expect(ctx.extra.market).toBe('BTC-USD')
    })

    it('swallows gated noise without reporting to Sentry', async () => {
      const { capturePerps, PERPS_FEATURE, PerpsServiceUnavailableError } =
        await load(false)
      capturePerps(PERPS_FEATURE.WITHDRAW, new PerpsServiceUnavailableError(), {
        title: 'PERPS: Withdraw failed',
      })
      capturePerps(
        PERPS_FEATURE.ORDER,
        { code: 4001, message: 'User rejected' },
        { title: 'PERPS: Order failed' },
      )
      expect(captureExceptionSpy).not.toHaveBeenCalled()
    })
  })

  describe('capturePerps (dev mode)', () => {
    it('never reaches Sentry in dev mode', async () => {
      const { capturePerps, PERPS_FEATURE, PerpsHttpError } = await load(true)
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      capturePerps(PERPS_FEATURE.ORDER, new PerpsHttpError(500, 'boom'), {
        title: 'PERPS: Order creation failed',
      })
      expect(captureExceptionSpy).not.toHaveBeenCalled()
      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })
  })
})
