import { watch, type ComputedRef } from 'vue'
import type { NewTokenInfo } from '@/stores/swapStore'
import type { TradeForm } from './useTradeForm'

interface UseOipPairGuardOptions {
  form: Pick<TradeForm, 'toTokenSelected' | 'toTokenManuallySelected'>
  isOipPairAllowed: ComputedRef<boolean>
  getDefaultToToken: () => NewTokenInfo | null
}

/**
 * Keeps the selected pair inside the OIP rules by replacing the To token when a
 * From change refuses it. The To side is the one that gives way: the picker
 * has no empty state, so it is reset to the default rather than cleared.
 */
export function useOipPairGuard(options: UseOipPairGuardOptions) {
  const { form, isOipPairAllowed, getDefaultToToken } = options
  const { toTokenSelected, toTokenManuallySelected } = form

  /**
   * Call synchronously after a user-driven From pick, before anything reads
   * the pair (the "tokens switched" toast): the watcher below only runs on the
   * next flush. Returns whether the To token was replaced.
   */
  const ensureValidPair = (): boolean => {
    if (isOipPairAllowed.value) return false
    toTokenSelected.value = getDefaultToToken()
    toTokenManuallySelected.value = false
    return true
  }

  // Programmatic From changes and asset data that arrives after the selection.
  watch(isOipPairAllowed, allowed => {
    if (!allowed) ensureValidPair()
  })

  return { ensureValidPair }
}
