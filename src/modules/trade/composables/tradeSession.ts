import type { GetWebSwapOndoAssetsResponse } from '@/mew_api/types'

type TradableAsset = GetWebSwapOndoAssetsResponse[number]

/** Inline message shown when the selected asset can't trade in the current session. */
export const TRADING_PAUSED_SESSION_MESSAGE = 'Trading Paused for this session'

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

/**
 * Addresses (lowercased) of assets that are globally tradable but NOT tradable
 * in the current session — i.e. the ones to render under the "Trading Paused
 * for this session" group. Assets with `tradable === false` (scheduled pause)
 * are intentionally excluded; they keep their existing pause messaging.
 */
export const getSessionDisabledAddresses = (
  assets: TradableAsset[] | null,
  currentSession: string | null,
): Set<string> => {
  const disabled = new Set<string>()
  if (!assets) return disabled
  for (const asset of assets) {
    if (!asset.tradable) continue
    if (isAssetTradableInSession(asset, currentSession)) continue
    for (const addr of asset.addresses) {
      if (addr.address) disabled.add(addr.address.toLowerCase())
    }
  }
  return disabled
}
