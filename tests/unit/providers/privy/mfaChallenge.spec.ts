import { beforeEach, describe, expect, it, vi } from 'vitest'

type Waiting<T> = {
  resolve: (value: T) => void
  reject: (error: unknown) => void
}

/** The part of the SDK's MFA hand-off this module talks to. */
const fake = vi.hoisted(() => {
  const handlers: Array<() => void> = []
  return {
    handlers,
    passkeyAssertion: vi.fn(),
    privy: {
      mfaPromises: {
        on: (_event: string, handler: () => void) => handlers.push(handler),
        rootPromise: { current: null as Waiting<unknown> | null },
        submitPromise: { current: null as Waiting<undefined> | null },
      },
    },
  }
})

/** The error the passkey module raises for a dismissed browser prompt. */
class PasskeyCancelledError extends Error {}

vi.mock('@/providers/privy/client', () => ({ privy: fake.privy }))
vi.mock('@/providers/privy/passkey', () => ({
  passkeyAssertion: fake.passkeyAssertion,
  PasskeyCancelledError,
}))

const PROOF = { id: 'bmV3', raw_id: 'bmV3', type: 'public-key' }

const { rootPromise, submitPromise } = fake.privy.mfaPromises

/** Privy holds a wallet action and asks for the check, as the SDK does. */
const privyAsksForTheCheck = () => {
  const held = { resolve: vi.fn(), reject: vi.fn() }
  rootPromise.current = held
  for (const handler of fake.handlers) handler()
  return held
}
/** Privy refuses the proof and waits for another, as the SDK does. */
const privyRefusesTheProof = () => {
  const refused = submitPromise.current
  const held = { resolve: vi.fn(), reject: vi.fn() }
  rootPromise.current = held
  refused?.reject({ type: 'missing_or_invalid_mfa' })
  return held
}
const settled = () => new Promise(resolve => setTimeout(resolve, 0))

const onOutcome = vi.fn()
const start = async () => {
  const { answerPasskeyChecks } = await import('@/providers/privy/mfaChallenge')
  answerPasskeyChecks(onOutcome)
  return answerPasskeyChecks
}

describe('answerPasskeyChecks', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    fake.handlers.length = 0
    rootPromise.current = null
    submitPromise.current = null
    fake.passkeyAssertion.mockResolvedValue(PROOF)
  })

  it("answers Privy's check with a passkey proof made on this site", async () => {
    await start()

    const held = privyAsksForTheCheck()
    await settled()

    expect(fake.passkeyAssertion).toHaveBeenCalledTimes(1)
    expect(held.resolve).toHaveBeenCalledWith({
      mfaMethod: 'passkey',
      mfaCode: PROOF,
      relyingParty: window.location.origin,
    })
  })

  it('fails the held wallet action at once when the user dismisses the passkey prompt', async () => {
    fake.passkeyAssertion.mockRejectedValue(new PasskeyCancelledError())
    await start()

    const held = privyAsksForTheCheck()
    await settled()

    expect(held.resolve).not.toHaveBeenCalled()
    expect(held.reject).toHaveBeenCalledTimes(1)
    // The app's flows show a cancelled request for an error that says so.
    expect(held.reject.mock.calls[0][0]).toMatchObject({
      code: 'mfa_canceled',
      message: expect.stringMatching(/cancell?ed/i),
    })
  })

  it('fails the held wallet action as a failure, not a cancellation, when the check cannot be made', async () => {
    // No challenge from Privy, a passkey that belongs to another site, a
    // browser that cannot ask: none of these is the user saying no.
    fake.passkeyAssertion.mockRejectedValue(new Error('Failed to fetch'))
    await start()

    const held = privyAsksForTheCheck()
    await settled()

    expect(held.resolve).not.toHaveBeenCalled()
    expect(held.reject).toHaveBeenCalledTimes(1)
    const failure = held.reject.mock.calls[0][0] as Error & { code: string }
    expect(failure.code).not.toBe('mfa_canceled')
    // The app's flows show this message to the user as it is.
    expect(failure.message).toBe(
      'Your passkey could not be checked, so nothing was done. Please try again.',
    )
    expect(failure.message).not.toMatch(/cancell?ed|rejected|denied/i)
    expect(onOutcome.mock.calls).toEqual([['failed']])
  })

  it('asks for the passkey again when Privy refuses the proof', async () => {
    await start()
    privyAsksForTheCheck()
    await settled()

    const heldAgain = privyRefusesTheProof()
    await settled()

    expect(fake.passkeyAssertion).toHaveBeenCalledTimes(2)
    expect(heldAgain.resolve).toHaveBeenCalledWith(
      expect.objectContaining({ mfaMethod: 'passkey', mfaCode: PROOF }),
    )
  })

  it('stops asking once Privy accepts the proof', async () => {
    await start()
    privyAsksForTheCheck()
    await settled()

    submitPromise.current?.resolve(undefined)
    await settled()

    expect(fake.passkeyAssertion).toHaveBeenCalledTimes(1)
  })

  it('stops asking once Privy has given up on the action', async () => {
    await start()
    privyAsksForTheCheck()
    await settled()

    submitPromise.current?.reject({
      type: 'mfa_verification_max_attempts_reached',
    })
    await settled()

    expect(fake.passkeyAssertion).toHaveBeenCalledTimes(1)
  })

  it('listens once however often it is started', async () => {
    const answerPasskeyChecks = await start()
    answerPasskeyChecks(onOutcome)

    privyAsksForTheCheck()
    await settled()

    expect(fake.passkeyAssertion).toHaveBeenCalledTimes(1)
  })

  it('reports how each check ended: cancelled, failed, then passed', async () => {
    fake.passkeyAssertion.mockRejectedValueOnce(new PasskeyCancelledError())
    await start()
    privyAsksForTheCheck()
    await settled()
    expect(onOutcome.mock.calls).toEqual([['cancelled']])

    privyAsksForTheCheck()
    await settled()
    privyRefusesTheProof()
    await settled()
    expect(onOutcome.mock.calls).toEqual([['cancelled'], ['failed']])

    submitPromise.current?.resolve(undefined)
    await settled()
    expect(onOutcome.mock.calls).toEqual([
      ['cancelled'],
      ['failed'],
      ['passed'],
    ])
  })
})
