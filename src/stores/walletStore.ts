import { ref, type Ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { WalletInterface } from '@/providers/common/walletInterface'
import { fromWei } from 'web3-utils'
import type { TokenBalance, TokenBalanceRaw } from '@/mew_api/types'
export const MAIN_TOKEN_CONTRACT = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export const useWalletStore = defineStore('walletStore', () => {
  const wallet: Ref<WalletInterface | null> = ref(null) // allows for falsey
  const walletAddress: Ref<string | null> = ref(null)
  const tokens: Ref<Array<TokenBalance>> = ref([])
  const balance = ref('0')
  const isLoadingBalances = ref(true)

  const isWalletConnected = computed(() => {
    return wallet.value !== null && walletAddress.value !== null
  })
  const setTokens = (newTokens: Array<TokenBalanceRaw>) => {
    const locToken: TokenBalance[] = newTokens.map(token => {
      return Object.assign({}, token, {
        name: token.name ?? 'Unknown',
        symbol: token.symbol ?? 'Unknown',
        balance: fromWei(token.balance, 'ether'),
      })
    })
    const newTokenCopy: Array<TokenBalance> = []
    locToken.forEach(token => {
      if (token.contract === MAIN_TOKEN_CONTRACT) {
        newTokenCopy.unshift(token)
      } else {
        newTokenCopy.push(token)
      }
      if (token.contract === MAIN_TOKEN_CONTRACT) {
        balance.value = token.balance
      }
    })

    tokens.value = newTokenCopy
  }

  const removeTokens = () => {
    tokens.value = []
  }

  const setAddress = async () => {
    if (wallet.value) {
      walletAddress.value = await wallet.value.getAddress()
    }
  }

  const setWallet = (newWallet: WalletInterface) => {
    wallet.value = newWallet
    setAddress()
  }

  const removeWallet = () => {
    wallet.value = {} as WalletInterface
  }

  const setIsLoadingBalances = (isLoading: boolean) => {
    isLoadingBalances.value = isLoading
  }

  return {
    wallet,
    walletAddress,
    setWallet,
    removeWallet,
    setTokens,
    removeTokens,
    tokens,
    balance,
    isLoadingBalances,
    setIsLoadingBalances,
    setAddress,
    isWalletConnected,
  }
})
