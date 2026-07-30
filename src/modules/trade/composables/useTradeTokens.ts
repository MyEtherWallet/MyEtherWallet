import { computed, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { NewTokenInfo } from '@/composables/useSwap'
import type {
  Chain,
  GetWebSwapOndoAssetsResponse,
  GetWebSwapOndoSupportingAssetsResponse,
} from '@/mew_api/types'
import type { HardcodedTokenInfo } from '@/modules/trade/providers/oneinch_fusion/oneInchFusion'
import {
  isAssetTradableInSession,
  getSessionDisabledAddresses,
} from '../common/tradeSession'

// Individual asset type from the response arrays
type TradableAsset = GetWebSwapOndoAssetsResponse[number]
type SupportingAsset = GetWebSwapOndoSupportingAssetsResponse[number]

interface UseTradeTokensOptions {
  selectedFromChain: Ref<Chain | undefined>
  fromTokens: Ref<NewTokenInfo[]>
  fromTokenSelected: Ref<NewTokenInfo | null>
  toTokenSelected: Ref<NewTokenInfo | null>
  tradableAssets: Ref<GetWebSwapOndoAssetsResponse | null>
  additionalBuyAssets: Ref<GetWebSwapOndoSupportingAssetsResponse | null>
  hardcodedTokensInfo: Ref<HardcodedTokenInfo[]>
  currentSession: Ref<string | null>
}

export function useTradeTokens(options: UseTradeTokensOptions) {
  const {
    selectedFromChain,
    fromTokens,
    fromTokenSelected,
    toTokenSelected,
    tradableAssets,
    additionalBuyAssets,
    hardcodedTokensInfo,
    currentSession,
  } = options

  const { t } = useI18n()

  // Check if selected from token is a tradable asset (stock token)
  const isSellingTradableAsset = computed(() => {
    if (!fromTokenSelected.value || !tradableAssets.value) return false
    const fromAddress = fromTokenSelected.value.address?.toLowerCase()
    if (!fromAddress) return false

    return tradableAssets.value.some(asset =>
      asset.addresses.some(addr => addr.address?.toLowerCase() === fromAddress),
    )
  })

  // Check if the selected to token is a cash-out (supporting) asset, e.g. USDC
  const isCashOutTradableAsset = computed(() => {
    if (!toTokenSelected.value || !additionalBuyAssets.value) return false
    const toAddress = toTokenSelected.value.address?.toLowerCase()
    if (!toAddress) return false

    return additionalBuyAssets.value.some(asset =>
      asset.addresses.some(addr => addr.address?.toLowerCase() === toAddress),
    )
  })

  // Get the tradable asset info for the selected from token
  const selectedFromAssetInfo = computed((): TradableAsset | null => {
    if (!fromTokenSelected.value || !tradableAssets.value) return null
    const fromAddress = fromTokenSelected.value.address?.toLowerCase()
    if (!fromAddress) return null

    return (
      tradableAssets.value.find(asset =>
        asset.addresses.some(
          addr => addr.address?.toLowerCase() === fromAddress,
        ),
      ) || null
    )
  })

  // Get the tradable asset info for the selected to token
  const selectedToAssetInfo = computed((): TradableAsset | null => {
    if (!toTokenSelected.value || !tradableAssets.value) return null
    const toAddress = toTokenSelected.value.address?.toLowerCase()
    if (!toAddress) return null

    return (
      tradableAssets.value.find(asset =>
        asset.addresses.some(addr => addr.address?.toLowerCase() === toAddress),
      ) || null
    )
  })

  // Check if the selected assets are tradeable: not paused (asset-level
  // `tradable`) AND allowed in the current session (tradableSessions).
  const isSelectedAssetTradeable = computed(() => {
    for (const info of [
      selectedFromAssetInfo.value,
      selectedToAssetInfo.value,
    ]) {
      //state no token selected, then skip
      if (!info) continue

      // Off-hours override: explicit `offhours` membership keeps the asset
      // tradable even if globally paused (explicit, not the missing-field
      // fallback, so a paused asset without off-hours support stays blocked).
      if (
        currentSession.value === 'offhours' &&
        !!info.primaryMarket?.tradableSessions?.includes('offhours')
      )
        continue

      //if asset is not tradable, then return false
      if (!info.tradable) return false

      //  if asset is not tradable in current session, then return false
      if (!isAssetTradableInSession(info, currentSession.value)) return false
    }
    return true
  })

  // Get the message for non-tradeable assets. Scheduled pause / halt
  // (`tradable === false`) keeps its own reason; a session-only block returns
  // the "Trading Paused for this session" copy.
  const nonTradeableAssetMessage = computed(() => {
    const pairs = [
      [selectedFromAssetInfo.value, fromTokenSelected.value] as const,
      [selectedToAssetInfo.value, toTokenSelected.value] as const,
    ]
    for (const [info, token] of pairs) {
      //not token input selected, then skip
      if (!info) continue

      // Off-hours override: explicit `offhours` membership keeps the asset
      // tradable even if globally paused (explicit, not the missing-field
      // fallback).
      if (
        currentSession.value === 'offhours' &&
        !!info.primaryMarket?.tradableSessions?.includes('offhours')
      )
        continue

      //if asset is not tradable in current session, then return the session pause message
      if (!isAssetTradableInSession(info, currentSession.value)) {
        return t('trade.trading_paused_session')
      }
      //if asset is globally paused, then return the reason or default message
      if (!info.tradable) {
        return (
          info.pause?.reason?.message ||
          t('trade.error.token-not-available', { symbol: token?.symbol })
        )
      }
    }
    return ''
  })

  // Addresses to render disabled under the "Trading Paused for this session"
  // group in the token selector (assets tradable globally but not in this session).
  const disabledTokenAddresses = computed<string[]>(() => {
    return Array.from(
      getSessionDisabledAddresses(tradableAssets.value, currentSession.value),
    )
  })

  // Build toTokens list from tradable assets
  const toTokens = computed(() => {
    if (!tradableAssets.value || !selectedFromChain.value)
      return [] as NewTokenInfo[]

    const chainName = selectedFromChain.value.name.toUpperCase()

    // Create a lookup map from fromTokens by address
    const fromTokensMap = new Map<string, NewTokenInfo>()
    for (const token of fromTokens.value) {
      if (token.address) {
        fromTokensMap.set(token.address.toLowerCase(), token)
      }
    }

    // Map tradable assets to NewTokenInfo format
    const tradableTokens = mapTradableAssetsToTokens(
      tradableAssets.value,
      chainName,
      fromTokensMap,
      hardcodedTokensInfo.value,
    )

    // If selling a tradable asset, add additional buy assets
    if (isSellingTradableAsset.value && additionalBuyAssets.value) {
      const additionalTokens = mapSupportingAssetsToTokens(
        additionalBuyAssets.value,
        chainName,
        fromTokensMap,
      )

      // Combine avoiding duplicates
      const existingAddresses = new Set(
        tradableTokens.map(t => t.address?.toLowerCase()),
      )
      const uniqueAdditionalTokens = additionalTokens.filter(
        t => !existingAddresses.has(t.address?.toLowerCase()),
      )

      return [...tradableTokens, ...uniqueAdditionalTokens]
    }

    return tradableTokens
  })

  return {
    isCashOutTradableAsset,
    isSelectedAssetTradeable,
    nonTradeableAssetMessage,
    disabledTokenAddresses,
    toTokens,
  }
}

// Helper to map tradable assets to token format
function mapTradableAssetsToTokens(
  assets: TradableAsset[],
  chainName: string,
  fromTokensMap: Map<string, NewTokenInfo>,
  hardcodedTokensInfo: HardcodedTokenInfo[],
): NewTokenInfo[] {
  const mappedAssets = assets
    .filter(asset =>
      asset.addresses.some(addr => addr.chainName?.toUpperCase() === chainName),
    )
    .map(asset => {
      const addressInfo = asset.addresses.find(
        addr => addr.chainName?.toUpperCase() === chainName,
      )
      const tokenAddress = addressInfo?.address || ''

      const matchingFromToken = tokenAddress
        ? fromTokensMap.get(tokenAddress.toLowerCase())
        : undefined

      const tokenPrice =
        parseFloat(asset.primaryMarket.price) || matchingFromToken?.price || 0

      return {
        name: asset.stockAlias || asset.symbol,
        symbol: asset.symbol.toUpperCase(),
        decimals: addressInfo?.decimals || 18,
        address: tokenAddress,
        logoURI: asset.iconPngUrl || asset.iconSvgUrl || '',
        cgId: matchingFromToken?.cgId || '',
        type: 'erc20',
        rank: matchingFromToken?.rank || 0,
        balance: matchingFromToken?.balance || '0',
        price: tokenPrice,
        networkInfo: {
          name: chainName.toLowerCase(),
          isAddress: tokenAddress,
        },
      }
    }) as unknown as NewTokenInfo[]

  if (
    chainName.toUpperCase() === 'ETHEREUM' &&
    hardcodedTokensInfo.length > 0
  ) {
    const existingAddresses = new Set(
      mappedAssets.map(t => (t as NewTokenInfo).address?.toLowerCase()),
    )
    const hardcodedTokens = hardcodedTokensInfo
      .filter(t => !existingAddresses.has(t.address.toLowerCase()))
      .map(t => {
        const matchingFromToken = fromTokensMap.get(t.address.toLowerCase())
        return {
          name: t.name,
          symbol: t.symbol,
          decimals: t.decimals,
          address: t.address,
          logoURI: t.logoURI,
          cgId: t.cgId,
          type: 'erc20',
          rank: matchingFromToken?.rank || 0,
          balance: matchingFromToken?.balance || '0',
          price: t.price,
          networkInfo: {
            name: 'ETHEREUM',
            isAddress: t.address,
          },
        }
      }) as unknown as NewTokenInfo[]
    return [...mappedAssets, ...hardcodedTokens]
  }

  return mappedAssets
}

// Helper to map supporting assets to token format
function mapSupportingAssetsToTokens(
  assets: SupportingAsset[],
  chainName: string,
  fromTokensMap: Map<string, NewTokenInfo>,
): NewTokenInfo[] {
  return assets
    .filter(asset =>
      asset.addresses.some(addr => addr.chainName?.toUpperCase() === chainName),
    )
    .map(asset => {
      const addressInfo = asset.addresses.find(
        addr => addr.chainName?.toUpperCase() === chainName,
      )
      const tokenAddress = addressInfo?.address || ''

      const matchingFromToken = tokenAddress
        ? fromTokensMap.get(tokenAddress.toLowerCase())
        : undefined

      return {
        name: asset.name,
        symbol: asset.symbol.toUpperCase(),
        decimals: addressInfo?.decimals || 18,
        address: tokenAddress,
        logoURI: addressInfo?.tokenLogoUrl || '',
        cgId: asset.coinId || matchingFromToken?.cgId || '',
        type: 'erc20',
        rank: matchingFromToken?.rank || 0,
        balance: matchingFromToken?.balance || '0',
        price: asset.price || matchingFromToken?.price || 0,
        networkInfo: {
          name: chainName.toLowerCase(),
          isAddress: tokenAddress,
        },
      }
    }) as unknown as NewTokenInfo[]
}
