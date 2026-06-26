<template>
  <app-dialog
    v-model:is-open="isOpen"
    z-index-overlay="z-[200]"
    z-index-container="z-[201]"
    class="xs:max-w-[480px] xs:h-[382px] mx-auto rounded-32"
    @close-dialog="onCloseIcon"
  >
    <template #content>
      <div class="p-6 h-full flex flex-col justify-between">
        <!-- Top: token icons + headline -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center">
            <img
              v-for="(icon, i) in tokenIcons"
              :key="i"
              :src="icon"
              alt=""
              class="w-10 h-10 rounded-full border-[1.5px] border-white bg-white object-cover"
              :class="i > 0 ? '-ml-2' : ''"
            />
          </div>
          <h1 class="text-s-28 font-bold leading-8 tracking-tight">
            Weekend stock trading:
            <span class="text-primary">Unlocked!</span>
          </h1>
        </div>
        <!-- Footer: body + actions (mt on mobile where height is auto and
             justify-between gives no gap; reset at xs+ where height is fixed) -->
        <div class="flex flex-col gap-5 mt-8 xs:mt-0">
          <p class="text-s-16 leading-[22px] text-info">
            SPYon, QQQon, CRCLon, NVDAon, TSLAon, GOOGLon are now open for 24/7
            trading. Trade the news, trade the tweets, make your stock moves any
            time.
          </p>
          <div class="flex gap-2">
            <button
              class="flex-1 h-12 rounded-24 bg-primary text-white text-s-16 font-semibold"
              @click="onTradeNow"
            >
              Trade now
            </button>
            <button
              class="flex-1 h-12 rounded-24 bg-grey-10 text-black text-s-16 font-semibold"
              @click="onGotIt"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import AppDialog from '@/components/AppDialog.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useWeekendTradingAnnouncementStore } from '@/stores/weekendTradingAnnouncementStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useMarketStatus } from '@/modules/trade/composables'
import { analytics, WeekendTradingAnnouncementEvent } from '@/analytics'
import { ROUTES_ACCESS, ROUTES_CREATE_WALLET } from '@/router/routeNames'
import nvda from '@/assets/images/weekend-trading/nvda.png'
import qqq from '@/assets/images/weekend-trading/qqq.png'
import googl from '@/assets/images/weekend-trading/googl.png'
import spy from '@/assets/images/weekend-trading/spy.png'
import tsla from '@/assets/images/weekend-trading/tsla.png'
import crcl from '@/assets/images/weekend-trading/crcl.png'

const tokenIcons = [nvda, qqq, googl, spy, tsla, crcl]

const walletStore = useWalletStore()
const { isWalletUnlocked } = storeToRefs(walletStore)
const walletMenu = useWalletMenuStore()
const announcement = useWeekendTradingAnnouncementStore()
const { modalSeen } = storeToRefs(announcement)

const { isTradingRestrictedInRegion } = storeToRefs(useGlobalStore())
const { fetchTradingRestriction } = useMarketStatus()

const isOpen = ref(false)

const showAfter = ref(false)
let openDialogTimeout: ReturnType<typeof setTimeout> | null = null

const router = useRouter()
const route = useRoute()
onMounted(async () => {
  await router.isReady()
  // Don't surface the 24/7 trading announcement where trading is restricted.
  // Awaiting here (the result is cached per session) avoids flashing the modal
  // before the restriction status resolves.
  await fetchTradingRestriction()
  if (isTradingRestrictedInRegion.value) return
  if (!modalSeen.value) {
    if (
      !isWalletUnlocked.value &&
      (route.name === ROUTES_ACCESS.ACCESS.NAME ||
        route.name === ROUTES_CREATE_WALLET.CREATE_WALLET.NAME)
    ) {
      showAfter.value = true
    } else {
      openDialog()
    }
  }
})

const openDialog = () => {
  // Defer behind the Welcome dialog so a brand-new user isn't shown two modals
  // at once. In dev the Welcome dialog never mounts, so don't require it there.
  if (isTradingRestrictedInRegion.value) return
  if (!modalSeen.value) {
    isOpen.value = true
    announcement.markModalSeen()
    analytics.trackWeekendTradingAnnouncementEvent(
      WeekendTradingAnnouncementEvent.MODAL_SHOWN,
    )
  }
}

const scheduleOpenDialog = () => {
  if (openDialogTimeout) {
    clearTimeout(openDialogTimeout)
  }
  openDialogTimeout = setTimeout(openDialog, 2000)
}

watch(
  () => isWalletUnlocked.value,
  () => {
    if (isWalletUnlocked.value && showAfter.value) {
      scheduleOpenDialog()
    }
  },
)

const onTradeNow = () => {
  isOpen.value = false
  walletMenu.openPanel('trade')
  analytics.trackWeekendTradingAnnouncementEvent(
    WeekendTradingAnnouncementEvent.MODAL_CLICK_TRADE_NOW,
  )
}

const onGotIt = () => {
  isOpen.value = false
  analytics.trackWeekendTradingAnnouncementEvent(
    WeekendTradingAnnouncementEvent.MODAL_DISMISSED,
  )
}

// Close (X) icon / overlay click — AppDialog has already closed itself,
// so just report the dismissal.
const onCloseIcon = () => {
  analytics.trackWeekendTradingAnnouncementEvent(
    WeekendTradingAnnouncementEvent.MODAL_DISMISSED,
  )
}
</script>
