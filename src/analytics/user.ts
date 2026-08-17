// =============================================================================
// USER PROPERTIES
// =============================================================================

import { WalletConfigType } from '@/modules/access/common/walletConfigs'

export const WalletStatus = {
  CONNECTED: 'Connected',
  WATCH_ONLY: 'WatchOnly',
  NOT_CONNECTED: 'NotConnected',
} as const
export type WalletStatus = (typeof WalletStatus)[keyof typeof WalletStatus]

export const AssetHolderType = {
  RWA: 'isRWAHolder',
  STABLECOIN: 'isStablecoinHolder',
  CRYPTO: 'isCryptoHolder',
  PARTNER: 'isPartnerHolder',
  HAS_BALANCE: 'hasBalance',
} as const
export type AssetHolderType =
  (typeof AssetHolderType)[keyof typeof AssetHolderType]

export const BalanceBracket = {
  UNDER_50: '<50',
  BRACKET_50: '50-100',
  BRACKET_100: '100-250',
  BRACKET_250: '250-500',
  UNDER_500: '<500',
  BRACKET_500: '500-2500',
  BRACKET_2500: '2500-10k',
  BRACKET_10K: '10k-50k',
  BRACKET_50K: '50k-100k',
  BRACKET_100K: '100k-500k',
  OVER_500K: '>500k',
} as const
export type BalanceBracket =
  (typeof BalanceBracket)[keyof typeof BalanceBracket]

export type UserProperties = {
  walletStatus?: WalletStatus
  walletName?: string
  walletType?: WalletConfigType
  network?: string
  balanceBracket?: BalanceBracket
  isRWAHolder?: boolean
  isStablecoinHolder?: boolean
  isCryptoHolder?: boolean
  isPartnerHolder?: boolean
  hasBalance?: boolean
  canClaimRewards?: boolean
  canClaimTrade?: boolean
  canClaimSwap?: boolean
  canTrade?: boolean
  holdCampaignStatus?: string
  isRegionRestricted?: boolean
}
