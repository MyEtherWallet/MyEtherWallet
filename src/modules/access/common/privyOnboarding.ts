/**
 * Shared values for the Google / email login flow (MEW-2289). Timings live
 * here in one place so design can tune them.
 */

/** How long "Connected to Google" / "Success!" stays up before advancing. */
export const CONNECTED_HOLD_MS = 1200
/** Minimum time "Setting up your wallet…" shows, so it never flashes. */
export const WALLET_SETUP_MIN_MS = 800
/** How long the Google verification may take before it is called a timeout. */
export const GOOGLE_VERIFY_TIMEOUT_MS = 30_000
/** Seconds before "Resend code" can be used again. */
export const RESEND_COOLDOWN_SECONDS = 30

/** sessionStorage key for the route to return to after the Google redirect. */
export const RETURN_TO_KEY = 'mew:auth:return_to'

/** Query parameters Privy adds to the callback URL after a Google login. */
export const OAUTH_CODE_PARAM = 'privy_oauth_code'
export const OAUTH_STATE_PARAM = 'privy_oauth_state'

/** One state per screen of the flow; `existing_login` is the "Continue as" prompt. */
export type OnboardingState =
  | 'entry'
  | 'existing_login'
  | 'google.verifying'
  | 'google.connected'
  | 'email.code'
  | 'email.code.error'
  | 'email.code.success'
  | 'wallet.setup'
  | 'account.ready'
  | 'done'
  | 'error'

/** What went wrong, for the generic error screen. */
export type OnboardingError =
  'google' | 'timeout' | 'wallet' | 'storage' | 'generic'
