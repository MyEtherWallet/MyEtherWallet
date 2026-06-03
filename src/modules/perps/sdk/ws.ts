import { ref, type Ref } from 'vue'
import { perpsWsUrl } from '../configs'
import type {
  AuthStatus,
  ChannelName,
  ClientFrame,
  ConnectionStatus,
  PrivateChannelName,
  ServerFrame,
} from './wsTypes'

type AnyHandler = (data: any) => void

interface SubscribeParams {
  market?: string
  markets?: string[]
}

const status: Ref<ConnectionStatus> = ref('idle')
const authStatus: Ref<AuthStatus> = ref('anonymous')
let pendingToken: string | null = null
let socket: WebSocket | null = null
let manualDisconnect = false

// Outbound frames buffered while the socket is not yet open.
const outboundQueue: ClientFrame[] = []
// Subscription registry: stores handler + params so frames can be replayed on reconnect.
interface ActiveSub { handler: AnyHandler; params: SubscribeParams }
const subscriptions = new Map<ChannelName, ActiveSub[]>()

const PRIVATE_CHANNELS: ReadonlySet<PrivateChannelName> = new Set([
  'ordersPerps',
  'fillsPerps',
  'positionsPerps',
  'balancePerps',
  'deposits',
  'withdrawals',
])

function isPrivate(channel: ChannelName): boolean {
  return PRIVATE_CHANNELS.has(channel as PrivateChannelName)
}

const privateOutboundQueue: ClientFrame[] = []

function flushPrivateOutbound() {
  if (authStatus.value !== 'authenticated') return
  if (!socket || socket.readyState !== WebSocket.OPEN) return
  while (privateOutboundQueue.length) {
    socket.send(JSON.stringify(privateOutboundQueue.shift()!))
  }
}

const PING_INTERVAL_MS = 30_000
const STALE_TIMEOUT_MS = 60_000
let pingTimer: ReturnType<typeof setInterval> | null = null
let staleTimer: ReturnType<typeof setTimeout> | null = null

function resetStaleTimer() {
  if (staleTimer) clearTimeout(staleTimer)
  staleTimer = setTimeout(() => {
    if (socket) {
      try { socket.close() } catch { /* ignore */ }
    }
  }, STALE_TIMEOUT_MS)
}

function startHeartbeat() {
  stopHeartbeat()
  pingTimer = setInterval(() => {
    sendOrQueue({ op: 'ping' })
  }, PING_INTERVAL_MS)
  resetStaleTimer()
}

function stopHeartbeat() {
  if (pingTimer) { clearInterval(pingTimer); pingTimer = null }
  if (staleTimer) { clearTimeout(staleTimer); staleTimer = null }
}

function sendOrQueue(frame: ClientFrame) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(frame))
  } else {
    outboundQueue.push(frame)
  }
}

function flushOutbound() {
  if (!socket || socket.readyState !== WebSocket.OPEN) return
  while (outboundQueue.length) {
    socket.send(JSON.stringify(outboundQueue.shift()!))
  }
}

function handleMessage(ev: MessageEvent) {
  resetStaleTimer()
  let frame: ServerFrame
  try { frame = JSON.parse(ev.data as string) as ServerFrame } catch { return }
  if (frame.type === 'loggedIn') {
    authStatus.value = 'authenticated'
    flushPrivateOutbound()
    return
  }
  if (frame.type === 'loggedOut') {
    authStatus.value = 'anonymous'
    return
  }
  const list = subscriptions.get(frame.type as ChannelName)
  if (!list) return
  if ('data' in frame) {
    const payload = (frame as { data: unknown }).data
    list.forEach(({ handler }) => handler(payload))
  }
}

const BACKOFF_MAX_MS = 30_000
let reconnectAttempt = 0
let reconnectTimer: ReturnType<typeof setTimeout> | null = null

function scheduleReconnect() {
  const base = Math.min(1000 * 2 ** reconnectAttempt, BACKOFF_MAX_MS)
  const jitter = base * 0.2 * (Math.random() * 2 - 1)
  const delay = Math.max(0, base + jitter)
  reconnectAttempt += 1
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    // Don't call open() — it short-circuits when status is 'reconnecting'.
    // Re-enter the open path explicitly.
    status.value = 'idle'
    open()
  }, delay)
}

function replaySubscriptions() {
  subscriptions.forEach((list, channel) => {
    list.forEach(({ params }) => {
      const frame: ClientFrame = { op: 'subscribe', channel, ...params }
      if (isPrivate(channel)) {
        privateOutboundQueue.push(frame)
      } else {
        sendOrQueue(frame)
      }
    })
  })
}

function open() {
  if (status.value === 'connecting' || status.value === 'open') return
  // Cancel any pending reconnect — we're connecting now.
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null }
  manualDisconnect = false
  status.value = 'connecting'
  socket = new WebSocket(perpsWsUrl)
  socket.onopen = () => {
    status.value = 'open'
    reconnectAttempt = 0
    startHeartbeat()
    flushOutbound()
    replaySubscriptions()
    if (pendingToken) {
      authStatus.value = 'authenticating'
      sendOrQueue({ op: 'login', args: { token: pendingToken } })
    }
  }
  socket.onclose = () => {
    stopHeartbeat()
    socket = null
    if (manualDisconnect) {
      status.value = 'closed'
    } else {
      if (authStatus.value === 'authenticated') authStatus.value = 'authenticating'
      status.value = 'reconnecting'
      scheduleReconnect()
    }
  }
  socket.onerror = () => {}
  socket.onmessage = handleMessage
}

function close() {
  manualDisconnect = true
  outboundQueue.length = 0
  privateOutboundQueue.length = 0
  // Keep subscriptions registered so they replay when the user re-enters /perps.
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null }
  reconnectAttempt = 0
  stopHeartbeat()
  if (socket) {
    // Detach handlers so the async onclose can't flip state back after a fast
    // re-connect (real-browser WebSocket.close() is async; without this, a
    // subsequent connect() short-circuits on status==='open').
    const s = socket
    socket = null
    s.onopen = null
    s.onclose = null
    s.onerror = null
    s.onmessage = null
    try { s.close() } catch { /* ignore */ }
  }
  status.value = 'closed'
}

function subscribe(
  channel: ChannelName,
  params: SubscribeParams,
  handler: AnyHandler,
): () => void {
  let list = subscriptions.get(channel)
  if (!list) { list = []; subscriptions.set(channel, list) }
  list.push({ handler, params })

  const frame: ClientFrame = { op: 'subscribe', channel, ...params }
  if (isPrivate(channel) && authStatus.value !== 'authenticated') {
    privateOutboundQueue.push(frame)
  } else {
    sendOrQueue(frame)
  }

  return () => {
    const cur = subscriptions.get(channel)
    if (cur) {
      const idx = cur.findIndex(s => s.handler === handler)
      if (idx >= 0) cur.splice(idx, 1)
      if (cur.length === 0) subscriptions.delete(channel)
    }
    if (isPrivate(channel) && authStatus.value !== 'authenticated') {
      // No point sending unsubscribe for a sub we never sent — just drop the queued subscribe.
      const i = privateOutboundQueue.findIndex(
        f => f.op === 'subscribe' && (f as { channel?: string }).channel === channel,
      )
      if (i >= 0) privateOutboundQueue.splice(i, 1)
    } else {
      sendOrQueue({ op: 'unsubscribe', channel, ...params })
    }
  }
}

function login(token: string) {
  pendingToken = token
  authStatus.value = 'authenticating'
  sendOrQueue({ op: 'login', args: { token } })
}

function logout() {
  pendingToken = null
  authStatus.value = 'anonymous'
  privateOutboundQueue.length = 0
  sendOrQueue({ op: 'logout' })
}

export const perpsWs = {
  status,
  authStatus,
  connect: open,
  disconnect: close,
  subscribe,
  login,
  logout,
}
