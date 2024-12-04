<template>
  <div ref="appBodyRef" :class="[coreBackground]">
    <MewHeader :use-i18n="useI18n" bg-visible :amplitude="analytics.amplitude" :link-component="RouterLink"
      :user-consent="popupStore.consent" :curr-project="CURR_PROJECT" @update:consent="handleSetConsent">
      <!-- <template #lang-switch-mobile>
        <AppChangeLocale />
      </template> -->
    </MewHeader>
    <div :class="[
      'absolute top-0 inset-x-0 flex justify-center overflow-hidden',
      background,
    ]"></div>
    <!-- <main> -->
    <main :class="['max-w-[1392px] px-5 md-header:px-10 mx-auto']">
      <div class="pt-16 mt-10">
        <router-view />
      </div>
    </main>
    <MewFooter :use-i18n="useI18n" :amplitude="analytics.amplitude" :link-component="RouterLink"
      :package-version="packageVersion" :user-consent="popupStore.consent" :curr-project="CURR_PROJECT"
      @update:consent="handleSetConsent">
      <!-- <template #lang-switch-footer>
        <AppChangeLocale class="mt-5" />
      </template> -->
    </MewFooter>
  </div>
</template>

<script setup lang="ts">
import { MewHeader, MewFooter } from '@myetherwallet/vue-common-components'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed, inject } from 'vue'
import type { Analytics } from '@/analytics/amplitude'
import { Provider } from '@/providers'
import { usePopupStore } from '@/stores/popup'

const popupStore = usePopupStore()
const analytics = inject<Analytics>(Provider.ANALYTICS)!

const CURR_PROJECT = 'MEW_PORTFOLIO'
/**
 * App Version
 */

const packageVersion = 'v7'
/**
 * Header Scroll
 */

/**
 * Background
 */
const background = computed<string>(() => {
  // switch (routePath.value) {
  //   case '/':
  //     return `home overview bg-bottom bg-no-repeat bg-cover h-[710px] -z-30 `
  //   case '/staking':
  //     return 'staking h-[520px] md:h-[552px] lg:h-[600px] opacity-[40%]'
  //   case '/uk':
  //     return 'bg-white'
  //   default:
  //     return ''
  // }
  return ''
})

const coreBackground = computed<string>(() => {
  // switch (routePath.value) {
  //   case '/':
  //     return `relative bg-gradient-to-b from-white via-appBackground bg-[center_top_710px]`
  //   case '/uk':
  //     return 'home'
  //   default:
  //     return ''
  // }
  return ''
})

function handleSetConsent(consent: boolean) {
  popupStore.setTrackingConsent(consent)
}
</script>

<style scoped></style>
