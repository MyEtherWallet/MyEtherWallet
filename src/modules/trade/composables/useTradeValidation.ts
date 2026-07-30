import { computed, type Ref, type ComputedRef } from 'vue'
import { parseUnits } from 'viem'
import BigNumber from 'bignumber.js'
import type { NewTokenInfo } from '@/stores/swapStore'
import { MAIN_TOKEN_CONTRACT, useWalletStore } from '@/stores/walletStore'
import { useI18n } from 'vue-i18n'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import { reportModuleError } from '@/utils/reportModuleError'

interface UseTradeValidationOptions {
  fromTokenSelected: Ref<NewTokenInfo | null>
  fromAmount: Ref<string>
  toAmount: Ref<string>
  isWalletConnected: Ref<boolean>
  isMarketOpen: ComputedRef<boolean>
  isSelectedAssetTradeable: ComputedRef<boolean>
  supportedNetwork: ComputedRef<boolean>
  isLoadingQuote: Ref<boolean>
  generalError: Ref<string>
  toTokenSelected: Ref<NewTokenInfo | null>
}

export function useTradeValidation(options: UseTradeValidationOptions) {
  const {
    fromTokenSelected,
    fromAmount,
    toAmount,
    isWalletConnected,
    isMarketOpen,
    isSelectedAssetTradeable,
    supportedNetwork,
    isLoadingQuote,
    generalError,
    toTokenSelected,
  } = options

  const { t } = useI18n()
  const walletStore = useWalletStore()

  // Helper to get token balance parameters
  const getTokenBalanceParams = (token: NewTokenInfo) => {
    const isMainToken = token.address === MAIN_TOKEN_CONTRACT
    const balance = token.balance || '0'

    const baseNetworkBalance = parseUnits(
      walletStore.getTokenBalance(MAIN_TOKEN_CONTRACT)?.balance || '0',
      18,
    )

    const decimals = token.decimals || 18
    const baseBalance = isMainToken ? baseNetworkBalance : BigInt(balance)

    return { baseBalance, decimals }
  }

  // Check if amount has pre-quote errors (excludes balance check)
  const hasPreQuoteError = computed(() => {
    if (
      !fromTokenSelected.value ||
      !fromAmount.value ||
      fromAmount.value === '' ||
      fromAmount.value === '0'
    ) {
      return true
    }

    const amountBN = BigNumber(fromAmount.value)
    if (amountBN.isNaN() || amountBN.lte(0)) {
      return true
    }

    // Check decimals
    const decimals = fromTokenSelected.value.decimals || 18
    const decimalPlaces = fromAmount.value.includes('.')
      ? fromAmount.value.split('.')[1]?.length || 0
      : 0
    if (decimalPlaces > decimals) {
      return true
    }

    const tokenPrice = fromTokenSelected.value.price || 0
    if (tokenPrice > 0) {
      const usdValue = amountBN.times(tokenPrice)
      if (usdValue.lt(0.95)) {
        return true
      }
    }

    return false
  })

  // Computed error for from amount with balance validation
  const fromAmountError = computed(() => {
    if (
      !fromTokenSelected.value ||
      !fromAmount.value ||
      fromAmount.value === '' ||
      fromAmount.value === '0'
    ) {
      return ''
    }
    if (generalError.value === 'pathfinder error') {
      return t('trade.error.token-unavailable')
    }

    const amountBN = BigNumber(fromAmount.value)
    if (amountBN.isNaN()) {
      return t('swap.error.invalid-amount')
    }

    if (amountBN.lte(0)) {
      return t('swap.error.more-than-zero')
    }

    const decimals = fromTokenSelected.value.decimals || 18
    const decimalPlaces = fromAmount.value.includes('.')
      ? fromAmount.value.split('.')[1]?.length || 0
      : 0
    if (decimalPlaces > decimals) {
      return t('swap.error.too-many-decimals')
    }

    // Minimum $0.95 value check
    const tokenPrice = fromTokenSelected.value.price || 0
    if (tokenPrice > 0) {
      const usdValue = amountBN.times(tokenPrice)
      if (usdValue.lt(0.95)) {
        return t('trade.error.minimum-trade-value')
      }
    }

    // Balance check (only when wallet is connected)
    if (isWalletConnected.value) {
      try {
        const tokenParams = getTokenBalanceParams(fromTokenSelected.value)
        const baseAmount = parseUnits(amountBN.toFixed(decimals), decimals)

        if (tokenParams.baseBalance < baseAmount) {
          return t('swap.error.insufficient-native', {
            symbol: fromTokenSelected.value.symbol,
          })
        }
      } catch (e) {
        reportModuleError({
          tag: SENTRY_MODULE_TAGS.TRADE,
          title: 'TRADE: Error parsing amount for balance check',
          error: e,
          extra: {
            amount: fromAmount.value,
            tokenSymbol: fromTokenSelected.value.symbol,
          },
        })
      }
    }

    return ''
  })

  // Check if trade button should be disabled
  const isTradeDisabled = computed(
    () =>
      !supportedNetwork.value ||
      !isMarketOpen.value ||
      !isSelectedAssetTradeable.value ||
      !(
        fromAmount.value !== '' &&
        fromAmount.value !== '0' &&
        fromAmountError.value === '' &&
        toAmount.value !== '' &&
        toAmount.value !== '0'
      ) ||
      isLoadingQuote.value ||
      isSameTokenSelected.value,
  )

  const isSameTokenSelected = computed(() => {
    if (!fromTokenSelected.value || !toTokenSelected.value) return false
    return (
      fromTokenSelected.value.address.toLowerCase() ===
      toTokenSelected.value.address.toLowerCase()
    )
  })

  return {
    hasPreQuoteError,
    fromAmountError,
    isTradeDisabled,
    isSameTokenSelected,
  }
}
