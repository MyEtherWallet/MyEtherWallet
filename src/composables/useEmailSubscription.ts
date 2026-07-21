import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { watchDebounced } from '@vueuse/core'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import Configs from '@/configs'
import { captureException } from '@sentry/vue'

export const useEmailSubscription = () => {
  const { t } = useI18n()
  const toastStore = useToastStore()

  const email = ref('')
  const isValidEmail = ref<boolean>(true)
  // Store the i18n key (not the resolved string) so the message re-translates
  // reactively when the locale changes — resolving with t() into a plain ref
  // would freeze the message in whatever locale was active at validation time.
  const emailErrorKey = ref<string | undefined>(undefined)
  const emailErrorMessage = computed(() =>
    emailErrorKey.value ? t(emailErrorKey.value) : undefined,
  )

  // Valid Email:
  const validateEmail = () => {
    isValidEmail.value = true
    if (email.value === '' || email.value === undefined) {
      emailErrorKey.value = 'common.subscribe.email_required'
      isValidEmail.value = false
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      isValidEmail.value = emailRegex.test(email.value)
      emailErrorKey.value = isValidEmail.value
        ? undefined
        : 'common.subscribe.email_invalid'
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

  const subscribeToUpdates = async (): Promise<boolean> => {
    validateEmail()
    if (isValidEmail.value && email.value !== '') {
      const _url = Configs.MEW_EMAIL
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

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`)
        } else {
          toastStore.addToastMessage({
            text: 'Thank you for subscribing!',
          })
          isLoading.value = false
        }
        return true
      } catch (e) {
        captureException(e)
        toastStore.addToastMessage({
          text: 'Something went wrong',
          textSecondary: 'Please try again later.',
          type: ToastType.Error,
        })
        isLoading.value = false
        return false
      }
    }
    return false
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
