import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'

// What Privy's React SDK tells the page, set by each test. As in the SDK, the
// functions it hands out are new on every render.
const privy = vi.hoisted(() => ({
  ready: true,
  authenticated: false,
  error: null as Error | null,
  login: vi.fn(),
  logout: vi.fn(),
  exportWallet: vi.fn(),
  /** What the page asked to hear about the login modal. */
  onLoginError: undefined as (() => void) | undefined,
}))
vi.mock('@privy-io/react-auth', () => ({
  usePrivy: () => ({
    ready: privy.ready,
    authenticated: privy.authenticated,
    error: privy.error,
    logout: () => privy.logout(),
  }),
  useLogin: (callbacks?: { onError?: () => void }) => {
    privy.onLoginError = callbacks?.onError
    return { login: (options: unknown) => privy.login(options) }
  },
  useExportWallet: () => ({ exportWallet: () => privy.exportWallet() }),
}))

import {
  ExportWalletPage,
  LOGIN_STARTED_KEY,
} from '../../../export_wallet/ExportWalletPage'

;(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true

let host: HTMLElement
let root: Root
/** Render, or render again after the SDK's answers changed. */
const render = () =>
  act(async () => root.render(createElement(ExportWalletPage)))
/** Load the page afresh, as a reload or a return from Google does. */
const load = async () => {
  if (root) act(() => root.unmount())
  root = createRoot(host)
  await render()
}
const button = (label: string) =>
  [...host.querySelectorAll('button')].find(b => b.textContent === label)
const press = (label: string) => act(async () => button(label)!.click())
const setUrl = (search: string) =>
  window.history.replaceState({}, '', `/wallet-export.html${search}`)
const GOOGLE_RETURN =
  '?privy_oauth_state=s1&privy_oauth_code=c1&privy_oauth_provider=google'
const NOT_READY = new Error('Wallet not ready for export')

beforeEach(async () => {
  sessionStorage.clear()
  localStorage.clear()
  setUrl('')
  privy.ready = true
  privy.authenticated = false
  privy.error = null
  privy.onLoginError = undefined
  privy.logout.mockImplementation(async () => {
    privy.authenticated = false
  })
  privy.exportWallet.mockResolvedValue(undefined)
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
})
afterEach(() => {
  act(() => root.unmount())
  host.remove()
  vi.useRealTimers()
})

describe('the wallet export page', () => {
  it('waits for Privy before it offers anything', async () => {
    privy.ready = false

    await render()

    expect(host.querySelectorAll('button')).toHaveLength(0)
  })

  it('says what the phrase gives access to before anyone logs in', async () => {
    // The page can be opened by its address, past the warning in Settings.
    await render()

    expect(host.textContent).toContain('can take your funds')
    expect(host.textContent).toContain('copy')
    expect(host.textContent).not.toMatch(/\bsee\b|\bshows?\b/)
  })

  it('asks the visitor to log in, with email or Google and no way to sign up', async () => {
    await render()

    await press('Log in')

    expect(privy.login).toHaveBeenCalledWith({
      loginMethods: ['email', 'google'],
      disableSignup: true,
    })
    expect(privy.exportWallet).not.toHaveBeenCalled()
  })

  describe('after a login made on this page', () => {
    it("opens Privy's export screen once the email login completes", async () => {
      await render()
      await press('Log in')
      privy.authenticated = true

      await render()

      expect(privy.exportWallet).toHaveBeenCalledTimes(1)
    })

    it("opens it on the return from Google's login", async () => {
      // Log in was pressed here, then the browser left for Google and came back.
      sessionStorage.setItem(LOGIN_STARTED_KEY, '1')
      setUrl(GOOGLE_RETURN)
      privy.authenticated = true

      await load()

      expect(privy.exportWallet).toHaveBeenCalledTimes(1)
    })

    it('logs out once the visitor leaves the export screen, and says so', async () => {
      await render()
      await press('Log in')
      privy.authenticated = true

      await render()

      expect(privy.logout).toHaveBeenCalledTimes(1)
      expect(host.textContent).toContain("You're logged out of this page")
      expect(host.querySelector('a')?.getAttribute('href')).toBe('/')
    })

    describe('once the export screen is left', () => {
      // Privy hands the phrase over through its Copy buttons and nowhere
      // else: it is on the clipboard when the user comes back to this page.
      const writeText = vi.fn()
      beforeEach(() => {
        writeText.mockReset().mockResolvedValue(undefined)
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: { writeText },
        })
      })
      const reachDone = async () => {
        await render()
        await press('Log in')
        privy.authenticated = true
        await render()
      }

      it('says the phrase is still on the clipboard', async () => {
        await reachDone()

        expect(host.textContent).toContain('still on your clipboard')
      })

      it('clears the clipboard when asked, and says so', async () => {
        await reachDone()

        await press('Clear clipboard')

        expect(writeText).toHaveBeenCalledWith('')
        expect(host.textContent).toContain('Clipboard cleared')
      })

      it('says how to clear it by hand when the browser will not', async () => {
        writeText.mockRejectedValue(new Error('NotAllowedError'))
        await reachDone()

        await press('Clear clipboard')

        expect(host.querySelector('[role="alert"]')?.textContent).toContain(
          'copy something else',
        )
      })
    })

    it('opens the export screen once, however often the page renders', async () => {
      let leave: () => void = () => undefined
      privy.exportWallet.mockReturnValue(
        new Promise<void>(resolve => (leave = resolve)),
      )
      await render()
      await press('Log in')
      privy.authenticated = true

      await render()
      await render()
      await render()

      expect(privy.exportWallet).toHaveBeenCalledTimes(1)
      expect(privy.logout).not.toHaveBeenCalled()
      await act(async () => leave())
    })

    it("waits for Privy's wallet to be ready instead of giving up", async () => {
      vi.useFakeTimers()
      // On the return from Google the login is there before the wallet is.
      privy.exportWallet
        .mockRejectedValueOnce(NOT_READY)
        .mockRejectedValueOnce(NOT_READY)
        .mockResolvedValue(undefined)
      sessionStorage.setItem(LOGIN_STARTED_KEY, '1')
      setUrl(GOOGLE_RETURN)
      privy.authenticated = true

      await load()
      expect(privy.logout).not.toHaveBeenCalled()
      await act(async () => vi.advanceTimersByTimeAsync(2000))

      expect(privy.exportWallet).toHaveBeenCalledTimes(3)
      expect(host.textContent).toContain("You're logged out of this page")
    })

    it('gives up, logs out and says so when the wallet never becomes ready', async () => {
      vi.useFakeTimers()
      privy.exportWallet.mockRejectedValue(NOT_READY)
      sessionStorage.setItem(LOGIN_STARTED_KEY, '1')
      setUrl(GOOGLE_RETURN)
      privy.authenticated = true

      await load()
      await act(async () => vi.advanceTimersByTimeAsync(20_000))

      expect(host.querySelector('[role="alert"]')).not.toBeNull()
      expect(privy.logout).toHaveBeenCalledTimes(1)
    })

    it('says so, logs out and offers a fresh start when the phrase cannot be shown', async () => {
      privy.exportWallet.mockRejectedValue(
        new Error('User must have an embedded wallet.'),
      )
      await render()
      await press('Log in')
      privy.authenticated = true

      await render()

      expect(host.querySelector('[role="alert"]')?.textContent).toContain(
        "We couldn't get your Recovery Phrase",
      )
      expect(privy.exportWallet).toHaveBeenCalledTimes(1)
      expect(privy.logout).toHaveBeenCalledTimes(1)
      // Starting again is a clean load of the page, with nothing carried over.
      const again = [...host.querySelectorAll('a')].find(
        a => a.textContent === 'Try again',
      )
      expect(again?.getAttribute('href')).toBe('/wallet-export.html')
    })
  })

  describe('a login it did not just see made', () => {
    /** The SDK reports a login; nothing shows this visitor made it. */
    const expectEndedWithoutExport = () => {
      expect(privy.logout).toHaveBeenCalled()
      expect(privy.exportWallet).not.toHaveBeenCalled()
    }

    it('is ended when it was left behind by an earlier visit', async () => {
      privy.authenticated = true

      await load()
      await render()

      expectEndedWithoutExport()
      expect(button('Log in')).toBeDefined()
    })

    it('is ended after a reload, even though this tab once started a login', async () => {
      // A crash or a restored tab brings the tab's storage back with the page.
      sessionStorage.setItem(LOGIN_STARTED_KEY, '1')
      privy.authenticated = true

      await load()

      expectEndedWithoutExport()
      expect(sessionStorage.getItem(LOGIN_STARTED_KEY)).toBeNull()
    })

    it('is ended when only the address claims a return from Google', async () => {
      setUrl(GOOGLE_RETURN)
      privy.authenticated = true

      await load()

      expectEndedWithoutExport()
    })

    it('is ended when the visitor closed the login window and a login appears later', async () => {
      await render()
      await press('Log in')
      await act(async () => privy.onLoginError?.())
      // Another tab logged in meanwhile.
      privy.authenticated = true

      await render()

      expectEndedWithoutExport()
      expect(sessionStorage.getItem(LOGIN_STARTED_KEY)).toBeNull()
    })

    it('is not used for a second export once it has shown one', async () => {
      let leave: () => void = () => undefined
      privy.exportWallet.mockReturnValue(
        new Promise<void>(resolve => (leave = resolve)),
      )
      sessionStorage.setItem(LOGIN_STARTED_KEY, '1')
      setUrl(GOOGLE_RETURN)
      privy.authenticated = true
      await load()
      expect(privy.exportWallet).toHaveBeenCalledTimes(1)

      // The tab is restored while the export screen was open.
      await load()

      expect(privy.exportWallet).toHaveBeenCalledTimes(1)
      expect(privy.logout).toHaveBeenCalled()
      await act(async () => leave())
    })
  })

  describe('when Privy does not answer', () => {
    it('says so when Privy reports that it could not start', async () => {
      privy.ready = false
      privy.error = new Error('Failed to fetch')

      await render()

      expect(host.querySelector('[role="alert"]')).not.toBeNull()
    })

    it('does not wait forever for Privy to be ready', async () => {
      vi.useFakeTimers()
      privy.ready = false

      await render()
      expect(host.querySelector('[role="alert"]')).toBeNull()
      await act(async () => vi.advanceTimersByTimeAsync(20_000))

      expect(host.querySelector('[role="alert"]')).not.toBeNull()
    })
  })

  describe('when the tab is closed', () => {
    const SDK_KEYS = ['privy:token', 'privy:refresh_token']

    it('forgets the login at once while the export screen is open', async () => {
      privy.exportWallet.mockReturnValue(new Promise<void>(() => undefined))
      await render()
      await press('Log in')
      // The SDK's login, where it keeps it.
      SDK_KEYS.forEach(key => localStorage.setItem(key, '"secret"'))
      privy.authenticated = true
      await render()

      // The SDK's logout tells Privy which login to end: it has to read the
      // refresh token before that is removed.
      let tokenAtLogout: string | null = 'not called'
      privy.logout.mockImplementation(async () => {
        tokenAtLogout = localStorage.getItem('privy:refresh_token')
      })

      window.dispatchEvent(new Event('pagehide'))

      // Nothing asynchronous finishes on the way out: the tokens must be gone
      // by the time the handler returns.
      SDK_KEYS.forEach(key => expect(localStorage.getItem(key)).toBeNull())
      expect(privy.logout).toHaveBeenCalledTimes(1)
      expect(tokenAtLogout).toBe('"secret"')
    })

    it('keeps the login mark when the page is left for the Google login itself', async () => {
      await render()
      await press('Log in')

      // The browser leaves for Google: nothing is being exported yet.
      window.dispatchEvent(new Event('pagehide'))

      expect(privy.logout).not.toHaveBeenCalled()
      expect(sessionStorage.getItem(LOGIN_STARTED_KEY)).toBe('1')
    })
  })
})
