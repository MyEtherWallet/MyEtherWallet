import { describe, it, expect, afterEach } from 'vitest'
import axios from 'axios'
import { IsolatedAxiosConnector } from '@/modules/trade/providers/oneinch_fusion/oneInchHttpConnector'

// `@ledgerhq/live-network` registers a global response interceptor as a side
// effect of being imported (it arrives eagerly via @/analytics → walletConfigs
// → @enkryptcom/hw-wallets). It rewrites every axios error into a LedgerAPI4xx
// and drops `error.response`, which used to swallow 1inch's error body. These
// cases pin the isolation that keeps Fusion traffic off that instance.
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
    // Stub at the adapter level so no network call is made: the point under
    // test is which interceptor chain the error travels through.
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

    await expect(connector.get('https://fusion.1inch.io/quote')).rejects.toEqual(
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

    await expect(connector.get('https://fusion.1inch.io/quote')).resolves.toEqual(
      { quoteId: 'abc' },
    )
  })
})
