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
}

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
        const raw = t.balance ?? '0'
        if (!/^\d+$/.test(raw)) continue
        const bal = Number(formatUnits(BigInt(raw), t.decimals ?? 0))
        if (bal > 0) {
          tokenCount += 1
          usdValue += bal * Number(t.price ?? 0)
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
      await Promise.all(
        entries.map(async e => {
          balances.value[e.id] = await fetchOne(e)
        }),
      )
    } finally {
      isLoading.value = false
    }
  }

  return { balances, isLoading, fetchFor }
}
