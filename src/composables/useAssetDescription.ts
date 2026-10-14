import { computed, watch, type Ref } from 'vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import type {
  GetWebStocksInfoDescriptionResponse,
  GetWebTokenInfoDescriptionResponse,
} from '@/mew_api/types'

export type AssetDescriptionKind = 'stock' | 'token'

/**
 * The coin description may contain HTML anchor tags. The app never renders raw
 * markup (no sanitizer is bundled), so strip tags and decode the handful of
 * entities the provider emits to get displayable plain text.
 */
const toPlainText = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .trim()
}

/**
 * Fetches the description of an asset when its info page is opened.
 *
 * The description lives behind its own endpoint (it is not part of the summary
 * payload) so the page can render without waiting on the upstream provider.
 *
 * @param assetId - coin id for tokens, symbol for stocks. Refetches on change.
 * @param kind - which endpoint to hit.
 */
export const useAssetDescription = (
  assetId: Ref<string | undefined>,
  kind: AssetDescriptionKind,
) => {
  const { useMEWFetch } = useFetchMewApi()

  const endpoint = computed(() => {
    if (!assetId.value) return ''
    const id = encodeURIComponent(assetId.value)
    return kind === 'stock'
      ? `/v1/web/pages/stocks-info/stocks/${id}/description`
      : `/v1/web/pages/token-info/coins/${id}/description`
  })

  // Fetching is driven by the watcher below rather than `refetch`, so an
  // unresolved asset id never fires a request against the bare base url.
  const { data, isFetching, error, execute } = useMEWFetch(endpoint, {
    immediate: false,
  })
    .get()
    .json<
      GetWebStocksInfoDescriptionResponse | GetWebTokenInfoDescriptionResponse
    >()

  watch(
    endpoint,
    url => {
      // The route reuses the component across assets, so drop the previous
      // asset's description instead of showing it under the new one.
      data.value = null
      if (!url) return
      execute()
    },
    { immediate: true },
  )

  const description = computed<string | null>(() => {
    const raw = data.value?.description
    if (!raw) return null
    const text = toPlainText(raw)
    return text.length > 0 ? text : null
  })

  return {
    description,
    isFetchingDescription: isFetching,
    descriptionError: error,
  }
}
