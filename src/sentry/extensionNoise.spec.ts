import { describe, it, expect } from 'vitest'
import { isMetaMaskSdkDecryptError } from './extensionNoise'

describe('isMetaMaskSdkDecryptError', () => {
  it('drops the MetaMask SDK AES-GCM decrypt rejection (APP-MEW-WEB-CQ)', () => {
    const err = new Error('aes/gcm: invalid ghash tag')
    err.stack =
      'Error: aes/gcm: invalid ghash tag\n' +
      '    at decrypt (/assets/metamask-sdk-RwJkC4lN.js:1:193237)\n' +
      '    at /assets/metamask-sdk-RwJkC4lN.js:1:212867'
    expect(isMetaMaskSdkDecryptError(err)).toBe(true)
  })

  it('ignores the same message from a non-metamask-sdk frame', () => {
    const err = new Error('aes/gcm: invalid ghash tag')
    err.stack =
      'Error: aes/gcm: invalid ghash tag\n' +
      '    at decrypt (/assets/index-abc123.js:1:100)'
    expect(isMetaMaskSdkDecryptError(err)).toBe(false)
  })

  it('ignores an unrelated metamask-sdk error', () => {
    const err = new Error('some other failure')
    err.stack = 'Error: some other failure\n    at /assets/metamask-sdk-RwJkC4lN.js:1:1'
    expect(isMetaMaskSdkDecryptError(err)).toBe(false)
  })

  it('handles non-error inputs', () => {
    expect(isMetaMaskSdkDecryptError(null)).toBe(false)
    expect(isMetaMaskSdkDecryptError('aes/gcm: invalid ghash tag')).toBe(false)
    expect(isMetaMaskSdkDecryptError({})).toBe(false)
  })
})
