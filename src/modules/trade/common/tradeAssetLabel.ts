/**
 * How Trade labels an asset. It's a tokenized stock when the stocks list has it
 * on this network, on either side: a cash-out buys a supporting asset (USDC).
 * The ticker is cased like AppTokenSymbol: uppercase, with the Ondo "on" suffix
 * lowercase.
 */
export const tradeAssetLabel = (
  { address, symbol }: { address: string; symbol: string },
  networkName: string | undefined,
  isListedStock: (address: string, chain: string) => boolean,
): { isStock: boolean; symbol: string } => {
  const isStock = !!networkName && isListedStock(address, networkName)
  const upper = symbol.toUpperCase()
  if (!isStock) return { isStock, symbol: upper }
  return {
    isStock,
    symbol: `${upper.endsWith('ON') ? upper.slice(0, -2) : upper}on`,
  }
}
