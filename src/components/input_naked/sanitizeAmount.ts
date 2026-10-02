/**
 * Cleans a typed or pasted amount into a plain decimal string ("1234.5").
 * With both separators present ("1,234.50" / "1.234,50") the last one is the
 * decimal point; otherwise the first separator is, and later ones are dropped.
 */
export const sanitizeAmount = (raw: string, maxDecimals = 18): string => {
  const kept = raw.replace(/[^\d.,]/g, '')
  if (!kept) return ''

  const decimalIndex =
    kept.includes('.') && kept.includes(',')
      ? Math.max(kept.lastIndexOf('.'), kept.lastIndexOf(','))
      : kept.search(/[.,]/)

  const integerDigits = (
    decimalIndex === -1 ? kept : kept.slice(0, decimalIndex)
  ).replace(/\D/g, '')
  const integer = integerDigits.replace(/^0+(?=\d)/, '')

  if (decimalIndex === -1 || maxDecimals <= 0) return integer

  const fraction = kept
    .slice(decimalIndex + 1)
    .replace(/\D/g, '')
    .slice(0, maxDecimals)
  return `${integer || '0'}.${fraction}`
}
