import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDialogStore = defineStore('dialogStore', () => {
  //Used to manage the state of the dialog
  const isAreaHidden = ref(false)
  return {
    isAreaHidden,
  }
})
