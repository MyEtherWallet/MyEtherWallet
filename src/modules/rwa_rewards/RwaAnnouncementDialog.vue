<template>
  <app-dialog
    v-model:is-open="isOpen"
    hide-close
    z-index-overlay="z-[200]"
    z-index-container="z-[201]"
    class="sm:max-w-[480px] mx-auto !rounded-32"
  >
    <template #content>
      <div class="flex flex-col overflow-hidden" style="border-radius: 32px">
        <img
          :src="overlayImg"
          alt=""
          class="w-full select-none pointer-events-none"
        />
        <div class="flex flex-col" style="padding: 24px; gap: 40px">
          <div class="flex flex-col" style="gap: 16px">
            <h1
              style="
                font-size: 28px;
                font-weight: 700;
                line-height: 32px;
                letter-spacing: -0.84px;
                color: #000;
                text-align: center;
              "
            >
              {{ $t('rwaRewards.announcement_title') }}
            </h1>
            <p
              style="
                font-size: 16px;
                font-weight: 400;
                line-height: 22px;
                color: #575757;
                text-align: center;
                white-space: pre-line;
              "
            >
              {{ $t('rwaRewards.announcement_desc') }}
            </p>
          </div>
          <button
            class="hoverOpacityHasBG"
            style="
              width: 100%;
              height: 48px;
              padding: 0 16px;
              border-radius: 24px;
              background: #e6e6e6;
              color: #000;
              font-size: 16px;
              font-weight: 600;
              letter-spacing: -0.32px;
            "
            @click="onGoToOffer"
          >
            {{ $t('rwaRewards.go_to_offer') }}
          </button>
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
import { useHoldingsStore } from '@/stores/holdingsStore'
import { useRwaAnnouncementStore } from '@/stores/rwaAnnouncementStore'
import { useMarketStatus } from '@/modules/trade/composables'
import { ROUTES_ACCESS, ROUTES_CREATE_WALLET } from '@/router/routeNames'
import overlayImg from '@/assets/images/rwa-rewards/tradeAndHoldFullscreenOverlayImg.png'

const walletStore = useWalletStore()
const { isWalletUnlocked } = storeToRefs(walletStore)
const holdingsStore = useHoldingsStore()
const announcement = useRwaAnnouncementStore()
const { modalSeen } = storeToRefs(announcement)
const { isTradingRestrictedInRegion, fetchTradingRestriction } =
  useMarketStatus()

const isOpen = ref(false)
const showAfter = ref(false)
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
  if (!modalSeen.value) {
    isOpen.value = true
    announcement.markModalSeen()
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

const onGoToOffer = () => {
  isOpen.value = false
  holdingsStore.openModal()
}
</script>
