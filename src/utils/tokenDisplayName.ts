export interface TokenWithOptionalAlias {
  name: string
  ondo?: { stockAlias?: string | null } | null
}

export const getTokenDisplayName = (token: TokenWithOptionalAlias): string =>
  token.ondo?.stockAlias || token.name

/**
 * A tokenized stock's ticker without its "on" suffix (AAPLon → AAPL), the part
 * AppTokenSymbol shows in upper case before the gradient "on".
 */
export const stockBaseSymbol = (symbol: string): string =>
  symbol.replace(/on$/i, '').toUpperCase()
