import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const WALLET_URL = 'https://auth.privy.io/apps/app-1/embedded-wallets'

const fake = vi.hoisted(() => ({
  setMessagePoster: vi.fn(),
  onMessage: vi.fn(),
}))

vi.mock('@/providers/privy/client', () => ({
  privy: {
    setMessagePoster: fake.setMessagePoster,
    embeddedWallet: {
      getURL: () => 'https://auth.privy.io/apps/app-1/embedded-wallets',
      onMessage: fake.onMessage,
    },
  },
}))

import {
  mountWalletIframe,
  teardownWalletIframe,
} from '@/providers/privy/walletIframe'

type Poster = {
  postMessage: (message: unknown, targetOrigin: string) => void
  reload: () => void
}

const frame = () => document.querySelector('iframe') as HTMLIFrameElement
const poster = () => fake.setMessagePoster.mock.calls[0][0] as Poster
const messageFrom = (
  source: Window | null,
  origin: string,
  data: unknown,
): void => {
  window.dispatchEvent(new MessageEvent('message', { data, origin, source }))
}

describe('walletIframe', () => {
  beforeEach(() => {
    fake.setMessagePoster.mockClear()
    fake.onMessage.mockClear()
  })

  afterEach(() => {
    teardownWalletIframe()
  })

  it('mounts one hidden iframe pointing at the Privy wallet URL', () => {
    mountWalletIframe()
    mountWalletIframe()

    expect(document.querySelectorAll('iframe')).toHaveLength(1)
    expect(frame().src).toBe(WALLET_URL)
    expect(frame().style.display).toBe('none')
  })

  it('gives the SDK a poster that posts into the iframe', () => {
    mountWalletIframe()
    const post = vi
      .spyOn(frame().contentWindow as Window, 'postMessage')
      .mockImplementation(() => undefined)

    poster().postMessage(
      { event: 'privy:iframe:ready' },
      'https://auth.privy.io',
    )

    expect(post).toHaveBeenCalledWith(
      { event: 'privy:iframe:ready' },
      'https://auth.privy.io',
      undefined,
    )
  })

  it('addresses what it posts to the Privy origin, whatever target the SDK names', () => {
    mountWalletIframe()
    const post = vi
      .spyOn(frame().contentWindow as Window, 'postMessage')
      .mockImplementation(() => undefined)

    poster().postMessage({ event: 'privy:wallet:rpc' }, '*')

    expect(post).toHaveBeenCalledWith(
      { event: 'privy:wallet:rpc' },
      'https://auth.privy.io',
      undefined,
    )
  })

  it('ignores an iframe message that is not valid JSON', () => {
    mountWalletIframe()

    expect(() =>
      messageFrom(frame().contentWindow, 'https://auth.privy.io', '{not json'),
    ).not.toThrow()
    expect(fake.onMessage).not.toHaveBeenCalled()
  })

  it('reloads the iframe by pointing it at the wallet URL again', () => {
    mountWalletIframe()
    frame().src = 'about:blank'

    poster().reload()

    expect(frame().src).toBe(WALLET_URL)
  })

  it('forwards iframe messages to the SDK, parsing string payloads', () => {
    mountWalletIframe()

    messageFrom(
      frame().contentWindow,
      'https://auth.privy.io',
      JSON.stringify({ event: 'privy:iframe:ready', id: '1' }),
    )
    messageFrom(frame().contentWindow, 'https://auth.privy.io', {
      event: 'privy:wallet:create',
    })

    expect(fake.onMessage.mock.calls).toEqual([
      [{ event: 'privy:iframe:ready', id: '1' }],
      [{ event: 'privy:wallet:create' }],
    ])
  })

  it('ignores messages from another window', () => {
    mountWalletIframe()

    messageFrom(window, 'https://auth.privy.io', { event: 'x' })

    expect(fake.onMessage).not.toHaveBeenCalled()
  })

  it('ignores messages from another origin', () => {
    mountWalletIframe()

    messageFrom(frame().contentWindow, 'https://evil.example', { event: 'x' })

    expect(fake.onMessage).not.toHaveBeenCalled()
  })

  it('removes the iframe and stops forwarding on teardown', () => {
    mountWalletIframe()
    const source = frame().contentWindow

    teardownWalletIframe()
    messageFrom(source, 'https://auth.privy.io', { event: 'x' })

    expect(document.querySelector('iframe')).toBeNull()
    expect(fake.onMessage).not.toHaveBeenCalled()
  })
})
