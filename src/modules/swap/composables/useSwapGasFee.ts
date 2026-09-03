import type { NewTokenInfo } from '@/stores/swapStore'

interface Options {
  generateBTCGasFeeQuote: () => Promise<unknown>
  generateEVMGasFeeQuote: () => Promise<unknown>
  getSwapFee: () => bigint
  getTokenBalanceParams: (token: NewTokenInfo) => {
    baseBalance: bigint
    totalBalance: bigint
    baseNetworkBalance: bigint
  }
}

export function useSwapGasFee(options: Options) {
  return options
}
