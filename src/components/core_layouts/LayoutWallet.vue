<template>
  <div class="h-screen w-full overflow-y-auto static">
    <the-wallet-menu
      :sidebar-is-open="getSideBarIsOpen"
      @click-close="setSidebaMenu"
    />
    <div
      :class="[
        'flex flex-col justify-center overflow-y-auto relative px-5 xs:px-10',
        { 'ml-[300px]': isDesktopAndUp },
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
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { type TokenBalancesRaw } from '@/mew_api/types'

const store = useWalletStore()
const { wallet } = storeToRefs(store)
const { setTokens, setIsLoadingBalances } = store

wallet.value?.getBalance().then((balances: TokenBalancesRaw[]) => {
  setTokens(balances as TokenBalancesRaw[])
  setIsLoadingBalances(false)
})

/** ------------------------------
 * SideBar Menu
 * ------------------------------*/
const { isDesktopAndUp } = useAppBreakpoints()
const sidebarIsOpen = ref(false)

const getSideBarIsOpen = computed<boolean>(() => {
  return isDesktopAndUp.value || sidebarIsOpen.value
})
const setSidebaMenu = () => {
  if (isDesktopAndUp.value) return
  sidebarIsOpen.value = !sidebarIsOpen.value
}
</script>

<style scoped></style>
