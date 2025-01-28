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

  const setTokens = (newTokens: Array<Token>) => {
    tokens.value = newTokens.map(token => {
      return Object.assign({}, token, {
        balance: fromWei(token.balance, 'ether'),
      })
    })
    newTokens.forEach(token => {
      if (token.contract === MAIN_TOKEN_CONTRACT) {
        balance.value = fromWei(token.balance, 'ether')
      }
    })
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

  return {
    wallet,
    setWallet,
    removeWallet,
    setTokens,
    removeTokens,
    tokens,
    balance,
  }
})
