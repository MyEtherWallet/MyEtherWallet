import type { GetWebSwapOndoMarketStatusResponse } from '@/mew_api/types'

/**
 * Resolve the single "current session" key used to test an asset's
 * `tradableSessions`. Canonical precedence:
 * - Case 1: `offhours.isOpen === true` -> `'offhours'` (takes priority,
 *   regardless of `isOpen`).
 * - Case 2: `offhours.isOpen === false && isOpen === true` -> the conventional
 *   session (`marketStatus`).
 * - Case 3: otherwise -> `null` (disable all assets).
 *
 * Kept in its own module (type-only import) so it stays unit-testable without
 * dragging in the composable's heavy runtime deps.
 */
export const resolveCurrentSession = (
  status: GetWebSwapOndoMarketStatusResponse | null,
): string | null => {
  if (!status) return null
  if (status.offhours?.isOpen) return 'offhours'
  if (status.isOpen) return status.marketStatus || null
  return null
}
