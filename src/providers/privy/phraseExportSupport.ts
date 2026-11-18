/**
 * Whether this page can get a Privy wallet's recovery phrase.
 *
 * It cannot. Privy's answer of 2026-11-18: client-side export exists only in
 * their React SDK, inside their own modal on their own origin, and the user
 * signer signs no export request. So the request `exportWallet.ts` makes is
 * refused, and Settings offers no Recovery Phrase row.
 *
 * The row, its screens and the export code stay in the tree, unreachable,
 * until the way to export is settled. Change this answer only together with
 * an export path Privy supports. Kept apart from the export module so it can
 * be asked without loading the Privy SDK.
 */
export const phraseExportSupported = (): boolean => false
