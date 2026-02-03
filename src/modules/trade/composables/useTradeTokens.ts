import { computed, type Ref } from 'vue'
import type { NewTokenInfo } from '@/composables/useSwap'
import type {
  Chain,
  GetWebSwapOndoAssetsResponse,
  GetWebSwapOndoSupportingAssetsResponse,
} from '@/mew_api/types'
import { MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'

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
}

export function useTradeTokens(options: UseTradeTokensOptions) {
  const {
    selectedFromChain,
    fromTokens,
    fromTokenSelected,
    toTokenSelected,
    tradableAssets,
    additionalBuyAssets,
  } = options

  // Check if selected from token is a tradable asset (stock token)
  const isSellingTradableAsset = computed(() => {
    if (!fromTokenSelected.value || !tradableAssets.value) return false
    const fromAddress = fromTokenSelected.value.address?.toLowerCase()
    if (!fromAddress) return false

    return tradableAssets.value.some(asset =>
      asset.addresses.some(addr => addr.address?.toLowerCase() === fromAddress),
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

  // Check if the selected assets are tradeable (not paused)
  const isSelectedAssetTradeable = computed(() => {
    if (selectedFromAssetInfo.value && !selectedFromAssetInfo.value.tradable) {
      return false
    }
    if (selectedToAssetInfo.value && !selectedToAssetInfo.value.tradable) {
      return false
    }
    return true
  })

  // Get the pause message for non-tradeable assets
  const nonTradeableAssetMessage = computed(() => {
    if (selectedFromAssetInfo.value && !selectedFromAssetInfo.value.tradable) {
      const pauseReason = selectedFromAssetInfo.value.pause?.reason?.message
      return (
        pauseReason ||
        `${fromTokenSelected.value?.symbol} is currently not available for trading`
      )
    }
    if (selectedToAssetInfo.value && !selectedToAssetInfo.value.tradable) {
      const pauseReason = selectedToAssetInfo.value.pause?.reason?.message
      return (
        pauseReason ||
        `${toTokenSelected.value?.symbol} is currently not available for trading`
      )
    }
    return ''
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

  // Get default from token (main token or first available)
  const getDefaultFromToken = (tokens: NewTokenInfo[]): NewTokenInfo | null => {
    return (
      tokens.find(t => t.address === MAIN_TOKEN_CONTRACT) || tokens[0] || null
    )
  }

  return {
    isSellingTradableAsset,
    isSelectedAssetTradeable,
    nonTradeableAssetMessage,
    toTokens,
    getDefaultFromToken,
  }
}

// Helper to map tradable assets to token format
function mapTradableAssetsToTokens(
  assets: TradableAsset[],
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
