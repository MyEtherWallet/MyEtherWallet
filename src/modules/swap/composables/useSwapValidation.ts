import type { ComputedRef } from 'vue'

interface Options {
  fromAmountError: ComputedRef<string>
  toAmountError: ComputedRef<string>
  isSwapDisabled: ComputedRef<boolean>
  isSameToken: ComputedRef<boolean>
  priceImpact: ComputedRef<number | null>
  priceImpactTooHigh: ComputedRef<boolean>
  priceImpactUnknown: ComputedRef<boolean>
  swapFeeError: ComputedRef<string | undefined>
}

export function useSwapValidation(options: Options) {
  return options
}
