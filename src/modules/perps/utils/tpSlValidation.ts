// Take-Profit / Stop-Loss trigger-price validation for the Auto Close dialog.
//
// The backend rejects trigger prices that are non-positive, on the wrong side
// of the mark price, or absurdly large. Mirror those rules on the client so the
// Save button can be disabled and the error surfaced before submit instead of
// after a rejected order (MEW-1912).
//
// Direction depends on the position side: for a LONG, take profit sits ABOVE
// the mark and stop loss BELOW; for a SHORT it is inverted.
//
// This util is pure (no `t` in scope), so instead of returning localized
// English sentences it returns an i18n descriptor `{ key, params?, plural? }`
// that the consumer resolves with `t()` (MEW-2012). `null` means valid.
import { hasInvalidPrecision } from './formatters'

// Matches the ceiling already enforced on the limit price input.
export const MAX_TRIGGER_PRICE = 10_000_000

// Formatted ceiling shown in the tp-max message. Mirrors the literal the limit
// price input passes to perps.errors.price-max ($10,000,000).
const MAX_TRIGGER_PRICE_LABEL = '$10,000,000'

// An i18n descriptor the consumer resolves with `t(key, params, plural)`, or
// `null` when the value is valid. `plural` is passed as the vue-i18n `count`
// so the pluralized message (e.g. price-precision-decimals) selects a branch.
export type TpSlError = {
  key: string
  params?: Record<string, string | number>
  plural?: number
} | null

function precisionError(quoteDecimals: number): TpSlError {
  if (quoteDecimals === 0) return { key: 'perps.errors.price-whole' }
  return {
    key: 'perps.errors.price-precision-decimals',
    params: { decimals: quoteDecimals },
    plural: quoteDecimals,
  }
}

// Returns an error descriptor for an invalid take-profit price, or null when
// valid. A null price means "not set" and is always valid (field is optional).
export function takeProfitError(
  price: number | null,
  markPrice: number,
  isLong: boolean,
  quoteDecimals: number,
): TpSlError {
  if (price == null) return null
  if (hasInvalidPrecision(String(price), quoteDecimals))
    return precisionError(quoteDecimals)
  if (price >= MAX_TRIGGER_PRICE)
    return {
      key: 'perps.errors.tp-max',
      params: { max: MAX_TRIGGER_PRICE_LABEL },
    }
  if (isLong) {
    // For a long, take profit above the mark also guarantees it is positive.
    if (price <= markPrice) return { key: 'perps.errors.tp-above-mark' }
  } else {
    if (price <= 0) return { key: 'perps.errors.tp-above-zero' }
    if (price >= markPrice) return { key: 'perps.errors.tp-below-mark' }
  }
  return null
}

// Returns an error descriptor for an invalid stop-loss price, or null when
// valid. A null price means "not set" and is always valid (field is optional).
export function stopLossError(
  price: number | null,
  markPrice: number,
  isLong: boolean,
  quoteDecimals: number,
): TpSlError {
  if (price == null) return null
  if (hasInvalidPrecision(String(price), quoteDecimals))
    return precisionError(quoteDecimals)
  if (price <= 0) return { key: 'perps.errors.sl-above-zero' }
  if (isLong) {
    if (price >= markPrice) return { key: 'perps.errors.sl-below-mark' }
  } else {
    if (price <= markPrice) return { key: 'perps.errors.sl-above-mark' }
  }
  return null
}
