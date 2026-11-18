import { beforeEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({
  startRegistration: vi.fn(),
  startAuthentication: vi.fn(),
  privy: {
    auth: {
      passkey: {
        generateRegistrationOptions: vi.fn(),
        linkWithPasskey: vi.fn(),
      },
    },
    mfa: {
      submitEnrollMfa: vi.fn(),
      unlinkPasskey: vi.fn(),
      passkey: { generateAuthenticationOptions: vi.fn() },
    },
  },
}))

// The browser's passkey prompt does not exist under jsdom, and the Privy
// client needs Privy's servers. Everything between them runs for real.
vi.mock('@simplewebauthn/browser', () => ({
  startRegistration: fake.startRegistration,
  startAuthentication: fake.startAuthentication,
}))
vi.mock('@/providers/privy/client', () => ({ privy: fake.privy }))

import {
  enrollPasskeys,
  linkPasskey,
  PasskeyCancelledError,
  passkeyAssertion,
  unlinkPasskey,
} from '@/providers/privy/passkey'

/** Registration options the way Privy sends them: snake_case. */
const PRIVY_REGISTRATION_OPTIONS = {
  challenge: 'Y2hhbGxlbmdl',
  rp: { id: 'localhost', name: 'MEW' },
  user: { id: 'dXNlcg', name: 'ada@example.com', display_name: 'Ada' },
  pub_key_cred_params: [{ alg: -7, type: 'public-key' }],
  timeout: 60000,
  attestation: 'none',
  authenticator_selection: {
    authenticator_attachment: 'platform',
    require_resident_key: true,
    resident_key: 'required',
    user_verification: 'preferred',
  },
  exclude_credentials: [
    { id: 'b2xk', type: 'public-key', transports: ['internal'] },
  ],
  extensions: { cred_props: { rk: true } },
}

/** What the browser hands back after the user makes a passkey. */
const BROWSER_REGISTRATION = { id: 'bmV3', rawId: 'bmV3', type: 'public-key' }

/** What the browser hands back after the user proves a passkey. */
const BROWSER_ASSERTION = {
  id: 'bmV3',
  rawId: 'bmV3',
  type: 'public-key',
  authenticatorAttachment: 'platform',
  clientExtensionResults: { appid: true, credProps: { rk: true } },
  response: {
    authenticatorData: 'YXV0aA',
    clientDataJSON: 'Y2xpZW50',
    signature: 'c2ln',
    userHandle: 'dXNlcg',
  },
}

/** The error a browser raises when the user dismisses the passkey prompt. */
const dismissed = () =>
  Object.assign(new Error('The operation was not allowed'), {
    name: 'NotAllowedError',
  })

describe('linkPasskey', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fake.privy.auth.passkey.generateRegistrationOptions.mockResolvedValue({
      options: PRIVY_REGISTRATION_OPTIONS,
    })
    fake.startRegistration.mockResolvedValue(BROWSER_REGISTRATION)
    fake.privy.auth.passkey.linkWithPasskey.mockResolvedValue({
      user: { id: 'did:privy:1' },
    })
  })

  it("shows the browser prompt with Privy's options in the shape the browser takes", async () => {
    await linkPasskey()

    expect(fake.startRegistration).toHaveBeenCalledWith({
      optionsJSON: {
        challenge: 'Y2hhbGxlbmdl',
        rp: { id: 'localhost', name: 'MEW' },
        user: { id: 'dXNlcg', name: 'ada@example.com', displayName: 'Ada' },
        pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
        timeout: 60000,
        attestation: 'none',
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          requireResidentKey: true,
          residentKey: 'required',
          userVerification: 'preferred',
        },
        excludeCredentials: [
          { id: 'b2xk', type: 'public-key', transports: ['internal'] },
        ],
        extensions: { credProps: true },
      },
    })
  })

  it('links the passkey the browser made and returns the user that now has it', async () => {
    const user = await linkPasskey()

    expect(fake.privy.auth.passkey.linkWithPasskey).toHaveBeenCalledWith(
      BROWSER_REGISTRATION,
    )
    expect(user).toEqual({ id: 'did:privy:1' })
  })

  it('reports a dismissed prompt as a cancellation and links nothing', async () => {
    fake.startRegistration.mockRejectedValue(dismissed())

    await expect(linkPasskey()).rejects.toBeInstanceOf(PasskeyCancelledError)
    expect(fake.privy.auth.passkey.linkWithPasskey).not.toHaveBeenCalled()
  })

  it("passes on any other failure of the prompt as it is, such as a device that already holds this account's passkey", async () => {
    const already = Object.assign(new Error('already registered'), {
      name: 'InvalidStateError',
    })
    fake.startRegistration.mockRejectedValue(already)

    await expect(linkPasskey()).rejects.toBe(already)
  })
})

describe('enrollPasskeys', () => {
  it('makes the given passkeys the check Privy asks for before the wallet is used', async () => {
    fake.privy.mfa.submitEnrollMfa.mockResolvedValue({})

    await enrollPasskeys(['a', 'b'])

    expect(fake.privy.mfa.submitEnrollMfa).toHaveBeenCalledWith({
      method: 'passkey',
      credentialIds: ['a', 'b'],
    })
  })
})

describe('unlinkPasskey', () => {
  it('removes that passkey from the account and from the check', async () => {
    fake.privy.mfa.unlinkPasskey.mockResolvedValue(undefined)

    await unlinkPasskey('a')

    expect(fake.privy.mfa.unlinkPasskey).toHaveBeenCalledWith({
      credentialId: 'a',
      removeAsMfa: true,
    })
  })
})

describe('passkeyAssertion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fake.privy.mfa.passkey.generateAuthenticationOptions.mockResolvedValue({
      options: {
        challenge: 'Y2hhbGxlbmdl',
        rp_id: 'localhost',
        timeout: 60000,
        user_verification: 'required',
        allow_credentials: [
          { id: 'bmV3', type: 'public-key', transports: ['internal'] },
        ],
      },
    })
    fake.startAuthentication.mockResolvedValue(BROWSER_ASSERTION)
  })

  it("asks the browser to prove a passkey with Privy's challenge, in the shape the browser takes", async () => {
    await passkeyAssertion()

    expect(fake.startAuthentication).toHaveBeenCalledWith({
      optionsJSON: {
        challenge: 'Y2hhbGxlbmdl',
        rpId: 'localhost',
        timeout: 60000,
        userVerification: 'required',
        allowCredentials: [
          { id: 'bmV3', type: 'public-key', transports: ['internal'] },
        ],
      },
    })
  })

  it("returns the browser's proof in the shape Privy checks", async () => {
    expect(await passkeyAssertion()).toEqual({
      id: 'bmV3',
      raw_id: 'bmV3',
      type: 'public-key',
      authenticator_attachment: 'platform',
      client_extension_results: { app_id: true, cred_props: { rk: true } },
      response: {
        authenticator_data: 'YXV0aA',
        client_data_json: 'Y2xpZW50',
        signature: 'c2ln',
        user_handle: 'dXNlcg',
      },
    })
  })

  it('reports a dismissed prompt as a cancellation', async () => {
    fake.startAuthentication.mockRejectedValue(dismissed())

    await expect(passkeyAssertion()).rejects.toBeInstanceOf(
      PasskeyCancelledError,
    )
  })
})
