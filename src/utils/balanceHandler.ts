import { type TokenBalancesRaw } from '@/mew_api/types'

export default async function useBalanceHandler(
  balances: TokenBalancesRaw,
  setter: (data: TokenBalancesRaw['result']) => void,
  loadingFn: (isLoading: boolean) => void,
) {
  setter((balances as TokenBalancesRaw).result)
  loadingFn(false)
}
