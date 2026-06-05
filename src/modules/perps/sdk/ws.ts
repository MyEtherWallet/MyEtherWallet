import { ref, type Ref } from 'vue'
import type {
  WsAuthStatus,
  WsChannel,
  WsConnectionState,
  WsFrameHandler,
  WsInboundFrame,
  WsOutboundFrame,
} from './wsTypes'
import { perpsWsUrl } from '../configs'

const PRIVATE_CHANNELS = new Set<WsChannel>([
  'balancePerps',
  'positionsPerps',
  'ordersPerps',
  'fillsPerps',
  'deposits',
  'withdrawals',
])

function isPrivate(ch: WsChannel) {
  return PRIVATE_CHANNELS.has(ch)
}

export interface PerpsWsOptions {
  url?: string
  wsFactory?: (url: string) => WebSocket
  pingIntervalMs?: number
  staleAfterMs?: number
  backoffBaseMs?: number
  backoffMaxMs?: number
  backoffJitter?: number // 0 = deterministic; 0.2 = ±20%
}

export interface PerpsWs {
  state: Ref<WsConnectionState>
  authStatus: Ref<WsAuthStatus>
  connect: () => void
  disconnect: () => void
  subscribe: <T = unknown>(
    channel: WsChannel,
    handler: WsFrameHandler<T[]>,
  ) => () => void
  login: (token: string) => void
  logout: () => void
  setOnUnauthorized: (cb: (() => void) | null) => void
}

export function createPerpsWs(opts: PerpsWsOptions = {}): PerpsWs {
  const url = opts.url ?? perpsWsUrl
  const wsFactory = opts.wsFactory ?? ((u) => new WebSocket(u))
  const state = ref<WsConnectionState>('idle')
  let socket: WebSocket | null = null

  const pingIntervalMs = opts.pingIntervalMs ?? 30_000
  const staleAfterMs = opts.staleAfterMs ?? 60_000
  let pingTimer: ReturnType<typeof setInterval> | null = null
  let staleTimer: ReturnType<typeof setTimeout> | null = null

  const backoffBaseMs = opts.backoffBaseMs ?? 1_000
  const backoffMaxMs = opts.backoffMaxMs ?? 30_000
  const backoffJitter = opts.backoffJitter ?? 0.2
  let backoffAttempt = 0
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let userClosed = false

  const authStatus = ref<WsAuthStatus>('unauthenticated')
  let pendingToken: string | null = null

  let onUnauthorized: (() => void) | null = null
  function setOnUnauthorized(cb: (() => void) | null) { onUnauthorized = cb }

  function login(token: string) {
    pendingToken = token
    authStatus.value = 'authenticating'
    _send({ op: 'login', args: { token } })
  }

  function logout() {
    pendingToken = null
    authStatus.value = 'unauthenticated'
    _send({ op: 'logout' })
  }

  function _scheduleReconnect() {
    if (userClosed) return
    state.value = 'reconnecting'
    const base = Math.min(backoffBaseMs * 2 ** backoffAttempt, backoffMaxMs)
    const jitter = base * backoffJitter
    const delay = base + (Math.random() * 2 - 1) * jitter
    backoffAttempt++
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null
      connect()
    }, delay)
  }

  function _stopTimers() {
    if (pingTimer) {
      clearInterval(pingTimer)
      pingTimer = null
    }
    if (staleTimer) {
      clearTimeout(staleTimer)
      staleTimer = null
    }
  }

  function _armStale() {
    if (staleTimer) clearTimeout(staleTimer)
    staleTimer = setTimeout(() => {
      if (socket) socket.close()
    }, staleAfterMs)
  }

  function _startTimers() {
    _stopTimers()
    pingTimer = setInterval(() => {
      if (state.value === 'open' && socket)
        socket.send(JSON.stringify({ op: 'ping' }))
    }, pingIntervalMs)
    _armStale()
  }

  function connect() {
    if (state.value === 'connecting' || state.value === 'open') return
    userClosed = false
    state.value = 'connecting'
    const s = wsFactory(url)
    socket = s
    s.onopen = () => {
      backoffAttempt = 0
      state.value = 'open'
      _startTimers()
      // Replay every active PUBLIC channel sub (handles reconnect — runbook §6).
      // Private channels wait for `loggedIn` so their auth context is fresh.
      for (const ch of subscribedChannels) {
        if (!isPrivate(ch as WsChannel)) {
          socket?.send(JSON.stringify({ op: 'subscribe', channel: ch }))
        }
      }
      // Re-login if we have a token — `loggedIn` handler will then replay private subs.
      if (pendingToken) {
        socket?.send(
          JSON.stringify({ op: 'login', args: { token: pendingToken } }),
        )
        authStatus.value = 'authenticating'
      }
      _flush()
    }
    s.onclose = () => {
      _stopTimers()
      socket = null
      if (userClosed) {
        state.value = 'closed'
        return
      }
      _scheduleReconnect()
    }
    s.onerror = () => {}
    s.onmessage = (e: MessageEvent) => {
      _handleMessage(typeof e.data === 'string' ? e.data : '')
    }
  }

  function disconnect() {
    userClosed = true
    pendingToken = null
    authStatus.value = 'unauthenticated'
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    _stopTimers()
    if (!socket) {
      if (state.value !== 'idle') state.value = 'closed'
      return
    }
    state.value = 'closing'
    const s = socket
    // Detach handlers BEFORE close to defuse the async-close race
    // (see runbook §5 — old socket onmessage could otherwise fire after
    // disconnect and mutate state we no longer own).
    s.onopen = null
    s.onclose = null
    s.onmessage = null
    s.onerror = null
    socket = null
    state.value = 'closed'
    s.close()
  }

  const handlers = new Map<string, Set<(data: unknown[]) => void>>()
  const subscribedChannels = new Set<string>()
  const outboundQueue: WsOutboundFrame[] = []

  function _send(frame: WsOutboundFrame) {
    if (state.value === 'open' && socket) {
      socket.send(JSON.stringify(frame))
    } else {
      outboundQueue.push(frame)
    }
  }

  function _flush() {
    while (outboundQueue.length && state.value === 'open' && socket) {
      socket.send(JSON.stringify(outboundQueue.shift()!))
    }
  }

  function _handleMessage(raw: string) {
    _armStale()
    let frame: WsInboundFrame
    try {
      frame = JSON.parse(raw) as WsInboundFrame
    } catch {
      return
    }
    if (frame.type === 'loggedIn') {
      authStatus.value = 'authenticated'
      for (const ch of subscribedChannels) {
        if (isPrivate(ch as WsChannel)) {
          _send({ op: 'subscribe', channel: ch as WsChannel })
        }
      }
      return
    }
    if (frame.type === 'loggedOut') {
      authStatus.value = 'unauthenticated'
      return
    }
    if (frame.type === 'error') {
      const msg = String(frame.message ?? '').toLowerCase()
      if (msg.includes('unauthorized') || msg.includes('invalid token')) {
        pendingToken = null
        authStatus.value = 'unauthenticated'
        if (onUnauthorized) onUnauthorized()
      }
      return
    }
    // Route by channel — frame.type is always 'update' for data frames.
    // (See runbook §5 — earlier attempt routed by frame.type and broke fan-out.)
    if (!frame.channel) return
    const set = handlers.get(frame.channel)
    if (!set || set.size === 0) return
    const rows = Array.isArray(frame.data) ? frame.data : [frame.data]
    for (const h of set) h(rows)
  }

  function subscribe<T>(channel: WsChannel, handler: WsFrameHandler<T[]>) {
    let set = handlers.get(channel)
    if (!set) {
      set = new Set()
      handlers.set(channel, set)
    }
    const wrapped = (rows: unknown[]) => handler(rows as T[])
    set.add(wrapped)
    if (!subscribedChannels.has(channel)) {
      subscribedChannels.add(channel)
      if (!isPrivate(channel) || authStatus.value === 'authenticated') {
        _send({ op: 'subscribe', channel })
      }
      // private + not-yet-authenticated → wait for loggedIn handler below
    }
    return () => {
      set!.delete(wrapped)
      if (set!.size === 0) {
        subscribedChannels.delete(channel)
        if (!isPrivate(channel) || authStatus.value === 'authenticated') {
          _send({ op: 'unsubscribe', channel })
        }
      }
    }
  }

  return { state, authStatus, connect, disconnect, subscribe, login, logout, setOnUnauthorized }
}

export const perpsWs: PerpsWs = createPerpsWs()
