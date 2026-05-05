import { computed, toValue, type MaybeRefOrGetter } from 'vue'

/**
 * Validates a fiat/crypto amount string against min/max limits and surfaces
 * the structural data needed by the UI (numeric value, emptiness, violation,
 * focused-empty hint, overall validity). i18n / formatting of the resulting
 * messages is the caller's responsibility — this composable is string-agnostic.
 */

interface AmountLimits {
  min: number
  max: number
}

interface AmountViolation {
  type: 'min' | 'max'
  value: number
}

interface UsePurchaseAmountOptions {
  amount: MaybeRefOrGetter<string>
  limits: MaybeRefOrGetter<AmountLimits>
  isFocused: MaybeRefOrGetter<boolean>
}

export const usePurchaseAmount = (options: UsePurchaseAmountOptions) => {
  const numericAmount = computed(() => Number(toValue(options.amount)))

  const isEmpty = computed(() => toValue(options.amount) === '')

  const violation = computed<AmountViolation | null>(() => {
    if (isEmpty.value) return null
    const { min, max } = toValue(options.limits)
    if (min > 0 && numericAmount.value < min) return { type: 'min', value: min }
    if (max > 0 && numericAmount.value > max) return { type: 'max', value: max }
    return null
  })

  const minHint = computed<number | null>(() => {
    if (!toValue(options.isFocused) || !isEmpty.value) return null
    const { min } = toValue(options.limits)
    return min > 0 ? min : null
  })

  const isValid = computed(
    () => !isEmpty.value && !violation.value && numericAmount.value > 0,
  )

  return { numericAmount, isEmpty, violation, minHint, isValid }
}
