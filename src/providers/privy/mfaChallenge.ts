import {
  errorIndicatesMfaVerificationFailed,
  PrivyClientError,
} from '@privy-io/js-sdk-core'
import i18n from '@/i18n'
import { privy } from './client'
import { passkeyAssertion, PasskeyCancelledError } from './passkey'

/**
 * Answers Privy's passkey check.
 *
 * A user who has enrolled a passkey must prove it before the wallet signs or
 * is exported. Privy's SDK shows nothing itself: it holds the wallet request,
 * emits `mfaRequired`, and waits (five minutes per attempt, four attempts)
 * for the app to hand it a proof. One listener here serves every wallet
 * request there is: transactions, messages and the recovery phrase export.
 *
 * Reach this module through a dynamic `import()` only, like every module that
 * loads the Privy client.
 */

/** How one check ended, for whoever wants to count them. */
export type PasskeyCheckOutcome = 'passed' | 'failed' | 'cancelled'
type OnOutcome = (outcome: PasskeyCheckOutcome) => void

let listening = false

/**
 * The error a wallet request ends with when its passkey check could not be
 * made. Its message is the sentence the user reads: the request's own flow
 * (send, recovery phrase, removing a passkey) shows it as it is.
 */
const checkFailed = (cause: unknown): PrivyClientError =>
  new PrivyClientError({
    code: 'invalid_passkey_response',
    error: i18n.global.t('common.error.passkey_check_failed'),
    cause,
  })

/**
 * One check: ask for the passkey, hand the proof to Privy, and ask again for
 * as long as Privy refuses the proof and is still waiting for another.
 */
const answerCheck = async (onOutcome: OnOutcome): Promise<void> => {
  const { rootPromise, submitPromise } = privy.mfaPromises
  for (;;) {
    let proof
    try {
      proof = await passkeyAssertion()
    } catch (error) {
      // Fail the held request now: left alone, the SDK keeps the user waiting
      // out its five minutes. Only a dismissed prompt is the user saying no;
      // a check that could not be made at all (no challenge from Privy, a
      // passkey of another site, a browser that cannot ask) must not read as
      // one, or a fault here would pass for users changing their minds.
      const cancelled = error instanceof PasskeyCancelledError
      rootPromise.current?.reject(
        cancelled
          ? new PrivyClientError({
              code: 'mfa_canceled',
              error: 'Passkey check canceled',
            })
          : checkFailed(error),
      )
      onOutcome(cancelled ? 'cancelled' : 'failed')
      return
    }

    const verdict = new Promise<void>((resolve, reject) => {
      submitPromise.current = { resolve: () => resolve(), reject }
    })
    rootPromise.current?.resolve({
      mfaMethod: 'passkey',
      mfaCode: proof,
      relyingParty: window.location.origin,
    })
    try {
      await verdict
      onOutcome('passed')
      return
    } catch (error) {
      onOutcome('failed')
      // Anything but a refused proof means the SDK has given up on the
      // request (too many attempts, or its own timeout) and failed it.
      if (!errorIndicatesMfaVerificationFailed(error)) return
    }
  }
}

/**
 * Start answering Privy's passkey checks. Safe to call more than once: the
 * first call's `onOutcome` is the one that stays.
 */
export const answerPasskeyChecks = (onOutcome: OnOutcome = () => {}): void => {
  if (listening) return
  listening = true
  privy.mfaPromises.on('mfaRequired', () => {
    void answerCheck(onOutcome)
  })
}
