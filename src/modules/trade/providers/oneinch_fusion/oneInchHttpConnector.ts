import axios from 'axios'
import type { HttpProviderConnector } from '@1inch/fusion-sdk'

/**
 * HTTP connector for the Fusion SDK backed by a *dedicated* axios instance.
 *
 * The SDK's own connector calls `axios.get` on the global instance, and
 * `@ledgerhq/live-network` — pulled in eagerly through
 * `@/analytics` → walletConfigs → `@enkryptcom/hw-wallets` — registers a global
 * response interceptor on that same instance. That interceptor rewrites every
 * axios error into a `LedgerAPI4xx`, taking the message from
 * `data.message || data.error_message || data.error || data.msg` and dropping
 * `error.response` entirely. For 1inch that meant:
 *   - `data.description` ("insufficient amount") was never reachable, and the
 *     user saw `data.error` ("Bad Request") instead,
 *   - `response.status` was lost, so `expectedClientError` always resolved to
 *     `false` and expected 4xx were reported to Sentry as genuine failures.
 *
 * `axios.create()` starts with an empty interceptor chain, so 1inch traffic no
 * longer passes through Ledger's handler. Nothing is removed from the global
 * instance: Ledger's own requests keep their interceptor, and hardware signing
 * is unaffected (it goes over the USB transport, not HTTP).
 */
export class IsolatedAxiosConnector implements HttpProviderConnector {
  private readonly client = axios.create()

  async get<T>(url: string): Promise<T> {
    const res = await this.client.get<T>(url)
    return res.data
  }

  async post<T>(url: string, data: unknown): Promise<T> {
    const res = await this.client.post<T>(url, data)
    return res.data
  }
}
