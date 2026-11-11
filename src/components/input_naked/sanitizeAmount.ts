/** How the value in the field came to be. */
export type AmountEdit =
  /** A whole value arrived at once: pasted, dropped, autofilled or set by code. */
  | { kind: 'paste' }
  /** One character was typed; `separatorAt` is its index when it is "." or ",". */
  | { kind: 'typing'; separatorAt?: number }

const SEPARATOR = /[.,]/

/** "1e-7", "2.5E-05": stripping the letters would leave an unrelated number. */
const EXPONENT = /\d[eE][+-]?\d/

/** First group of a number grouped with one kind of separator only: "1,234". */
const WHOLE_NUMBER_LEAD = /^[1-9]\d{0,2}$/
/** First group when a decimal part follows: "01,234.50" is still grouped. */
const AMOUNT_LEAD = /^\d{1,3}$/

/** A leading group, then groups of exactly three: "1,234" / "12.947.536". */
const isThousandsGrouped = (
  digits: string,
  separator: string,
  lead: RegExp,
): boolean => {
  const [first, ...groups] = digits.split(separator)
  return (
    groups.length > 0 &&
    lead.test(first) &&
    groups.every(group => /^\d{3}$/.test(group))
  )
}

/**
 * Where the decimal point of a pasted amount is; -1 when every separator is a
 * thousands mark. A separator is only read as a thousands mark when it can be
 * nothing else, otherwise the first one is the decimal point and the later
 * ones are dropped.
 */
const pastedDecimalIndex = (kept: string): number => {
  const lastDot = kept.lastIndexOf('.')
  const lastComma = kept.lastIndexOf(',')
  const first = kept.search(SEPARATOR)

  if (lastDot !== -1 && lastComma !== -1) {
    // "1,234.50" / "1.234,50": the last separator is the decimal point when it
    // appears once and the other kind groups the whole part. Two or more marks
    // of the other kind can only be grouping, threes or not ("1,23,456.78").
    const last = Math.max(lastDot, lastComma)
    const grouping = kept[last] === '.' ? ',' : '.'
    const whole = kept.slice(0, last)
    const isGroupedAmount =
      kept.indexOf(kept[last]) === last &&
      (whole.indexOf(grouping) !== whole.lastIndexOf(grouping) ||
        isThousandsGrouped(whole, grouping, AMOUNT_LEAD))
    return isGroupedAmount ? last : first
  }

  // One kind only. A lone dot is always the decimal point ("1.234"), a lone
  // comma is one unless exactly three digits follow it ("1,234").
  const separator = lastDot !== -1 ? '.' : ','
  const isRepeated = kept.indexOf(separator) !== kept.lastIndexOf(separator)
  const isGrouping =
    (separator === ',' || isRepeated) &&
    isThousandsGrouped(kept, separator, WHOLE_NUMBER_LEAD)
  return isGrouping ? -1 : first
}

const toDecimalString = (
  kept: string,
  decimalIndex: number,
  maxDecimals: number,
): string => {
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

/**
 * Cleans a typed or pasted amount into a plain decimal string ("1234.5").
 *
 * A typed separator is the decimal point, or is ignored when the value already
 * has one: it never moves the decimal point and is never a thousands mark. A
 * pasted value is read whole, grouped numbers included ("1,234.50" /
 * "1.234,50" / "1,234"). Returns null for a pasted exponent ("1e-7"), which is
 * not an amount this field can hold.
 */
export const sanitizeAmount = (
  raw: string,
  maxDecimals = 18,
  edit: AmountEdit = { kind: 'paste' },
): string | null => {
  if (edit.kind === 'paste') {
    if (EXPONENT.test(raw)) return null
    const kept = raw.replace(/[^\d.,]/g, '')
    return toDecimalString(kept, pastedDecimalIndex(kept), maxDecimals)
  }

  const { separatorAt } = edit
  const withoutTyped =
    separatorAt === undefined
      ? raw
      : raw.slice(0, separatorAt) + raw.slice(separatorAt + 1)
  const isTypedIgnored =
    separatorAt !== undefined &&
    (SEPARATOR.test(withoutTyped) || maxDecimals <= 0)
  const kept = (isTypedIgnored ? withoutTyped : raw).replace(/[^\d.,]/g, '')
  return toDecimalString(kept, kept.search(SEPARATOR), maxDecimals)
}
