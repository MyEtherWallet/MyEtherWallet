import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const fake = vi.hoisted(() => ({
  privy: {
    getAccessToken: vi.fn(),
    user: { get: vi.fn() },
    auth: {
      logout: vi.fn(),
      email: { sendCode: vi.fn(), loginWithCode: vi.fn() },
      oauth: { generateURL: vi.fn(), loginWithCode: vi.fn() },
    },
    embeddedWallet: { create: vi.fn(), getEthereumProvider: vi.fn() },
    mfa: { clearMfa: vi.fn() },
  },
  privyReady: vi.fn(),
  mountWalletIframe: vi.fn(),
  teardownWalletIframe: vi.fn(),
  chain: {
    selectedChain: undefined as
      { chainID: string; name: string; type: string } | undefined,
  },
  walletStore: {
    setWallet: vi.fn(),
    setWatchOnlyIfExist: vi.fn(),
    wallet: undefined as unknown,
  },
  trackOnboardingEvent: vi.fn(),
  trackAccountSecurityEvent: vi.fn(),
  linkPasskey: vi.fn(),
  enrollPasskeys: vi.fn(),
  unlinkPasskey: vi.fn(),
  answerPasskeyChecks: vi.fn(),
  exportRecoveryPhrase: vi.fn(),
}))
/** The error the passkey module raises for a dismissed browser prompt. */
class PasskeyCancelledError extends Error {}

vi.mock('@/providers/privy/client', () => ({
  privy: fake.privy,
  privyReady: fake.privyReady,
}))
vi.mock('@/providers/privy/walletIframe', () => ({
  mountWalletIframe: fake.mountWalletIframe,
  teardownWalletIframe: fake.teardownWalletIframe,
}))
vi.mock('@/stores/walletStore', () => ({
  useWalletStore: () => fake.walletStore,
}))
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => fake.chain,
}))
vi.mock('@/providers/privy/passkey', () => ({
  linkPasskey: fake.linkPasskey,
  enrollPasskeys: fake.enrollPasskeys,
  unlinkPasskey: fake.unlinkPasskey,
  PasskeyCancelledError,
}))
vi.mock('@/providers/privy/exportWallet', () => ({
  exportRecoveryPhrase: fake.exportRecoveryPhrase,
}))
vi.mock('@/providers/privy/mfaChallenge', () => ({
  answerPasskeyChecks: fake.answerPasskeyChecks,
}))
vi.mock('@/analytics', () => ({
  analytics: {
    trackOnboardingEvent: fake.trackOnboardingEvent,
    trackAccountSecurityEvent: fake.trackAccountSecurityEvent,
  },
}))
// The wallet configs reach the hardware-wallet SDK — unavailable under jsdom.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: { SOFTWARE: 'software' },
}))

import { useAuthStore } from '@/stores/authStore'
import PrivyWallet from '@/providers/ethereum/privyWallet'

const ADDRESS = '0x1111111111111111111111111111111111111111'
const NO_WALLET_AT_LOGIN = { embedded: { ethereum: { createOnLogin: 'off' } } }

const emailAccount = { type: 'email', address: 'ada@example.com' }
const walletAccount = {
  type: 'wallet',
  id: 'w-1',
  address: ADDRESS,
  chain_id: 'eip155:1',
  chain_type: 'ethereum',
  connector_type: 'embedded',
  wallet_client: 'privy',
  wallet_client_type: 'privy',
  wallet_index: 0,
  delegated: false,
  imported: false,
  recovery_method: 'privy',
  user_can_sign: true,
}
const userWith = (accounts: unknown[]) => ({
  id: 'did:privy:1',
  created_at: 1,
  linked_accounts: accounts,
  mfa_methods: [],
})
const passkeyAccount = (credentialId: string, enrolled: boolean) => ({
  type: 'passkey',
  credential_id: credentialId,
  enrolled_in_mfa: enrolled,
  authenticator_name: 'iCloud Keychain',
  created_with_device: 'Macintosh',
  first_verified_at: 1_794_000_000,
  latest_verified_at: 1_794_000_000,
  verified_at: 1_794_000_000,
})
const newUser = userWith([emailAccount])
const userWithWallet = userWith([emailAccount, walletAccount])

/** Put the tab in the state a completed login leaves behind. */
const holdLogin = (user: unknown) => {
  sessionStorage.setItem('privy:token', '"tok"')
  fake.privy.getAccessToken.mockResolvedValue('tok')
  fake.privy.user.get.mockResolvedValue({ user })
}

const loggedInStore = async (user: unknown, isNew = false) => {
  fake.privy.auth.email.loginWithCode.mockResolvedValue({
    user,
    is_new_user: isNew,
  })
  const store = useAuthStore()
  await store.loginWithEmailCode('ada@example.com', '123456')
  return store
}

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    sessionStorage.clear()
    vi.clearAllMocks()
    fake.privyReady.mockResolvedValue(undefined)
    fake.privy.getAccessToken.mockResolvedValue(null)
    fake.privy.user.get.mockRejectedValue(
      Object.assign(new Error('No tokens found in storage'), {
        code: 'missing_or_invalid_token',
      }),
    )
    fake.privy.auth.logout.mockResolvedValue(undefined)
    fake.privy.mfa.clearMfa.mockResolvedValue({})
    fake.privy.auth.email.sendCode.mockResolvedValue({ success: true })
    fake.privy.auth.oauth.generateURL.mockResolvedValue({
      url: 'https://accounts.google.com/o/oauth2/v2/auth?x=1',
    })
    fake.privy.embeddedWallet.getEthereumProvider.mockResolvedValue({
      request: vi.fn(),
    })
    fake.walletStore.setWallet.mockResolvedValue(undefined)
    fake.walletStore.wallet = undefined
    fake.chain.selectedChain = { chainID: '1', name: 'ETHEREUM', type: 'EVM' }
  })

  afterEach(() => {
    window.history.replaceState({}, '', '/')
  })

  describe('startGoogleLogin', () => {
    it('returns the Google login URL Privy gives for this app', async () => {
      const store = useAuthStore()

      const url = await store.startGoogleLogin()

      expect(fake.privy.auth.oauth.generateURL).toHaveBeenCalledWith(
        'google',
        `${window.location.origin}/auth/callback`,
      )
      expect(url).toBe('https://accounts.google.com/o/oauth2/v2/auth?x=1')
      expect(store.loginMethod).toBe('google')
    })

    it('logs out an existing login before starting a Google login', async () => {
      holdLogin(userWithWallet)

      await useAuthStore().startGoogleLogin()

      expect(fake.privy.auth.logout).toHaveBeenCalledTimes(1)
      expect(fake.privy.auth.logout.mock.invocationCallOrder[0]).toBeLessThan(
        fake.privy.auth.oauth.generateURL.mock.invocationCallOrder[0],
      )
    })
  })

  describe('completeOAuth', () => {
    it('completes a Google login without creating a wallet at login', async () => {
      fake.privy.auth.oauth.loginWithCode.mockResolvedValue({
        user: userWithWallet,
        is_new_user: false,
      })
      const store = useAuthStore()

      await store.completeOAuth('code-1', 'state-1')

      expect(fake.privy.auth.oauth.loginWithCode).toHaveBeenCalledWith(
        'code-1',
        'state-1',
        undefined,
        undefined,
        'login-or-sign-up',
        NO_WALLET_AT_LOGIN,
      )
      expect(store.status).toBe('authenticated')
      expect(store.loginMethod).toBe('google')
      expect(store.hasWallet).toBe(true)
      expect(store.isNew).toBe(false)
    })

    it('records the error code of a failed Google login and stays logged out', async () => {
      fake.privy.auth.oauth.loginWithCode.mockRejectedValue(
        Object.assign(new Error('mismatch'), {
          code: 'pkce_state_code_mismatch',
        }),
      )
      const store = useAuthStore()

      await expect(store.completeOAuth('code-1', 'bad')).rejects.toThrow(
        'mismatch',
      )

      expect(store.error).toBe('pkce_state_code_mismatch')
      expect(store.status).not.toBe('authenticated')
    })
  })

  describe('email login', () => {
    it('sends the confirmation code to the email address', async () => {
      const store = useAuthStore()

      await store.sendEmailCode('ada@example.com')

      expect(fake.privy.auth.email.sendCode).toHaveBeenCalledWith(
        'ada@example.com',
      )
      expect(store.loginMethod).toBe('email')
    })

    it('logs out an existing login before sending a code', async () => {
      holdLogin(userWithWallet)

      await useAuthStore().sendEmailCode('ada@example.com')

      expect(fake.privy.auth.logout.mock.invocationCallOrder[0]).toBeLessThan(
        fake.privy.auth.email.sendCode.mock.invocationCallOrder[0],
      )
    })

    it('logs in with the code and records a new user who has no wallet yet', async () => {
      const store = await loggedInStore(newUser, true)

      expect(fake.privy.auth.email.loginWithCode).toHaveBeenCalledWith(
        'ada@example.com',
        '123456',
        'login-or-sign-up',
        NO_WALLET_AT_LOGIN,
      )
      expect(store.status).toBe('authenticated')
      expect(store.hasWallet).toBe(false)
      expect(store.isNew).toBe(true)
    })

    it('knows the email of the logged-in user, and forgets it when the login ends', async () => {
      const store = await loggedInStore(userWithWallet)
      expect(store.email).toBe('ada@example.com')

      await store.useDifferentAccount()

      expect(store.email).toBeNull()
    })

    it('records the error code of a wrong confirmation code', async () => {
      fake.privy.auth.email.loginWithCode.mockRejectedValue(
        Object.assign(new Error('Invalid code'), {
          code: 'invalid_credentials',
        }),
      )
      const store = useAuthStore()

      await expect(
        store.loginWithEmailCode('ada@example.com', '000000'),
      ).rejects.toThrow('Invalid code')

      expect(store.error).toBe('invalid_credentials')
    })
  })

  describe('provisionWallet', () => {
    it('creates the embedded wallet for a user who has none and connects it', async () => {
      const store = await loggedInStore(newUser, true)
      fake.privy.embeddedWallet.create.mockResolvedValue({
        user: userWithWallet,
      })

      await store.provisionWallet()

      expect(fake.mountWalletIframe).toHaveBeenCalled()
      expect(fake.privy.embeddedWallet.create).toHaveBeenCalledWith({
        idempotencyKey: expect.stringMatching(/^[0-9a-f]{64}$/),
      })
      const connected = fake.walletStore.setWallet.mock.calls[0][0]
      expect(connected).toBeInstanceOf(PrivyWallet)
      expect(await connected.getAddress()).toBe(ADDRESS)
      expect(store.walletAddress).toBe(ADDRESS)
      expect(store.hasWallet).toBe(true)
    })

    it('connects an existing wallet without creating another', async () => {
      const store = await loggedInStore(userWithWallet)

      await store.provisionWallet()

      expect(fake.privy.embeddedWallet.create).not.toHaveBeenCalled()
      expect(fake.walletStore.setWallet).toHaveBeenCalledTimes(1)
    })

    it('does not create a second wallet when retried after a failure', async () => {
      const store = await loggedInStore(newUser, true)
      fake.privy.embeddedWallet.create.mockResolvedValue({
        user: userWithWallet,
      })
      fake.privy.embeddedWallet.getEthereumProvider.mockRejectedValueOnce(
        Object.assign(new Error('iframe blocked'), {
          code: 'embedded_wallet_webview_not_loaded',
        }),
      )

      await expect(store.provisionWallet()).rejects.toThrow('iframe blocked')
      await store.provisionWallet()

      expect(fake.privy.embeddedWallet.create).toHaveBeenCalledTimes(1)
      expect(fake.walletStore.setWallet).toHaveBeenCalledTimes(1)
      expect(store.error).toBeNull()
    })

    it('gives the connected wallet a disconnect that ends the Privy login', async () => {
      const store = await loggedInStore(userWithWallet)
      await store.provisionWallet()
      const connected = fake.walletStore.setWallet.mock
        .calls[0][0] as PrivyWallet

      expect(await connected.disconnect()).toBe(true)

      // No user id: with one the SDK waits on the wallet iframe to clear MFA.
      expect(fake.privy.auth.logout).toHaveBeenCalledWith()
      expect(fake.teardownWalletIframe).toHaveBeenCalled()
      expect(store.status).toBe('anonymous')
      expect(store.user).toBeNull()
      expect(store.walletAddress).toBeNull()
    })

    it('asks Privy for the wallet before creating one, so a create that failed late is not repeated', async () => {
      const store = await loggedInStore(newUser, true)
      // The first create reaches Privy and makes the wallet, but its answer is lost.
      fake.privy.embeddedWallet.create.mockRejectedValueOnce(
        Object.assign(new Error('timeout'), {
          code: 'embedded_wallet_creation_error',
        }),
      )
      fake.privy.user.get
        .mockResolvedValueOnce({ user: newUser })
        .mockResolvedValue({ user: userWithWallet })

      await expect(store.provisionWallet()).rejects.toThrow('timeout')
      await store.provisionWallet()

      expect(fake.privy.embeddedWallet.create).toHaveBeenCalledTimes(1)
      expect(fake.walletStore.setWallet).toHaveBeenCalledTimes(1)
    })

    it('does not leave a signing wallet behind when the login ends while it connects', async () => {
      const store = await loggedInStore(userWithWallet)
      let finishConnect: () => void = () => undefined
      fake.walletStore.setWallet.mockImplementation(
        (wallet: unknown) =>
          new Promise<void>(resolve => {
            finishConnect = () => {
              fake.walletStore.wallet = wallet
              resolve()
            }
          }),
      )

      const connecting = store.provisionWallet()
      await vi.waitFor(() =>
        expect(fake.walletStore.setWallet).toHaveBeenCalled(),
      )
      await store.useDifferentAccount()
      finishConnect()

      await expect(connecting).rejects.toThrow()
      expect(fake.walletStore.setWatchOnlyIfExist).toHaveBeenCalled()
      expect(store.walletAddress).toBeNull()
      expect(store.hasWallet).toBe(false)
    })

    it('refuses to connect when there is no chain to connect on', async () => {
      const store = await loggedInStore(userWithWallet)
      fake.chain.selectedChain = undefined

      await expect(store.provisionWallet()).rejects.toThrow()
      expect(fake.walletStore.setWallet).not.toHaveBeenCalled()
    })
  })

  describe('ending a login', () => {
    it('does not wipe a login made while the logout was still in flight', async () => {
      const store = await loggedInStore(userWithWallet)
      await store.provisionWallet()
      const connected = fake.walletStore.setWallet.mock
        .calls[0][0] as PrivyWallet
      let finishLogout: () => void = () => undefined
      fake.privy.auth.logout.mockImplementation(
        () => new Promise<void>(resolve => (finishLogout = resolve)),
      )

      const disconnecting = connected.disconnect()
      await vi.waitFor(() => expect(fake.privy.auth.logout).toHaveBeenCalled())
      await store.loginWithEmailCode('ada@example.com', '654321')
      finishLogout()
      await disconnecting

      expect(store.status).toBe('authenticated')
      expect(store.user).not.toBeNull()
    })

    it('turns an active Privy wallet watch-only when another account is chosen', async () => {
      const store = await loggedInStore(userWithWallet)
      await store.provisionWallet()
      fake.walletStore.wallet = fake.walletStore.setWallet.mock.calls[0][0]

      await store.useDifferentAccount()

      expect(fake.walletStore.setWatchOnlyIfExist).toHaveBeenCalledTimes(1)
    })

    it('still turns it watch-only when the logout fails', async () => {
      const store = await loggedInStore(userWithWallet)
      await store.provisionWallet()
      fake.walletStore.wallet = fake.walletStore.setWallet.mock.calls[0][0]
      fake.privy.auth.logout.mockRejectedValue(new Error('offline'))

      await expect(store.useDifferentAccount()).rejects.toThrow('offline')

      expect(fake.walletStore.setWatchOnlyIfExist).toHaveBeenCalledTimes(1)
    })

    describe('for a user whose wallet has a passkey check', () => {
      const protectedUser = userWith([
        emailAccount,
        walletAccount,
        passkeyAccount('cred-a', true),
      ])
      const connect = async () => {
        const store = await loggedInStore(protectedUser)
        fake.privy.user.get.mockResolvedValue({ user: protectedUser })
        await store.provisionWallet()
        return fake.walletStore.setWallet.mock.calls[0][0] as PrivyWallet
      }

      it('has the wallet forget a check it has passed, so the next login on this device is asked again', async () => {
        const connected = await connect()

        await connected.disconnect()

        expect(fake.privy.mfa.clearMfa.mock.calls).toEqual([
          [{ userId: 'did:privy:1' }],
        ])
        // It is the wallet iframe that forgets: it must still be there.
        expect(
          fake.privy.mfa.clearMfa.mock.invocationCallOrder[0],
        ).toBeLessThan(fake.teardownWalletIframe.mock.invocationCallOrder[0])
        expect(fake.privy.auth.logout).toHaveBeenCalledTimes(1)
      })

      it('logs out all the same when the wallet cannot forget it', async () => {
        const connected = await connect()
        fake.privy.mfa.clearMfa.mockRejectedValue(new Error('not loaded'))

        await connected.disconnect()

        expect(fake.teardownWalletIframe).toHaveBeenCalledTimes(1)
        expect(fake.privy.auth.logout).toHaveBeenCalledTimes(1)
      })

      it('does not wait long on a wallet that does not answer', async () => {
        const connected = await connect()
        fake.privy.mfa.clearMfa.mockReturnValue(new Promise(() => undefined))
        vi.useFakeTimers()
        try {
          const disconnecting = connected.disconnect()
          await vi.advanceTimersByTimeAsync(2000)
          await disconnecting
        } finally {
          vi.useRealTimers()
        }

        expect(fake.privy.auth.logout).toHaveBeenCalledTimes(1)
      })
    })

    it('asks nothing of the wallet when the user has no passkey check', async () => {
      const store = await loggedInStore(userWithWallet)
      fake.privy.user.get.mockResolvedValue({ user: userWithWallet })
      await store.provisionWallet()
      const connected = fake.walletStore.setWallet.mock
        .calls[0][0] as PrivyWallet

      await connected.disconnect()

      expect(fake.privy.mfa.clearMfa).not.toHaveBeenCalled()
      expect(fake.privy.auth.logout).toHaveBeenCalledTimes(1)
    })

    it('leaves another wallet alone when a login that is not active is dropped', async () => {
      holdLogin(userWithWallet)
      fake.walletStore.wallet = { getWalletType: () => 'INJECTED' }

      await useAuthStore().useDifferentAccount()

      expect(fake.walletStore.setWatchOnlyIfExist).not.toHaveBeenCalled()
    })
  })

  describe('a login lost while its wallet is connected', () => {
    /** A connected Privy wallet whose every request Privy fails with `error`. */
    const connectedWalletFailingWith = async (error: Error) => {
      fake.privy.embeddedWallet.getEthereumProvider.mockResolvedValue({
        request: vi.fn().mockRejectedValue(error),
      })
      const store = await loggedInStore(userWithWallet)
      await store.provisionWallet()
      const wallet = fake.walletStore.setWallet.mock.calls[0][0] as PrivyWallet
      fake.walletStore.wallet = wallet
      return { store, wallet }
    }

    it('leaves the wallet watch-only and reports the expired login when signing fails without a login', async () => {
      const { store, wallet } = await connectedWalletFailingWith(
        new Error('Missing privy token. User must be logged in'),
      )
      fake.privy.getAccessToken.mockResolvedValue(null)

      await expect(wallet.SignMessage({ message: 'hello' })).rejects.toThrow(
        'Your login has expired. Log in again to continue.',
      )

      expect(fake.walletStore.setWatchOnlyIfExist).toHaveBeenCalledTimes(1)
      expect(fake.privy.auth.logout).toHaveBeenCalledTimes(1)
      expect(store.status).toBe('anonymous')
    })

    it('keeps the wallet connected when signing fails for another reason', async () => {
      const { store, wallet } = await connectedWalletFailingWith(
        new Error('rate limited'),
      )
      fake.privy.getAccessToken.mockResolvedValue('tok')

      await expect(wallet.SignMessage({ message: 'hello' })).rejects.toThrow(
        'rate limited',
      )

      expect(fake.walletStore.setWatchOnlyIfExist).not.toHaveBeenCalled()
      expect(fake.privy.auth.logout).not.toHaveBeenCalled()
      expect(store.status).toBe('authenticated')
    })

    it('still leaves the wallet watch-only when Privy cannot be told the login ended', async () => {
      const { wallet } = await connectedWalletFailingWith(
        new Error('Missing privy token. User must be logged in'),
      )
      fake.privy.getAccessToken.mockResolvedValue(null)
      fake.privy.auth.logout.mockRejectedValue(new Error('offline'))

      await expect(wallet.SignMessage({ message: 'hello' })).rejects.toThrow(
        'Your login has expired. Log in again to continue.',
      )

      expect(fake.walletStore.setWatchOnlyIfExist).toHaveBeenCalledTimes(1)
    })

    it('treats the login as still there when Privy cannot say either way', async () => {
      const { wallet } = await connectedWalletFailingWith(new Error('offline'))
      fake.privy.getAccessToken.mockRejectedValue(new Error('offline'))

      await expect(wallet.SignMessage({ message: 'hello' })).rejects.toThrow(
        'offline',
      )

      expect(fake.walletStore.setWatchOnlyIfExist).not.toHaveBeenCalled()
    })
  })

  describe('passkeys', () => {
    it("starts answering Privy's passkey checks as soon as the SDK is loaded", async () => {
      await loggedInStore(userWithWallet)

      expect(fake.answerPasskeyChecks).toHaveBeenCalled()
    })

    it("lists the account's passkeys, and whether each one is in use as the check", async () => {
      const store = await loggedInStore(
        userWith([
          emailAccount,
          walletAccount,
          passkeyAccount('cred-a', true),
          passkeyAccount('cred-b', false),
        ]),
      )

      expect(store.passkeys).toEqual([
        {
          credentialId: 'cred-a',
          name: 'iCloud Keychain',
          addedAt: 1_794_000_000,
          active: true,
        },
        {
          credentialId: 'cred-b',
          name: 'iCloud Keychain',
          addedAt: 1_794_000_000,
          active: false,
        },
      ])
    })

    it('adds a passkey: links the new one, then makes every passkey of the account the check', async () => {
      const store = await loggedInStore(
        userWith([emailAccount, walletAccount, passkeyAccount('cred-a', true)]),
      )
      fake.linkPasskey.mockResolvedValue(
        userWith([
          emailAccount,
          walletAccount,
          passkeyAccount('cred-a', true),
          passkeyAccount('cred-new', false),
        ]),
      )
      fake.enrollPasskeys.mockResolvedValue(undefined)
      fake.privy.user.get.mockResolvedValue({
        user: userWith([
          emailAccount,
          walletAccount,
          passkeyAccount('cred-a', true),
          passkeyAccount('cred-new', true),
        ]),
      })

      expect(await store.addPasskey('settings')).toBe('added')

      expect(fake.enrollPasskeys).toHaveBeenCalledWith(['cred-a', 'cred-new'])
      expect(store.passkeys.map(passkey => passkey.active)).toEqual([
        true,
        true,
      ])
      expect(store.passkeyAdded).toBe(true)
    })

    it('changes nothing when the user dismisses the browser prompt', async () => {
      const store = await loggedInStore(userWithWallet)
      fake.linkPasskey.mockRejectedValue(new PasskeyCancelledError())

      expect(await store.addPasskey('settings')).toBe('cancelled')

      expect(fake.enrollPasskeys).not.toHaveBeenCalled()
      expect(store.passkeys).toEqual([])
      expect(store.passkeyAdded).toBe(false)
      expect(store.error).toBeNull()
    })

    it('keeps a passkey that was linked but could not be made the check, so that can be tried again', async () => {
      const store = await loggedInStore(userWithWallet)
      fake.linkPasskey.mockResolvedValue(
        userWith([
          emailAccount,
          walletAccount,
          passkeyAccount('cred-new', false),
        ]),
      )
      fake.enrollPasskeys.mockRejectedValueOnce(new Error('offline'))

      await expect(store.addPasskey('settings')).rejects.toThrow('offline')
      expect(store.passkeys).toEqual([
        expect.objectContaining({ credentialId: 'cred-new', active: false }),
      ])

      fake.enrollPasskeys.mockResolvedValue(undefined)
      fake.privy.user.get.mockResolvedValue({
        user: userWith([
          emailAccount,
          walletAccount,
          passkeyAccount('cred-new', true),
        ]),
      })
      expect(store.passkeyAdded).toBe(false)
      await store.activatePasskeys('settings')

      expect(fake.enrollPasskeys).toHaveBeenLastCalledWith(['cred-new'])
      expect(store.passkeys[0].active).toBe(true)
      // The add is complete only now, and the user is told so.
      expect(store.passkeyAdded).toBe(true)
      expect(fake.trackAccountSecurityEvent).toHaveBeenLastCalledWith(
        'Passkey_Add_Succeeded',
        { source: 'settings' },
      )
    })

    it('removes a passkey and shows the account without it', async () => {
      const store = await loggedInStore(
        userWith([emailAccount, walletAccount, passkeyAccount('cred-a', true)]),
      )
      fake.unlinkPasskey.mockResolvedValue(undefined)
      fake.privy.user.get.mockResolvedValue({ user: userWithWallet })

      await store.removePasskey('cred-a')

      expect(fake.unlinkPasskey).toHaveBeenCalledWith('cred-a')
      expect(store.passkeys).toEqual([])
    })

    it('reports adding a passkey to analytics with where it started and never with a credential', async () => {
      const store = await loggedInStore(userWithWallet)
      fake.linkPasskey.mockRejectedValue(
        Object.assign(new Error('nope'), { code: 'failed_to_create_passkey' }),
      )

      await expect(store.addPasskey('home_prompt')).rejects.toThrow('nope')

      expect(fake.trackAccountSecurityEvent.mock.calls).toEqual([
        ['Passkey_Add_Started', { source: 'home_prompt' }],
        [
          'Passkey_Add_Failed',
          { source: 'home_prompt', reason: 'failed_to_create_passkey' },
        ],
      ])
    })
  })

  describe('the recovery phrase', () => {
    const WORDS =
      'legal winner thank year wave sausage worth useful legal winner thank yellow'.split(
        ' ',
      )

    /** A store whose Privy wallet is connected and is the active one. */
    const connectedStore = async () => {
      const store = await loggedInStore(userWithWallet)
      await store.provisionWallet()
      fake.walletStore.wallet = fake.walletStore.setWallet.mock.calls[0][0]
      fake.privy.getAccessToken.mockResolvedValue('tok')
      fake.exportRecoveryPhrase.mockResolvedValue(WORDS)
      return store
    }

    it('asks Privy for the phrase of the connected wallet and hands the words on', async () => {
      const store = await connectedStore()

      expect(await store.exportRecoveryPhrase()).toEqual(WORDS)
      expect(fake.exportRecoveryPhrase).toHaveBeenCalledWith(
        expect.objectContaining({ address: ADDRESS }),
      )
    })

    it('keeps no copy of the words', async () => {
      const store = await connectedStore()

      await store.exportRecoveryPhrase()

      const kept = JSON.stringify(store.$state)
      for (const word of new Set(WORDS)) expect(kept).not.toContain(word)
    })

    it('refuses when the connected wallet is not the Privy one', async () => {
      const store = await connectedStore()
      fake.walletStore.wallet = { getWalletType: () => 'INJECTED' }

      await expect(store.exportRecoveryPhrase()).rejects.toThrow()
      expect(fake.exportRecoveryPhrase).not.toHaveBeenCalled()
    })

    it('refuses when the login is no longer live', async () => {
      const store = await connectedStore()
      fake.privy.getAccessToken.mockResolvedValue(null)

      await expect(store.exportRecoveryPhrase()).rejects.toThrow()
      expect(fake.exportRecoveryPhrase).not.toHaveBeenCalled()
    })
  })

  describe('a login that is still valid in the tab', () => {
    it('reports its email so the user can be asked to continue', async () => {
      holdLogin(userWithWallet)

      expect(await useAuthStore().findExistingLogin()).toEqual({
        email: 'ada@example.com',
      })
    })

    it('reports nothing, without loading Privy, when the tab holds no Privy data', async () => {
      expect(await useAuthStore().findExistingLogin()).toBeNull()
      expect(fake.privyReady).not.toHaveBeenCalled()
    })

    it('reports nothing when the stored data is not a login', async () => {
      sessionStorage.setItem('privy:caid', '"c"')

      expect(await useAuthStore().findExistingLogin()).toBeNull()
    })

    it('adopts the login when the user chooses to continue with it', async () => {
      holdLogin(userWithWallet)
      const store = useAuthStore()

      await store.continueWithExistingLogin()

      expect(store.status).toBe('authenticated')
      expect(store.hasWallet).toBe(true)
      expect(fake.privy.auth.logout).not.toHaveBeenCalled()
    })

    it('knows how the user logged in, though no login step ran this time', async () => {
      holdLogin(userWithWallet)
      const store = useAuthStore()

      await store.continueWithExistingLogin()

      expect(store.loginMethod).toBe('email')
    })

    it('tells a Google login from an email one when it continues with it', async () => {
      holdLogin(
        userWith([
          { type: 'google_oauth', email: 'ada@example.com', subject: 'g-1' },
          walletAccount,
        ]),
      )
      const store = useAuthStore()

      await store.continueWithExistingLogin()

      expect(store.loginMethod).toBe('google')
    })

    it('names the way the user logged in last when the account has both', async () => {
      holdLogin(
        userWith([
          { ...emailAccount, latest_verified_at: 1_794_000_000 },
          {
            type: 'google_oauth',
            email: 'ada@example.com',
            subject: 'g-1',
            latest_verified_at: 1_794_000_500,
          },
          walletAccount,
        ]),
      )
      const store = useAuthStore()

      await store.continueWithExistingLogin()

      expect(store.loginMethod).toBe('google')
    })

    it('logs out when the user picks a different account', async () => {
      holdLogin(userWithWallet)
      const store = useAuthStore()

      await store.useDifferentAccount()

      expect(fake.privy.auth.logout).toHaveBeenCalledTimes(1)
      expect(store.status).toBe('anonymous')
    })
  })

  describe('deleting a saved Privy address', () => {
    it('ends the login that address belongs to', async () => {
      holdLogin(userWithWallet)

      await useAuthStore().endLoginFor(ADDRESS)

      expect(fake.privy.auth.logout).toHaveBeenCalledTimes(1)
    })

    it('matches the address whatever its letter case', async () => {
      holdLogin(userWithWallet)

      await useAuthStore().endLoginFor(
        ADDRESS.toUpperCase().replace('0X', '0x'),
      )

      expect(fake.privy.auth.logout).toHaveBeenCalledTimes(1)
    })

    it('keeps a login that belongs to another address', async () => {
      holdLogin(userWithWallet)

      await useAuthStore().endLoginFor(
        '0x2222222222222222222222222222222222222222',
      )

      expect(fake.privy.auth.logout).not.toHaveBeenCalled()
    })

    it('does not load Privy when the tab holds no login', async () => {
      await useAuthStore().endLoginFor(ADDRESS)

      expect(fake.privyReady).not.toHaveBeenCalled()
    })

    it('leaves the wallet watch-only when the deleted address was connected', async () => {
      const store = await loggedInStore(userWithWallet)
      await store.provisionWallet()
      holdLogin(userWithWallet)
      fake.walletStore.wallet = fake.walletStore.setWallet.mock.calls[0][0]

      await store.endLoginFor(ADDRESS)

      expect(fake.privy.auth.logout).toHaveBeenCalledTimes(1)
      expect(fake.walletStore.setWatchOnlyIfExist).toHaveBeenCalledTimes(1)
      expect(store.status).toBe('anonymous')
    })
  })

  describe('setOptIn', () => {
    it('records the choice and reports it to analytics', () => {
      const store = useAuthStore()

      store.setOptIn(true)

      expect(store.emailOptIn).toBe(true)
      expect(fake.trackOnboardingEvent).toHaveBeenCalledWith(
        'Onboarding_Opt_In',
        { value: true },
      )
    })
  })
})
