<template>
  <app-dialog
    v-model:is-open="isOpen"
    class="xs:max-w-[420px] mx-auto rounded-32"
    persistent
  >
    <template #content>
      <div class="p-6 flex flex-col gap-5">
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
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import AppDialog from '@/components/AppDialog.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useWeekendTradingAnnouncementStore } from '@/stores/weekendTradingAnnouncementStore'
import { analytics, WeekendTradingAnnouncementEvent } from '@/analytics'
import configs from '@/configs'
import nvda from '@/assets/images/weekend-trading/nvda.png'
import qqq from '@/assets/images/weekend-trading/qqq.png'
import googl from '@/assets/images/weekend-trading/googl.png'
import spy from '@/assets/images/weekend-trading/spy.png'
import tsla from '@/assets/images/weekend-trading/tsla.png'
import crcl from '@/assets/images/weekend-trading/crcl.png'

const tokenIcons = [nvda, qqq, googl, spy, tsla, crcl]

const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)
const globalStore = useGlobalStore()
const { welcomeDialogDismissed } = storeToRefs(globalStore)
const walletMenu = useWalletMenuStore()
const announcement = useWeekendTradingAnnouncementStore()
const { modalSeen } = storeToRefs(announcement)

const isOpen = ref(false)

const maybeOpen = () => {
  // Defer behind the Welcome dialog so a brand-new user isn't shown two modals
  // at once. In dev the Welcome dialog never mounts, so don't require it there.
  const welcomeClear = welcomeDialogDismissed.value || configs.IS_DEV_MODE
  if (isWalletConnected.value && !modalSeen.value && welcomeClear) {
    isOpen.value = true
    announcement.markModalSeen()
    analytics.trackWeekendTradingAnnouncementEvent(
      WeekendTradingAnnouncementEvent.MODAL_SHOWN,
    )
  }
}

watch([isWalletConnected, welcomeDialogDismissed], () => maybeOpen(), {
  immediate: true,
})

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
</script>
