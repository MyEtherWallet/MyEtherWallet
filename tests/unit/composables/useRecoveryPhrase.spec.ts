import { beforeEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({
  exportRecoveryPhrase: vi.fn(),
  track: vi.fn(),
}))

// The real store reaches the hardware-wallet SDK, which Vitest cannot load.
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({ exportRecoveryPhrase: fake.exportRecoveryPhrase }),
}))
vi.mock('@/analytics', () => ({
  analytics: { trackAccountSecurityEvent: fake.track },
}))

import { useRecoveryPhrase } from '@/composables/useRecoveryPhrase'

const WORDS = ['legal', 'winner', 'thank', 'year']

/** A phrase request the test answers when it chooses to. */
const pendingExport = () => {
  let answer: (words: string[]) => void = () => undefined
  let fail: (error: unknown) => void = () => undefined
  fake.exportRecoveryPhrase.mockImplementation(
    () =>
      new Promise<string[]>((resolve, reject) => {
        answer = resolve
        fail = reject
      }),
  )
  return {
    answer: (words: string[]) => answer(words),
    fail: (e: unknown) => fail(e),
  }
}
const settled = () => new Promise(resolve => setTimeout(resolve, 0))

describe('useRecoveryPhrase', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('holds nothing before the phrase is asked for', () => {
    expect(useRecoveryPhrase().state.value).toEqual({ status: 'idle' })
  })

  it('is loading while Privy is asked, then holds the words', async () => {
    const privy = pendingExport()
    const { state, load } = useRecoveryPhrase()

    const loading = load()
    expect(state.value).toEqual({ status: 'loading' })

    privy.answer(WORDS)
    await loading

    expect(state.value).toEqual({ status: 'ready', words: WORDS })
  })

  it('drops the words when cleared', async () => {
    fake.exportRecoveryPhrase.mockResolvedValue(WORDS)
    const { state, load, clear } = useRecoveryPhrase()
    await load()

    clear()

    expect(state.value).toEqual({ status: 'idle' })
  })

  it('discards a phrase that arrives after it was cleared', async () => {
    const privy = pendingExport()
    const { state, load, clear } = useRecoveryPhrase()
    const loading = load()

    clear()
    privy.answer(WORDS)
    await loading

    expect(state.value).toEqual({ status: 'idle' })
  })

  it('reports a failure, with a reason and nothing else, when Privy refuses', async () => {
    fake.exportRecoveryPhrase.mockRejectedValue(
      Object.assign(new Error('Forbidden'), { code: 'not_a_phrase' }),
    )
    const { state, load } = useRecoveryPhrase()

    await load()

    expect(state.value).toEqual({ status: 'error' })
    expect(fake.track.mock.calls).toEqual([
      ['Recovery_Phrase_Failed', { reason: 'not_a_phrase' }],
    ])
  })

  it('goes back to idle, with no error, when the user cancels the passkey check', async () => {
    fake.exportRecoveryPhrase.mockRejectedValue(
      Object.assign(new Error('Passkey check canceled'), {
        code: 'mfa_canceled',
      }),
    )
    const { state, load } = useRecoveryPhrase()

    await load()

    expect(state.value).toEqual({ status: 'idle' })
    expect(fake.track).not.toHaveBeenCalled()
  })

  it('ignores a failure that arrives after it was cleared', async () => {
    const privy = pendingExport()
    const { state, load, clear } = useRecoveryPhrase()
    const loading = load()

    clear()
    privy.fail(new Error('late'))
    await loading
    await settled()

    expect(state.value).toEqual({ status: 'idle' })
  })
})
