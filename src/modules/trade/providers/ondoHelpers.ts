import type { GetWebSwapOndoMarketStatusResponse } from '@/mew_api/types'
import { getAPIPath } from '@/utils/constructAPIPath'

const getMarketStatus = (): Promise<GetWebSwapOndoMarketStatusResponse> => {
  return fetch(getAPIPath(`/v1/web/swap/ondo/status/market`)).then(
    res => res.json() as Promise<GetWebSwapOndoMarketStatusResponse>,
  )
}

export { getMarketStatus }
