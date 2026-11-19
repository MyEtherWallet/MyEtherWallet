import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  SDK_SESSION_COOKIES,
  SDK_SESSION_KEYS,
  forgetSdkSession,
} from '../../../export_wallet/sdkSession'

describe('forgetSdkSession', () => {
  beforeEach(() => {
    localStorage.clear()
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim()
      if (name) document.cookie = `${name}=; Max-Age=0; path=/`
    })
  })

  it("removes the React SDK's login from the browser, there and then", () => {
    SDK_SESSION_KEYS.forEach(key => localStorage.setItem(key, '"secret"'))
    localStorage.setItem('mew-locale', 'es')
    SDK_SESSION_COOKIES.forEach(name => {
      document.cookie = `${name}=secret; path=/`
    })

    forgetSdkSession()

    SDK_SESSION_KEYS.forEach(key =>
      expect(localStorage.getItem(key)).toBeNull(),
    )
    expect(document.cookie).not.toContain('secret')
    // Only the SDK's login goes.
    expect(localStorage.getItem('mew-locale')).toBe('es')
  })

  // The names are the SDK's own, not part of its public API. If an upgrade
  // renames one, this fails and the list is brought up to date with it.
  it('names the places the installed SDK keeps a login', () => {
    const dist = resolve('node_modules/@privy-io/react-auth/dist/esm')
    const built = readdirSync(dist)
      .filter(file => file.endsWith('.mjs'))
      .map(file => readFileSync(resolve(dist, file), 'utf8'))
      .join('\n')

    for (const name of [...SDK_SESSION_KEYS, ...SDK_SESSION_COOKIES]) {
      expect(built, name).toContain(`"${name}"`)
    }
  })
})
