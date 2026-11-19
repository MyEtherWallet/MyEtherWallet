import { describe, it, expect } from 'vitest'
import {
  isCorruptKeystoreError,
  isKeystoreFile,
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

describe('isCorruptKeystoreError', () => {
  it.each([
    'Unsupported kdf',
    'Unsupported key derivation scheme',
    'Unsupported parameters to PBKDF2',
    'Unsupported EtherWallet key format',
    'Not a V3 wallet',
    'Not a V1 Wallet',
    'Only md5 is supported in evp_kdf',
    'Invalid private key length',
  ])('treats "%s" as a file it cannot decrypt', message => {
    expect(isCorruptKeystoreError(new Error(message))).toBe(true)
  })

  it.each([
    'Key derivation failed - possibly wrong passphrase',
    'Decoded key mismatch - possibly wrong passphrase',
    'bad decrypt',
    'Password must be at least 7 characters',
    'Invalid private key or address',
  ])('treats "%s" as a wrong password', message => {
    expect(isCorruptKeystoreError(new Error(message))).toBe(false)
  })

  it('treats non-errors as a wrong password', () => {
    expect(isCorruptKeystoreError('boom')).toBe(false)
  })
})
