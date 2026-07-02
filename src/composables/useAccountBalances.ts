// src/composables/useAccountBalances.ts
import { ref, type Ref } from 'vue'
import { fetchWithRetry } from '@/mew_api/fetchWithRetry'
import type { TokenBalancesRaw } from '@/mew_api/types'
import { formatUnits } from 'viem'

export interface AccountBalance {
  usdValue: number
  tokenCount: number
}

export interface BalanceEntry {
  id: string
  chainName: string
  address: string
  /** Native-currency fiat price for the active chain — the /balances response returns
   *  price: null for the native token, so callers pass the chain's price to value it. */
  nativePrice?: number
}

/** The MEW API's sentinel contract for a chain's native currency (ETH, BNB, …). */
const NATIVE_TOKEN_CONTRACT = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export function useAccountBalances() {
  const balances: Ref<Record<string, AccountBalance>> = ref({})
  const isLoading = ref(false)

  const fetchOne = async (entry: BalanceEntry): Promise<AccountBalance> => {
    try {
      const res = await fetchWithRetry<TokenBalancesRaw>(
        `/balances/${entry.chainName}/${entry.address}/?noInjectErrors=false&sparklines=true`,
      )
      const result = res.result ?? []
      let usdValue = 0
      let tokenCount = 0
      for (const t of result) {
        // Balances arrive as hex ("0x…") or decimal strings; BigInt parses both.
        let wei: bigint
        try {
          wei = BigInt(t.balance ?? '0')
        } catch {
          continue
        }
        const bal = Number(formatUnits(wei, t.decimals ?? 18))
        if (bal > 0) {
          tokenCount += 1
          const isNative =
            (t.contract ?? '').toLowerCase() === NATIVE_TOKEN_CONTRACT
          const price = isNative
            ? (t.price ?? entry.nativePrice ?? 0)
            : (t.price ?? 0)
          usdValue += bal * Number(price)
        }
      }
      return { usdValue, tokenCount }
    } catch {
      return { usdValue: 0, tokenCount: 0 }
    }
  }

  const fetchFor = async (entries: BalanceEntry[]): Promise<void> => {
    isLoading.value = true
    try {
      const results = await Promise.all(
        entries.map(async e => [e.id, await fetchOne(e)] as const),
      )
      // Reassign (rather than mutating keys in place) so the record reference
      // changes and every dependent binding re-renders reliably.
      balances.value = { ...balances.value, ...Object.fromEntries(results) }
    } finally {
      isLoading.value = false
    }
  }

  const refreshOne = async (entry: BalanceEntry): Promise<void> => {
    balances.value = { ...balances.value, [entry.id]: await fetchOne(entry) }
  }

  return { balances, isLoading, fetchFor, refreshOne }
}
