import { type BitcoinBalanceResponse, type TokenBalancesRaw } from '@/mew_api/types'
import { useChainsStore } from '@/stores/chainsStore'
import { MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { fromBase } from '@/utils/unit'
import BigNumber from 'bignumber.js'
import { storeToRefs } from 'pinia'

export default async function useBalanceHandler(
  balances: TokenBalancesRaw | BitcoinBalanceResponse,
  setter: (data: TokenBalancesRaw['result']) => void,
  loadingFn: (isLoading: boolean) => void
) {
  const chainStore = useChainsStore()
  const { selectedChain } = storeToRefs(chainStore)
  if ((balances as TokenBalancesRaw).result) {
    setter((balances as TokenBalancesRaw).result)
  } else {
    // reformatted to be compatible with TokenBalancesRaw
    // TODO: replace once it gets fixed in the API
    const percent = fromBase(
      (balances as BitcoinBalanceResponse).balance.nativeValue,
      8,
    )
    const btcBalances = {
      balance: (balances as BitcoinBalanceResponse).balance.nativeValue,
      contract: MAIN_TOKEN_CONTRACT,
      logo_url: selectedChain.value?.icon || '',
      decimals: 8,
      name: selectedChain.value?.name || 'Bitcoin',
      symbol: (balances as BitcoinBalanceResponse).balance.nativeSymbol,
      price: parseFloat(
        BigNumber(
          (balances as BitcoinBalanceResponse).balance?.fiatValue || '0',
        )
          .dividedBy(BigNumber(percent))
          .decimalPlaces(2)
          .toString(),
      ),
    }
    setter([btcBalances])
  }
  loadingFn(false)
}