<template>
  <teleport to="#app">
    <transition
      enter-from-class="opacity-0 scale-95"
      enter-active-class="transition ease-out duration-200"
      enter-to-class="opacity-100 scale-100"
      leave-from-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="visible"
        :style="tooltipStyle"
        class="fixed z-[200] w-[220px] bg-white rounded-20 shadow-button shadow-button-elevated p-4 origin-right"
        role="tooltip"
        aria-live="polite"
      >
        <!-- Tail pointing right toward Trade button -->
        <div
          class="absolute top-1/2 -right-[8px] -translate-y-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-l-[8px] border-l-white"
        />

        <!-- Token icons row -->
        <div class="flex items-center mb-3">
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
          Weekend stock trading
        </p>

        <!-- Body -->
        <p class="text-s-12 text-info leading-[1.4] mb-3">
          SPYon, QQQon, CRCLon, NVDAon, TSLAon, GOOGLon are now open for 24/7
          trading.
        </p>

        <!-- Dismiss button -->
        <button
          class="absolute top-2 right-2 p-1 rounded-full hoverNoBG"
          aria-label="Dismiss tooltip"
          @click="dismiss"
        >
          <XMarkIcon class="w-4 h-4 text-info" />
        </button>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { useWeekendTradingAnnouncementStore } from '@/stores/weekendTradingAnnouncementStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useWalletStore } from '@/stores/walletStore'
import { analytics, WeekendTradingAnnouncementEvent } from '@/analytics'
import nvda from '@/assets/images/weekend-trading/nvda.png'
import qqq from '@/assets/images/weekend-trading/qqq.png'
import googl from '@/assets/images/weekend-trading/googl.png'
import spy from '@/assets/images/weekend-trading/spy.png'
import tsla from '@/assets/images/weekend-trading/tsla.png'
import crcl from '@/assets/images/weekend-trading/crcl.png'

const tokenIcons = [nvda, qqq, googl, spy, tsla, crcl]

const props = defineProps<{
  anchor: HTMLElement | null
}>()

const announcement = useWeekendTradingAnnouncementStore()
const { shouldShowTooltip } = storeToRefs(announcement)

const walletMenu = useWalletMenuStore()
const { walletPanel } = storeToRefs(walletMenu)

const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)

const visible = ref(false)
const anchorRect = ref<DOMRect | null>(null)

const tooltipStyle = computed(() => {
  if (!anchorRect.value) return {}
  const rect = anchorRect.value
  const GAP = 12 // px gap between tooltip and Trade button
  return {
    top: `${rect.top + rect.height / 2}px`,
    right: `${window.innerWidth - rect.left + GAP}px`,
    transform: 'translateY(-50%)',
  }
})

const tryShow = async () => {
  if (!shouldShowTooltip.value || !props.anchor) return
  await nextTick()
  anchorRect.value = props.anchor.getBoundingClientRect()
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

const reposition = () => {
  if (!visible.value || !props.anchor) return
  anchorRect.value = props.anchor.getBoundingClientRect()
}

onMounted(() => {
  window.addEventListener('resize', reposition)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', reposition)
})

// Show on mount if conditions are met
tryShow()

// Show when wallet connects
watch(isWalletConnected, () => {
  if (isWalletConnected.value) tryShow()
})

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
