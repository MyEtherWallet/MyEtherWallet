<template>
  <div class="h-screen w-full overflow-y-auto static">
    <the-wallet-menu
      :sidebar-is-open="getSideBarIsOpen"
      @click-close="setSidebaMenu"
    />
    <div
      :class="[
        'flex flex-col items-center overflow-y-auto relative',
        { 'ml-[300px]': isDesktop },
      ]"
    >
      <TheWalletHeader @click-menu-btn="setSidebaMenu" />
      <main :class="['flex-initial']">
        <div class="pt-16 mt-10 p-2 md:p-6">
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
import { storeToRefs } from 'pinia'
import { useWalletStore } from '@/stores/wallet_store'

const walletStore = useWalletStore()
const { wallet } = storeToRefs(walletStore)
const { setTokens } = walletStore

onMounted(async () => {
  const fetchTokens = await fetch(
    `https://tmp.ethvm.dev/balances/137/${wallet.value.getAddressString()}`,
  )
  const tokens = await fetchTokens.json()
  setTokens(tokens.result)
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
