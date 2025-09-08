<template>
  <div class="h-screen static">
    <welcome-dialog />

    <the-wallet-header />
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
          class="cursor-pointer fixed inset-0 bg-black/30 z-[19] h-screen w-screen overscroll-none overflow-hidden lg:hidden"
          @click="walletMenu.setIsOpenSideMenu(false)"
          aria-hidden
        />
      </transition>
    </teleport>
    <div
      :class="[
        backgroundClass,

        'relative flex  h-[calc(100vh-68px)] sm:h-[calc(100vh-76px)] overflow-hidden w-screen  min-w-[320px]',
      ]"
    >
      <div
        :class="[
          'relative flex justify-center overflow-hidden lg:mx-auto min-w-[320px] w-screen max-w-[1440px]',
        ]"
      >
        <main
          :class="[
            ' flex-initial w-full max-w-[1440px] mx-auto overflow-y-auto mr-[64px] lg:mr-0 ',
          ]"
        >
          <div
            class="min-h-[600px] pt-6 xs:pt-10 lg:pt-12 px-5 md-header:px-10"
          >
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
          />
        </main>
      </div>
      <layout-wallet />
    </div>
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
import { ROUTES_ACCESS } from '@/router/routeNames'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { storeToRefs } from 'pinia'
import WelcomeDialog from '@/components/core_layouts/WelcomeDialog.vue'

const popupStore = usePopupStore()
const analytics = inject<Analytics>(Provider.ANALYTICS)!
const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)

//TODO: make a new project for MEW  PORTOFLIO APP
const CURR_PROJECT = 'MEW_BLOG'
/**
 * App Version
 */

const packageVersion = 'v7'

const handleSetConsent = (consent: boolean) => {
  popupStore.setTrackingConsent(consent)
}

const route = useRoute()

const backgroundClass = computed(() => {
  if (route.name === ROUTES_ACCESS.ACCESS.NAME) {
    return ''
  } else {
    return 'blue-gradient'
  }
})
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
