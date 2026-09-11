import axios from 'axios'
import type { HttpProviderConnector } from '@1inch/fusion-sdk'

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
