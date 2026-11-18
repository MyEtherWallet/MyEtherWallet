import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CipherSuite, DhkemP256HkdfSha256, HkdfSha256 } from '@hpke/core'
import { Chacha20Poly1305 } from '@hpke/chacha20poly1305'
import { getPathWithParams, type Route } from '@privy-io/routes'

const fake = vi.hoisted(() => ({
  signWithUserSigner: vi.fn(),
  fetchPrivyRoute: vi.fn(),
}))

// The Privy client needs Privy's servers; everything else runs for real,
// including the SDK's request signing and the decryption.
vi.mock('@/providers/privy/client', () => ({
  privy: {
    app: { appId: 'app-1' },
    getCompiledPath: (
      route: Route,
      options: { params?: Record<string, string> },
    ) =>
      `https://auth.privy.io${getPathWithParams(route.path, options.params)}`,
    fetchPrivyRoute: fake.fetchPrivyRoute,
    embeddedWallet: { signWithUserSigner: fake.signWithUserSigner },
  },
}))

import {
  exportRecoveryPhrase,
  PrivyExportError,
} from '@/providers/privy/exportWallet'
import type { PrivyEmbeddedWallet } from '@/providers/privy/user'

/** BIP-39 test vectors (entropy 0x7f…7f): valid 12 and 24 word phrases. */
const PHRASE_12 =
  'legal winner thank year wave sausage worth useful legal winner thank yellow'
const PHRASE_24 =
  'legal winner thank year wave sausage worth useful legal winner thank year wave sausage worth useful legal winner thank year wave sausage worth title'

const walletAccount = {
  type: 'wallet',
  id: 'w-1',
  address: '0x1111111111111111111111111111111111111111',
  chain_id: 'eip155:1',
  chain_type: 'ethereum',
  connector_type: 'embedded',
  wallet_client: 'privy',
  wallet_client_type: 'privy',
  wallet_index: 0,
  delegated: false,
  imported: false,
  recovery_method: 'privy-v2',
  user_can_sign: true,
  verified_at: 1,
  first_verified_at: 1,
  latest_verified_at: 1,
}
/** A wallet Privy holds on its servers: the only kind its wallet API serves. */
const serverWallet = walletAccount as PrivyEmbeddedWallet
/** A wallet whose key is rebuilt on the user's device: it has no wallet id. */
const deviceWallet = {
  ...walletAccount,
  id: null,
  recovery_method: 'privy',
} as PrivyEmbeddedWallet

const P256 = { name: 'ECDH', namedCurve: 'P-256' } as const
const fromBase64 = (value: string): ArrayBuffer =>
  Uint8Array.from(atob(value), char => char.charCodeAt(0)).buffer
const toBase64 = (bytes: ArrayBuffer): string =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))

type ExportRequest = {
  body: {
    encryption_type: string
    recipient_public_key: string
    export_seed_phrase?: boolean
  }
  params: { wallet_id: string }
  headers: Record<string, string>
}

/** Answer export requests the way Privy does: the secret, sealed to the caller. */
const privyAnswersWith = (secret: string): void => {
  fake.fetchPrivyRoute.mockImplementation(
    async (_route: Route, request: ExportRequest) => {
      const suite = new CipherSuite({
        kem: new DhkemP256HkdfSha256(),
        kdf: new HkdfSha256(),
        aead: new Chacha20Poly1305(),
      })
      const sender = await suite.createSenderContext({
        recipientPublicKey: await crypto.subtle.importKey(
          'spki',
          fromBase64(request.body.recipient_public_key),
          P256,
          true,
          [],
        ),
      })
      const ciphertext = await sender.seal(
        new TextEncoder().encode(secret).buffer as ArrayBuffer,
      )
      return {
        encryption_type: 'HPKE',
        ciphertext: toBase64(ciphertext),
        encapsulated_key: toBase64(sender.enc),
      }
    },
  )
}

const sentRoute = (call = 0): Route => fake.fetchPrivyRoute.mock.calls[call][0]
const sentRequest = (call = 0): ExportRequest =>
  fake.fetchPrivyRoute.mock.calls[call][1]
/** What the user's signer was asked to sign, as the JSON it stands for. */
const signedRequest = (): unknown => {
  const { message } = fake.signWithUserSigner.mock.calls[0][0] as {
    message: string
  }
  return JSON.parse(new TextDecoder().decode(fromBase64(message)))
}

describe('exportRecoveryPhrase', () => {
  beforeEach(() => {
    fake.signWithUserSigner.mockResolvedValue({ signature: 'user-signature' })
    privyAnswersWith(PHRASE_24)
  })

  it('returns the words of the recovery phrase Privy sends back', async () => {
    const words = await exportRecoveryPhrase(serverWallet)

    expect(words).toEqual(PHRASE_24.split(' '))
  })

  it('returns a twelve word phrase as twelve words', async () => {
    privyAnswersWith(`  ${PHRASE_12}\n`)

    const words = await exportRecoveryPhrase(serverWallet)

    expect(words).toEqual(PHRASE_12.split(' '))
  })

  it("asks Privy's export route for the seed phrase of that wallet", async () => {
    await exportRecoveryPhrase(serverWallet)

    expect(fake.fetchPrivyRoute).toHaveBeenCalledTimes(1)
    expect(sentRoute()).toMatchObject({
      path: '/api/v1/wallets/:wallet_id/export',
      method: 'POST',
    })
    expect(sentRequest().params).toEqual({ wallet_id: 'w-1' })
    expect(sentRequest().body).toEqual({
      encryption_type: 'HPKE',
      export_seed_phrase: true,
      recipient_public_key: expect.stringMatching(/^[A-Za-z0-9+/]+=*$/),
    })
  })

  it("signs exactly the request it sends, with the user's own key", async () => {
    await exportRecoveryPhrase(serverWallet)

    const { body, headers } = sentRequest()
    expect(headers['privy-authorization-signature']).toBe('user-signature')
    expect(signedRequest()).toEqual({
      version: 1,
      method: 'POST',
      url: 'https://auth.privy.io/api/v1/wallets/w-1/export',
      headers: {
        'privy-app-id': 'app-1',
        'privy-request-expiry': headers['privy-request-expiry'],
      },
      body: {
        encryption_type: 'HPKE',
        export_seed_phrase: true,
        recipient_public_key: body.recipient_public_key,
      },
    })
  })

  it('gives the request a deadline that has not passed', async () => {
    const before = Date.now()

    await exportRecoveryPhrase(serverWallet)

    const deadline = Number(sentRequest().headers['privy-request-expiry'])
    expect(deadline).toBeGreaterThan(before)
  })

  it('seals every export to a key of its own', async () => {
    await exportRecoveryPhrase(serverWallet)
    await exportRecoveryPhrase(serverWallet)

    expect(sentRequest(1).body.recipient_public_key).not.toBe(
      sentRequest(0).body.recipient_public_key,
    )
  })

  it('refuses a wallet Privy does not hold on its servers, without asking', async () => {
    const failure = await exportRecoveryPhrase(deviceWallet).catch(
      (error: unknown) => error,
    )

    expect(failure).toBeInstanceOf(PrivyExportError)
    expect((failure as PrivyExportError).code).toBe('unsupported_wallet')
    expect(fake.signWithUserSigner).not.toHaveBeenCalled()
    expect(fake.fetchPrivyRoute).not.toHaveBeenCalled()
  })

  it('does not pass on a reply that is not a recovery phrase', async () => {
    const privateKey =
      '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318'
    privyAnswersWith(privateKey)

    const failure = await exportRecoveryPhrase(serverWallet).catch(
      (error: unknown) => error,
    )

    expect(failure).toBeInstanceOf(PrivyExportError)
    expect((failure as PrivyExportError).code).toBe('not_a_phrase')
    expect(String(failure)).not.toContain(privateKey)
  })

  it('does not pass on words that fail the phrase checksum', async () => {
    privyAnswersWith(PHRASE_12.replace(/yellow$/, 'year'))

    const failure = await exportRecoveryPhrase(serverWallet).catch(
      (error: unknown) => error,
    )

    expect((failure as PrivyExportError).code).toBe('not_a_phrase')
  })

  it("hands on Privy's own error when the export is refused", async () => {
    const refused = Object.assign(new Error('Forbidden'), {
      code: 'insufficient_permissions',
    })
    fake.fetchPrivyRoute.mockRejectedValue(refused)

    await expect(exportRecoveryPhrase(serverWallet)).rejects.toBe(refused)
  })
})
