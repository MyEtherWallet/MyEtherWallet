import { defineStore } from 'pinia'
import { ref } from 'vue'
/**
 * Store to manage the state of the access dialog.
 * It provides methods to open and close the dialog.
 */
export const useAccessStore = defineStore('accessStore', () => {
  const isOpenAccessDialog = ref(false)
  const openAccessDialog = () => {
    isOpenAccessDialog.value = true
  }
  const closeAccessDialog = () => {
    isOpenAccessDialog.value = false
  }
  return { isOpenAccessDialog, openAccessDialog, closeAccessDialog }
})
