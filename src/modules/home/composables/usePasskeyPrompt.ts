import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePrivyAccount } from '@/composables/usePrivyAccount'
import { passkeysOffered } from '@/providers/privy/accountOffer'
import { passkeySupported } from '@/providers/privy/passkeySupport'
import { useAuthStore } from '@/stores/authStore'
import { useWalletStore } from '@/stores/walletStore'
import { safeLocalStorage } from '@/utils/safeStorage'

/** One key per account; the address is lowercased so its casing cannot split it. */
const dismissalKey = (address: string): string =>
  `mew-passkey-prompt-dismissed:${address.toLowerCase()}`

/**
 * Whether Home asks the user to add a passkey.
 *
 * It asks a connected Privy account once its wallet holds funds, until a
 * passkey protects the wallet or the user dismisses the card. A passkey that
 * was made but could not be made the check protects nothing, so the card
 * stays for it (`awaitsActivation`) and its button finishes the job. The
 * dismissal is kept in this browser, per account.
 */
export const usePasskeyPrompt = () => {
  const { isPrivyConnected } = usePrivyAccount()
  const { walletAddress, isLoadingBalances, totalFiatPortfolioValueBN } =
    storeToRefs(useWalletStore())
  const { passkeys } = storeToRefs(useAuthStore())

  /** Accounts dismissed since this page loaded; storage holds the earlier ones. */
  const dismissedNow = ref<string[]>([])

  const key = computed(() =>
    walletAddress.value ? dismissalKey(walletAddress.value) : null,
  )
  const isDismissed = computed(
    () =>
      key.value !== null &&
      (dismissedNow.value.includes(key.value) ||
        safeLocalStorage.getItem(key.value) !== null),
  )

  const isProtected = computed(() =>
    passkeys.value.some(passkey => passkey.active),
  )
  /** A passkey exists but is not the check yet: finish it, do not add another. */
  const awaitsActivation = computed(
    () => passkeys.value.length > 0 && !isProtected.value,
  )

  const isVisible = computed(
    () =>
      passkeysOffered() &&
      isPrivyConnected.value &&
      !isLoadingBalances.value &&
      totalFiatPortfolioValueBN.value.isGreaterThan(0) &&
      !isProtected.value &&
      passkeySupported() &&
      !isDismissed.value,
  )

  const dismiss = (): void => {
    if (key.value === null) return
    safeLocalStorage.setItem(key.value, '1')
    dismissedNow.value = [...dismissedNow.value, key.value]
  }

  return { isVisible, awaitsActivation, dismiss }
}
