import { ref, type Ref } from 'vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import {
  mapCryptoItem,
  mapStockItem,
  type AssetPickerItem,
} from '@/modules/home/composables/useAssetPicker'
import type { RecommendedAsset } from '@/modules/home/components/watchlistOnboarding'
import type {
  GetWebTokensTableResponse,
  GetWebStocksTableResponse,
} from '@/mew_api/types'

/**
 * Single seam for the watchlist onboarding recommendations (MEW-2130).
 *
 * There is no `/recommendations` endpoint yet, so this derives the list from the
 * existing market tables based on the markets picked in step 1:
 *   - crypto selected            → crypto table
 *   - stocks selected            → stocks table
 *   - both (or nothing) selected → both, combined and de-duped
 * Industries can't filter these tables, so they're ignored for now.
 *
 * When the recommendations endpoint ships, swap the body of
 * `fetchRecommendations` for that single call — the signature stays the same.
 */
const PER_PAGE = 50
const TOKENS_TABLE = `/v1/web/tokens-table?page=1&perPage=${PER_PAGE}&sort=MARKET_CAP_DESC`
const STOCKS_TABLE = `/v1/web/pages/stocks/table?page=1&perPage=${PER_PAGE}&sort=MARKET_CAP_DESC`

const toRecommended = (i: AssetPickerItem): RecommendedAsset => ({
  id: i.key,
  symbol: i.symbol,
  name: i.name,
  logoUrl: i.logoUrl,
  type: i.type,
  watchlistId: i.watchlistId,
})

/** Keep the first occurrence of each id (stocks win over crypto-table dupes). */
const dedupe = (assets: RecommendedAsset[]): RecommendedAsset[] => {
  const seen = new Set<string>()
  const out: RecommendedAsset[] = []
  for (const a of assets) {
    if (seen.has(a.id)) continue
    seen.add(a.id)
    out.push(a)
  }
  return out
}

export function useRecommendedWatchlist(): {
  assets: Ref<RecommendedAsset[]>
  isLoading: Ref<boolean>
  fetchRecommendations: (
    markets: string[],
    industries: string[],
  ) => Promise<void>
} {
  const { useMEWFetch } = useFetchMewApi()
  const assets = ref<RecommendedAsset[]>([])
  const isLoading = ref(false)

  const fetchCrypto = async (): Promise<RecommendedAsset[]> => {
    const { data } = await useMEWFetch(TOKENS_TABLE)
      .get()
      .json<GetWebTokensTableResponse>()
    return (data.value?.items ?? []).map(mapCryptoItem).map(toRecommended)
  }

  const fetchStocks = async (): Promise<RecommendedAsset[]> => {
    const { data } = await useMEWFetch(STOCKS_TABLE)
      .get()
      .json<GetWebStocksTableResponse>()
    return (data.value?.items ?? []).map(mapStockItem).map(toRecommended)
  }

  const fetchRecommendations = async (
    markets: string[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _industries: string[],
  ) => {
    const wantCrypto = markets.length === 0 || markets.includes('crypto')
    const wantStocks = markets.length === 0 || markets.includes('stocks')
    isLoading.value = true
    try {
      const [crypto, stocks] = await Promise.all([
        wantCrypto ? fetchCrypto() : Promise.resolve<RecommendedAsset[]>([]),
        wantStocks ? fetchStocks() : Promise.resolve<RecommendedAsset[]>([]),
      ])
      assets.value = dedupe([...stocks, ...crypto])
    } catch {
      assets.value = []
    } finally {
      isLoading.value = false
    }
  }

  return { assets, isLoading, fetchRecommendations }
}
