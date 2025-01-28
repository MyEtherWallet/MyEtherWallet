import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { WalletInterface } from '@/providers/common/walletInterface'

export const useWalletStore = defineStore('walletStore', () => {
  const wallet = ref({})

  const setWallet = (newWallet: WalletInterface) => {
    wallet.value = newWallet
  }

  const removeWallet = () => {
    wallet.value = {}
  }

  return { wallet, setWallet, removeWallet }
})
