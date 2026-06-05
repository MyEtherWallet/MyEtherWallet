import { beforeEach, describe, expect, it, vi } from 'vitest'
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
})
