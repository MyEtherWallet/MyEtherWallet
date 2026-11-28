import i18n from '@/i18n'

/**
 * Errors of the Privy wallet. Each message is the sentence the user reads, in
 * the app's language: the send, swap, trade and perps flows all put a failed
 * signature's message into their own error toast as it is.
 */

/** A request failed because the Privy login behind the wallet is gone. */
export class PrivyLoginExpiredError extends Error {
  constructor() {
    super(i18n.global.t('common.error.login_expired'))
    this.name = 'PrivyLoginExpiredError'
  }
}

export type PrivySignatureFailure =
  'not_a_transaction' | 'different_transaction'

/**
 * Privy answered a signing request with something other than the requested
 * transaction signed by this wallet. Nothing was broadcast.
 */
export class PrivySignatureError extends Error {
  readonly code: PrivySignatureFailure

  constructor(code: PrivySignatureFailure) {
    super(i18n.global.t('common.error.signature_not_verified'))
    this.name = 'PrivySignatureError'
    this.code = code
  }
}
