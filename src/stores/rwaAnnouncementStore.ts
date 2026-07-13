import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

// Follow-up announcements (the 24/7 weekend-trading modal + tooltip) are
// sequenced behind this one: they never surface while it is open and only
// after 3 days have elapsed since it was first closed.
const FOLLOWUP_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000

export const useRwaAnnouncementStore = defineStore('rwaAnnouncement', () => {
  const modalSeen = useLocalStorage<boolean>('mew-rwa-announcement-seen', false)
  // epoch ms when the modal was first closed; 0 = never closed.
  const modalClosedAt = useLocalStorage<number>(
    'mew-rwa-announcement-closed-at',
    0,
  )

  const markModalSeen = () => {
    modalSeen.value = true
  }
  const markModalClosed = () => {
    if (modalClosedAt.value <= 0) modalClosedAt.value = Date.now()
  }

  // True once the modal has been closed AND 3 days have elapsed since. False
  // while the modal is still open (modalClosedAt === 0) or within the cooldown.
  const followupCooldownElapsed = computed(
    () =>
      modalClosedAt.value > 0 &&
      Date.now() - modalClosedAt.value >= FOLLOWUP_COOLDOWN_MS,
  )

  return {
    modalSeen,
    modalClosedAt,
    followupCooldownElapsed,
    markModalSeen,
    markModalClosed,
  }
})
