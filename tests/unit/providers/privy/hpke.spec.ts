import { describe, expect, it } from 'vitest'
import { CipherSuite, DhkemP256HkdfSha256, HkdfSha256 } from '@hpke/core'
import { Chacha20Poly1305 } from '@hpke/chacha20poly1305'
import { createRecipient, openSealed } from '@/providers/privy/hpke'

const P256 = { name: 'ECDH', namedCurve: 'P-256' } as const

const fromBase64 = (value: string): ArrayBuffer =>
  Uint8Array.from(atob(value), char => char.charCodeAt(0)).buffer
const toBase64 = (bytes: ArrayBuffer): string =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))

/**
 * The worked example on Privy's "Export a wallet" page: the recipient's
 * private key and the reply Privy's API gave for it.
 * https://docs.privy.io/wallets/wallets/export
 */
const DOCS_PRIVATE_KEY =
  'MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgU4RP++trEcTL2CPSgX9dKZAQ+XW3Pt49PNI4Elwia1qhRANCAAROjlGlaxrE9rIRc2jy0xmW7ajzkRqccVJsc2WMsXKoB2lG5NllwkSHwWsZkDbmqhYFk/WlDYl/MCiLnYYVtJf+'
const DOCS_REPLY = {
  encapsulatedKey:
    'BLplgxEpMz+WMxDSOzGZe+Oa5kkt9FTxUudRRyO5zRj/OaDbUaddlE18uNv8UKxpecnrSy+UByG2C3oJTgTnGNk=',
  ciphertext:
    'Zb2XqqIpPlQKJhkb9GRoXa8N6pKLAlozYnXg713g7mCu5vvn6tGIRbeJj4XOUQkFeB9DRxKg',
}
const DOCS_MESSAGE = "They're taking the Hobbits to Isengard"

const docsPrivateKey = (): Promise<CryptoKey> =>
  crypto.subtle.importKey('pkcs8', fromBase64(DOCS_PRIVATE_KEY), P256, true, [
    'deriveBits',
  ])

/** Seal a message to a recipient the way Privy's wallet API does. */
const sealFor = async (publicKey: string, message: string) => {
  const suite = new CipherSuite({
    kem: new DhkemP256HkdfSha256(),
    kdf: new HkdfSha256(),
    aead: new Chacha20Poly1305(),
  })
  const sender = await suite.createSenderContext({
    recipientPublicKey: await crypto.subtle.importKey(
      'spki',
      fromBase64(publicKey),
      P256,
      true,
      [],
    ),
  })
  const ciphertext = await sender.seal(
    new TextEncoder().encode(message).buffer as ArrayBuffer,
  )
  return {
    encapsulatedKey: toBase64(sender.enc),
    ciphertext: toBase64(ciphertext),
  }
}

describe('hpke', () => {
  it("opens the example reply from Privy's export documentation", async () => {
    const message = await openSealed(await docsPrivateKey(), DOCS_REPLY)

    expect(message).toBe(DOCS_MESSAGE)
  })

  it('opens a reply written in the URL-safe base64 alphabet', async () => {
    const urlSafe = (value: string) =>
      value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

    const message = await openSealed(await docsPrivateKey(), {
      encapsulatedKey: urlSafe(DOCS_REPLY.encapsulatedKey),
      ciphertext: urlSafe(DOCS_REPLY.ciphertext),
    })

    expect(message).toBe(DOCS_MESSAGE)
  })

  it('opens what is sealed to the public key it hands out', async () => {
    const recipient = await createRecipient()
    const sealed = await sealFor(recipient.publicKey, 'legal winner thank year')

    expect(await recipient.open(sealed)).toBe('legal winner thank year')
  })

  it('makes a new key for every recipient', async () => {
    const first = await createRecipient()
    const second = await createRecipient()

    expect(second.publicKey).not.toBe(first.publicKey)
    await expect(
      second.open(await sealFor(first.publicKey, 'for the first one')),
    ).rejects.toThrow()
  })
})
