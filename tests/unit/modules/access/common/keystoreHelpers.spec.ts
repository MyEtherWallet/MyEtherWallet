import { describe, it, expect } from 'vitest'
import {
  isKeystoreFile,
  isWrongKeystorePassword,
} from '@/modules/access/common/helpers'

describe('isKeystoreFile', () => {
  it.each([
    [{ version: 3, Crypto: { cipher: 'aes-128-ctr' } }],
    [{ crypto: {} }],
    [{ encseed: 'abc' }],
    [{ hash: 'abc' }],
    [{ publisher: 'MyEtherwallet', privKey: 'aa' }],
  ])('accepts a supported keystore shape %#', json => {
    expect(isKeystoreFile(json)).toBe(true)
  })

  it.each([[null], ['text'], [[]], [{ name: 'not a keystore' }]])(
    'rejects %j',
    json => {
      expect(isKeystoreFile(json)).toBe(false)
    },
  )
})

describe('isWrongKeystorePassword', () => {
  it('flags the wallet library wrong-passphrase errors', () => {
    expect(
      isWrongKeystorePassword(
        new Error('Key derivation failed - possibly wrong passphrase'),
      ),
    ).toBe(true)
    expect(
      isWrongKeystorePassword(
        new Error('Decoded key mismatch - possibly wrong passphrase'),
      ),
    ).toBe(true)
  })

  it('treats anything else as a file it cannot decrypt', () => {
    expect(isWrongKeystorePassword(new Error('Unsupported kdf'))).toBe(false)
    expect(isWrongKeystorePassword('boom')).toBe(false)
  })
})
