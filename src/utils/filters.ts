import BigNumber from 'bignumber.js'

/** Format a fiat amount to 2 decimals, truncating (ROUND_DOWN) with thousands
 *  separators — matches walletStore's `formattedTotalFiatPortfolioValue` so the
 *  address popup shows the exact same number as the top-bar trigger. */
export const formatFiat = (value: number | string): string =>
  new BigNumber(value || 0).toFormat(2, BigNumber.ROUND_DOWN)

export const truncate = (value: string, length: number): string => {
  if (!value) return ''
  value = value.toString()
  return value.length > length ? value.substring(0, length) + '...' : value
}

export const truncateAddress = (
  value: string,
  startLength: number = 6,
  endLenght: number = 4,
): string => {
  if (!value) return ''
  const start = value.substring(0, startLength)
  const end = value.substring(value.length - endLenght, value.length)
  return `${start}...${end}`
}
