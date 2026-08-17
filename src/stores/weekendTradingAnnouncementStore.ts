import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

const TOOLTIP_SEEN_KEY = 'mew-weekend-trading-tooltip-seen'

/**
 * Bump this whenever the tooltip's content changes and everyone should get
 * another look at it, including users who already dismissed an earlier version.
 * The bump clears their seen flag exactly once — see the reset below.
 */
const TOOLTIP_REVISION = 2

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
    // Which tooltip revision this install has already been shown; 0 = an
    // install from before revisions were tracked.
    const tooltipRevisionSeen = useLocalStorage<number>(
      'mew-weekend-trading-tooltip-revision',
      0,
    )

    // One-time reset: drop the seen flag for anyone who dismissed an older
    // revision, so the tooltip gets one more chance to be seen.
    //
    // This must run BEFORE `tooltipSeen` is created — `useLocalStorage` reads
    // the key on creation, so removing it afterwards would leave the ref
    // holding the stale `true`. Recording the revision in the same breath is
    // what keeps this to a single reset instead of re-showing on every load.
    if (tooltipRevisionSeen.value < TOOLTIP_REVISION) {
      localStorage.removeItem(TOOLTIP_SEEN_KEY)
      tooltipRevisionSeen.value = TOOLTIP_REVISION
    }

    const tooltipSeen = useLocalStorage<boolean>(TOOLTIP_SEEN_KEY, false)

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
      tooltipRevisionSeen,
      markModalSeen,
      markTooltipSeen,
      shouldShowTooltip,
    }
  },
)
