import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Toast } from '@/types/notification/index'

/**
 * Toast store
 * Toast will be deleted after 6 seconds by default. If you want to keep it infinite, set isInfinite to true
 * By Default toast Message is of Type Info.
 * Original Toast Module is imported in the App.vue file
 *
 * @returns { messages, addToastMessage, removeToastMessage }
 *
 * @messages {Toast[]} - Array of Toast Messages
 * @addToastMessage {Function} - Add a new toast message
 * @removeToastMessage {Function} - Remove a toast message
 *
 *
 * @example usage in codebase
 *
 * import { useToastStore } from '@/stores/toastStore'
 * const toastStore = useToastStore()
 *
 * // with isInfinite option
 * toastStore.addToastMessage({
 *   text: 'This is a toast message',
 *   isInfinite: true,
 * })
 *
 * // with link option
 * toastStore.addToastMessage({
 *   text: 'This is a toast message',
 *   link: {
 *     title: 'Click here',
 *     url: 'https://www.google.com',
 *   },
 * })
 *
 * // with duration and toast type
 * toastStore.addToastMessage({
 *   text: 'This is a toast message',
 *   duration: 3000,
 *   type: ToastType.Success,
 * })
 */

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
