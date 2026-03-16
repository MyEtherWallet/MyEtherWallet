import configs from '@/configs'
import type { GetWebSwapOndoMarketStatusResponse } from '@/mew_api/types'
import { getAPIPath } from '@/utils/constructAPIPath'
import { throttle } from 'underscore'

const TRADING_RESTRICTED_HELP_URL =
  'https://help.myetherwallet.com/en/articles/13641432-restrictions-on-tokenized-stock-trading-in-mew'

const _getMarketStatus = (): Promise<GetWebSwapOndoMarketStatusResponse> => {
  return fetch(getAPIPath(`/v1/web/swap/ondo/status/market`)).then(
    res => res.json() as Promise<GetWebSwapOndoMarketStatusResponse>,
  )
}

const getMarketStatus = throttle(_getMarketStatus, 1000)

const getRestrictedTokenAddresses = (): Promise<string[]> => {
  return fetch(
    `https://raw.githubusercontent.com/enkryptcom/dynamic-data/refs/heads/main/configs/filtered-rwa-addresses.json`,
  ).then(res => res.json() as Promise<string[]>)
}

const isTradingRestricted = async (): Promise<boolean> => {
  if (!configs.MEW_LIVE_URLS.includes(window.location.hostname)) return false
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

const checkAddressRestriction = async (address: string): Promise<boolean> => {
  const addrCheckRequest = await fetch(
    `https://partners.mewapi.io/o/walletscreen?address=${address}`,
  )
  const { isRestricted } = await addrCheckRequest.json()
  if (isRestricted) {
    window.location.href = 'https://www.myetherwallet.com/blocked'
  }
  return isRestricted
}
export {
  getMarketStatus,
  isTradingRestricted,
  getRestrictedTokenAddresses,
  TRADING_RESTRICTED_HELP_URL,
  checkAddressRestriction,
}
