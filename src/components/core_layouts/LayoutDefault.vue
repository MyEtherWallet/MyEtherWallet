<template>
  <div ref="appBodyRef">
    <MewHeader
      :use-i18n="useI18n"
      bg-visible
      :amplitude="analytics.amplitude"
      :link-component="RouterLink"
      :user-consent="popupStore.consent"
      :curr-project="CURR_PROJECT"
      @update:consent="handleSetConsent"
    >
      <!-- <template #lang-switch-mobile>
        <AppChangeLocale />
      </template> -->
    </MewHeader>
    <!-- <main> -->
    <main :class="['max-w-[1392px] px-5 md-header:px-10 mx-auto']">
      <div class="pt-16 mt-10">
        <router-view />
      </div>
    </main>
    <MewFooter
      :use-i18n="useI18n"
      :amplitude="analytics.amplitude"
      :link-component="RouterLink"
      :package-version="packageVersion"
      :user-consent="popupStore.consent"
      :curr-project="CURR_PROJECT"
      @update:consent="handleSetConsent"
    >
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
import { inject } from 'vue'
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

const handleSetConsent = (consent: boolean) => {
  popupStore.setTrackingConsent(consent)
}
</script>

<style scoped></style>
