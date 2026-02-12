import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppLayoutStore = defineStore('useAppLayoutStore', () => {
  const isOverflowHidden = ref(false)
  const isNotificationsOpen = ref(false)

  return {
    isOverflowHidden,
    isNotificationsOpen,
  }
})
