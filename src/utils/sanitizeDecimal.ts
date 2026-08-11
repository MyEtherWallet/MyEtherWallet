/**
 * Strips any character that is not a digit or `.`, and collapses multiple dots
 * into the first one (so `"1.2.3"` → `"1.23"`).
 *
 * Commas are disambiguated before stripping: a single comma with no dot is a
 * decimal separator (`"1,5"` → `"1.5"`, common in pasted European amounts),
 * anything else treats commas as thousands separators (`"1,234.56"` →
 * `"1234.56"`).
 *
 * Intentionally preserves partial typing states (e.g. a lone trailing dot)
 * that finalised formatters like `numberFormatHelper` would drop — meant for
 * sanitizing amount inputs on every write (typing, paste, drag-and-drop, IME).
 */
export const sanitizeDecimal = (raw: string): string => {
  let normalized = raw
  const commaCount = (normalized.match(/,/g) || []).length
  if (commaCount === 1 && !normalized.includes('.')) {
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
