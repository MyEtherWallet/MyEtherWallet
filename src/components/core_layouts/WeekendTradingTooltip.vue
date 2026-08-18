<template>
  <base-tooltip :anchor="anchor" :visible="visible" @dismiss="dismiss">
    <!-- Token icons row -->
    <div class="flex items-center mb-5">
      <img
        v-for="(icon, i) in tokenIcons"
        :key="i"
        :src="icon"
        alt=""
        class="w-7 h-7 rounded-full border-[1.5px] border-white bg-white object-cover"
        :class="i > 0 ? '-ml-2' : ''"
      />
    </div>

    <!-- Headline -->
    <p class="text-s-14 font-semibold leading-[1.3] mb-1">
      {{ $t('trade.weekend.tooltip_headline') }}
    </p>

    <!-- Body -->
    <p class="text-s-12 text-info leading-[1.4]">
      {{
        $t('trade.weekend.tooltip_body', {
          tickers: 'AMZNon, MSTRon, COINon, ORCLon, TQQQon',
        })
      }}
    </p>
  </base-tooltip>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import BaseTooltip from '@/components/core_layouts/BaseTooltip.vue'
import { useWeekendTradingAnnouncementStore } from '@/stores/weekendTradingAnnouncementStore'
import { useRwaAnnouncementStore } from '@/stores/rwaAnnouncementStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useWalletStore } from '@/stores/walletStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useHoldingsStore } from '@/stores/holdingsStore'
import { analytics, WeekendTradingAnnouncementEvent } from '@/analytics'
import amzn from '@/assets/images/weekend-trading/amzn.png'
import coin from '@/assets/images/weekend-trading/coin.png'
import mstr from '@/assets/images/weekend-trading/mstr.png'
import orcl from '@/assets/images/weekend-trading/orcl.png'
import tqqq from '@/assets/images/weekend-trading/tqqq.png'

const tokenIcons = [amzn, coin, mstr, orcl, tqqq]

const props = defineProps<{
  anchor: HTMLElement | null
}>()

const announcement = useWeekendTradingAnnouncementStore()
const { shouldShowTooltip } = storeToRefs(announcement)

// Sequenced behind the RWA "Trade & Hold" campaign with no waiting period:
//
//  - never saw the campaign, dismissed the announcement → straight away
//  - never saw it, took "Go to offer" → once the offer modal is closed
//  - already saw the campaign in an earlier session → straight away
//
// `followupUnlocked` covers the first and third; the modal refs below cover the
// second, since "Go to offer" closes the announcement (which unlocks) and opens
// the offer modal in the same click.
const { followupUnlocked: rwaCampaignDone, isTradeInfoOpen } = storeToRefs(
  useRwaAnnouncementStore(),
)

const walletMenu = useWalletMenuStore()
const { walletPanel } = storeToRefs(walletMenu)

const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)

const { isTradingRestrictedInRegion } = storeToRefs(useGlobalStore())

// The offer modal behind "Go to offer" (and the Hold card's "More info").
const { isModalOpen: isRwaOfferModalOpen } = storeToRefs(useHoldingsStore())

// True while any Trade & Hold modal is on screen. The announcement itself isn't
// here: closing it is what unlocks the tooltip, so it can never still be open.
const rwaModalOpen = computed(
  () => isRwaOfferModalOpen.value || isTradeInfoOpen.value,
)

const visible = ref(false)

const tryShow = async () => {
  if (isTradingRestrictedInRegion.value) return
  if (!rwaCampaignDone.value) return
  if (rwaModalOpen.value) return
  if (!shouldShowTooltip.value || !props.anchor) return
  await nextTick()
  // Re-checked after the tick: "Go to offer" unlocks and opens the offer modal
  // in one click, and the two land in either order.
  if (rwaModalOpen.value) return
  if (visible.value) return // already showing
  visible.value = true
  analytics.trackWeekendTradingAnnouncementEvent(
    WeekendTradingAnnouncementEvent.TOOLTIP_SHOWN,
  )
}

const dismiss = () => {
  if (!visible.value) return
  visible.value = false
  announcement.markTooltipSeen()
  analytics.trackWeekendTradingAnnouncementEvent(
    WeekendTradingAnnouncementEvent.TOOLTIP_DISMISSED,
  )
}

// Show once all conditions are met. Re-evaluated when the tooltip becomes due,
// when the wallet connects, AND when the anchor ref populates after the parent
// mounts — the last one covers an already-connected user on page load, whose
// anchor is null during this component's setup. tryShow() guards on
// shouldShowTooltip + anchor and is idempotent (visible guard).
watch(
  [
    shouldShowTooltip,
    isWalletConnected,
    () => props.anchor,
    isTradingRestrictedInRegion,
    rwaCampaignDone,
    rwaModalOpen,
  ],
  () => tryShow(),
  { immediate: true },
)

// Auto-dismiss when the Trade panel opens
watch(walletPanel, newVal => {
  if (newVal === 'trade' && visible.value) {
    visible.value = false
    announcement.markTooltipSeen()
    analytics.trackWeekendTradingAnnouncementEvent(
      WeekendTradingAnnouncementEvent.TOOLTIP_DISMISSED,
    )
  }
})
</script>
