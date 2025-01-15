import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type WalletInterface from '@/modules/access/common/WalletInterface';

interface Token {
  balance: string;
  contract: string;
  decimals: number;
  logo_url: string;
  name: string;
  price: number;
  symbol: string;
}

export const useWalletStore = defineStore('walletStore', () => {
  const wallet = ref({});
  const walletTokens: Ref<Array<Token>> = ref([]);

  const setTokens = (tokens: Array<Token>) => {
    walletTokens.value = tokens;
  }

  const clearTokens = () => {
    walletTokens.value = [];
  }

  const setWallet = (newWallet: WalletInterface) => {
    wallet.value = newWallet;
  }

  const removeWallet = () => {
    wallet.value = {};
  }

  return {
    wallet, setWallet, removeWallet, setTokens,
    clearTokens
  }
})
