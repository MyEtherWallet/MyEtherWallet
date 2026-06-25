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
        class="fixed z-[200] w-[360px] min-h-[144px] bg-white rounded-20 shadow-[0px_8px_12px_-4px_rgba(0,0,0,0.32)] p-4 origin-right"
        role="tooltip"
        aria-live="polite"
      >
        <!-- Tail pointing right toward Trade button (rounded tip) -->
        <svg
          class="absolute top-1/2 -right-[14px] -translate-y-1/2 drop-shadow-[2px_2px_1px_rgba(0,0,0,0.18)]"
          width="14"
          height="20"
          viewBox="0 0 14 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M11.7061 6.50337C14.4493 8.02739 14.4493 11.9726 11.7061 13.4966L0 20L0 0L11.7061 6.50337Z"
            fill="white"
          />
        </svg>

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
          Weekend stock trading
        </p>

        <!-- Body -->
        <p class="text-s-12 text-info leading-[1.4]">
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
  const GAP = 12 // gap card↔button; the 20px tail still reaches into the drawer
  const MARGIN = 16 // min px between tooltip left edge and viewport edge
  // The tooltip's right edge sits at (rect.left - GAP); cap its width to the
  // space left of that point so it never overflows on screens narrower than W.
  const maxWidth = Math.max(0, rect.left - GAP - MARGIN)
  return {
    top: `${rect.top + rect.height / 2}px`,
    right: `${window.innerWidth - rect.left + GAP}px`,
    maxWidth: `${maxWidth}px`,
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
