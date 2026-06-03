import { ref, type Ref } from 'vue'
import { perpsWsUrl } from '../configs'
import type {
  ChannelName,
  ClientFrame,
  ConnectionStatus,
  ServerFrame,
  SubscribeFrame,
  UnsubscribeFrame,
} from './wsTypes'

type AnyHandler = (data: any) => void

interface SubscribeParams {
  market?: string
  markets?: string[]
}

const status: Ref<ConnectionStatus> = ref('idle')
let socket: WebSocket | null = null
let manualDisconnect = false

// Outbound frames buffered while the socket is not yet open.
const outboundQueue: ClientFrame[] = []
// Registered handlers per channel. Multiple handlers per channel are allowed.
const handlers = new Map<ChannelName, Set<AnyHandler>>()

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
  let frame: ServerFrame
  try { frame = JSON.parse(ev.data as string) as ServerFrame } catch { return }
  const set = handlers.get(frame.type as ChannelName)
  if (!set) return
  // For data-carrying frames pass `.data`; control frames are ignored above.
  if ('data' in frame) set.forEach(h => h((frame as { data: unknown }).data))
}

function open() {
  if (status.value === 'connecting' || status.value === 'open') return
  manualDisconnect = false
  status.value = 'connecting'
  socket = new WebSocket(perpsWsUrl)
  socket.onopen = () => {
    status.value = 'open'
    flushOutbound()
  }
  socket.onclose = () => {
    socket = null
    status.value = manualDisconnect ? 'closed' : 'reconnecting'
  }
  socket.onerror = () => {}
  socket.onmessage = handleMessage
}

function close() {
  manualDisconnect = true
  outboundQueue.length = 0
  if (socket) {
    try { socket.close() } catch { /* ignore */ }
  } else {
    status.value = 'closed'
  }
}

function subscribe(
  channel: ChannelName,
  params: SubscribeParams,
  handler: AnyHandler,
): () => void {
  let set = handlers.get(channel)
  if (!set) {
    set = new Set()
    handlers.set(channel, set)
  }
  set.add(handler)
  const frame: SubscribeFrame = { op: 'subscribe', channel, ...params }
  sendOrQueue(frame)
  return () => {
    const s = handlers.get(channel)
    if (s) {
      s.delete(handler)
      if (s.size === 0) handlers.delete(channel)
    }
    const off: UnsubscribeFrame = { op: 'unsubscribe', channel, ...params }
    sendOrQueue(off)
  }
}

export const perpsWs = {
  status,
  connect: open,
  disconnect: close,
  subscribe,
}
