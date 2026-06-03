import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

class MockWebSocket {
  static OPEN = 1
  static CLOSED = 3
  static instances: MockWebSocket[] = []
  url: string
  readyState = 0
  sent: string[] = []
  onopen: ((this: WebSocket, ev: Event) => void) | null = null
  onclose: ((this: WebSocket, ev: CloseEvent) => void) | null = null
  onmessage: ((this: WebSocket, ev: MessageEvent) => void) | null = null
  onerror: ((this: WebSocket, ev: Event) => void) | null = null
  constructor(url: string) {
    this.url = url
    MockWebSocket.instances.push(this)
  }
  send(data: string) { this.sent.push(data) }
  close() {
    this.readyState = MockWebSocket.CLOSED
    this.onclose?.call(this as unknown as WebSocket, { code: 1000, reason: 'normal' } as CloseEvent)
  }
  // Test helpers
  _open() {
    this.readyState = MockWebSocket.OPEN
    this.onopen?.call(this as unknown as WebSocket, new Event('open'))
  }
  _message(payload: unknown) {
    this.onmessage?.call(this as unknown as WebSocket, { data: JSON.stringify(payload) } as MessageEvent)
  }
}

describe('perpsWs — connect/disconnect', () => {
  beforeEach(() => {
    MockWebSocket.instances = []
    vi.stubGlobal('WebSocket', MockWebSocket as unknown as typeof WebSocket)
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts in idle and opens a socket on connect()', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    expect(perpsWs.status.value).toBe('idle')
    perpsWs.connect()
    expect(perpsWs.status.value).toBe('connecting')
    expect(MockWebSocket.instances).toHaveLength(1)
  })

  it('transitions to open on socket open', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    perpsWs.connect()
    MockWebSocket.instances[0]._open()
    expect(perpsWs.status.value).toBe('open')
  })

  it('transitions to closed on disconnect() and does not auto-reconnect', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    perpsWs.connect()
    MockWebSocket.instances[0]._open()
    perpsWs.disconnect()
    expect(perpsWs.status.value).toBe('closed')
    expect(MockWebSocket.instances).toHaveLength(1)
  })

  it('connect() is a no-op when already connecting or open', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    perpsWs.connect()
    perpsWs.connect()
    expect(MockWebSocket.instances).toHaveLength(1)
  })
})

describe('perpsWs — subscribe/unsubscribe', () => {
  beforeEach(() => {
    MockWebSocket.instances = []
    vi.stubGlobal('WebSocket', MockWebSocket as unknown as typeof WebSocket)
    vi.resetModules()
  })
  afterEach(() => vi.unstubAllGlobals())

  it('queues subscribes before open, flushes on open', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    const handler = vi.fn()
    perpsWs.connect()
    perpsWs.subscribe('topOfBooksPerps', { markets: ['ETH-USD'] }, handler)
    expect(MockWebSocket.instances[0].sent).toEqual([])
    MockWebSocket.instances[0]._open()
    expect(JSON.parse(MockWebSocket.instances[0].sent[0])).toEqual({
      op: 'subscribe', channel: 'topOfBooksPerps', markets: ['ETH-USD'],
    })
  })

  it('routes server events to matching handlers by channel', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    const handler = vi.fn()
    perpsWs.connect()
    MockWebSocket.instances[0]._open()
    perpsWs.subscribe('topOfBooksPerps', { markets: ['ETH-USD'] }, handler)
    MockWebSocket.instances[0]._message({
      type: 'topOfBooksPerps', data: { market: 'ETH-USD', bid: '1', ask: '2' },
    })
    expect(handler).toHaveBeenCalledWith({ market: 'ETH-USD', bid: '1', ask: '2' })
  })

  it('unsubscribe() removes the handler and sends unsubscribe frame', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    const handler = vi.fn()
    perpsWs.connect()
    MockWebSocket.instances[0]._open()
    const off = perpsWs.subscribe('markPricesPerps', { markets: ['ETH-USD'] }, handler)
    off()
    expect(JSON.parse(MockWebSocket.instances[0].sent.at(-1)!)).toEqual({
      op: 'unsubscribe', channel: 'markPricesPerps', markets: ['ETH-USD'],
    })
    MockWebSocket.instances[0]._message({
      type: 'markPricesPerps', data: { market: 'ETH-USD', markPrice: '3' },
    })
    expect(handler).not.toHaveBeenCalled()
  })

  it('ignores frames whose type has no registered handler', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    perpsWs.connect()
    MockWebSocket.instances[0]._open()
    expect(() => {
      MockWebSocket.instances[0]._message({ type: 'tradesPerps', data: { market: 'X' } })
    }).not.toThrow()
  })
})

describe('perpsWs — heartbeat', () => {
  beforeEach(() => {
    MockWebSocket.instances = []
    vi.useFakeTimers()
    vi.stubGlobal('WebSocket', MockWebSocket as unknown as typeof WebSocket)
    vi.resetModules()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('sends a ping every 30s while open', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    perpsWs.connect()
    MockWebSocket.instances[0]._open()
    vi.advanceTimersByTime(30_000)
    const sent = MockWebSocket.instances[0].sent.map(s => JSON.parse(s))
    expect(sent.some(f => f.op === 'ping')).toBe(true)
  })

  it('force-closes the socket if no message received in 60s', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    perpsWs.connect()
    MockWebSocket.instances[0]._open()
    const closeSpy = vi.spyOn(MockWebSocket.instances[0], 'close')
    vi.advanceTimersByTime(60_001)
    expect(closeSpy).toHaveBeenCalled()
  })

  it('resets the staleness timer on any inbound message', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    perpsWs.connect()
    MockWebSocket.instances[0]._open()
    const closeSpy = vi.spyOn(MockWebSocket.instances[0], 'close')
    vi.advanceTimersByTime(50_000)
    MockWebSocket.instances[0]._message({ type: 'pong' })
    vi.advanceTimersByTime(50_000)
    expect(closeSpy).not.toHaveBeenCalled()
  })
})

describe('perpsWs — reconnect', () => {
  beforeEach(() => {
    MockWebSocket.instances = []
    vi.useFakeTimers()
    vi.stubGlobal('WebSocket', MockWebSocket as unknown as typeof WebSocket)
    // Stable jitter for deterministic tests.
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    vi.resetModules()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('reconnects after an unexpected close', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    perpsWs.connect()
    MockWebSocket.instances[0]._open()
    MockWebSocket.instances[0].close() // server-side close (manualDisconnect = false)
    expect(perpsWs.status.value).toBe('reconnecting')
    vi.advanceTimersByTime(2_000) // 1s base + jitter window
    expect(MockWebSocket.instances).toHaveLength(2)
  })

  it('replays subscribe frames on reconnect', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    perpsWs.connect()
    MockWebSocket.instances[0]._open()
    perpsWs.subscribe('topOfBooksPerps', { markets: ['ETH-USD'] }, vi.fn())
    MockWebSocket.instances[0].close()
    vi.advanceTimersByTime(2_000)
    MockWebSocket.instances[1]._open()
    const sent = MockWebSocket.instances[1].sent.map(s => JSON.parse(s))
    expect(sent).toContainEqual({
      op: 'subscribe', channel: 'topOfBooksPerps', markets: ['ETH-USD'],
    })
  })

  it('does not reconnect after manual disconnect()', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    perpsWs.connect()
    MockWebSocket.instances[0]._open()
    perpsWs.disconnect()
    vi.advanceTimersByTime(60_000)
    expect(MockWebSocket.instances).toHaveLength(1)
  })
})

describe('perpsWs — re-entry after disconnect', () => {
  beforeEach(() => {
    MockWebSocket.instances = []
    vi.stubGlobal('WebSocket', MockWebSocket as unknown as typeof WebSocket)
    vi.resetModules()
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('disconnect() transitions status to closed synchronously', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    perpsWs.connect()
    MockWebSocket.instances[0]._open()
    expect(perpsWs.status.value).toBe('open')
    // Detach onclose to simulate the real-browser race where WebSocket.close()
    // is async and onclose has not fired yet by the time the user re-enters.
    MockWebSocket.instances[0].onclose = null
    perpsWs.disconnect()
    expect(perpsWs.status.value).toBe('closed')
  })

  it('replays subscriptions when connect() is called after disconnect()', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    perpsWs.connect()
    MockWebSocket.instances[0]._open()
    perpsWs.subscribe('topOfBooksPerps', { markets: ['ETH-USD'] }, vi.fn())
    perpsWs.disconnect()
    perpsWs.connect()
    expect(MockWebSocket.instances).toHaveLength(2)
    MockWebSocket.instances[1]._open()
    const sent = MockWebSocket.instances[1].sent.map(s => JSON.parse(s))
    expect(sent).toContainEqual({
      op: 'subscribe', channel: 'topOfBooksPerps', markets: ['ETH-USD'],
    })
  })
})

describe('perpsWs — login/logout', () => {
  beforeEach(() => {
    MockWebSocket.instances = []
    vi.stubGlobal('WebSocket', MockWebSocket as unknown as typeof WebSocket)
    vi.resetModules()
  })
  afterEach(() => vi.unstubAllGlobals())

  it('authStatus starts as anonymous', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    expect(perpsWs.authStatus.value).toBe('anonymous')
  })

  it('login() queues the frame before open, sends it on open', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    perpsWs.connect()
    perpsWs.login('tok-1')
    expect(perpsWs.authStatus.value).toBe('authenticating')
    expect(MockWebSocket.instances[0].sent).toEqual([])
    MockWebSocket.instances[0]._open()
    expect(JSON.parse(MockWebSocket.instances[0].sent[0])).toEqual({
      op: 'login', args: { token: 'tok-1' },
    })
  })

  it('authStatus flips to authenticated on {type:"loggedIn"}', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    perpsWs.connect()
    MockWebSocket.instances[0]._open()
    perpsWs.login('tok-1')
    MockWebSocket.instances[0]._message({ type: 'loggedIn' })
    expect(perpsWs.authStatus.value).toBe('authenticated')
  })

  it('logout() sends {op:"logout"} and resets authStatus', async () => {
    const { perpsWs } = await import('@/modules/perps/sdk/ws')
    perpsWs.connect()
    MockWebSocket.instances[0]._open()
    perpsWs.login('tok-1')
    MockWebSocket.instances[0]._message({ type: 'loggedIn' })
    perpsWs.logout()
    expect(JSON.parse(MockWebSocket.instances[0].sent.at(-1)!)).toEqual({ op: 'logout' })
    expect(perpsWs.authStatus.value).toBe('anonymous')
  })
})
