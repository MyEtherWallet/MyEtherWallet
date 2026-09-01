import { describe, it, expect } from 'vitest'
import {
  isTransientRpcError,
  isAxiosNetworkError,
} from '@/modules/trade/common/transientRpcError'

describe('isTransientRpcError', () => {
  it('is true for the top-level viem error whose message is "WebSocket request failed"', () => {
    // The exact production shape: ContractFunctionExecutionError carrying the
    // WS failure in its message.
    expect(
      isTransientRpcError({
        name: 'ContractFunctionExecutionError',
        message:
          'WebSocket request failed.\n\nURL: wss://nodes.mewapi.io/ws/eth\nVersion: viem@2.44.0',
      }),
    ).toBe(true)
  })

  it('is true when a transient error is nested in the cause chain', () => {
    expect(
      isTransientRpcError({
        name: 'ContractFunctionExecutionError',
        message: 'Contract call failed',
        cause: {
          name: 'CallExecutionError',
          message: 'call failed',
          cause: {
            name: 'SocketClosedError',
            message: 'The socket has been closed.',
          },
        },
      }),
    ).toBe(true)
  })

  it('is true for WebSocketRequestError by name', () => {
    expect(
      isTransientRpcError({ name: 'WebSocketRequestError', message: 'boom' }),
    ).toBe(true)
  })

  it('is true for an object whose message is "Connection is closed"', () => {
    expect(isTransientRpcError({ message: 'Connection is closed' })).toBe(true)
  })

  it('is true for a bare-string "Connection is closed" rejection', () => {
    // The production shape captured by Sentry `onunhandledrejection`: a WS layer
    // rejects with a plain string (no Error, no stack, no cause chain).
    expect(isTransientRpcError('Connection is closed')).toBe(true)
    expect(isTransientRpcError('The socket has been closed.')).toBe(true)
  })

  it('is false for a genuine app error', () => {
    expect(
      isTransientRpcError({
        name: 'TypeError',
        message: "Cannot read properties of undefined (reading 'presets')",
      }),
    ).toBe(false)
  })

  it('is false for a 1inch client error (handled separately)', () => {
    expect(isTransientRpcError(new Error('Bad Request'))).toBe(false)
  })

  it('is false for a non-transient bare string', () => {
    expect(isTransientRpcError('Bad Request')).toBe(false)
    expect(isTransientRpcError('Cannot read properties of undefined')).toBe(
      false,
    )
  })

  it('is false for empty / nullish inputs', () => {
    expect(isTransientRpcError(null)).toBe(false)
    expect(isTransientRpcError(undefined)).toBe(false)
    expect(isTransientRpcError('')).toBe(false)
  })
})

describe('isAxiosNetworkError', () => {
  it('is true for a raw axios network error (code ERR_NETWORK, no response)', () => {
    // The exact production shape: axios rejects with code 'ERR_NETWORK' and a
    // hard-coded message when the 1inch request never completes (APP-MEW-WEB-13E).
    expect(
      isAxiosNetworkError({
        code: 'ERR_NETWORK',
        message: 'Network Error',
        request: {},
      }),
    ).toBe(true)
  })

  it('is true when the code is absent but message is "Network Error" and no response', () => {
    expect(isAxiosNetworkError({ message: 'Network Error' })).toBe(true)
  })

  it('is false for a 1inch 4xx client error (has a response)', () => {
    expect(
      isAxiosNetworkError({
        code: 'ERR_BAD_REQUEST',
        message: 'Request failed with status code 400',
        response: { status: 400 },
      }),
    ).toBe(false)
  })

  it('is false for a genuine app error', () => {
    expect(
      isAxiosNetworkError({
        name: 'TypeError',
        message: "Cannot read properties of undefined (reading 'presets')",
      }),
    ).toBe(false)
  })

  it('is false for non-object / nullish inputs', () => {
    expect(isAxiosNetworkError(null)).toBe(false)
    expect(isAxiosNetworkError(undefined)).toBe(false)
    expect(isAxiosNetworkError('Network Error')).toBe(false)
  })
})
