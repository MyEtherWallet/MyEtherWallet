import { ref, type Ref } from 'vue'
import type {
  WsChannel,
  WsConnectionState,
  WsFrameHandler,
  WsInboundFrame,
  WsOutboundFrame,
} from './wsTypes'
import { perpsWsUrl } from '../configs'

export interface PerpsWsOptions {
  url?: string
  wsFactory?: (url: string) => WebSocket
  pingIntervalMs?: number
  staleAfterMs?: number
}

export interface PerpsWs {
  state: Ref<WsConnectionState>
  connect: () => void
  disconnect: () => void
  subscribe: <T = unknown>(
    channel: WsChannel,
    handler: WsFrameHandler<T[]>,
  ) => () => void
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
    state.value = 'connecting'
    const s = wsFactory(url)
    socket = s
    s.onopen = () => {
      state.value = 'open'
      _startTimers()
      // Replay every active channel sub (handles reconnect — runbook §6).
      for (const ch of subscribedChannels) {
        socket?.send(JSON.stringify({ op: 'subscribe', channel: ch }))
      }
      _flush()
    }
    s.onclose = () => {
      _stopTimers()
      state.value = 'closed'
      socket = null
    }
    s.onerror = () => {}
    s.onmessage = (e: MessageEvent) => {
      _handleMessage(typeof e.data === 'string' ? e.data : '')
    }
  }

  function disconnect() {
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
      _send({ op: 'subscribe', channel })
    }
    return () => {
      set!.delete(wrapped)
      if (set!.size === 0) {
        subscribedChannels.delete(channel)
        _send({ op: 'unsubscribe', channel })
      }
    }
  }

  return { state, connect, disconnect, subscribe }
}

export const perpsWs: PerpsWs = createPerpsWs()
