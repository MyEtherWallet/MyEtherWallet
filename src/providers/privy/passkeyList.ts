import type { PrivyUser } from './user'

/** A passkey of a Privy account, as Settings lists it. */
export type PasskeyEntry = {
  /** Privy's id for the passkey. Never shown, logged or sent to analytics. */
  credentialId: string
  /** What made the passkey (a password manager or a device), when known. */
  name: string | undefined
  /** When it was added, in seconds since the epoch; null when Privy has no date. */
  addedAt: number | null
  /** Whether Privy asks for it before the wallet is used. A passkey that is only linked protects nothing. */
  active: boolean
}

/** The passkeys of this user, in the order Privy lists them. */
export const passkeysOf = (user: PrivyUser | null): PasskeyEntry[] =>
  (user?.linked_accounts ?? []).flatMap(account =>
    account.type === 'passkey'
      ? [
          {
            credentialId: account.credential_id,
            name: account.authenticator_name ?? account.created_with_device,
            addedAt: account.first_verified_at,
            active: account.enrolled_in_mfa,
          },
        ]
      : [],
  )
