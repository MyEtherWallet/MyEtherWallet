import axios from 'axios'
import type { HttpProviderConnector } from '@1inch/fusion-sdk'

/**
 * Fields of the raw 1inch quoter response that the Fusion SDK's `Quote` class
 * drops but the trade UI needs. `marketAmount` and `fromTokenAmount` are kept
 * so the caller can confirm the captured body belongs to the quote it received.
 */
export interface RawQuoteResponse {
  fromTokenAmount?: string
  marketAmount?: string
  priceImpactPercent?: number
}

const QUOTE_PATH = '/quote/receive'

export class IsolatedAxiosConnector implements HttpProviderConnector {
  private readonly client = axios.create()

  /** Raw body of the most recent quoter response, see `RawQuoteResponse`. */
  lastQuoteResponse: RawQuoteResponse | null = null

  async get<T>(url: string): Promise<T> {
    const res = await this.client.get<T>(url)
    if (url.includes(QUOTE_PATH) && res.data && typeof res.data === 'object') {
      this.lastQuoteResponse = res.data as RawQuoteResponse
    }
    return res.data
  }

  async post<T>(url: string, data: unknown): Promise<T> {
    const res = await this.client.post<T>(url, data)
    return res.data
  }
}
