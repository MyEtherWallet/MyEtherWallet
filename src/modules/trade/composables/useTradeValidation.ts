import { computed, type Ref, type ComputedRef } from 'vue'
import { parseUnits } from 'viem'
import BigNumber from 'bignumber.js'
import type { NewTokenInfo } from '@/composables/useSwap'
import { MAIN_TOKEN_CONTRACT, useWalletStore } from '@/stores/walletStore'
import { useI18n } from 'vue-i18n'
import { captureException } from '@sentry/vue'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import Configs from '@/configs'

const isDevMode = Configs.IS_DEV_MODE

type FromAmountErrorCode =
  | ''
  | 'unavailable'
  | 'invalid'
  | 'decimals'
  | 'minimum'
  | 'balance'

const NO_ERROR = { code: '' as const, message: '' }

interface UseTradeValidationOptions {
  fromTokenSelected: Ref<NewTokenInfo | null>
  fromAmount: Ref<string>
  toAmount: Ref<string>
  isWalletConnected: Ref<boolean>
  isMarketOpen: ComputedRef<boolean>
  isSelectedAssetTradeable: ComputedRef<boolean>
  supportedNetwork: ComputedRef<boolean>
  isLoadingQuote: Ref<boolean>
  isPairUnavailable: Ref<boolean>
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
    isPairUnavailable,
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
  const fromAmountErrorDetail = computed<{
    code: FromAmountErrorCode
    message: string
  }>(() => {
    if (
      !fromTokenSelected.value ||
      !fromAmount.value ||
      fromAmount.value === '' ||
      fromAmount.value === '0'
    ) {
      return NO_ERROR
    }
    if (generalError.value === 'pathfinder error') {
      return {
        code: 'unavailable',
        message: t('trade.error.token-unavailable'),
      }
    }

    const amountBN = BigNumber(fromAmount.value)
    if (amountBN.isNaN()) {
      return { code: 'invalid', message: t('swap.error.invalid-amount') }
    }

    if (amountBN.lte(0)) {
      return { code: 'invalid', message: t('swap.error.more-than-zero') }
    }

    const decimals = fromTokenSelected.value.decimals || 18
    const decimalPlaces = fromAmount.value.includes('.')
      ? fromAmount.value.split('.')[1]?.length || 0
      : 0
    if (decimalPlaces > decimals) {
      const excessDecimals = decimalPlaces - decimals
      return {
        code: 'decimals',
        message: t(
          'trade.error.remove_decimals',
          { count: excessDecimals },
          excessDecimals,
        ),
      }
    }

    // Minimum $0.95 value check
    const tokenPrice = fromTokenSelected.value.price || 0
    if (tokenPrice > 0) {
      const usdValue = amountBN.times(tokenPrice)
      if (usdValue.lt(0.95)) {
        const minAmount = BigNumber(0.95).div(tokenPrice)
        const roundedMinAmount = minAmount.gte(1)
          ? minAmount.integerValue(BigNumber.ROUND_CEIL)
          : minAmount.precision(2, BigNumber.ROUND_CEIL)
        return {
          code: 'minimum',
          message: t('trade.error.minimum_amount', {
            amount: roundedMinAmount.toFixed(),
            symbol: fromTokenSelected.value.symbol,
          }),
        }
      }
    }

    // Balance check (only when wallet is connected)
    if (isWalletConnected.value) {
      try {
        const tokenParams = getTokenBalanceParams(fromTokenSelected.value)
        const baseAmount = parseUnits(amountBN.toFixed(decimals), decimals)

        if (tokenParams.baseBalance < baseAmount) {
          return {
            code: 'balance',
            message: t('trade.error.not_enough_balance'),
          }
        }
      } catch (e) {
        if (isDevMode) {
          console.error('Error parsing amount for balance check')
        } else {
          captureException(e, {
            ...SENTRY_MODULE_TAGS.TRADE,
            extra: {
              title: 'TRADE: Error parsing amount for balance check',
              amount: fromAmount.value,
              tokenSymbol: fromTokenSelected.value.symbol,
            },
          })
        }
      }
    }

    return NO_ERROR
  })

  const fromAmountError = computed(() => fromAmountErrorDetail.value.message)

  // Only this error paints the balance red — see MEW-2228.
  const isInsufficientBalanceError = computed(
    () => fromAmountErrorDetail.value.code === 'balance',
  )

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
      isSameTokenSelected.value ||
      isPairUnavailable.value,
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
    isInsufficientBalanceError,
    isTradeDisabled,
    isSameTokenSelected,
  }
}
