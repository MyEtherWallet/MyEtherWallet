/**
 * Helpers for parsing and formatting the fiat amount string while the user is
 * typing. These intentionally preserve partial states (e.g. a trailing `.`)
 * that finalised formatters like `numberFormatHelper` would drop.
 */

const MAX_INTEGER_DIGITS = 12
const MAX_DECIMAL_DIGITS = 6

/**
 * Adds thousand separators to the integer part while preserving any decimal
 * portion (including a lone trailing dot).
 *
 * Examples: `"1234"` → `"1,234"`, `"1234."` → `"1,234."`, `"1234.5"` → `"1,234.5"`.
 */
export const formatWithCommas = (raw: string): string => {
  if (raw === '') return ''
  const [intPart, decPart] = raw.split('.')
  const intWithCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (decPart === undefined) return intWithCommas
  return `${intWithCommas}.${decPart}`
}

/**
 * Strips any character that is not a digit or `.`, and collapses multiple dots
 * into the first one (so `"1.2.3"` → `"1.23"`).
 */
export const sanitizeDecimal = (raw: string): string => {
  let cleaned = raw.replace(/[^\d.]/g, '')
  const firstDot = cleaned.indexOf('.')
  if (firstDot !== -1) {
    cleaned =
      cleaned.slice(0, firstDot + 1) +
      cleaned.slice(firstDot + 1).replace(/\./g, '')
  }
  return cleaned
}

/**
 * Returns `true` if the (already-sanitized) value would exceed the maximum
 * allowed digits before/after the decimal point. Callers use this to reject
 * a keystroke rather than silently truncating it.
 */
export const exceedsLimits = (sanitized: string): boolean => {
  const [intPart, decPart] = sanitized.split('.')
  if (intPart.length > MAX_INTEGER_DIGITS) return true
  if (decPart !== undefined && decPart.length > MAX_DECIMAL_DIGITS) return true
  return false
}
