import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useWeekendTradingAnnouncementStore = defineStore(
  'weekendTradingAnnouncement',
  () => {
    const modalSeen = useLocalStorage<boolean>(
      'mew-weekend-trading-announcement-seen',
      false,
    )
    // epoch ms when the modal was first shown; 0 = never shown
    const modalShownAt = useLocalStorage<number>(
      'mew-weekend-trading-announcement-shown-at',
      0,
    )
    const tooltipSeen = useLocalStorage<boolean>(
      'mew-weekend-trading-tooltip-seen',
      false,
    )

    const markModalSeen = () => {
      if (modalShownAt.value <= 0) modalShownAt.value = Date.now()
      modalSeen.value = true
    }
    const markTooltipSeen = () => {
      tooltipSeen.value = true
    }
    // The tooltip is decoupled from the modal: show once per wallet until
    // dismissed, independent of the modal.
    const shouldShowTooltip = computed(() => !tooltipSeen.value)

    return {
      modalSeen,
      modalShownAt,
      tooltipSeen,
      markModalSeen,
      markTooltipSeen,
      shouldShowTooltip,
    }
  },
)
