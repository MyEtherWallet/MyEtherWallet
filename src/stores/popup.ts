import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { StoreConfigs } from './configs'
import { computed, inject, watch, type ComputedRef } from 'vue'
import { Provider } from '@/providers'
import type { Analytics } from '@/analytics/amplitude'
import { ConsentEvent } from '@/analytics/events'

export type PopupState = {
  localStore: boolean
  stateVersion: string
  consentToTrack: boolean
  displayedTrackingPopup: boolean
  showedBanner: boolean
  showWalletPromo: boolean
  showEnkryptPromo: boolean
  promoOver: boolean
  enkryptLandingPopup: boolean
  enkryptLandingPopupClosed: number
  enkryptWalletPopup: boolean
  enkryptWalletPopupClosed: number
  enkryptWalletSnackbar: boolean
  enkryptWalletSnackbarClosed: number
  enkryptWalletSnackbarCounter: number
}

const defaultState: PopupState = {
  localStore: true,
  stateVersion: StoreConfigs.VERSION.popups,
  consentToTrack: false,
  displayedTrackingPopup: false,
  showedBanner: false,
  showWalletPromo: true,
  showEnkryptPromo: true,
  promoOver: false,
  enkryptLandingPopup: true,
  enkryptLandingPopupClosed: 0,
  enkryptWalletPopup: true,
  enkryptWalletPopupClosed: 0,
  enkryptWalletSnackbar: false,
  enkryptWalletSnackbarClosed: 0,
  enkryptWalletSnackbarCounter: 0,
}

export type PopupStore = {
  consent: ComputedRef<boolean>

  setTrackingConsent(value: boolean): void
  neverShowEnkryptPromo(): void
  neverShowEnkryptLandingPage(): void
  neverShowEnkryptWalletPage(): void
  showEnkryptWalletSnackbar(): void
  closeEnkryptWalletSnackbar(): void
}

export const usePopupStore = defineStore('popups', (): PopupStore => {
  const storage = useLocalStorage(
    StoreConfigs.LOCAL_STORAGE_KEYS.popups,
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
  )

  const store: PopupStore = {
    consent: computed(() => {
      return storage.value.consentToTrack
    }),

    setTrackingConsent: (consent: boolean) => {
      storage.value.consentToTrack = consent
      if (consent) {
        analytics.trackConsentEvent(ConsentEvent.USER_OPT_IN_TRACKING)
      } else {
        analytics.trackConsentEvent(ConsentEvent.USER_OPT_OUT_TRACKING)
      }
    },

    neverShowEnkryptPromo: () => {
      storage.value.showEnkryptPromo = false
    },

    neverShowEnkryptLandingPage: () => {
      storage.value.showEnkryptPromo = false
    },

    neverShowEnkryptWalletPage: () => {
      storage.value.enkryptWalletPopup = false
      storage.value.enkryptWalletPopupClosed = Date.now()
    },

    showEnkryptWalletSnackbar: () => {
      storage.value.enkryptWalletSnackbar = true
      storage.value.enkryptWalletSnackbarCounter += 1
    },

    closeEnkryptWalletSnackbar: () => {
      storage.value.enkryptWalletSnackbar = false
      storage.value.enkryptWalletSnackbarClosed = Date.now()
    },
  }

  return store
})
