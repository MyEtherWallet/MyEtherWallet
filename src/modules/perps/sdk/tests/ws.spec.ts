import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPerpsWs, type PerpsWs } from '../ws'

class FakeSocket {
  static instances: FakeSocket[] = []
  readyState = 0 // CONNECTING
  sent: string[] = []
  onopen: ((e: Event) => void) | null = null
  onclose: ((e: CloseEvent) => void) | null = null
  onmessage: ((e: MessageEvent) => void) | null = null
  onerror: ((e: Event) => void) | null = null
  constructor(public url: string) {
    FakeSocket.instances.push(this)
  }
  send(s: string) { this.sent.push(s) }
  close() {
    this.readyState = 3 // CLOSED
    this.onclose?.({ code: 1000, reason: '', wasClean: true } as CloseEvent)
  }
  open() {
    this.readyState = 1 // OPEN
    this.onopen?.(new Event('open'))
  }
}

describe('perpsWs — connect / disconnect', () => {
  let ws: PerpsWs
  beforeEach(() => {
    FakeSocket.instances = []
    ws = createPerpsWs({
      url: 'wss://test',
      wsFactory: (u) => new FakeSocket(u) as unknown as WebSocket,
    })
  })

  it('starts in idle state', () => {
    expect(ws.state.value).toBe('idle')
  })

  it('connect() opens a socket and transitions idle → connecting → open', async () => {
    ws.connect()
    expect(ws.state.value).toBe('connecting')
    expect(FakeSocket.instances).toHaveLength(1)
    FakeSocket.instances[0].open()
    expect(ws.state.value).toBe('open')
  })

  it('connect() is idempotent — calling twice while connecting reuses the socket', () => {
    ws.connect()
    ws.connect()
    expect(FakeSocket.instances).toHaveLength(1)
  })

  it('disconnect() closes the socket and goes to closed', () => {
    ws.connect()
    FakeSocket.instances[0].open()
    ws.disconnect()
    expect(ws.state.value).toBe('closed')
    expect(FakeSocket.instances[0].readyState).toBe(3)
  })

  it('disconnect() when idle is a no-op', () => {
    expect(() => ws.disconnect()).not.toThrow()
    expect(ws.state.value).toBe('idle')
  })

  it('detaches handlers before close() — late onmessage from old socket is ignored', () => {
    ws.connect()
    const s = FakeSocket.instances[0]
    s.open()
    const calls: unknown[] = []
    ws.subscribe('markPricesPerps', (d) => calls.push(d))
    ws.disconnect()
    // Old socket fires a late message AFTER disconnect — must be no-op
    s.onmessage?.({
      data: JSON.stringify({
        type: 'update',
        channel: 'markPricesPerps',
        data: [{ market: 'X' }],
      }),
    } as MessageEvent)
    expect(calls).toEqual([])
  })
})

describe('perpsWs — subscribe / routing', () => {
  let ws: PerpsWs
  beforeEach(() => {
    FakeSocket.instances = []
    ws = createPerpsWs({
      url: 'wss://test',
      wsFactory: (u) => new FakeSocket(u) as unknown as WebSocket,
    })
  })

  it('subscribe() sends a subscribe frame after socket opens', () => {
    ws.connect()
    ws.subscribe('markPricesPerps', () => {})
    expect(FakeSocket.instances[0].sent).toHaveLength(0) // not yet open
    FakeSocket.instances[0].open()
    expect(FakeSocket.instances[0].sent).toContainEqual(
      JSON.stringify({ op: 'subscribe', channel: 'markPricesPerps' }),
    )
  })

  it('routes by frame.channel, not frame.type — handler receives array always', () => {
    ws.connect()
    FakeSocket.instances[0].open()
    const calls: unknown[][] = []
    ws.subscribe('markPricesPerps', (rows) => calls.push(rows as unknown[]))
    FakeSocket.instances[0].onmessage?.({
      data: JSON.stringify({
        type: 'update',
        channel: 'markPricesPerps',
        data: [{ market: 'AAPL-PERP', markPrice: '100' }],
      }),
    } as MessageEvent)
    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual([{ market: 'AAPL-PERP', markPrice: '100' }])
  })

  it('unwraps single-object payloads (balancePerps) to a 1-length array', () => {
    ws.connect()
    FakeSocket.instances[0].open()
    const calls: unknown[][] = []
    ws.subscribe('balancePerps', (rows) => calls.push(rows as unknown[]))
    FakeSocket.instances[0].onmessage?.({
      data: JSON.stringify({
        type: 'update',
        channel: 'balancePerps',
        data: { equity: '1000' },
      }),
    } as MessageEvent)
    expect(calls[0]).toEqual([{ equity: '1000' }])
  })

  it('unsubscribe() removes handler and sends unsubscribe when last handler leaves', () => {
    ws.connect()
    FakeSocket.instances[0].open()
    const unsub = ws.subscribe('markPricesPerps', () => {})
    FakeSocket.instances[0].sent.length = 0
    unsub()
    expect(FakeSocket.instances[0].sent).toContainEqual(
      JSON.stringify({ op: 'unsubscribe', channel: 'markPricesPerps' }),
    )
  })

  it('multiple subscribers to same channel only send one subscribe frame', () => {
    ws.connect()
    FakeSocket.instances[0].open()
    ws.subscribe('markPricesPerps', () => {})
    ws.subscribe('markPricesPerps', () => {})
    const subs = FakeSocket.instances[0].sent.filter((s) =>
      s.includes('"op":"subscribe"'),
    )
    expect(subs).toHaveLength(1)
  })
})

describe('perpsWs — heartbeat', () => {
  let ws: PerpsWs
  beforeEach(() => {
    vi.useFakeTimers()
    FakeSocket.instances = []
    ws = createPerpsWs({
      url: 'wss://test',
      wsFactory: (u) => new FakeSocket(u) as unknown as WebSocket,
      pingIntervalMs: 30_000,
      staleAfterMs: 60_000,
    })
  })
  afterEach(() => vi.useRealTimers())

  it('sends a ping every 30s once open', () => {
    ws.connect()
    FakeSocket.instances[0].open()
    FakeSocket.instances[0].sent.length = 0
    vi.advanceTimersByTime(30_000)
    expect(FakeSocket.instances[0].sent).toContainEqual(
      JSON.stringify({ op: 'ping' }),
    )
  })

  it('closes the socket after 60s of inbound silence', () => {
    ws.connect()
    FakeSocket.instances[0].open()
    vi.advanceTimersByTime(60_001)
    expect(FakeSocket.instances[0].readyState).toBe(3)
  })

  it('any inbound frame (incl. pong) resets the stale timer', () => {
    ws.connect()
    FakeSocket.instances[0].open()
    vi.advanceTimersByTime(50_000)
    FakeSocket.instances[0].onmessage?.({
      data: JSON.stringify({ type: 'pong' }),
    } as MessageEvent)
    vi.advanceTimersByTime(50_000) // total 100s, but reset at 50s
    expect(FakeSocket.instances[0].readyState).toBe(1) // still open
  })
})

describe('perpsWs — reconnect', () => {
  let ws: PerpsWs
  beforeEach(() => {
    vi.useFakeTimers()
    FakeSocket.instances = []
    ws = createPerpsWs({
      url: 'wss://test',
      wsFactory: (u) => new FakeSocket(u) as unknown as WebSocket,
      // Disable jitter for deterministic backoff in tests
      backoffJitter: 0,
      backoffBaseMs: 1000,
      backoffMaxMs: 30000,
    })
  })
  afterEach(() => vi.useRealTimers())

  it('on unexpected close, schedules reconnect with exponential backoff', () => {
    ws.connect()
    FakeSocket.instances[0].open()
    FakeSocket.instances[0].onclose?.({
      code: 1006,
      reason: '',
      wasClean: false,
    } as CloseEvent)
    expect(ws.state.value).toBe('reconnecting')

    vi.advanceTimersByTime(1000)
    expect(FakeSocket.instances).toHaveLength(2)
  })

  it('replays subscribed channels after reconnect', () => {
    ws.connect()
    FakeSocket.instances[0].open()
    ws.subscribe('markPricesPerps', () => {})
    FakeSocket.instances[0].onclose?.({
      code: 1006,
      wasClean: false,
    } as CloseEvent)
    vi.advanceTimersByTime(1000)
    FakeSocket.instances[1].open()
    expect(FakeSocket.instances[1].sent).toContainEqual(
      JSON.stringify({ op: 'subscribe', channel: 'markPricesPerps' }),
    )
  })

  it('explicit disconnect() does NOT trigger reconnect', () => {
    ws.connect()
    FakeSocket.instances[0].open()
    ws.disconnect()
    vi.advanceTimersByTime(60_000)
    expect(FakeSocket.instances).toHaveLength(1)
  })

  it('reconnect attempt resets backoff after a successful open', () => {
    ws.connect()
    FakeSocket.instances[0].open()
    // close, reconnect attempt #1 at 1s
    FakeSocket.instances[0].onclose?.({ wasClean: false } as CloseEvent)
    vi.advanceTimersByTime(1000)
    FakeSocket.instances[1].open()
    // close again — should backoff from 1s again, NOT 2s
    FakeSocket.instances[1].onclose?.({ wasClean: false } as CloseEvent)
    vi.advanceTimersByTime(1000)
    expect(FakeSocket.instances).toHaveLength(3)
  })
})

describe('perpsWs — auth', () => {
  let ws: PerpsWs
  beforeEach(() => {
    FakeSocket.instances = []
    ws = createPerpsWs({
      url: 'wss://test',
      wsFactory: (u) => new FakeSocket(u) as unknown as WebSocket,
    })
  })

  it('starts as unauthenticated', () => {
    expect(ws.authStatus.value).toBe('unauthenticated')
  })

  it('login(token) sends a login frame and flips to authenticating', () => {
    ws.connect()
    FakeSocket.instances[0].open()
    FakeSocket.instances[0].sent.length = 0
    ws.login('tok-1')
    expect(ws.authStatus.value).toBe('authenticating')
    expect(FakeSocket.instances[0].sent).toContainEqual(
      JSON.stringify({ op: 'login', args: { token: 'tok-1' } }),
    )
  })

  it('loggedIn inbound frame flips authStatus to authenticated', () => {
    ws.connect()
    FakeSocket.instances[0].open()
    ws.login('tok-1')
    FakeSocket.instances[0].onmessage?.({
      data: JSON.stringify({ type: 'loggedIn' }),
    } as MessageEvent)
    expect(ws.authStatus.value).toBe('authenticated')
  })

  it('logout() sends a logout frame and clears authStatus', () => {
    ws.connect()
    FakeSocket.instances[0].open()
    ws.login('tok-1')
    FakeSocket.instances[0].onmessage?.({
      data: JSON.stringify({ type: 'loggedIn' }),
    } as MessageEvent)
    FakeSocket.instances[0].sent.length = 0
    ws.logout()
    expect(FakeSocket.instances[0].sent).toContainEqual(
      JSON.stringify({ op: 'logout' }),
    )
    expect(ws.authStatus.value).toBe('unauthenticated')
  })

  it('subscribing to a private channel defers the subscribe until loggedIn', () => {
    ws.connect()
    FakeSocket.instances[0].open()
    ws.subscribe('positionsPerps', () => {})
    // Before login, no subscribe frame sent for private channel
    const subs1 = FakeSocket.instances[0].sent.filter(
      (s) => s.includes('"channel":"positionsPerps"') && s.includes('subscribe'),
    )
    expect(subs1).toHaveLength(0)

    ws.login('tok')
    FakeSocket.instances[0].onmessage?.({
      data: JSON.stringify({ type: 'loggedIn' }),
    } as MessageEvent)

    const subs2 = FakeSocket.instances[0].sent.filter(
      (s) => s.includes('"channel":"positionsPerps"') && s.includes('subscribe'),
    )
    expect(subs2).toHaveLength(1)
  })

  it('public channels subscribe immediately regardless of auth', () => {
    ws.connect()
    FakeSocket.instances[0].open()
    ws.subscribe('markPricesPerps', () => {})
    expect(FakeSocket.instances[0].sent).toContainEqual(
      JSON.stringify({ op: 'subscribe', channel: 'markPricesPerps' }),
    )
  })
})
