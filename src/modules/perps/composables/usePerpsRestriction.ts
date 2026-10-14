import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/globalStore'
import { TRADING_RESTRICTED_HELP_URL } from '@/modules/trade/providers/ondoHelpers'

/**
 * Awaits the session's geo check and resolves to its real value.
 *
 * Use this instead of reading `isPerpsRestricted` wherever a wrong answer has
 * consequences beyond a frame — the ref defaults to `true` (fail-closed), so
 * code running before the check resolves would treat everyone as restricted.
 * The underlying fetch is deduped per session, so awaiting it repeatedly is free.
 */
export const resolvePerpsRestricted = (): Promise<boolean> =>
  useGlobalStore().fetchTradingRestriction()

/**
 * Single source of truth for whether perpetuals are blocked in the user's
 * region. Every perps surface reads this rather than re-deriving the flag, so
 * the nav entry, the markets list and the order panel can never disagree.
 *
 * Backed by `globalStore`, which owns the session's geo check:
 * `isTradingRestrictedInRegion` starts `true`, so an unresolved or failed check
 * blocks trading instead of briefly exposing a tradeable form, and
 * `fetchTradingRestriction` dedupes the request across every caller.
 *
 * Perps and tokenized-stock trading currently share one geo check. This
 * indirection is where they would diverge if that changes.
 */
export const usePerpsRestriction = () => {
  const { isTradingRestrictedInRegion } = storeToRefs(useGlobalStore())

  const isPerpsRestricted = computed(() => isTradingRestrictedInRegion.value)

  return {
    isPerpsRestricted,
    /**
     * NOTE: currently the tokenized-stock restrictions article — perps has no
     * dedicated help page yet.
     */
    perpsHelpUrl: TRADING_RESTRICTED_HELP_URL,
  }
}
