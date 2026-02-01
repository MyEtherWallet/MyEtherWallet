import type { GetWebSwapOndoMarketStatusResponse } from '@/mew_api/types'
import { getAPIPath } from '@/utils/constructAPIPath'

const TRADING_RESTRICTED_HELP_URL =
  'https://help.myetherwallet.com/en/articles/12897302-geographic-restrictions-for-mew'

const getMarketStatus = (): Promise<GetWebSwapOndoMarketStatusResponse> => {
  return fetch(getAPIPath(`/v1/web/swap/ondo/status/market`)).then(
    res => res.json() as Promise<GetWebSwapOndoMarketStatusResponse>,
  )
}

const isTradingRestricted = (): Promise<boolean> => {
  return fetch(`https://partners.mewapi.io/o/ipcomply`)
    .then(async res => {
      if (!res.ok) return false
      else {
        const json: { isRWARestricted: boolean } = await res.json()
        return json.isRWARestricted
      }
    })
    .catch(() => false)
}

export { getMarketStatus, isTradingRestricted, TRADING_RESTRICTED_HELP_URL }
