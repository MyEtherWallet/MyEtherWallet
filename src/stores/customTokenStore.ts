import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface storedTokenInfo {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
}
export const useCustomTokenStore = defineStore('customTokenStore', () => {
  const customTokens = useLocalStorage<Record<string, Array<storedTokenInfo>>>('customTokens', {}, {
    mergeDefaults: true,
  });
  const editToken = ref<storedTokenInfo | null>(null)
  const addCustomToken = (chainName: string, tokenInfo: storedTokenInfo) => {
    if (customTokens.value[chainName]) {
      customTokens.value[chainName].push(tokenInfo)
    } else {
      customTokens.value[chainName] = [tokenInfo]
    }
  }
  const editCustomToken = (chainName: string, tokenAddress: string, updatedTokenInfo: storedTokenInfo) => {
    if (customTokens.value[chainName]) {
      const tokenIndex = customTokens.value[chainName].findIndex(
        (token) => token.address === tokenAddress
      )
      if (tokenIndex !== -1) {
        customTokens.value[chainName][tokenIndex] = updatedTokenInfo
      }
    }
  }

  const deleteCustomToken = (chainName: string, tokenAddress: string) => {
    if (customTokens.value[chainName]) {
      customTokens.value[chainName] = customTokens.value[chainName].filter(
        (token) => token.address !== tokenAddress
      )
    }
  }
  const isOpenCustomTokenDialog = ref(false)
  const openCustomTokenDialog = () => {
    isOpenCustomTokenDialog.value = true
  }
  const closeCustomTokenDialog = () => {
    isOpenCustomTokenDialog.value = false
    currentView.value = 'add'
  }

  const isStoredToken = (chainName: string, tokenAddress: string): boolean => {
    if (customTokens.value[chainName]) {
      return customTokens.value[chainName].some(
        (token) => token.address === tokenAddress
      )
    }
    return false
  }

  const currentView = ref<'add' | 'edit' | 'delete'>('add')
  const setCurrentView = (view: 'add' | 'edit' | 'delete', token?: storedTokenInfo) => {
    currentView.value = view
    editToken.value = token ?? null
  }

  return {
    isOpenCustomTokenDialog,
    openCustomTokenDialog,
    closeCustomTokenDialog,
    currentView,
    setCurrentView,
    addCustomToken,
    editCustomToken,
    deleteCustomToken,
    customTokens,
    isStoredToken
  }
})
