interface Options {
  proceedWithSwap: (quoteId: string) => Promise<void>
  swapForBtc: () => Promise<void>
  swapForEvm: () => Promise<void>
  swapButton: () => Promise<void>
}

export function useSwapExecution(options: Options) {
  return options
}
