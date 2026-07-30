import { describe, it, expect } from 'vitest'
import {
  buildMewApiErrorMessage,
  buildMewApiErrorFingerprint,
  describeMewApiFetchError,
} from '@/utils/mewApiFetchError'

describe('buildMewApiErrorMessage', () => {
  it('never returns an empty message for an HTTP/2 non-OK response (the "No error message" bug)', () => {
    // The exact production shape: useFetch threw `new Error(response.statusText)`
    // and over HTTP/2 statusText is always '', so both the error message and
    // statusText are empty. There is no JSON body message either.
    const message = buildMewApiErrorMessage({
      error: new Error(''),
      data: null,
      status: 404,
      statusText: '',
      url: 'https://mew-api-prod.ethvm.dev/v1/chains/with-prices',
    })
    expect(message).toBe('MEW API request failed with status 404')
    expect(message.length).toBeGreaterThan(0)
  })

  it('prefers the JSON body message when the API returns one', () => {
    expect(
      buildMewApiErrorMessage({
        error: new Error(''),
        data: { message: 'Invalid request body.' },
        status: 400,
        statusText: '',
        url: 'https://mew-api-prod.ethvm.dev/v1/evm/chains/1/multi-quotes',
      }),
    ).toBe('Invalid request body.')
  })

  it('uses the original error message for a network failure (no response)', () => {
    expect(
      buildMewApiErrorMessage({
        error: new TypeError('Failed to fetch'),
        data: null,
        status: undefined,
        statusText: undefined,
        url: 'https://mew-api-prod.ethvm.dev/v1/tokens',
      }),
    ).toBe('Failed to fetch')
  })

  it('falls back to statusText when it is non-empty and there is no body message', () => {
    expect(
      buildMewApiErrorMessage({
        error: new Error(''),
        data: null,
        status: 503,
        statusText: 'Service Unavailable',
        url: 'https://mew-api-prod.ethvm.dev/v1/tokens',
      }),
    ).toBe('Service Unavailable')
  })

  it('falls back to a network-error message when there is no status at all', () => {
    expect(
      buildMewApiErrorMessage({
        error: new Error(''),
        data: null,
        status: undefined,
        statusText: undefined,
        url: 'https://mew-api-prod.ethvm.dev/v1/tokens',
      }),
    ).toBe('MEW API request failed (network error)')
  })

  it('ignores a whitespace-only / non-string body message', () => {
    expect(
      buildMewApiErrorMessage({
        error: new Error(''),
        data: { message: '   ' },
        status: 500,
        statusText: '',
        url: 'x',
      }),
    ).toBe('MEW API request failed with status 500')
    expect(
      buildMewApiErrorMessage({
        error: new Error(''),
        data: { message: 42 },
        status: 500,
        statusText: '',
        url: 'x',
      }),
    ).toBe('MEW API request failed with status 500')
  })
})

describe('buildMewApiErrorFingerprint', () => {
  it('groups by HTTP status', () => {
    expect(buildMewApiErrorFingerprint(404)).toEqual([
      'mew-api-fetch-error',
      '404',
    ])
    expect(buildMewApiErrorFingerprint(500)).toEqual([
      'mew-api-fetch-error',
      '500',
    ])
  })

  it('groups network failures (no status) into a single bucket', () => {
    expect(buildMewApiErrorFingerprint(undefined)).toEqual([
      'mew-api-fetch-error',
      'network',
    ])
  })
})

describe('describeMewApiFetchError', () => {
  it('produces a non-empty Error, bounded fingerprint, tags and extra for the empty-message case', () => {
    const captured = describeMewApiFetchError({
      error: new Error(''),
      data: null,
      status: 404,
      statusText: '',
      url: 'https://mew-api-prod.ethvm.dev/v1/chains/with-prices?address=0xabc',
    })
    expect(captured.error).toBeInstanceOf(Error)
    expect(captured.error.message).toBe(
      'MEW API request failed with status 404',
    )
    expect(captured.fingerprint).toEqual(['mew-api-fetch-error', '404'])
    // URL tag is sanitised (query string dropped) to bound cardinality / avoid
    // leaking query params.
    expect(captured.tags.mew_api_url).toBe(
      'https://mew-api-prod.ethvm.dev/v1/chains/with-prices',
    )
    expect(captured.tags.mew_api_status).toBe('404')
    expect(captured.extra.status).toBe(404)
    expect(captured.extra.url).toBe(
      'https://mew-api-prod.ethvm.dev/v1/chains/with-prices?address=0xabc',
    )
  })

  it('preserves the original error (type + stack) when it already has a message', () => {
    const original = new TypeError('Failed to fetch')
    const captured = describeMewApiFetchError({
      error: original,
      data: null,
      status: undefined,
      statusText: undefined,
      url: 'https://mew-api-prod.ethvm.dev/v1/tokens',
    })
    expect(captured.error).toBe(original)
    expect(captured.fingerprint).toEqual(['mew-api-fetch-error', 'network'])
    expect(captured.tags.mew_api_status).toBe('network_error')
  })

  it('wraps the built message in a fresh Error but keeps the original as cause', () => {
    // Empty-message error: we build a descriptive message but must not discard
    // the original error's stack — preserve it via `cause` so Sentry can
    // reconstruct the chain.
    const original = new Error('')
    const captured = describeMewApiFetchError({
      error: original,
      data: null,
      status: 500,
      statusText: '',
      url: 'https://mew-api-prod.ethvm.dev/v1/tokens',
    })
    expect(captured.error).not.toBe(original)
    expect(captured.error.message).toBe(
      'MEW API request failed with status 500',
    )
    expect((captured.error as { cause?: unknown }).cause).toBe(original)
  })
})
