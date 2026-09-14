import { beforeEach, describe, expect, it, vi } from 'vitest'

const { captureException } = vi.hoisted(() => ({
  captureException: vi.fn(),
}))

vi.mock('@sentry/vue', () => ({ captureException }))
// Separate spec from reportModuleError.spec.ts because IS_DEV_MODE is read at
// module scope, so the two modes cannot share one module graph.
vi.mock('@/configs', () => ({ default: { IS_DEV_MODE: true } }))

import { reportModuleError } from '@/utils/reportModuleError'

const tag = { tags: { module: 'trade' } }

describe('reportModuleError in development', () => {
  let consoleError: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    captureException.mockClear()
    consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)
  })

  it('logs to the console instead of Sentry', () => {
    const error = new Error('failed')

    reportModuleError({ tag, title: 'TRADE: Failed', error })

    expect(consoleError).toHaveBeenCalledWith('TRADE: Failed', error)
    expect(captureException).not.toHaveBeenCalled()
    consoleError.mockRestore()
  })

  // The dev-mode branch returns before the `expected` filter, so an expected
  // error is still visible to the developer who caused it.
  it('logs expected errors too', () => {
    const error = new Error('expected failure')

    reportModuleError({ tag, title: 'TRADE: Expected', error, expected: true })

    expect(consoleError).toHaveBeenCalledWith('TRADE: Expected', error)
    expect(captureException).not.toHaveBeenCalled()
    consoleError.mockRestore()
  })
})
