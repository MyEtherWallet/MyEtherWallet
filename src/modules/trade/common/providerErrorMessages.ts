const PROVIDER_ERROR_MESSAGE_KEYS = new Map([
  ['XSTOCKS_NOT_ALLOWED', 'trade.error.xstocks-not-allowed'],
])

export function getProviderErrorMessageKey(
  providerMessage: string | undefined,
): string | undefined {
  if (!providerMessage) return undefined
  return PROVIDER_ERROR_MESSAGE_KEYS.get(providerMessage)
}
