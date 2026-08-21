/**
 * Strips any character that is not a digit or `.`, and collapses multiple dots
 * into the first one (so `"1.2.3"` → `"1.23"`).
 *
 * Commas are disambiguated before stripping, without relying on locale (the
 * active i18n locale is not the same as the number format the user typed or
 * pasted in): a thousands separator always groups digits in blocks of
 * exactly 3, in every convention, so that shape is used instead.
 *
 * - A dot already present, or more than one comma, means every comma is a
 *   thousands separator: `"1,234.56"` → `"1234.56"`, `"1,234,567"` →
 *   `"1234567"`.
 * - A single comma followed by exactly 3 digits is the one truly ambiguous
 *   case (`"1,234"` could mean 1234 or 1.234) — treated as thousands, since
 *   silently dividing a pasted amount by 1000 is the more dangerous failure
 *   for a trade input: `"1,234"` → `"1234"`.
 * - A single comma followed by any other digit count can't be a thousands
 *   group (those are never 1, 2, or 4+ digits), so it's a decimal separator:
 *   `"1,5"` → `"1.5"`, `"0,0001"` → `"0.0001"`.
 *
 * Intentionally preserves partial typing states (e.g. a lone trailing dot)
 * that finalised formatters like `numberFormatHelper` would drop — meant for
 * sanitizing amount inputs on every write (typing, paste, drag-and-drop, IME).
 */
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
