// import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'
import type { GetWebTokenInfo, TokenBalanceRaw } from '@/mew_api/types'
import type { ComputedRef } from 'vue'

export const useTokenInfoStore = defineStore('tokenInfoStore', () => {
  const tokenStore = useLocalStorage<(TokenBalanceRaw | GetWebTokenInfo)[]>('tokenInfo', [], { mergeDefaults: true })
  const tokenInfo: ComputedRef<TokenBalanceRaw | GetWebTokenInfo | null> = computed(() => tokenStore.value[0] || null)

  const setTokenInfo = (value: TokenBalanceRaw | GetWebTokenInfo) => {
    tokenStore.value = [value]
  }

  const removeTokenInfo = () => {
    tokenStore.value = []
  }

  return {
    tokenInfo,
    setTokenInfo,
    removeTokenInfo
  }
})