import { computed, toValue, type MaybeRefOrGetter } from 'vue'

/**
 * Applied to the content sitting *behind* an `AppUnavailableCard` so the form
 * reads as present-but-unusable rather than missing. `pointer-events-none`
 * carries the actual guarantee (no interaction); the opacity is the visual
 * signal.
 *
 * Faded but NOT blurred, and 25% rather than the 60% this replaced: sampled
 * from the perps design, where dimmed near-black text renders #BFBFBF on white
 * with glyph edges still crisp.
 *
 * Disabling interaction here is a UI affordance, not a security boundary —
 * callers must still gate the underlying action.
 */
export const BLOCKED_CONTENT_CLASS = 'pointer-events-none opacity-25'

/**
 * Returns the class to spread onto blocked content, or `''` when usable.
 *
 * @example
 * const { blockedClass } = useBlockedContent(
 *   () => isTradingRestrictedInRegion.value || !isCurrentNetworkSupported.value,
 * )
 */
export const useBlockedContent = (isBlocked: MaybeRefOrGetter<boolean>) => {
  const blockedClass = computed(() =>
    toValue(isBlocked) ? BLOCKED_CONTENT_CLASS : '',
  )

  return { blockedClass }
}
