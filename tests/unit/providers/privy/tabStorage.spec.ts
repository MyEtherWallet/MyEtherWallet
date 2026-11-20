import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { tabHoldsPrivyData, tabStorage } from '@/providers/privy/tabStorage'

describe('tabStorage', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  it('round-trips a structured value', async () => {
    await tabStorage.put('privy:token', { jwt: 'abc', exp: 123 })

    expect(await tabStorage.get('privy:token')).toEqual({
      jwt: 'abc',
      exp: 123,
    })
  })

  it('returns undefined for a key that was never stored', async () => {
    expect(await tabStorage.get('privy:missing')).toBeUndefined()
  })

  it('removes the key when asked to store undefined', async () => {
    await tabStorage.put('privy:token', 'abc')

    await tabStorage.put('privy:token', undefined)

    expect(sessionStorage.getItem('privy:token')).toBeNull()
  })

  it('deletes a stored key', async () => {
    await tabStorage.put('privy:refresh_token', 'r1')

    await tabStorage.del('privy:refresh_token')

    expect(await tabStorage.get('privy:refresh_token')).toBeUndefined()
  })

  it('keeps values in sessionStorage and never in localStorage', async () => {
    await tabStorage.put('privy:token', 'abc')

    expect(sessionStorage.getItem('privy:token')).toBe('"abc"')
    expect(localStorage.length).toBe(0)
  })

  it('lists the keys it holds', async () => {
    await tabStorage.put('privy:token', 'abc')
    await tabStorage.put('privy:state_code', 's')

    expect((await tabStorage.getKeys()).sort()).toEqual([
      'privy:state_code',
      'privy:token',
    ])
  })
})

describe('tabHoldsPrivyData', () => {
  beforeEach(() => sessionStorage.clear())
  afterEach(() => vi.restoreAllMocks())

  it('is true once Privy has stored something in this tab', async () => {
    await tabStorage.put('privy:token', 'abc')

    expect(tabHoldsPrivyData()).toBe(true)
  })

  it('is false for a tab that only holds other data', () => {
    sessionStorage.setItem('mew:auth:return_to', '/stocks')

    expect(tabHoldsPrivyData()).toBe(false)
  })

  it('is false, without throwing, when storage is blocked', () => {
    vi.spyOn(window, 'sessionStorage', 'get').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })

    expect(tabHoldsPrivyData()).toBe(false)
  })
})
