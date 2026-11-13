import BigNumber from 'bignumber.js'
import { mainnet, bsc } from 'viem/chains'
import { NATIVE_ADDRESS } from '../providers/oneinch_fusion/configs'

/**
 * Ondo Intelligent Portfolio (OIP) tokens trade only against the native token
 * or a stable, with a $10 minimum. Everything here is pure so the pair and
 * amount rules stay unit-testable away from the composables.
 */
export const OIP_MIN_TRADE_USD = 10

// Deliberately its own list rather than the provider's SUPPORTED_CHAINS: a
// chain added to trading later must not inherit the OIP rules by accident.
const OIP_CHAIN_IDS: ReadonlySet<number> = new Set([mainnet.id, bsc.id])

export const isOipChain = (
  chainId: string | number | null | undefined,
): boolean => {
  if (chainId === null || chainId === undefined || chainId === '') return false
  return OIP_CHAIN_IDS.has(Number(chainId))
}

/**
 * The slice of both Ondo asset responses the rules read, typed as loosely as
 * the API has behaved: the flag may be absent and members may be null.
 */
interface OipFlaggedAsset {
  isPortfolio?: boolean | null
  addresses: ({ address?: string | null } | null)[]
}

type OipFlaggedAssets = readonly (OipFlaggedAsset | null)[] | null | undefined

export interface OipIndex {
  oipAddresses: ReadonlySet<string>
  stableAddresses: ReadonlySet<string>
}

const addAddresses = (asset: OipFlaggedAsset, target: Set<string>) => {
  // Defensive, as in getSessionDisabledAddresses: only index real, non-empty
  // address strings.
  if (!Array.isArray(asset.addresses)) return
  for (const entry of asset.addresses) {
    if (typeof entry?.address === 'string' && entry.address)
      target.add(entry.address.toLowerCase())
  }
}

/**
 * Lowercased address sets for the two classes the API defines: OIP tokens
 * (`isPortfolio === true` on either endpoint) and stables (every other
 * supporting asset). A missing or null flag is "not OIP", so a backend that
 * does not send it yet leaves the index without OIP tokens.
 */
export const buildOipIndex = (
  tradableAssets: OipFlaggedAssets,
  supportingAssets: OipFlaggedAssets,
): OipIndex => {
  const oipAddresses = new Set<string>()
  const stableAddresses = new Set<string>()
  for (const asset of tradableAssets ?? []) {
    if (asset?.isPortfolio === true) addAddresses(asset, oipAddresses)
  }
  for (const asset of supportingAssets ?? []) {
    if (!asset) continue
    addAddresses(
      asset,
      asset.isPortfolio === true ? oipAddresses : stableAddresses,
    )
  }
  return { oipAddresses, stableAddresses }
}

export type TradeTokenClass = 'oip' | 'native' | 'stable' | 'other'

export const classifyTradeToken = (
  address: string | null | undefined,
  index: OipIndex,
): TradeTokenClass => {
  const key = address?.toLowerCase()
  if (!key) return 'other'
  if (index.oipAddresses.has(key)) return 'oip'
  if (key === NATIVE_ADDRESS) return 'native'
  if (index.stableAddresses.has(key)) return 'stable'
  return 'other'
}

export const isCashClass = (tokenClass: TradeTokenClass): boolean =>
  tokenClass === 'native' || tokenClass === 'stable'

/** A pair is restricted only when one side is OIP: the other must be cash. */
export const isOipPairAllowed = (
  from: TradeTokenClass,
  to: TradeTokenClass,
): boolean => {
  if (from === 'oip') return isCashClass(to)
  if (to === 'oip') return isCashClass(from)
  return true
}

export const filterToTokensForFrom = <T extends { address?: string }>(
  tokens: T[],
  fromClass: TradeTokenClass,
  index: OipIndex,
): T[] => {
  if (isCashClass(fromClass)) return tokens
  return tokens.filter(token =>
    isOipPairAllowed(fromClass, classifyTradeToken(token.address, index)),
  )
}

/**
 * Whether a From amount is under the OIP minimum. An amount that is not a
 * positive number is someone else's error, and an unknown price cannot be
 * judged, so both report "not below".
 */
export const isBelowOipMinimum = ({
  amount,
  price,
  isStableFrom,
}: {
  amount: string
  price: number | null | undefined
  isStableFrom: boolean
}): boolean => {
  const amountBN = BigNumber(amount)
  if (amountBN.isNaN() || amountBN.lte(0)) return false
  // A stable is nominally $1: 10 of them meet the minimum even when the price
  // feed puts the token a hair under its peg.
  if (isStableFrom && amountBN.gte(OIP_MIN_TRADE_USD)) return false
  if (!price || price <= 0) return false
  // Compared at cent precision, the precision the user sees the value in.
  const usdValue = amountBN
    .times(price)
    .decimalPlaces(2, BigNumber.ROUND_HALF_UP)
  return usdValue.lt(OIP_MIN_TRADE_USD)
}
