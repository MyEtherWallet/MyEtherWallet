import { describe, expect, it } from 'vitest'
import {
  embeddedWallet,
  isNewUser,
  primaryEmail,
  walletIdempotencyKey,
  walletProviderInput,
  type PrivySession,
  type PrivyUser,
} from '@/providers/privy/user'

const emailAccount = {
  type: 'email',
  address: 'ada@example.com',
  verified_at: 1,
  first_verified_at: 1,
  latest_verified_at: 1,
}
const googleAccount = {
  type: 'google_oauth',
  subject: 'g-1',
  email: 'ada@gmail.com',
  name: 'Ada',
  verified_at: 1,
  first_verified_at: 1,
  latest_verified_at: 1,
}
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
  recovery_method: 'privy',
  user_can_sign: true,
  verified_at: 1,
  first_verified_at: 1,
  latest_verified_at: 1,
}

const userWith = (accounts: unknown[], createdAt = 1_000): PrivyUser =>
  ({
    id: 'did:privy:1',
    created_at: createdAt,
    has_accepted_terms: false,
    is_guest: false,
    linked_accounts: accounts,
    mfa_methods: [],
  }) as unknown as PrivyUser

const sessionFor = (user: PrivyUser, isNew?: boolean): PrivySession =>
  ({ user, is_new_user: isNew }) as unknown as PrivySession

describe('embeddedWallet', () => {
  it('finds the embedded Ethereum wallet among the linked accounts', () => {
    const user = userWith([emailAccount, walletAccount])

    expect(embeddedWallet(user)?.address).toBe(walletAccount.address)
  })

  it('returns null when the user has no embedded wallet yet', () => {
    expect(embeddedWallet(userWith([emailAccount]))).toBeNull()
  })
})

describe('walletProviderInput', () => {
  it('returns what the SDK needs to open the embedded wallet provider', () => {
    const input = walletProviderInput(userWith([emailAccount, walletAccount]))

    expect(input?.wallet.address).toBe(walletAccount.address)
    expect(input?.entropyId).toBe(walletAccount.address)
    expect(input?.entropyIdVerifier).toBe('ethereum-address-verifier')
  })

  it('returns null while the user has no embedded wallet', () => {
    expect(walletProviderInput(userWith([emailAccount]))).toBeNull()
  })
})

describe('walletIdempotencyKey', () => {
  it('gives the same key every time for one user, and another for another user', async () => {
    const ada = userWith([emailAccount])
    const bob = { ...ada, id: 'did:privy:2' } as PrivyUser

    expect(await walletIdempotencyKey(ada)).toBe(
      await walletIdempotencyKey(ada),
    )
    expect(await walletIdempotencyKey(ada)).not.toBe(
      await walletIdempotencyKey(bob),
    )
  })
})

describe('primaryEmail', () => {
  it('uses the email login address', () => {
    expect(primaryEmail(userWith([emailAccount, googleAccount]))).toBe(
      'ada@example.com',
    )
  })

  it('falls back to the Google account email for Google logins', () => {
    expect(primaryEmail(userWith([googleAccount]))).toBe('ada@gmail.com')
  })

  it('returns undefined when no linked account carries an email', () => {
    expect(primaryEmail(userWith([walletAccount]))).toBeUndefined()
  })
})

describe('isNewUser', () => {
  const now = 2_000_000

  it('trusts the login response when it says the user is new', () => {
    const user = userWith([], 1)

    expect(isNewUser(sessionFor(user, true), now)).toBe(true)
  })

  it('trusts the login response when it says the user is not new', () => {
    const user = userWith([], now / 1000)

    expect(isNewUser(sessionFor(user, false), now)).toBe(false)
  })

  it('falls back to a user created within the last minute', () => {
    const user = userWith([], now / 1000 - 30)

    expect(isNewUser(sessionFor(user), now)).toBe(true)
  })

  it('falls back to not new for an older user', () => {
    const user = userWith([], now / 1000 - 61)

    expect(isNewUser(sessionFor(user), now)).toBe(false)
  })
})
