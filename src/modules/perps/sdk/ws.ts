import { ref, type Ref } from 'vue'
import type {
  WsConnectionState,
  WsOutboundFrame,
} from './wsTypes'
import { perpsWsUrl } from '../configs'

export interface PerpsWsOptions {
  url?: string
  wsFactory?: (url: string) => WebSocket
}

export interface PerpsWs {
  state: Ref<WsConnectionState>
  connect: () => void
  disconnect: () => void
}

export function createPerpsWs(opts: PerpsWsOptions = {}): PerpsWs {
  const url = opts.url ?? perpsWsUrl
  const wsFactory = opts.wsFactory ?? ((u) => new WebSocket(u))
  const state = ref<WsConnectionState>('idle')
  let socket: WebSocket | null = null

  function connect() {
    if (state.value === 'connecting' || state.value === 'open') return
    state.value = 'connecting'
    const s = wsFactory(url)
    socket = s
    s.onopen = () => { state.value = 'open' }
    s.onclose = () => {
      state.value = 'closed'
      socket = null
    }
    s.onerror = () => {}
    s.onmessage = () => {}
  }

  function disconnect() {
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

  // Singleton-friendly outbound queue placeholder — used by 1.4+
  function _send(_frame: WsOutboundFrame) { /* impl in 1.4 */ }
  void _send

  return { state, connect, disconnect }
}

export const perpsWs: PerpsWs = createPerpsWs()
