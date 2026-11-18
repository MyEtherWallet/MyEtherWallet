import { onScopeDispose, getCurrentScope, shallowRef } from 'vue'
import { analytics } from '@/analytics'
import { AccountSecurityEvent } from '@/analytics/events'
import { useAuthStore } from '@/stores/authStore'
import { isUserRejectionError } from '@/utils/walletUtils'

/** One viewing of the recovery phrase. The words exist only in `ready`. */
export type RecoveryPhraseState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly words: readonly string[] }
  | { readonly status: 'error' }

const errorCode = (error: unknown): string => {
  const code = (error as { code?: unknown } | null)?.code
  return typeof code === 'string' ? code : 'unknown'
}

/**
 * Holds the recovery phrase of the connected Privy wallet for as long as one
 * screen shows it, and no longer.
 *
 * The words live in this composable's state only: never in a store, in
 * storage, in a log or in analytics. `clear()` drops them, and a phrase or a
 * failure that arrives after `clear()` is discarded. The owner must call
 * `clear()` whenever the screen goes away.
 */
export const useRecoveryPhrase = () => {
  const authStore = useAuthStore()
  const state = shallowRef<RecoveryPhraseState>({ status: 'idle' })
  /** Identifies the current viewing, so an answer to an earlier one is dropped. */
  let viewing = 0

  const load = async (): Promise<void> => {
    const current = ++viewing
    state.value = { status: 'loading' }
    try {
      const words = await authStore.exportRecoveryPhrase()
      if (current === viewing) state.value = { status: 'ready', words }
    } catch (error) {
      if (current !== viewing) return
      // A passkey check the user cancelled is a change of mind, not a failure.
      if (isUserRejectionError(error)) {
        state.value = { status: 'idle' }
        return
      }
      state.value = { status: 'error' }
      void analytics.trackAccountSecurityEvent(
        AccountSecurityEvent.RECOVERY_PHRASE_FAILED,
        { reason: errorCode(error) },
      )
    }
  }

  const clear = (): void => {
    viewing += 1
    state.value = { status: 'idle' }
  }

  if (getCurrentScope()) onScopeDispose(clear)

  return { state, load, clear }
}
