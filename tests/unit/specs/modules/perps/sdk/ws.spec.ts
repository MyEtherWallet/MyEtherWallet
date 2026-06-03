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
