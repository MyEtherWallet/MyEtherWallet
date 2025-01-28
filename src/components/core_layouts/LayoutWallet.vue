<template>
  <div class="h-screen w-full overflow-y-auto static">
    <the-wallet-menu
      :sidebar-is-open="getSideBarIsOpen"
      @click-close="setSidebaMenu"
    />
    <div
      :class="[
        'flex flex-col justify-center overflow-y-auto relative px-5 xs:px-10',
        { 'ml-[300px]': isDesktop },
      ]"
    >
      <TheWalletHeader @click-menu-btn="setSidebaMenu" />
      <main
        :class="['flex-initial w-full max-w-[496px] xs:max-w-[932px] mx-auto']"
      >
        <div class="mt-[84px] xs:mt-[104px] min-h-[500px]">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TheWalletMenu from './wallet/TheWalletMenu.vue'
import TheWalletHeader from './wallet/TheWalletHeader.vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { useWalletStore } from '@/stores/wallet_store'
import { storeToRefs } from 'pinia'
import { useFetch, useTimeoutFn } from '@vueuse/core'
const store = useWalletStore()
const { wallet } = storeToRefs(store)
const { setTokens, setIsLoadingBalances } = store

const urlTokenBalances = computed(() => {
  return `https://tmp.ethvm.dev/balances/137/${wallet.value.getAddressString()}/?noInjectErrors=false`
})

const { execute } = useFetch(urlTokenBalances.value, {
  afterFetch(ctx) {
    setTokens(ctx.data.result.result)
    setIsLoadingBalances(false)
    return ctx.data.result.result
  },
  onFetchError: e => {
    console.error(e)
    if (retryIsPending) {
      stopRetry()
    }
    if (retryCount.value < 3) {
      startRetry()
    } else {
      console.error('Failed to fetch token balances after retrying 3 times')
    }
    return e
  },
  refetch: true, //  Will trigger another request urlTokenBalances
})
  .get()
  .json()

const retryCount = ref(0)

const {
  isPending: retryIsPending,
  start: startRetry,
  stop: stopRetry,
} = useTimeoutFn(
  () => {
    console.log('retrying...')
    retryCount.value++
    execute()
  },
  1000,
  { immediate: false },
)

/** ------------------------------
 * SideBar Menu
 * ------------------------------*/
const { isDesktop } = useAppBreakpoints()
const sidebarIsOpen = ref(false)

const getSideBarIsOpen = computed<boolean>(() => {
  return isDesktop.value || sidebarIsOpen.value
})
const setSidebaMenu = () => {
  if (isDesktop.value) return
  sidebarIsOpen.value = !sidebarIsOpen.value
}
</script>

<style scoped></style>
