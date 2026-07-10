import { ref, type Ref } from 'vue'
import OneInchFusion from './providers/oneinch_fusion/oneInchFusion'
import type { HardcodedTokenInfo } from './providers/oneinch_fusion/oneInchFusion'
import type {
  GetWebSwapOndoAssetsResponse,
  GetWebSwapOndoSupportingAssetsResponse,
} from '@/mew_api/types'
import { captureException } from '@sentry/vue'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import Configs from '@/configs'
import * as Sentry from '@sentry/vue'

const isDevMode = Configs.IS_DEV_MODE

type TradableAsset = GetWebSwapOndoAssetsResponse[number]

const isTradableAsset = (asset: unknown): asset is TradableAsset => {
  if (typeof asset !== 'object' || asset === null) return false
  const a = asset as Record<string, unknown>
  return (
    typeof a.symbol === 'string' &&
    typeof a.tradable === 'boolean' &&
    (a.pause === null || (typeof a.pause === 'object' && a.pause !== null)) &&
    typeof a.primaryMarket === 'object' &&
    a.primaryMarket !== null &&
    typeof a.underlyingMarket === 'object' &&
    a.underlyingMarket !== null &&
    Array.isArray(a.addresses)
  )
}

export interface UseTrade {
  supportedChainNames: Ref<string[]>
  tradableAssets: Ref<GetWebSwapOndoAssetsResponse | null>
  additionalBuyAssets: Ref<GetWebSwapOndoSupportingAssetsResponse | null>
  hardcodedTokensInfo: Ref<HardcodedTokenInfo[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  loadTradableAssets: () => Promise<void>
}

export const useTrade = (): UseTrade => {
  const supportedChainNames = ref<string[]>(
    OneInchFusion.getSupportedChainNames(),
  )
  const tradableAssets = ref<GetWebSwapOndoAssetsResponse | null>(null)
  const additionalBuyAssets =
    ref<GetWebSwapOndoSupportingAssetsResponse | null>(null)
  const hardcodedTokensInfo = ref<HardcodedTokenInfo[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadTradableAssets = async () => {
    isLoading.value = true
    error.value = null
    try {
      const [assets, additionalAssets, hardcodedInfo] = await Promise.all([
        OneInchFusion.getTradableAssets(),
        OneInchFusion.getAdditionalBuyAssets(),
        OneInchFusion.getHardcodedTokensInfo(),
      ])
      const validAssets: TradableAsset[] = []
      assets.forEach((asset, index) => {
        if (isTradableAsset(asset)) {
          validAssets.push(asset)
        } else {
          if (isDevMode) {
            console.warn(
              'Skipping unexpected tradable asset at index',
              index,
              asset,
            )
          } else {
            Sentry.captureMessage(
              `Unexpected tradable asset at index ${index}: ${JSON.stringify(
                asset,
              )}`,
              {
                ...SENTRY_MODULE_TAGS.TRADE,
                level: 'warning',
                extra: {
                  title: 'TRADE: Unexpected tradable asset',
                  index,
                  asset,
                },
              },
            )
          }
        }
      })
      tradableAssets.value = validAssets

      additionalBuyAssets.value = additionalAssets
      hardcodedTokensInfo.value = hardcodedInfo
    } catch (e) {
      error.value = (e as Error).message || 'Failed to load tradable assets'
      if (isDevMode) {
        console.error('Error loading tradable assets:', e)
      } else {
        captureException(e, {
          ...SENTRY_MODULE_TAGS.TRADE,
          extra: {
            title: 'TRADE: Error loading tradable assets',
            errorMessage: error.value,
          },
        })
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    supportedChainNames,
    tradableAssets,
    additionalBuyAssets,
    hardcodedTokensInfo,
    isLoading,
    error,
    loadTradableAssets,
  }
}
