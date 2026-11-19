/**
 * Whether this browser can make and use passkeys at all. Every passkey entry
 * point hides when it cannot. Kept apart from the passkey module so it can be
 * asked without loading the Privy SDK.
 */
export const passkeySupported = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.PublicKeyCredential === 'function'
