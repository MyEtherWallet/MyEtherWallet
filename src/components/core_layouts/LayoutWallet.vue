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
import { ref, computed } from 'vue'
import TheWalletMenu from './wallet/TheWalletMenu.vue'
import TheWalletHeader from './wallet/TheWalletHeader.vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'

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
