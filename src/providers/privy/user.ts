import {
  generateWalletIdempotencyKey,
  getEntropyDetailsFromUser,
  getUserEmbeddedEthereumWallet,
} from '@privy-io/js-sdk-core'
import type Privy from '@privy-io/js-sdk-core'
import type { EntropyIdVerifier } from '@privy-io/js-sdk-core'

/** What a Privy login resolves to: the user plus the new-user flag. */
export type PrivySession = Awaited<
  ReturnType<Privy['auth']['email']['loginWithCode']>
>
/**
 * A Privy user. An interface rather than an alias: the SDK only exposes the
 * shape through a package the app does not depend on directly, and a store
 * that holds a user needs a type it can name.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PrivyUser extends SessionUser {}
type SessionUser = PrivySession['user']
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PrivyEmbeddedWallet extends EmbeddedWalletAccount {}
type EmbeddedWalletAccount = NonNullable<
  ReturnType<typeof getUserEmbeddedEthereumWallet>
>
/** What `embeddedWallet.getEthereumProvider()` takes to open a user's wallet. */
export type PrivyWalletProviderInput = {
  wallet: PrivyEmbeddedWallet
  entropyId: string
  entropyIdVerifier: EntropyIdVerifier
}

/** A user created this recently counts as new when the login response has no flag. */
const NEW_USER_WINDOW_SECONDS = 60

/** The user's embedded Ethereum wallet, or null while none has been created. */
export const embeddedWallet = (
  user: PrivyUser | null,
): PrivyEmbeddedWallet | null => getUserEmbeddedEthereumWallet(user)

/**
 * Key that makes creating this user's wallet safe to repeat: Privy answers a
 * second create that carries the same key with the wallet it already made.
 */
export const walletIdempotencyKey = (user: PrivyUser): Promise<string> =>
  generateWalletIdempotencyKey(user.id, 'ethereum')

/**
 * Everything `embeddedWallet.getEthereumProvider()` needs for this user's
 * wallet, or null while the user has none.
 */
export const walletProviderInput = (
  user: PrivyUser,
): PrivyWalletProviderInput | null => {
  const wallet = embeddedWallet(user)
  const entropy = getEntropyDetailsFromUser(user)
  return wallet && entropy ? { wallet, ...entropy } : null
}

/**
 * The address to show for this login: the email-login address, or the Google
 * account's email for a user who only ever signed in with Google.
 */
export const primaryEmail = (user: PrivyUser): string | undefined => {
  for (const account of user.linked_accounts) {
    if (account.type === 'email') return account.address
  }
  for (const account of user.linked_accounts) {
    if (account.type === 'google_oauth') return account.email
  }
  return undefined
}

/**
 * Whether this login created the user. Analytics only: the flow itself
 * branches on whether the user has a wallet. `created_at` is in seconds.
 */
export const isNewUser = (
  session: PrivySession,
  now: number = Date.now(),
): boolean =>
  session.is_new_user ??
  now / 1000 - session.user.created_at <= NEW_USER_WINDOW_SECONDS
