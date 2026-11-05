/**
 * How Trade labels an asset. Every buy-side asset is a tokenized stock; a sell
 * asset is one when the stocks list has it on this network. The ticker is cased
 * like AppTokenSymbol: uppercase, with the Ondo "on" suffix lowercase.
 */
export const tradeAssetLabel = (
  { address, symbol }: { address: string; symbol: string },
  side: 'sell' | 'buy',
  networkName: string | undefined,
  isListedStock: (address: string, chain: string) => boolean,
): { isStock: boolean; symbol: string } => {
  const isStock =
    side === 'buy' || (!!networkName && isListedStock(address, networkName))
  const upper = symbol.toUpperCase()
  if (!isStock) return { isStock, symbol: upper }
  return {
    isStock,
    symbol: `${upper.endsWith('ON') ? upper.slice(0, -2) : upper}on`,
  }
}
