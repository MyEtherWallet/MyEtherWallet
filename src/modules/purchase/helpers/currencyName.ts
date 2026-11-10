const currencyDisplayNames = new Intl.DisplayNames(['en'], {
  type: 'currency',
})

/** English display name of an ISO 4217 code ("USD" → "US Dollar"), or the code itself. */
export const getCurrencyName = (code: string): string => {
  try {
    return currencyDisplayNames.of(code) ?? code
  } catch {
    return code
  }
}
