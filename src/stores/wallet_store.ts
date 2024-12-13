import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type WalletInterface from '@/modules/access/common/WalletInterface';

const MAIN_TOKEN_CONTRACT = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

type Token = {
  balance: string;
  contract: string;
  decimals: number;
  logo_url: string;
  name: string;
  symbol: string;
  price: number;
}

export const useWalletStore = defineStore('walletStore', () => {
  const wallet: Ref<WalletInterface> = ref({} as WalletInterface);
  const tokens: Ref<Array<Token>> = ref([]);
  const balance = ref('0');

  const setTokens = (newTokens: Array<Token>) => {
    tokens.value = newTokens;
    newTokens.forEach((token) => {
      if (token.contract === MAIN_TOKEN_CONTRACT) {
        balance.value = token.balance;
      }
    })
  }

  const removeTokens = () => {
    tokens.value = [];
  }

  const setWallet = (newWallet: WalletInterface) => {
    wallet.value = newWallet;
  }

  const removeWallet = () => {
    wallet.value = {} as WalletInterface;
  }

  return {
    wallet, setWallet, removeWallet, setTokens, removeTokens
  }
})
