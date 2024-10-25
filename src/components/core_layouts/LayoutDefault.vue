<template>
  <div ref="appBodyRef" :class="[coreBackground]">
    <MewHeader
      :use-i18n="useI18n"
      bg-visible
      :amplitude="{ track }"
      :link-component="RouterLink"
      :user-consent="userConsent"
      :curr-project="CURR_PROJECT"
      @update:consent="val => (userConsent = val)"
    >
      <!-- <template #lang-switch-mobile>
        <AppChangeLocale />
      </template> -->
    </MewHeader>
    <div
      :class="[
        'absolute top-0 inset-x-0 flex justify-center overflow-hidden',
        background,
      ]"
    ></div>
    <!-- <main> -->
    <main :class="['max-w-[1392px] px-5 md-header:px-10 mx-auto']">
      <div>
        <slot />
      </div>
    </main>
    <MewFooter
      :use-i18n="useI18n"
      :amplitude="{ track }"
      :link-component="RouterLink"
      :package-version="packageVersion"
      :user-consent="userConsent"
      :curr-project="CURR_PROJECT"
      @update:consent="val => (userConsent = val)"
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
import { ref, computed } from 'vue'

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

/**
 * Fake Amplitude
 * Tracking event
 */
const track = () => {
  console.log('Tracking')
}

/**
 * Fake User Consent
 */
const userConsent = ref(false)
</script>

<style scoped></style>
