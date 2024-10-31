import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { StoreConfigs } from './configs'

type PopupState = {
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
  setTrackingConsent(value: boolean): void
  neverShowEnkryptPromo(): void
  setTracking(): Promise<void>
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

  const store: PopupStore = {
    setTrackingConsent: (value: boolean) => {
      storage.value.consentToTrack = value
    },

    neverShowEnkryptPromo: () => {
      storage.value.showEnkryptPromo = false
    },

    setTracking: () => {
      storage.value.consentToTrack = true
      // TODO: Implement tracking
      return Promise.resolve()
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
