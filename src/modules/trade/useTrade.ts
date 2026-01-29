import { ref, type Ref } from 'vue'
import OneInchFusion from './providers/oneinch_fusion/oneInchFusion'
import type {
  GetWebSwapOndoAssetsResponse,
  GetWebSwapOndoSupportingAssetsResponse,
} from '@/mew_api/types'

export interface UseTrade {
  supportedChainNames: Ref<string[]>
  tradableAssets: Ref<GetWebSwapOndoAssetsResponse | null>
  additionalBuyAssets: Ref<GetWebSwapOndoSupportingAssetsResponse | null>
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
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadTradableAssets = async () => {
    isLoading.value = true
    error.value = null
    try {
      const [assets, additionalAssets] = await Promise.all([
        OneInchFusion.getTradableAssets(),
        OneInchFusion.getAdditionalBuyAssets(),
      ])
      tradableAssets.value = assets
      additionalBuyAssets.value = additionalAssets
    } catch (e) {
      error.value = (e as Error).message || 'Failed to load tradable assets'
    } finally {
      isLoading.value = false
    }
  }

  return {
    supportedChainNames,
    tradableAssets,
    additionalBuyAssets,
    isLoading,
    error,
    loadTradableAssets,
  }
}
