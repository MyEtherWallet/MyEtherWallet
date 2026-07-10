import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useRwaAnnouncementStore = defineStore('rwaAnnouncement', () => {
  const modalSeen = useLocalStorage<boolean>('mew-rwa-announcement-seen', false)
  // epoch ms when the modal was first closed; 0 = never closed. Used to gate the
  // 24/7 weekend-trading announcement, which only surfaces 3 days after this.
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

  return {
    modalSeen,
    modalClosedAt,
    markModalSeen,
    markModalClosed,
  }
})
