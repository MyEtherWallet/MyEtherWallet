import { type TokenBalanceBTCRaw, type TokenBalancesRaw } from '@/mew_api/types'
import { useChainsStore } from '@/stores/chainsStore'
import { MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'

export default async function useBalanceHandler(
  balances: TokenBalancesRaw | TokenBalanceBTCRaw,
  setter: (data: TokenBalancesRaw['result']) => void,
  loadingFn: (isLoading: boolean) => void,
) {
  const chainStore = useChainsStore()
  const { selectedChain } = storeToRefs(chainStore)
  if (selectedChain.value?.type !== 'BITCOIN') {
    setter((balances as TokenBalancesRaw).result)
  } else {
    const BTCRawBalance: TokenBalanceBTCRaw = balances as TokenBalanceBTCRaw
    const btcBalances: TokenBalancesRaw['result'][0] = {
      ...BTCRawBalance,
      contract: MAIN_TOKEN_CONTRACT,
      logo_url: BTCRawBalance.logoUrl || selectedChain.value?.icon,
      market_cap: BTCRawBalance.marketCap,
      price_change_percentage_24h: BTCRawBalance.priceChangePercentage24h,
      sparkline_in_7d: BTCRawBalance.sparklineIn7d,
    }
    setter([btcBalances])
  }
  loadingFn(false)
}
