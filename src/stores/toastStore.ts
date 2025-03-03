import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Toast } from '@/types/notification/index'

export const useToastStore = defineStore('toastStore', () => {
  const messages = ref([] as Toast[])

  const addToastMessage = (message: Toast) => {
    messages.value.push(message)
  }
  const removeToastMessage = (index: number) => {
    messages.value.splice(index, 1)
  }

  return {
    messages,
    addToastMessage,
    removeToastMessage,
  }
})
