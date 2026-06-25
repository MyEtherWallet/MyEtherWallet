import { PURCHASE_CHAIN_TO_V7 } from '@/types/buyToken'
import type { Chain } from '@/mew_api/types'

/**
 * Reverse lookup: given a V7 chain name (e.g. `"ETHEREUM"`), return the
 * purchase API's chain code (e.g. `"ETH"`). Returns `undefined` if the V7 name
 * has no mapping or `v7Name` itself is `undefined`.
 */
export const v7ToPurchaseChain = (
  v7Name: string | undefined,
): string | undefined =>
  v7Name
    ? Object.entries(PURCHASE_CHAIN_TO_V7).find(([, v7]) => v7 === v7Name)?.[0]
    : undefined

/**
 * Given a purchase API chain code (e.g. `"ETH"`) and the list of V7 chains,
 * return the matching `Chain` object — or `undefined` if the code is not
 * mapped or the corresponding V7 chain is not in the list.
 */
export const purchaseChainToChain = (
  purchaseCode: string,
  chains: Chain[],
): Chain | undefined => {
  const v7Name = PURCHASE_CHAIN_TO_V7[purchaseCode]
  return v7Name ? chains.find(c => c.name === v7Name) : undefined
}
