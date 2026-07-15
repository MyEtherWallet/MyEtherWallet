// viem error class names that represent a transient RPC/WebSocket connection
// drop (not an app bug). viem nests these in the `cause` chain of the
// higher-level ContractFunctionExecutionError / CallExecutionError.
const TRANSIENT_RPC_ERROR_NAMES = new Set<string>([
  'WebSocketRequestError',
  'SocketClosedError',
  'TimeoutError',
])

/**
 * Whether an error is a transient RPC/WebSocket failure — expected flakiness of
 * the node connection (idle disconnect / node restart), not an app bug, so it
 * should be skipped in Sentry. Matches by viem error name or message, walking
 * the `cause` chain since viem wraps the socket error several levels deep.
 */
export function isTransientRpcError(e: unknown): boolean {
  let cur: unknown = e
  for (let depth = 0; cur && typeof cur === 'object' && depth < 6; depth++) {
    const err = cur as { name?: unknown; message?: unknown; cause?: unknown }
    if (typeof err.name === 'string' && TRANSIENT_RPC_ERROR_NAMES.has(err.name)) {
      return true
    }
    const msg = typeof err.message === 'string' ? err.message.toLowerCase() : ''
    if (
      msg.includes('websocket request failed') ||
      msg.includes('socket has been closed') ||
      msg.includes('socket closed')
    ) {
      return true
    }
    cur = err.cause
  }
  return false
}
