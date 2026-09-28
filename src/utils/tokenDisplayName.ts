export interface TokenWithOptionalAlias {
  name: string
  ondo?: { stockAlias?: string | null } | null
}

export const getTokenDisplayName = (token: TokenWithOptionalAlias): string =>
  token.ondo?.stockAlias || token.name
