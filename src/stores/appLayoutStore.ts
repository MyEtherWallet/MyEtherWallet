import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppLayoutStore = defineStore('useAppLayoutStore', () => {
  const isOverflowHidden = ref(false)
  const isNotificationsOpen = ref(false)
  const isSettingsOpen = ref(false)
  // Manage-accounts popup open state lives here (not as a local ref in
  // TheAddressMenu) so it survives header re-renders/re-mounts triggered by
  // network changes — otherwise a local ref resets to false and the popup closes.
  const isManageAccountsOpen = ref(false)

  return {
    isOverflowHidden,
    isNotificationsOpen,
    isSettingsOpen,
    isManageAccountsOpen,
  }
})
