/**
 * Where Privy's React SDK keeps a login on this origin: its tokens in
 * localStorage, and a cookie copy of them unless told otherwise (the export
 * page tells it otherwise, see privyConfig.ts).
 *
 * The names are the SDK's own and not part of its public API; a test checks
 * them against the installed SDK, so an upgrade that renames one is noticed.
 */
export const SDK_SESSION_KEYS = [
  'privy:token',
  'privy:refresh_token',
  'privy:pat',
  'privy:id_token',
] as const
export const SDK_SESSION_COOKIES = [
  'privy-token',
  'privy-refresh-token',
  'privy-id-token',
  'privy-session',
] as const

/**
 * Remove the React SDK's login from this browser, synchronously.
 *
 * The SDK's own `logout()` asks Privy first and clears the browser only when
 * the answer is back, which never happens for a tab that is closing. This is
 * for that moment: whatever else is cut short, the tokens are gone.
 */
export const forgetSdkSession = (): void => {
  try {
    SDK_SESSION_KEYS.forEach(key => localStorage.removeItem(key))
  } catch {
    // Storage that cannot be reached holds no login to remove.
  }
  SDK_SESSION_COOKIES.forEach(name => {
    document.cookie = `${name}=; Max-Age=0; path=/`
  })
}
