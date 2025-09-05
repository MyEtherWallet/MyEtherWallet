import { ref } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'

export const useEmailSubscription = () => {
  const toastStore = useToastStore()

  const email = ref('')
  const isValidEmail = ref<boolean>(true)
  const emailErrorMessage = ref<string | undefined>(undefined)
  // Valid Email:
  const validateEmail = () => {
    isValidEmail.value = true
    if (email.value === '' || email.value === undefined) {
      emailErrorMessage.value = 'email required'
      isValidEmail.value = false
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      isValidEmail.value = emailRegex.test(email.value)
      emailErrorMessage.value = isValidEmail.value
        ? undefined
        : 'Email address is not valid'
    }
  }
  const isLoading = ref(false)

  watchDebounced(
    email,
    () => {
      validateEmail()
    },
    { debounce: 500, maxWait: 1500 },
  )

  const subscribeToUpdates = async () => {
    validateEmail()
    if (isValidEmail.value && email.value !== '') {
      const _url = `https://mainnet.mewwallet.dev/email-web`
      isLoading.value = true

      const groups = ['V7_UPDATES']
      const _body = JSON.stringify({
        email: email.value,
        fields: {
          platform: 'web',
        },
        groups: [...groups],
        product: 'MEW_PORTFOLIO',
      })
      try {
        const response = await fetch(_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: _body,
        })
        isLoading.value = false
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`)
        }
        toastStore.addToastMessage({
          text: 'Thank you for subscribing!',
        })
      } catch {
        toastStore.addToastMessage({
          text: 'Something went wrong, please try again later.',
          type: ToastType.Error,
        })
        isLoading.value = false
      }
    }
  }

  return {
    email,
    isValidEmail,
    emailErrorMessage,
    validateEmail,
    subscribeToUpdates,
    isLoading,
  }
}
