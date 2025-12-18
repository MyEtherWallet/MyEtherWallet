import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCustomTokenStore = defineStore('customTokenStore', () => {
  const isOpenCustomTokenDialog = ref(false)
  const openCustomTokenDialog = () => {
    isOpenCustomTokenDialog.value = true
  }
  const closeCustomTokenDialog = () => {
    isOpenCustomTokenDialog.value = false
    currentView.value = 'add'
  }

  const currentView = ref<'add' | 'edit' | 'delete'>('add')
  const setCurrentView = (view: 'add' | 'edit' | 'delete') => {
    currentView.value = view
  }

  return {
    isOpenCustomTokenDialog,
    openCustomTokenDialog,
    closeCustomTokenDialog,
    currentView,
    setCurrentView,
  }
})
