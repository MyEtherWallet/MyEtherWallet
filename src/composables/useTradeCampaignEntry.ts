import { onMounted } from 'vue'
import { useRoute, useRouter, type LocationQuery } from 'vue-router'
import { ROUTES_MAIN } from '@/router/routeNames'
import { useWalletMenuStore } from '@/stores/walletMenuStore'

/**
 * UTM tags on the "Trade" links marketing places on myetherwallet.com. A visit
 * carrying all three is a deep link into the Trade panel on the Stocks page.
 */
export const TRADE_CAMPAIGN_UTM = {
  utm_source: 'https://myetherwallet.com',
  utm_medium: 'referral',
  utm_campaign: 'trade',
} as const

/**
 * Case-insensitive, and a trailing slash on the source is ignored: CMS and
 * link-builder tools disagree on both, and neither should break the deep link.
 */
const normalize = (value: string): string =>
  value.trim().toLowerCase().replace(/\/+$/, '')

const queryValue = (query: LocationQuery, key: string): string | null => {
  const raw = query[key]
  const value = Array.isArray(raw) ? raw[0] : raw
  return typeof value === 'string' ? value : null
}

export const isTradeCampaignQuery = (query: LocationQuery): boolean =>
  Object.entries(TRADE_CAMPAIGN_UTM).every(([key, expected]) => {
    const value = queryValue(query, key)
    return value !== null && normalize(value) === normalize(expected)
  })

/**
 * Lands a `utm_campaign=trade` referral from myetherwallet.com in the Trade
 * panel: opens the panel and, unless the user is already on the Stocks page
 * (or a stock-info drawer on it), navigates there. The UTM query is carried
 * over on that navigation so it stays visible to analytics and to the user.
 *
 * Runs once, on mount of the host (LayoutWallet, which owns the panel). Waits
 * for the router's initial navigation so `route.query` is the landing URL's,
 * not START_LOCATION's.
 */
export const useTradeCampaignEntry = () => {
  const route = useRoute()
  const router = useRouter()
  const walletMenu = useWalletMenuStore()

  onMounted(async () => {
    await router.isReady()
    if (!isTradeCampaignQuery(route.query)) return

    walletMenu.openPanel('trade')

    const onStocksPage = route.matched.some(
      record => record.name === ROUTES_MAIN.STOCKS.NAME,
    )
    if (onStocksPage) return
    await router.push({ name: ROUTES_MAIN.STOCKS.NAME, query: route.query })
  })
}
