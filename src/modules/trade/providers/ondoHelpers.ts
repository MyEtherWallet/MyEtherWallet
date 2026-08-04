import configs from '@/configs'
import type { GetWebSwapOndoMarketStatusResponse } from '@/mew_api/types'
import { getAPIPath } from '@/utils/constructAPIPath'
import { throttle } from 'underscore'

const TRADING_RESTRICTED_HELP_URL =
  'https://help.myetherwallet.com/en/articles/13641432-restrictions-on-tokenized-stock-trading-in-mew'

const _getMarketStatus = (): Promise<GetWebSwapOndoMarketStatusResponse> => {
  return fetch(getAPIPath(`/v1/web/swap/ondo/status/market`)).then(res => {
    if (!res.ok)
      throw new Error(`Failed to fetch market status: ${res.status}`)
    return res.json() as Promise<GetWebSwapOndoMarketStatusResponse>
  })
}

const getMarketStatus = throttle(_getMarketStatus, 1000)

const getRestrictedTokenAddresses = (): Promise<string[]> => {
  return fetch(
    `https://raw.githubusercontent.com/enkryptcom/dynamic-data/refs/heads/main/configs/filtered-rwa-addresses.json`,
  )
    .then(res => {
      if (!res.ok) return []
      return res.json() as Promise<string[]>
    })
    .catch(() => [])
}

const isTradingRestricted = async (): Promise<boolean> => {
  if (!configs.MEW_LIVE_URLS.includes(window.location.hostname)) return false
  return fetch(`https://partners.mewapi.io/o/ipcomply/web`)
    .then(async res => {
      if (!res.ok) return true
      else {
        const json: { isRWARestricted: boolean } = await res.json()
        return json.isRWARestricted
      }
    })
    .catch(() => true
    )
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
