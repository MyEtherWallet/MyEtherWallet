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

const isDevMode = Configs.IS_DEV_MODE

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
      tradableAssets.value = assets
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
