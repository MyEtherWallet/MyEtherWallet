<template>
  <app-dialog
    v-model:is-open="isOpen"
    hide-close
    z-index-overlay="z-[200]"
    z-index-container="z-[201]"
    class="sm:max-w-[480px] mx-auto !rounded-32"
  >
    <template #content>
      <div class="flex flex-col overflow-hidden rounded-32">
        <img
          :src="overlayImg"
          alt=""
          class="w-full select-none pointer-events-none"
        />
        <div class="flex flex-col p-6 gap-10">
          <div class="flex flex-col gap-4">
            <h1
              class="text-s-28 font-bold leading-8 tracking-[-0.84px] text-black text-center"
            >
              {{ $t('rwaRewards.announcement_title') }}
            </h1>
            <p
              class="text-s-16 font-normal leading-[22px] text-[#575757] text-center whitespace-pre-line"
            >
              {{ $t('rwaRewards.announcement_desc') }}
            </p>
          </div>
          <app-base-button
            theme="neutral"
            class="w-full text-s-16 font-semibold tracking-[-0.32px]"
            @click="onGoToOffer"
          >
            {{ $t('rwaRewards.go_to_offer') }}
          </app-base-button>
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
import AppBaseButton from '@/components/AppBaseButton.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useHoldingsStore } from '@/stores/holdingsStore'
import { useRwaAnnouncementStore } from '@/stores/rwaAnnouncementStore'
import { useGlobalStore } from '@/stores/globalStore'
import { ROUTES_ACCESS, ROUTES_CREATE_WALLET } from '@/router/routeNames'
import overlayImg from '@/assets/images/rwa-rewards/tradeAndHoldFullscreenOverlayImg.png'
import {
  analytics,
  HoldRewardsBannerEvent,
  RerwadsAndOffersEvent,
} from '@/analytics'

const walletStore = useWalletStore()
const { isWalletUnlocked } = storeToRefs(walletStore)
const holdingsStore = useHoldingsStore()
const { canRegisterTrade } = storeToRefs(holdingsStore)
const announcement = useRwaAnnouncementStore()
const { modalSeen } = storeToRefs(announcement)
const globalStore = useGlobalStore()
const { isTradingRestrictedInRegion } = storeToRefs(globalStore)
const { fetchTradingRestriction } = globalStore

const isOpen = ref(false)
const showAfter = ref(false)
// Tracks whether the modal was closed by taking the CTA, so the close watcher
// doesn't also report a dismissal for the same interaction.
let wentToOffer = false
let openDialogTimeout: ReturnType<typeof setTimeout> | null = null

const router = useRouter()
const route = useRoute()

onMounted(async () => {
  await router.isReady()
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
  if (isTradingRestrictedInRegion.value) return
  // Don't announce an offer that can no longer be joined. Best-effort: reward
  // info only loads for an unlocked wallet, so an unknown state still announces.
  if (!canRegisterTrade.value) return
  if (!modalSeen.value) {
    isOpen.value = true
    announcement.markModalSeen()
    analytics.trackHoldRewardsBannerEvent(HoldRewardsBannerEvent.MODAL_SHOWN)
  }
}

const scheduleOpenDialog = () => {
  if (openDialogTimeout) clearTimeout(openDialogTimeout)
  openDialogTimeout = setTimeout(openDialog, 2000)
}

watch(
  () => isWalletUnlocked.value,
  () => {
    if (isWalletUnlocked.value && showAfter.value) scheduleOpenDialog()
  },
)

// Record when the announcement is closed (any path) so the 24/7 weekend-trading
// dialog can surface 3 days later.
watch(isOpen, (open, wasOpen) => {
  if (wasOpen && !open) {
    announcement.markModalClosed()
    if (!wentToOffer) {
      analytics.trackHoldRewardsBannerEvent(
        HoldRewardsBannerEvent.MODAL_DISMISSED,
      )
    }
  }
})

const onGoToOffer = () => {
  wentToOffer = true
  analytics.trackRewardsAndOffersEvent(
    RerwadsAndOffersEvent.CLICKED_MORE_INFO,
    {
      campaign: 'hold',
      cta: 'go_to_offer',
      location: 'main-banner',
    },
  )
  isOpen.value = false
  holdingsStore.openModal()
}
</script>
