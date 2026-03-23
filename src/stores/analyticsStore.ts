import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { StoreConfigs } from './configs'
import { computed, inject, ref, watch } from 'vue'
import { Provider } from '@/providers'
import type { Analytics } from '@/analytics/amplitude'
import { ConsentEvent } from '@/analytics/events'
import isEU from '@/utils/isEU'

export type AnalyticsState = {
  stateVersion: string
  consentToTrack: boolean
  hasSetConsent: boolean
}

const defaultState: AnalyticsState = {
  stateVersion: StoreConfigs.VERSION.analytics,
  consentToTrack: false,
  hasSetConsent: false,
}

export const useAnalyticsStore = defineStore('analytics', () => {
  const storage = useLocalStorage(
    StoreConfigs.LOCAL_STORAGE_KEYS.analytics,
    defaultState,
  )

  // We need to sync some changes back to the analytics engine (Amplitude)
  const analytics = inject<Analytics>(Provider.ANALYTICS)!

  // Listen to changes the pinia store (Inside this browser tab) and local storage
  // (other browser tabs) and update analytics (Amplitude) accordingly
  watch(
    () => storage.value.consentToTrack,
    value => {
      analytics.setTrackingConsent(value)
    },
    { immediate: true },
  )

  // On first visit (consent not explicitly set), check if user is in the EU.
  // EU users default to opt-out; all others default to opt-in.
  const isEUUser = ref(false)

  if (!storage.value.hasSetConsent) {
    isEU().then(euUser => {
      isEUUser.value = euUser
      if (euUser && !storage.value.hasSetConsent) {
        storage.value.consentToTrack = false
      } else if (hasSetConsent.value === false) {
        setTrackingConsent(true)
      }
    })
  }

  const consent = computed(() => storage.value.consentToTrack)
  const hasSetConsent = computed(() => storage.value.hasSetConsent)

  const setTrackingConsent = (value: boolean) => {
    storage.value.consentToTrack = value
    storage.value.hasSetConsent = true
    if (value) {
      analytics.trackConsentEvent(ConsentEvent.USER_OPT_IN_TRACKING)
    } else {
      analytics.trackConsentEvent(ConsentEvent.USER_OPT_OUT_TRACKING)
    }
  }

  return {
    consent,
    hasSetConsent,
    isEUUser,
    setTrackingConsent,
  }
})
