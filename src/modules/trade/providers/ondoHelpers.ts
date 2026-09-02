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

/**
 * The restricted-RWA address list, and **rejects** when it could not be fetched.
 * An empty array previously stood for both "nothing is restricted" and "the
 * fetch failed", which let a failed fetch read as a successful empty filter and
 * expose restricted tokens in a restricted region.
 */
const getRestrictedTokenAddresses = async (): Promise<string[]> => {
  const res = await fetch(
    `https://raw.githubusercontent.com/enkryptcom/dynamic-data/refs/heads/main/configs/filtered-rwa-addresses.json`,
  )
  if (!res.ok) {
    throw new Error(`restricted-address list fetch failed: ${res.status}`)
  }
  return (await res.json()) as string[]
}

/**
 * Resolves to the region's verdict, and **rejects** when the check could not be
 * made. It deliberately does not convert failures into `true`: the caller
 * (`globalStore.fetchTradingRestriction`) already fails closed on rejection, and
 * it can only report the failure to Sentry and allow a later retry if it can
 * tell a real "restricted" answer apart from an unreachable endpoint.
 */
const isTradingRestricted = async (): Promise<boolean> => {
  if (configs.TRADING_RESTRICTION === 'off') return false
  const res = await fetch(`https://partners.mewapi.io/o/ipcomply/web`)
  if (!res.ok) {
    throw new Error(`ipcomply check failed: ${res.status}`)
  }
  const json: { isRWARestricted: boolean } = await res.json()
  return json.isRWARestricted
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
