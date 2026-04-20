import { ref, watch, nextTick, type Ref } from 'vue'
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
  amountRef: Ref<string | number>
  isPristineRef: Ref<boolean>
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
    amountRef,
    isPristineRef,
    getDependencies,
    onMaxApplied,
  } = options

  const walletStore = useWalletStore()
  const { wallet } = storeToRefs(walletStore)

  const isMaxSelected = ref(false)
  const isApplyingMaxAmount = ref(false)

  const isInternalWallet = (): boolean => {
    const walletType = wallet.value?.getWalletType()
    return (
      walletType === WalletType.PRIVATE_KEY ||
      walletType === WalletType.MNEMONIC
    )
  }

  const getMaxAmount = (): string => {
    if (!isTokenSelected()) return ''

    const balance = getBalance()
    const fee = getEstimatedFee()
    const reservedFee = isNativeToken() ? fee : 0n
    const spendable = balance > reservedFee ? balance - reservedFee : 0n

    return formatUnits(spendable, getDecimals())
  }

  const applyMaxAmount = async (): Promise<void> => {
    if (!isTokenSelected()) return

    isApplyingMaxAmount.value = true
    try {
      const maxAmount = getMaxAmount()

      if (String(amountRef.value) !== maxAmount) {
        amountRef.value = maxAmount
      }

      onMaxApplied?.()
      await nextTick()
    } finally {
      isApplyingMaxAmount.value = false
    }
  }

  const setMaxAmount = (): void => {
    isPristineRef.value = false

    if (isMaxSelected.value) {
      void applyMaxAmount()
      return
    }

    isMaxSelected.value = true
  }

  const resetMaxState = (): void => {
    isMaxSelected.value = false
  }

  watch(
    () => amountRef.value,
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
    () => [isMaxSelected.value, ...getDependencies()],
    () => {
      if (!isMaxSelected.value) return
      void applyMaxAmount()
    },
  )

  return {
    isMaxSelected,
    isApplyingMaxAmount,
    getMaxAmount,
    applyMaxAmount,
    setMaxAmount,
    resetMaxState,
    isInternalWallet,
  }
}
