export const sanitizeDecimal = (raw: string): string => {
  let normalized = raw
  const lastComma = normalized.lastIndexOf(',')
  const lastDot = normalized.lastIndexOf('.')
  if (lastComma !== -1 && lastDot !== -1 && lastComma > lastDot) {
    // European format ("1.234,56"): the final comma is the decimal separator
    // and the dots are grouping. Stripping the comma instead — the old
    // behavior — silently read the paste ~1000x too large.
    normalized =
      normalized.slice(0, lastComma).replace(/[.,]/g, '') +
      '.' +
      normalized.slice(lastComma + 1).replace(/[.,]/g, '')
  } else {
    const commaCount = (normalized.match(/,/g) || []).length
    const isDecimalComma =
      commaCount === 1 &&
      !normalized.includes('.') &&
      !/,\d{3}(?!\d)/.test(normalized)
    if (isDecimalComma) {
      normalized = normalized.replace(',', '.')
    }
  }
  let cleaned = normalized.replace(/[^\d.]/g, '')
  const firstDot = cleaned.indexOf('.')
  if (firstDot !== -1) {
    cleaned =
      cleaned.slice(0, firstDot + 1) +
      cleaned.slice(firstDot + 1).replace(/\./g, '')
  }
  return cleaned
}
