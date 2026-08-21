import { describe, it, expect, vi } from 'vitest'

// walletConfigs drags @enkryptcom/hw-wallets (ledger transport) into the
// import graph via @/analytics; the transport does not resolve under vitest.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

import { fusionErrorMessage } from '@/modules/trade/providers/oneinch_fusion/oneInchFusion'

const axios400 = (data: unknown) =>
  Object.assign(new Error('Request failed with status code 400'), {
    response: { status: 400, data },
  })

describe('fusionErrorMessage', () => {
  it('localizes known machine-readable codes', () => {
    const message = fusionErrorMessage(
      axios400({
        error: 'Bad Request',
        description: 'insufficient amount',
        code: 'INSUFFICIENT_AMOUNT',
      }),
    )
    expect(message).toBe(
      'Amount is too low to trade right now. Try a larger amount.',
    )
  })

  it('falls back to the API description for unknown codes', () => {
    const message = fusionErrorMessage(
      axios400({
        error: 'Bad Request',
        description: 'token not supported',
        code: 'SOMETHING_NEW',
      }),
    )
    expect(message).toBe('token not supported')
  })

  it('never surfaces the generic error field', () => {
    const message = fusionErrorMessage(axios400({ error: 'Bad Request' }))
    expect(message).toBeNull()
  })

  it('returns null for errors without a response body', () => {
    expect(fusionErrorMessage(new Error('Network Error'))).toBeNull()
    expect(fusionErrorMessage(null)).toBeNull()
    expect(fusionErrorMessage('boom')).toBeNull()
  })
})
