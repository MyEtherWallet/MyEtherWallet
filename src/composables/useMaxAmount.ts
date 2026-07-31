import { ref, watch, nextTick } from 'vue'
import { formatUnits } from 'viem'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { WalletType } from '@/providers/types'

export interface UseMaxAmountOptions {
  getBalance: () => bigint
  getDecimals: () => number
  getEstimatedFee: () => bigint
  isNativeToken: () => boolean
  isTokenSelected: () => boolean
  getAmount: () => string | number
  onAmountChange: (amount: string | number) => void
  markFormDirty: () => void
  resetFormPristine: () => void
  getTokenIdentifier: () => string | undefined
  getDependencies: () => unknown[]
  onMaxApplied?: () => void
}

/**
 * Handles "Max" button for Send/Swap. Only for internal wallets (PRIVATE_KEY, MNEMONIC).
 * Subtracts fee from native token balance and recalculates when dependencies change.
 */
export function useMaxAmount(options: UseMaxAmountOptions) {
  const {
    getBalance,
    getDecimals,
    getEstimatedFee,
    isNativeToken,
    isTokenSelected,
    getAmount,
    onAmountChange,
    markFormDirty,
    resetFormPristine,
    getTokenIdentifier,
    getDependencies,
    onMaxApplied,
  } = options

  const walletStore = useWalletStore()
  const { wallet } = storeToRefs(walletStore)

  const isMaxSelected = ref(false)
  const isApplyingMaxAmount = ref(false)
  const preMaxAmount = ref<string | number>('')
  const isFreshMaxClick = ref(false)
  const selectedPercentage = ref(100)

  const isInternalWallet = (): boolean => {
    const walletType = wallet.value?.getWalletType()
    return (
      walletType === WalletType.PRIVATE_KEY ||
      walletType === WalletType.MNEMONIC
    )
  }

  const getMaxAmount = (percentage = selectedPercentage.value): string => {
    if (!isTokenSelected()) return ''

    const boundedPercentage = Math.trunc(Math.min(100, Math.max(0, percentage)))
    const balance = (getBalance() * BigInt(boundedPercentage)) / 100n
    const fee = getEstimatedFee()
    const reservedFee = isNativeToken() && boundedPercentage === 100 ? fee : 0n
    const spendable = balance > reservedFee ? balance - reservedFee : 0n

    return formatUnits(spendable, getDecimals())
  }

  const applyMaxAmount = async (): Promise<void> => {
    if (!isTokenSelected()) return

    const isFresh = isFreshMaxClick.value
    isFreshMaxClick.value = false

    isApplyingMaxAmount.value = true
    try {
      const maxAmount = getMaxAmount()
      const currentAmount = String(getAmount())

      // On automatic recalculations (fee/balance changed), don't zero out a positive
      // amount the user set — fee validation surfaces the insufficient-gas error.
      // On an explicit Max click (isFresh), always apply regardless.
      const shouldUpdate =
        isFresh || maxAmount !== '0' || currentAmount === '' || currentAmount === '0'

      if (shouldUpdate && currentAmount !== maxAmount) {
        onAmountChange(maxAmount)
      }

      onMaxApplied?.()
      await nextTick()
    } finally {
      isApplyingMaxAmount.value = false
    }
  }

  const setMaxAmount = (percentage = 100): void => {
    const boundedPercentage = Math.trunc(Math.min(100, Math.max(0, percentage)))
    if (isMaxSelected.value && selectedPercentage.value === boundedPercentage) return

    markFormDirty()
    isFreshMaxClick.value = true
    if (!isMaxSelected.value) preMaxAmount.value = getAmount()
    selectedPercentage.value = boundedPercentage
    isMaxSelected.value = true
  }

  const resetMaxState = (): void => {
    isMaxSelected.value = false
    isFreshMaxClick.value = false
    selectedPercentage.value = 100
    preMaxAmount.value = ''
  }

  // When the user switches tokens after clicking Max, restore the amount that
  // was in the input before Max was applied (empty if they never typed) and
  // clear the Max selection so it doesn't auto-apply for the new token.
  // Registered before the apply-max watch so it fires first.
  watch(
    () => getTokenIdentifier(),
    (newToken, oldToken) => {
      if (newToken !== oldToken && isMaxSelected.value) {
        isMaxSelected.value = false
        onAmountChange(preMaxAmount.value)
        // If nothing was typed before max, go back to pristine so no validation error shows
        if (
          preMaxAmount.value === '' ||
          preMaxAmount.value === 0 ||
          preMaxAmount.value === '0'
        ) {
          resetFormPristine()
        }
        preMaxAmount.value = ''
      }
    },
  )

  watch(
    () => getAmount(),
    (newAmount, oldAmount) => {
      if (
        isMaxSelected.value &&
        !isApplyingMaxAmount.value &&
        newAmount !== oldAmount
      ) {
        isMaxSelected.value = false
      }
    },
  )

  watch(
    () => [isMaxSelected.value, selectedPercentage.value, ...getDependencies()],
    () => {
      if (!isMaxSelected.value) return
      void applyMaxAmount()
    },
  )

  return {
    isMaxSelected,
    isApplyingMaxAmount,
    selectedPercentage,
    getMaxAmount,
    applyMaxAmount,
    setMaxAmount,
    resetMaxState,
    isInternalWallet,
  }
}
