// viem error class names that represent a transient RPC/WebSocket connection
// drop (not an app bug). viem nests these in the `cause` chain of the
// higher-level ContractFunctionExecutionError / CallExecutionError.
const TRANSIENT_RPC_ERROR_NAMES = new Set<string>([
  'WebSocketRequestError',
  'SocketClosedError',
  'TimeoutError',
])

// Message fragments (matched case-insensitively) that identify a transient
// RPC/WebSocket drop. "connection is closed" / "connection closed" cover the
// plain-value rejection some WS layers emit when the socket drops mid-request.
const TRANSIENT_MESSAGE_FRAGMENTS = [
  'websocket request failed',
  'socket has been closed',
  'socket closed',
  'connection is closed',
  'connection closed',
]

function hasTransientMessage(message: string): boolean {
  const msg = message.toLowerCase()
  return TRANSIENT_MESSAGE_FRAGMENTS.some(fragment => msg.includes(fragment))
}

/**
 * Whether an error is a transient RPC/WebSocket failure — expected flakiness of
 * the node connection (idle disconnect / node restart), not an app bug, so it
 * should be skipped in Sentry. Matches by viem error name or message, walking
 * the `cause` chain since viem wraps the socket error several levels deep. Also
 * handles a bare-string rejection (e.g. a WS layer that rejects with the plain
 * string "Connection is closed"), which reaches the global Sentry `beforeSend`
 * as an unhandled rejection with no Error, stack, or cause chain.
 */
export function isTransientRpcError(e: unknown): boolean {
  if (typeof e === 'string') return hasTransientMessage(e)
  let cur: unknown = e
  for (let depth = 0; cur && typeof cur === 'object' && depth < 6; depth++) {
    const err = cur as { name?: unknown; message?: unknown; cause?: unknown }
    if (
      typeof err.name === 'string' &&
      TRANSIENT_RPC_ERROR_NAMES.has(err.name)
    ) {
      return true
    }
    if (typeof err.message === 'string' && hasTransientMessage(err.message)) {
      return true
    }
    cur = err.cause
  }
  return false
}
