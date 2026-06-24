import type { GetWebSwapOndoMarketStatusResponse } from '@/mew_api/types'

/**
 * Resolve the single "current session" key used to test an asset's
 * `tradableSessions`. Off-hours is a parallel track: on weekends/holidays the
 * conventional market reads closed while `offhours.isOpen` can be true.
 * - conventional open  -> the conventional session (`marketStatus`)
 * - conventional closed + off-hours open -> `'offhours'`
 * - otherwise -> `null` (no tradable session)
 *
 * Kept in its own module (type-only import) so it stays unit-testable without
 * dragging in the composable's heavy runtime deps.
 */
export const resolveCurrentSession = (
  status: GetWebSwapOndoMarketStatusResponse | null,
): string | null => {
  if (!status) return null
  if (status.isOpen) return status.marketStatus || null
  if (status.offhours?.isOpen) return 'offhours'
  return null
}
