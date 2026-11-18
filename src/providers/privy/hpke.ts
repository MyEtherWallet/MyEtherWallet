import { CipherSuite, DhkemP256HkdfSha256, HkdfSha256 } from '@hpke/core'
import { Chacha20Poly1305 } from '@hpke/chacha20poly1305'

/**
 * Hybrid public key encryption (RFC 9180) as Privy's wallet API uses it to
 * send back an exported key: the caller names a public key, and only the
 * matching private key can open the reply.
 * https://docs.privy.io/wallets/wallets/export
 */

/** A reply sealed for one recipient. Both fields are base64. */
export type SealedMessage = {
  encapsulatedKey: string
  ciphertext: string
}

/** One party that a single reply can be sealed for. */
export type Recipient = {
  /** Base64 of the public key in SPKI form: what the sender is given. */
  publicKey: string
  open: (sealed: SealedMessage) => Promise<string>
}

const P256 = { name: 'ECDH', namedCurve: 'P-256' } as const

/** The one suite Privy's export endpoint supports. */
const privySuite = (): CipherSuite =>
  new CipherSuite({
    kem: new DhkemP256HkdfSha256(),
    kdf: new HkdfSha256(),
    aead: new Chacha20Poly1305(),
  })

/** Accepts both base64 alphabets; `atob` already tolerates missing padding. */
const fromBase64 = (value: string): ArrayBuffer => {
  const standard = value.replace(/-/g, '+').replace(/_/g, '/')
  return Uint8Array.from(atob(standard), char => char.charCodeAt(0)).buffer
}

const toBase64 = (bytes: ArrayBuffer): string =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))

/**
 * Open a sealed reply. Rejects when the reply was sealed for another key or
 * was altered on the way.
 *
 * @param recipientKey the private key, or the whole pair when the private key
 *   cannot be exported (the library otherwise derives the public half from it)
 */
export const openSealed = async (
  recipientKey: CryptoKey | CryptoKeyPair,
  sealed: SealedMessage,
): Promise<string> => {
  const recipient = await privySuite().createRecipientContext({
    recipientKey,
    enc: fromBase64(sealed.encapsulatedKey),
  })
  const opened = await recipient.open(fromBase64(sealed.ciphertext))
  return new TextDecoder().decode(opened)
}

/**
 * Make a recipient with a fresh key pair. The private key never leaves the
 * browser's key store: it is created non-exportable and is reachable only
 * through `open`.
 */
export const createRecipient = async (): Promise<Recipient> => {
  const keyPair = await crypto.subtle.generateKey(P256, false, ['deriveBits'])
  const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey)
  return {
    publicKey: toBase64(publicKey),
    open: sealed => openSealed(keyPair, sealed),
  }
}
