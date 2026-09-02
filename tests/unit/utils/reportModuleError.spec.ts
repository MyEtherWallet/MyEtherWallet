import { beforeEach, describe, expect, it, vi } from 'vitest'

const { captureException } = vi.hoisted(() => ({
  captureException: vi.fn(),
}))

vi.mock('@sentry/vue', () => ({ captureException }))
vi.mock('@/configs', () => ({ default: { IS_DEV_MODE: false } }))

import { reportModuleError } from '@/utils/reportModuleError'

const tag = { tags: { module: 'trade' } }

describe('reportModuleError', () => {
  beforeEach(() => captureException.mockClear())

  it('captures unexpected errors with consistent context', () => {
    const error = new Error('failed')

    reportModuleError({
      tag,
      title: 'TRADE: Failed',
      error,
      extra: { request: 'quote' },
    })

    expect(captureException).toHaveBeenCalledWith(error, {
      tags: { module: 'trade' },
      extra: {
        title: 'TRADE: Failed',
        errorMessage: 'failed',
        request: 'quote',
      },
    })
  })

  it('does not capture expected errors', () => {
    reportModuleError({
      tag,
      title: 'TRADE: Expected failure',
      error: new Error('expected'),
      expected: true,
    })

    expect(captureException).not.toHaveBeenCalled()
  })
})
