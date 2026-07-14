// Take-Profit / Stop-Loss trigger-price validation for the Auto Close dialog.
//
// The backend rejects trigger prices that are non-positive, on the wrong side
// of the mark price, or absurdly large. Mirror those rules on the client so the
// Save button can be disabled and the error surfaced before submit instead of
// after a rejected order (MEW-1912).
//
// Direction depends on the position side: for a LONG, take profit sits ABOVE
// the mark and stop loss BELOW; for a SHORT it is inverted.
import { hasInvalidPrecision } from './formatters'

// Matches the ceiling already enforced on the limit price input.
export const MAX_TRIGGER_PRICE = 10_000_000

function precisionMessage(quoteDecimals: number): string {
  if (quoteDecimals === 0) return 'Price must be a whole number'
  return `Price supports up to ${quoteDecimals} decimal place${quoteDecimals === 1 ? '' : 's'}`
}

// Returns an error message for an invalid take-profit price, or '' when valid.
// A null price means "not set" and is always valid (the field is optional).
export function takeProfitError(
  price: number | null,
  markPrice: number,
  isLong: boolean,
  quoteDecimals: number,
): string {
  if (price == null) return ''
  if (hasInvalidPrecision(String(price), quoteDecimals))
    return precisionMessage(quoteDecimals)
  if (price >= MAX_TRIGGER_PRICE)
    return 'Take Profit must be less than $10,000,000'
  if (isLong) {
    // For a long, take profit above the mark also guarantees it is positive.
    if (price <= markPrice) return 'Take Profit must be above mark price'
  } else {
    if (price <= 0) return 'Take Profit must be above 0'
    if (price >= markPrice) return 'Take Profit must be below mark price'
  }
  return ''
}

// Returns an error message for an invalid stop-loss price, or '' when valid.
export function stopLossError(
  price: number | null,
  markPrice: number,
  isLong: boolean,
  quoteDecimals: number,
): string {
  if (price == null) return ''
  if (hasInvalidPrecision(String(price), quoteDecimals))
    return precisionMessage(quoteDecimals)
  if (price <= 0) return 'Stop Loss must be above 0'
  if (isLong) {
    if (price >= markPrice) return 'Stop Loss must be below mark price'
  } else {
    if (price <= markPrice) return 'Stop Loss must be above mark price'
  }
  return ''
}
