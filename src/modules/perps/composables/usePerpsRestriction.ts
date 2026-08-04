import { computed } from 'vue'
import { useTradingRestriction } from '@/composables/useTradingRestriction'
import { TRADING_RESTRICTED_HELP_URL } from '@/modules/trade/providers/ondoHelpers'

/**
 * Single source of truth for whether perpetuals are blocked in the user's
 * region. Every perps surface reads this rather than re-deriving the flag, so
 * the nav entry, the markets list and the order panel can never disagree.
 *
 * Backed by `useTradingRestriction` (module-level, fetched once per session)
 * rather than `globalStore.isTradingRestrictedInRegion`, for two reasons:
 *
 * 1. It defaults to `true`, so an unresolved or failed geo check blocks trading
 *    instead of briefly exposing a tradeable form. The store default is `false`.
 * 2. It already gates the perps nav item and action-bar button, so sharing it
 *    keeps entry points and panel content consistent.
 *
 * Perps and tokenized-stock trading currently share one geo check. This
 * indirection is where they would diverge if that changes.
 */
export const usePerpsRestriction = () => {
  const { isTradingRestrictedInRegion } = useTradingRestriction()

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
