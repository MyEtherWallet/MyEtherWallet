import type { ComputedRef } from 'vue'

interface Options {
  fromAmountError: ComputedRef<string>
  toAmountError: ComputedRef<string>
  isSwapDisabled: ComputedRef<boolean>
  isSameToken: ComputedRef<boolean>
  priceImpact: ComputedRef<number>
  priceImpactTooHigh: ComputedRef<boolean>
  swapFeeError: ComputedRef<string | undefined>
}

export function useSwapValidation(options: Options) {
  return options
}
