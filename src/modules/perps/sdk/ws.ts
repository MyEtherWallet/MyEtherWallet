import { ref, type Ref } from 'vue'
import { perpsWsUrl } from '../configs'
import type { ConnectionStatus } from './wsTypes'

const status: Ref<ConnectionStatus> = ref('idle')
let socket: WebSocket | null = null
let manualDisconnect = false

function open() {
  if (status.value === 'connecting' || status.value === 'open') return
  manualDisconnect = false
  status.value = 'connecting'
  socket = new WebSocket(perpsWsUrl)
  socket.onopen = () => {
    status.value = 'open'
  }
  socket.onclose = () => {
    socket = null
    status.value = manualDisconnect ? 'closed' : 'reconnecting'
  }
  socket.onerror = () => {
    // closure path handles state transition
  }
  socket.onmessage = () => {
    // routing added in later tasks
  }
}

function close() {
  manualDisconnect = true
  if (socket) {
    try { socket.close() } catch { /* ignore */ }
  } else {
    status.value = 'closed'
  }
}

export const perpsWs = {
  status,
  connect: open,
  disconnect: close,
}
