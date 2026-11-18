import {
  generateAuthorizationSignature,
  isUnifiedWallet,
} from '@privy-io/js-sdk-core'
import { WalletExport } from '@privy-io/routes'
import { validateMnemonic } from 'bip39'
import { privy } from './client'
import { createRecipient } from './hpke'
import type { PrivyEmbeddedWallet } from './user'

/**
 * Export of a Privy embedded wallet's recovery phrase.
 *
 * The SDK has no export of its own (Privy ships one only in its React SDK),
 * so this calls Privy's wallet export route directly, built the way the SDK
 * builds its own wallet requests: the request is signed with the user's
 * signing key inside Privy's iframe and sent with the user's access token.
 * Privy seals the phrase to a key made here for this one request, so the
 * phrase is readable only in this page.
 *
 * Reach this module through a dynamic `import()` only: it is needed by the
 * few users who export, and it brings the decryption library with it.
 */

export type PrivyExportFailure = 'unsupported_wallet' | 'not_a_phrase'

/** An export that could not be completed for a reason of our own. */
export class PrivyExportError extends Error {
  readonly code: PrivyExportFailure

  constructor(code: PrivyExportFailure, message: string) {
    super(message)
    this.name = 'PrivyExportError'
    this.code = code
  }
}

type ExportBody = NonNullable<(typeof WalletExport)['body']>

const EXPIRY_HEADER = 'privy-request-expiry'
/** How long Privy may take to process the request: the SDK's own allowance. */
const REQUEST_LIFETIME_MS = 30 * 60 * 1000

/**
 * The recovery phrase of the user's embedded wallet, one word per entry.
 *
 * The caller owns the result: nothing here keeps, logs or reports it, and no
 * error carries any part of it.
 *
 * @throws {PrivyExportError} `unsupported_wallet` for a wallet Privy does not
 *   hold on its servers (the route serves no other kind); `not_a_phrase` when
 *   the reply is not a valid recovery phrase
 * @throws Privy's own error when the request is refused or cannot be signed
 */
export const exportRecoveryPhrase = async (
  wallet: PrivyEmbeddedWallet,
): Promise<string[]> => {
  if (!isUnifiedWallet(wallet)) {
    throw new PrivyExportError(
      'unsupported_wallet',
      'This wallet cannot be exported through the wallet API',
    )
  }

  const recipient = await createRecipient()
  const params = { wallet_id: wallet.id }
  const body: ExportBody = {
    encryption_type: 'HPKE',
    recipient_public_key: recipient.publicKey,
    export_seed_phrase: true,
  }
  // The deadline is part of what is signed, so the same value goes in both.
  const expiry = String(Date.now() + REQUEST_LIFETIME_MS)
  const { signature } = await generateAuthorizationSignature(
    request => privy.embeddedWallet.signWithUserSigner(request),
    {
      version: 1,
      method: 'POST',
      url: privy.getCompiledPath(WalletExport, { params }),
      headers: { 'privy-app-id': privy.app.appId, [EXPIRY_HEADER]: expiry },
      body,
    },
  )

  const sealed = await privy.fetchPrivyRoute(WalletExport, {
    body,
    params,
    headers: {
      'privy-authorization-signature': signature,
      [EXPIRY_HEADER]: expiry,
    },
  })
  const opened = await recipient.open({
    encapsulatedKey: sealed.encapsulated_key,
    ciphertext: sealed.ciphertext,
  })

  const words = opened.trim().split(/\s+/)
  if (!validateMnemonic(words.join(' '))) {
    throw new PrivyExportError(
      'not_a_phrase',
      'Privy did not answer with a recovery phrase',
    )
  }
  return words
}
