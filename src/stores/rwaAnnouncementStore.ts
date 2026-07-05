import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useRwaAnnouncementStore = defineStore('rwaAnnouncement', () => {
  const modalSeen = useLocalStorage<boolean>('mew-rwa-announcement-seen', false)

  const markModalSeen = () => {
    modalSeen.value = true
  }

  return {
    modalSeen,
    markModalSeen,
  }
})
