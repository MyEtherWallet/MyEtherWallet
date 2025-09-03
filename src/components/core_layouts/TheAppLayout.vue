<template>
  <div ref="appBodyRef" class="h-screen w-full static">
    <the-wallet-header />
    <div
      :class="[
        backgroundClass,

        'relative flex justify-between h-[calc(100vh-68px)] sm:h-[calc(100vh-76px)] overflow-hidden',
      ]"
    >
      <div :class="['relative flex justify-center overflow-hidden mx-auto ']">
        <main
          :class="[
            ' flex-initial w-full max-w-[1440px] mx-auto overflow-y-auto mr-[64px] lg:mr-0',
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
            class="mr-[64px] lg:mr-0'"
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

const popupStore = usePopupStore()
const analytics = inject<Analytics>(Provider.ANALYTICS)!

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
