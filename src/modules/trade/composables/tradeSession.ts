import type { GetWebSwapOndoAssetsResponse } from '@/mew_api/types'

type TradableAsset = GetWebSwapOndoAssetsResponse[number]

/**
 * Whether an asset's `tradableSessions` allows trading in the current session.
 * - `currentSession === null` (nothing tradable) -> false
 * - missing/empty `tradableSessions` (older payloads) -> not session-gated (true),
 *   so we never hide everything just because the field is absent
 * - otherwise -> membership test
 *
 * NOTE: this is the SESSION gate only. The asset-level `tradable` flag
 * (scheduled pause / halt) is checked separately by callers.
 */
export const isAssetTradableInSession = (
  asset: Pick<TradableAsset, 'primaryMarket'>,
  currentSession: string | null,
): boolean => {
  if (currentSession === null) return false
  const sessions = asset.primaryMarket?.tradableSessions
  if (!sessions || sessions.length === 0) return true
  return sessions.includes(currentSession)
}

export const PAUSE_REASONS = [
  'cash_dividend',
  'stock_dividend',
  'stock_split',
  'merger',
  'acquisition',
  'spinoff',
  'earnings',
  'maintenance',
] as const

export type PauseReason = (typeof PAUSE_REASONS)[number]

export const isPauseReason = (value: string): value is PauseReason =>
  (PAUSE_REASONS as readonly string[]).includes(value)

export const getActivePauseReason = (
  asset: Pick<TradableAsset, 'pause'> | null | undefined,
  now: number,
): PauseReason | null => {
  const pause = asset?.pause
  if (!pause) return null

  const start = pause.start ? Date.parse(pause.start) : NaN
  const end = pause.end ? Date.parse(pause.end) : NaN
  if (Number.isNaN(start) || Number.isNaN(end)) return null
  if (now < start || now > end) return null

  const slug = pause.reason?.message?.trim().toLowerCase()
  return slug && isPauseReason(slug) ? slug : null
}

/**
 * Addresses (lowercased) to render disabled under the "Trading paused for this
 * session" group. An asset is disabled when it is globally paused
 * (`tradable === false`) or not tradable in the current session — UNLESS, during
 * off-hours, it EXPLICITLY lists `offhours` in `tradableSessions` (the off-hours
 * override keeps it tradable even when globally paused).
 */
export const getSessionDisabledAddresses = (
  assets: TradableAsset[] | null,
  currentSession: string | null,
): Set<string> => {
  const disabled = new Set<string>()
  if (!assets) return disabled
  const addAll = (asset: TradableAsset) => {
    for (const addr of asset.addresses) {
      // Defensive: address members can be null or have a non-string `address`
      // in malformed payloads; only lowercase real, non-empty strings.
      if (typeof addr?.address === 'string' && addr.address)
        disabled.add(addr.address.toLowerCase())
    }
  }
  for (const asset of assets) {
    // Defensive: the Ondo assets API has been observed returning null/malformed
    // elements (Sentry APP-MEW-WEB-1CE). Skip anything that is not a shaped
    // asset with an addresses array, so this pure utility never dereferences a
    // bad entry, independent of upstream filtering.
    if (!asset || !Array.isArray(asset.addresses)) continue

    // Off-hours override: an asset that EXPLICITLY lists `offhours` stays
    // tradable during off-hours even if globally paused. Must be an explicit
    // membership (not the missing-field fallback in isAssetTradableInSession)
    // so a paused asset without off-hours support doesn't slip through.
    if (
      currentSession === 'offhours' &&
      !!asset.primaryMarket?.tradableSessions?.includes('offhours')
    )
      continue

    // Globally paused (and not off-hours-enabled) -> disabled.
    if (!asset.tradable) {
      addAll(asset)
      continue
    }

    // Tradable in the current session -> enabled (skip).
    if (isAssetTradableInSession(asset, currentSession)) continue

    // Otherwise session-gated -> disabled.
    addAll(asset)
  }
  return disabled
}
