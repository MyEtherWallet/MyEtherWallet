import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { WalletInterface } from '@/providers/common/walletInterface'
import { fromWei } from 'web3-utils'

export const MAIN_TOKEN_CONTRACT = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export type Token = {
  balance: string
  contract: string
  decimals: number
  logo_url: string
  name: string
  symbol: string
  price: number
}

export const useWalletStore = defineStore('walletStore', () => {
  const wallet: Ref<WalletInterface> = ref(null as unknown as WalletInterface) // allows for falsey
  const tokens: Ref<Array<Token>> = ref([])
  const balance = ref('0')
  const isLoadingBalances = ref(true)

  const setTokens = (newTokens: Array<Token>) => {
    const locToken = newTokens.map(token => {
      return Object.assign({}, token, {
        balance: fromWei(token.balance, 'ether'),
      })
    })
    const newTokenCopy: Array<Token> = [];
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

    tokens.value = newTokenCopy;
  }

  const removeTokens = () => {
    tokens.value = []
  }

  const setWallet = (newWallet: WalletInterface) => {
    wallet.value = newWallet
  }

  const removeWallet = () => {
    wallet.value = {} as WalletInterface
  }

  const setIsLoadingBalances = (isLoading: boolean) => {
    isLoadingBalances.value = isLoading
  }

  return {
    wallet,
    setWallet,
    removeWallet,
    setTokens,
    removeTokens,
    tokens,
    balance,
    isLoadingBalances,
    setIsLoadingBalances,
  }
})
