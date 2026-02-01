import type { GetWebSwapOndoMarketStatusResponse } from '@/mew_api/types'
import { getAPIPath } from '@/utils/constructAPIPath'

const TRADING_RESTRICTED_HELP_URL =
  'https://help.myetherwallet.com/en/articles/12897302-geographic-restrictions-for-mew'

const getMarketStatus = (): Promise<GetWebSwapOndoMarketStatusResponse> => {
  return fetch(getAPIPath(`/v1/web/swap/ondo/status/market`)).then(
    res => res.json() as Promise<GetWebSwapOndoMarketStatusResponse>,
  )
}

const getRestrictedTokenAddresses = (): Promise<string[]> => {
  return fetch(
    `https://raw.githubusercontent.com/enkryptcom/dynamic-data/refs/heads/main/configs/filtered-rwa-addresses.json`,
  ).then(res => res.json() as Promise<string[]>)
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

export {
  getMarketStatus,
  isTradingRestricted,
  getRestrictedTokenAddresses,
  TRADING_RESTRICTED_HELP_URL,
}
