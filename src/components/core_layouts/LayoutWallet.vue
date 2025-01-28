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
        <div
          class="mt-[84px] xs:mt-[104px] p-6 sm:p-10 lg:p-14 min-h-[500px] bg-white rounded-4xl"
        >
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import TheWalletMenu from './wallet/TheWalletMenu.vue'
import TheWalletHeader from './wallet/TheWalletHeader.vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'

import { useWalletStore } from '@/stores/wallet_store'
import { storeToRefs } from 'pinia'

const store = useWalletStore()
const { wallet } = storeToRefs(store)
const { setTokens } = store

onMounted(async () => {
  const fetchTokens = await fetch(
    `https://tmp.ethvm.dev/balances/137/${wallet.value.getAddressString()}?noInjectErrors=false`,
  )
  const tokens = await fetchTokens.json()
  setTokens(tokens.result.result)
})

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
