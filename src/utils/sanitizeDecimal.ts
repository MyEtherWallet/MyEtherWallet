export const sanitizeDecimal = (raw: string): string => {
  let normalized = raw
  const commaCount = (normalized.match(/,/g) || []).length
  const isDecimalComma =
    commaCount === 1 &&
    !normalized.includes('.') &&
    !/,\d{3}(?!\d)/.test(normalized)
  if (isDecimalComma) {
    normalized = normalized.replace(',', '.')
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
