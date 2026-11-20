/**
 * Parts of the Privy account that are built and tested but not offered to
 * users yet, by design's call of 2026-11-19. Each is one answer here, so it
 * is turned on in one place; the code behind it stays in the tree. Kept apart
 * from the modules that load the Privy SDK so it can be asked anywhere.
 */

/**
 * Whether a user can add a passkey: the button in Settings › Login methods
 * and the prompt on Home. Off ("disable passkeys"). An account that already
 * has a passkey still sees it, can remove it, and is still asked for it when
 * its wallet signs.
 */
export const passkeysOffered = (): boolean => false

/**
 * Whether the account menu shows "Buy crypto" and "Deposit from wallet" to
 * an empty Privy wallet. Off ("don't update address dropdown for now").
 */
export const fundActionsOffered = (): boolean => false
