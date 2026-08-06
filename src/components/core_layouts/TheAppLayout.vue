<template>
  <div class="h-screen relative flex overflow-hidden">
    <the-header class="basis-full" @wheel="onHeaderWheel" />

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
          class="cursor-pointer top-0 xs:top-[69px] sm:top-[77px] fixed inset-0 bg-black/30 z-[19] h-screen w-screen overscroll-none overflow-hidden xl:hidden"
          @click="walletMenu.setIsOpenSideMenu(false)"
          aria-hidden
        />
      </transition>
    </teleport>
    <div
      ref="scrollContainer"
      :class="[
        isOpenSideMenu ? 'xl:mr-[455px]' : 'xl:mr-[80px]',
        backgroundClass,
        'flex w-full mr-[60px] xs:mr-[80px]',
        isOverflowHidden
          ? 'overflow-hidden'
          : 'overflow-y-auto no-scrollbar scrollbar-hide',
      ]"
    >
      <div :class="['absolute w-full', backgroundClass]"></div>
      <div
        :class="['relative flex justify-center  w-full mt-[68px] sm:mt-[76px]']"
      >
        <main :class="[' basis-full w-full max-w-[1440px] mx-auto relative']">
          <div
            :class="[
              'min-h-[600px] pt-3 xs:pt-6',
              isNewHome ? '' : 'px-3 xs:px-5',
            ]"
          >
            <router-view />
          </div>
          <MewFooter
            :use-i18n="useI18n"
            :amplitude="analytics.amplitude"
            :link-component="RouterLink"
            :package-version="packageVersion"
            :user-consent="analyticsStore.consent"
            :curr-project="CURR_PROJECT"
            @update:consent="handleSetConsent"
            class="px-3 xs:px-5"
          />
          <div
            class="sticky flex items-center justify-center w-full bottom-0 z-10"
          >
            <a
              class="text-s-14 sm:text-s-16 text-center group hover:underline hoverOpacityHasBG transition h-12 px-5 md-header:px-9 bg-white shadow-[0px_3px_12px_-6px_rgba(0,0,0,0.32)] rounded-3xl flex items-center justify-center mb-5"
              :href="configs.VINATGE"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ t('common.old_version_link') }}
              <arrow-long-right-icon
                class="w-5 h-5 text-black inline-block group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>
        </main>
      </div>
    </div>

    <layout-wallet />
  </div>
</template>

<script setup lang="ts">
import { MewFooter } from '@myetherwallet/vue-common-components'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { inject, computed, ref, watch } from 'vue'
import type { Analytics } from '@/analytics/amplitude'
import { Provider } from '@/providers'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import TheHeader from './TheHeader.vue'
import LayoutWallet from './LayoutWallet.vue'
import { ROUTES_MAIN } from '@/router/routeNames'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useAppLayoutStore } from '@/stores/appLayoutStore'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '@/stores/walletStore'
import configs from '@/configs'
import { ArrowLongRightIcon } from '@heroicons/vue/24/solid'

const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)
const { t } = useI18n()

const analyticsStore = useAnalyticsStore()
const analytics = inject<Analytics>(Provider.ANALYTICS)!
const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)

//TODO: make a new project for MEW  PORTOFLIO APP
const CURR_PROJECT = 'MEW_WEBAPP'
/**
 * App Version
 */

const packageVersion = configs.APP_VERSION

const handleSetConsent = (consent: boolean) => {
  analyticsStore.setTrackingConsent(consent)
}

const route = useRoute()
const router = useRouter()

// When the wallet is disconnected/removed, return the user to the public Home.
// (Connecting does NOT auto-navigate — the user opens their portfolio manually
// via the header logo or the hero CTA.)
watch(isWalletConnected, connected => {
  if (!connected) {
    router.push({ name: ROUTES_MAIN.HOME.NAME })
  }
})

const backgroundClass = computed(() => {
  if (route.name === ROUTES_MAIN.PORTFOLIO.NAME && !isWalletConnected.value) {
    return 'home-not-connected-background '
  } else if (route.name === ROUTES_MAIN.EARN.NAME) {
    return 'blue-gradient'
  } else {
    return ''
  }
})

// The Home page ('/') keeps the layout max-width but drops the shared
// horizontal padding, so its sections own their padding.
const isNewHome = computed(() => route.name === ROUTES_MAIN.HOME.NAME)

const appLayoutStore = useAppLayoutStore()
const { isOverflowHidden } = storeToRefs(appLayoutStore)

const scrollContainer = ref<HTMLElement | null>(null)

const onHeaderWheel = (e: WheelEvent) => {
  if (isOverflowHidden.value || !scrollContainer.value) return
  scrollContainer.value?.scrollBy({ top: e.deltaY, behavior: 'instant' })
}
</script>

<style scoped>
.blue-gradient {
  background: linear-gradient(
    180deg,
    rgba(44, 91, 255, 0.24) 0%,
    rgba(0, 152, 166, 0) 100%
  );
}
.home-not-connected-background {
  background:
    radial-gradient(
      circle 350px at 50% 45%,
      rgba(255, 255, 255, 0.5) 60%,
      transparent 100%
    ),
    linear-gradient(
      to bottom,
      transparent,
      rgba(255, 255, 255, 1) 400px,
      #f5f5f7 100%
    ),
    linear-gradient(
      to right,
      rgba(90, 197, 210, 1) 0%,
      rgba(149, 206, 253, 1) 50%,
      rgba(126, 138, 250, 1) 100%
    );
}
</style>
