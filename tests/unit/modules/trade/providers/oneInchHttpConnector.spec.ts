import { describe, it, expect, afterEach } from 'vitest'
import axios from 'axios'
import { IsolatedAxiosConnector } from '@/modules/trade/providers/oneinch_fusion/oneInchHttpConnector'

const registerLedgerLikeInterceptor = () =>
  axios.interceptors.response.use(
    response => response,
    () => {
      throw new Error('rewritten-by-global-interceptor')
    },
  )

let interceptorId: number | null = null

afterEach(() => {
  if (interceptorId !== null) {
    axios.interceptors.response.eject(interceptorId)
    interceptorId = null
  }
})

const clientOf = (connector: IsolatedAxiosConnector) =>
  (connector as unknown as { client: typeof axios }).client

describe('IsolatedAxiosConnector', () => {
  it('starts with an empty response interceptor chain', () => {
    interceptorId = registerLedgerLikeInterceptor()

    const client = clientOf(new IsolatedAxiosConnector())
    const handlers = (
      client.interceptors.response as unknown as { handlers: unknown[] }
    ).handlers

    expect(handlers).toHaveLength(0)
  })

  it('does not use the global axios instance', () => {
    const client = clientOf(new IsolatedAxiosConnector())
    expect(client).not.toBe(axios)
  })

  it('preserves the error response body when a global interceptor is active', async () => {
    interceptorId = registerLedgerLikeInterceptor()

    const connector = new IsolatedAxiosConnector()
    const client = clientOf(connector)
    client.defaults.adapter = async config =>
      Promise.reject(
        Object.assign(new Error('Request failed with status code 400'), {
          config,
          response: {
            status: 400,
            data: {
              error: 'Bad Request',
              description: 'insufficient amount',
              code: 'INSUFFICIENT_AMOUNT',
            },
          },
        }),
      )

    await expect(
      connector.get('https://fusion.1inch.io/quote'),
    ).rejects.toEqual(
      expect.objectContaining({
        message: 'Request failed with status code 400',
        response: expect.objectContaining({
          status: 400,
          data: expect.objectContaining({
            description: 'insufficient amount',
            code: 'INSUFFICIENT_AMOUNT',
          }),
        }),
      }),
    )
  })

  it('unwraps the response body on success', async () => {
    const connector = new IsolatedAxiosConnector()
    clientOf(connector).defaults.adapter = async config => ({
      data: { quoteId: 'abc' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    })

    await expect(
      connector.get('https://fusion.1inch.io/quote'),
    ).resolves.toEqual({ quoteId: 'abc' })
  })

  it('captures the raw quoter body so callers can read fields the SDK drops', async () => {
    const connector = new IsolatedAxiosConnector()
    const body = {
      quoteId: null,
      marketAmount: '7691305155320972158',
      priceImpactPercent: 0.43,
    }
    clientOf(connector).defaults.adapter = async config => ({
      data: body,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    })

    expect(connector.lastQuoteResponse).toBeNull()
    await connector.get(
      'https://fusion.1inch.io/quoter/v2.0/1/quote/receive/?x=1',
    )
    expect(connector.lastQuoteResponse).toEqual(body)
  })

  it('ignores non-quote responses when capturing the raw body', async () => {
    const connector = new IsolatedAxiosConnector()
    clientOf(connector).defaults.adapter = async config => ({
      data: { status: 'filled' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    })

    await connector.get(
      'https://fusion.1inch.io/orders/v2.0/1/order/status/0xabc',
    )
    expect(connector.lastQuoteResponse).toBeNull()
  })
})
