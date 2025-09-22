<template>
  <div class="h-screen relative flex overflow-y-auto">
    <the-wallet-header class="basis-full" />

    <!-- Background -->
    <teleport to="#app">
      <transition
        enter-from-class="opacity-0"
        enter-active-class="transform ease-out duration-300 transition "
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-active-class="ease-in duration-100 transition"
        leave-to-class="opacity-0"
        appear
      >
        <div
          v-if="isOpenSideMenu"
          class="cursor-pointer fixed inset-0 bg-black/30 z-[19] h-screen w-screen overscroll-none overflow-hidden xl:hidden"
          @click="walletMenu.setIsOpenSideMenu(false)"
          aria-hidden
        />
      </transition>
    </teleport>
    <div
      :class="[
        isOpenSideMenu ? 'xl:mr-[400px]' : 'xl:mr-[60px]',
        backgroundClass,
        'flex w-full mr-[60px]',
        isOverflowHidden ? 'overflow-hidden' : 'overflow-y-auto',
      ]"
    >
      <div
        :class="[
          'relative flex justify-center min-w-[320px] w-full   mt-[68px] sm:mt-[76px]',
        ]"
      >
        <main :class="[' basis-full w-full max-w-[1440px] mx-auto  ']">
          <div class="min-h-[600px] pt-6 xs:pt-10 lg:pt-12 px-5 2xl:px-7">
            <router-view />
          </div>
          <MewFooter
            :use-i18n="useI18n"
            :amplitude="analytics.amplitude"
            :link-component="RouterLink"
            :package-version="packageVersion"
            :user-consent="popupStore.consent"
            :curr-project="CURR_PROJECT"
            @update:consent="handleSetConsent"
            class="!px-5 !2xl:px-7"
          />
        </main>
      </div>
    </div>
    <layout-wallet />
  </div>
</template>

<script setup lang="ts">
import { MewFooter } from '@myetherwallet/vue-common-components'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { inject, computed } from 'vue'
import type { Analytics } from '@/analytics/amplitude'
import { Provider } from '@/providers'
import { usePopupStore } from '@/stores/popup'
import TheWalletHeader from './wallet/TheWalletHeader.vue'
import LayoutWallet from './LayoutWallet.vue'
import { ROUTES_ACCESS, ROUTES_MAIN } from '@/router/routeNames'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useAppLayoutStore } from '@/stores/appLayoutStore'
import { storeToRefs } from 'pinia'

const popupStore = usePopupStore()
const analytics = inject<Analytics>(Provider.ANALYTICS)!
const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)

//TODO: make a new project for MEW  PORTOFLIO APP
const CURR_PROJECT = 'MEW_PORTFOLIO'
/**
 * App Version
 */

const packageVersion = 'v7'

const handleSetConsent = (consent: boolean) => {
  popupStore.setTrackingConsent(consent)
}

const route = useRoute()

const backgroundClass = computed(() => {
  if (
    route.name === ROUTES_ACCESS.ACCESS.NAME ||
    route.name === ROUTES_MAIN.CRYPTO.NAME ||
    route.name === ROUTES_MAIN.TOKEN_INFO.NAME
  ) {
    return ''
  } else {
    return 'blue-gradient'
  }
})

const appLayoutStore = useAppLayoutStore()
const { isOverflowHidden } = storeToRefs(appLayoutStore)
</script>

<style scoped>
.blue-gradient {
  background: linear-gradient(
    180deg,
    rgba(44, 91, 255, 0.24) 0%,
    rgba(0, 152, 166, 0) 100%
  );
}
</style>
