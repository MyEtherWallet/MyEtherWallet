import {
  ref,
  computed,
  watch,
  nextTick,
  type Ref,
  type ComputedRef,
} from 'vue'
import { storeToRefs } from 'pinia'
import BigNumber from 'bignumber.js'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'
import { useWalletStore, MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { useSwapStore, type NewTokenInfo } from '@/stores/swapStore'
import { useMaxAmount } from '@/composables/useMaxAmount'
import { useBlockedContent } from '@/composables/useBlockedContent'
import { useSwapForm } from './useSwapForm'
import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useInputStore } from '@/stores/inputStore'
import { useToastStore } from '@/stores/toastStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useAccessStore } from '@/stores/accessStore'
import { useAddressBookStore, type Address } from '@/stores/addressBook'
import { useRewardsStore } from '@/stores/rewardsStore'
import { usePairStore } from '@/stores/pairStore'
import {
  analytics,
  ConnectWalletEvent,
  SwapEvent,
  SwapEventError,
  SwapEventStatus,
} from '@/analytics'
import { useSwapTokens } from './useSwapTokens'
import { useSwapValidation } from './useSwapValidation'
import { useSwapQuote } from './useSwapQuote'
import { useSwapGasFee } from './useSwapGasFee'
import { useSwapExecution } from './useSwapExecution'
import { useSwapAnalytics } from './useSwapAnalytics'

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) return error.message
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error &&
    typeof error.message === 'string') return error.message
  return fallback
}

// Utils and Types
import {
  enumToChain,
  supportedSwapEnums,
} from '@/providers/ethereum/chainToEnum'
import { formatUnits, parseUnits } from 'viem'
import dataTxAction from '@/utils/dataTxAction'
import {
  type Chain,
  type EvmTransactionAction,
  type QuotesResponse,
  type BitcoinQuotesRequestBody,
} from '@/mew_api/types'
import { isP2shAddress } from '@/providers/common/btcInfo'
import {
  type ProviderQuoteResponse,
  type ProviderSwapResponse,
  type EVMTransaction,
  type TokenType,
  type GenericTransaction,
  getSupportedNetworks,
} from '@enkryptcom/swap'
import {
  GasPriceType,
  WalletType,
  type HexPrefixedString,
} from '@/providers/types'
import { ToastType } from '@/types/notification'
import configs from '@/configs'
import { isSignableWallet, isUserRejectionError } from '@/utils/walletUtils'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import { hydrateTokenBalances } from '@/utils/tokenBalance'
import { reportModuleError } from '@/utils/reportModuleError'
interface SwapModuleBindings {
  supportedNetwork: Ref<boolean>
  swapLoaded: Ref<boolean>
  selectedChain: Ref<Chain | undefined>
  isBitcoinChain: ComputedRef<boolean>
  isWalletConnected: Ref<boolean>
  userAddress: ComputedRef<string>
  isWatchOnly: Ref<boolean>
  hasChainBalance: ComputedRef<boolean>
  selectedToChain: Ref<Chain | undefined>
  fromTokenSelected: Ref<NewTokenInfo | null>
  toTokenSelected: Ref<NewTokenInfo | null>
  toAddressError: Ref<string>
  generalError: Ref<string>
  fromAmount: Ref<string>
  toAmount: Ref<string>
  userToAddress: Ref<string>
  isPristine: Ref<boolean>
  foundNickName: Ref<string>
  providers: Ref<ProviderQuoteResponse[]>
  selectedQuote: Ref<ProviderQuoteResponse | undefined>
  swapInfo: Ref<ProviderSwapResponse | null>
  swapGasFeeQuote: Ref<QuotesResponse | undefined>
  txHash: Ref<HexPrefixedString>
  bestSwapLoadingOpen: Ref<boolean>
  bestOfferSelectionOpen: Ref<boolean>
  swapInitiatedOpen: Ref<boolean>
  txProceeding: Ref<boolean>
  isSwapView: ComputedRef<boolean>
  isCrossChain: ComputedRef<boolean>
  parsedFromTokens: ComputedRef<NewTokenInfo[]>
  filteredToTokens: ComputedRef<NewTokenInfo[]>
  parsedToChains: ComputedRef<Chain[]>
  isLoading: ComputedRef<boolean>
  fromChains: ComputedRef<Chain[]>
  defualtChainWhenNetworkUnsupported: ComputedRef<Chain | undefined>
  blockedClass: ComputedRef<string>
  toAddress: ComputedRef<string>
  toLoadingState: ComputedRef<boolean>
  fromLoadingState: ComputedRef<boolean>
  fromAmountError: ComputedRef<string>
  toAmountError: ComputedRef<string>
  priceImpact: ComputedRef<number>
  priceImpactTooHigh: ComputedRef<boolean>
  isSwapDisabled: ComputedRef<boolean>
  swapFeeError: ComputedRef<string | undefined>
  isInternalWallet: () => boolean
  handleMaxClick: () => void
  switchGlobalNetwork: (chain: Chain) => void
  clearValues: () => void
  validateToAddress: () => Promise<void>
  proceedWithSwap: (quoteId: string) => Promise<void>
  swapButton: () => Promise<void>
  cancelSwap: () => void
  setToChain: (chain: Chain) => void
  connectWalletForSwap: () => void
  bindWatchers: () => void
  initialize: () => Promise<void>
}

export function useSwapModule(): SwapModuleBindings {
  const isDevMode = configs.IS_DEV_MODE
  const MAX_PRICE_IMPACT = 10
  // --- Stores ---
  const walletMenu = useWalletMenuStore()
  const { walletPanel } = storeToRefs(walletMenu)
  const { inAddressBook, addAddress } = useAddressBookStore()
  const walletStore = useWalletStore()
  const globalStore = useGlobalStore()
  const chainsStore = useChainsStore()
  const inputStore = useInputStore()
  const toastStore = useToastStore()
  const accessStore = useAccessStore()
  const rewardsStore = useRewardsStore()
  const pairStore = usePairStore()
  const {
    swapFromToken,
    swapToToken,
    bridgeFromToken,
    bridgeToToken,
    bridgeToChain,
  } = storeToRefs(pairStore)
  const {
    setSwapFromToken,
    setSwapToToken,
    setBridgeFromToken,
    setBridgeToToken,
    setBridgeToChain,
  } = pairStore
  const { t } = useI18n()

  // --- Refs from Stores ---
  const { gasPriceType } = storeToRefs(globalStore)
  const {
    isWalletConnected,
    userAddress,
    walletAddress,
    wallet,
    isWatchOnly,
    tokens,
    balanceWei,
    hasChainBalance,
  } = storeToRefs(walletStore)
  const { selectedChain, isBitcoinChain, chains } = storeToRefs(chainsStore)
  const { hasSwapValues, swapValues } = storeToRefs(inputStore)
  const { storeSwapValues, clearSwapValues } = inputStore

  // --- Swap Store ---
  const swapStore = useSwapStore()
  const {
    supportedNetwork,
    swapLoaded,
    toChains,
    fromTokens,
    toTokens,
  } = storeToRefs(swapStore)
  const { initSwapper, getQuote, getSwap } = swapStore

  const form = useSwapForm()
  const {
    selectedToChain, fromTokenSelected, toTokenSelected, toAddressError,
    generalError, fromAmount, toAmount, userToAddress, foundNickName,
    providers, selectedQuote, swapInfo, swapGasFeeQuote, txHash, localToTokens,
    isLoadingQuotes, bestSwapLoadingOpen, bestOfferSelectionOpen,
    swapInitiatedOpen, txProceeding, quotesError, isPristine,
    resetPristine, markFormDirty,
  } = form
  const { getAnalyticsShared } = useSwapAnalytics({ form, selectedChain })

  // --- Computed Helpers ---
  const isSwapView = computed(() => walletPanel.value === 'swap')

  const isCrossChain = computed(
    () => selectedChain.value?.type !== selectedToChain.value?.type,
  )

  const isSameToken = computed(() => {
    if (!fromTokenSelected.value || !toTokenSelected.value) return false
    return (
      selectedChain.value?.name === selectedToChain.value?.name &&
      fromTokenSelected.value.address.toLowerCase() ===
        toTokenSelected.value.address.toLowerCase()
    )
  })

  const parsedFromTokens = computed<NewTokenInfo[]>(() => {
    if (!fromTokens.value || !selectedChain.value || !selectedToChain.value)
      return []
    return fromTokens.value
  })

  const filteredToTokens = computed<NewTokenInfo[]>(() => {
    if (
      !fromTokenSelected.value ||
      selectedChain.value?.name !== selectedToChain.value?.name
    )
      return localToTokens.value
    return localToTokens.value.filter(
      t =>
        t.address.toLowerCase() !==
        fromTokenSelected.value!.address.toLowerCase(),
    )
  })

  const parsedToChains = computed<Chain[]>(() => {
    if (!toChains.value) return []
    if (isBitcoinChain.value) {
      return toChains.value.filter(chain => chain.name !== 'BITCOIN')
    }
    return toChains.value
  })

  const isLoading = computed(() => !swapLoaded.value || isLoadingQuotes.value)

  const fromChains = computed(() => {
    const supportedNetworks = getSupportedNetworks()
    return supportedNetworks
      .map(chain => {
        const toChainByEnum = enumToChain[chain.id]
        if (!toChainByEnum) return null
        return chains.value.find(c => c.name === toChainByEnum) || null
      })
      .filter((chain): chain is Chain => chain !== null)
  })

  const defualtChainWhenNetworkUnsupported = computed(() => {
    return (
      fromChains.value.filter(chain => chain.name === 'ETHEREUM')[0] ||
      fromChains.value[0]
    )
  })

  // Matches the unavailable card's own condition, so the form is never dimmed
  // without the card present to explain why.
  const { blockedClass } = useBlockedContent(
    () => swapLoaded.value && !supportedNetwork.value,
  )

  const toAddress = computed(() => {
    // `walletAddress`, not `userAddress`: the latter falls back to the donation
    // address so disconnected users can still be quoted, and this value is a
    // funds destination. With no wallet there is no destination.
    const ownAddress = walletAddress.value || ''
    if (selectedToChain.value?.name === selectedChain.value?.name)
      return ownAddress
    if (!isCrossChain.value) return ownAddress
    return userToAddress.value || ''
  })

  const toLoadingState = computed(() => isLoading.value)
  const fromLoadingState = computed(() => !swapLoaded.value)

  const fromAmountError = computed(() => {
    if (
      !fromAmount.value ||
      fromAmount.value === '0' ||
      fromAmount.value === '' ||
      BigNumber(fromAmount.value).isNaN()
    )
      return t('swap.error.amount-required')

    if (!fromTokenSelected.value) return ''

    // Validate Decimals
    const decimals = fromTokenSelected.value.decimals || 18
    if (BigNumber(fromAmount.value).toFixed().split('.')[1]?.length > decimals) {
      return t('swap.error.too-many-decimals')
    }

    // Ensure > 0
    const amountBN = BigNumber(fromAmount.value)
    if (amountBN.lte(0)) return t('swap.error.more-than-zero')

    // Calculate Base Units
    const baseAmount = parseUnits(amountBN.toFixed(), decimals)

    // Balance Check
    const tokenParams = getTokenBalanceParams(fromTokenSelected.value)
    const isMainToken = isMainTokenAddress(fromTokenSelected.value.address)
    const remainingNativeBalance = isMainToken
      ? tokenParams.totalBalance - baseAmount
      : tokenParams.baseNetworkBalance

    // Insufficient Balance Error
    if (isWalletConnected.value && tokenParams.baseBalance < baseAmount) {
      return t('swap.error.insufficient-native', {
        symbol: fromTokenSelected.value.symbol,
      })
    }

    if (selectedQuote.value) {
      // Fee Check
      const fees = BigInt(
        selectedQuote.value.additionalNativeFees?.toString() || '0',
      )
      if (isWalletConnected.value && fees > remainingNativeBalance) {
        return t('swap.error.insufficient-balance-for-fees', {
          symbol: selectedChain.value?.currencyName,
        })
      }

      // Min/Max Check
      const min = BigInt(
        selectedQuote.value.minMax?.minimumFrom.toString() || '0',
      )
      const max = BigInt(
        selectedQuote.value.minMax?.maximumFrom.toString() || '0',
      )
      if (baseAmount < min) return t('swap.error.minimum-amount')
      if (baseAmount > max) return t('swap.error.maximum-amount')
    }

    return ''
  })

  const toAmountError = computed(() => {
    // In bridge mode, if toAddress is missing, don't show "no quotes" — the address input handles it
    if (isCrossChain.value && !toAddress.value) {
      return ''
    }
    if (
      !isLoading.value &&
      quotesError.value &&
      fromAmount.value !== '0' &&
      fromAmount.value !== '' &&
      fromAmountError.value === '' &&
      generalError.value === ''
    ) {
      return t('swap.error.no-quotes')
    }
    return ''
  })

  const priceImpact = computed(() => {
    const fromAmt = parseFloat(fromAmount.value)
    const toAmt = parseFloat(toAmount.value)
    const fromPrice = fromTokenSelected.value?.price || 0
    const toPrice = toTokenSelected.value?.price || 0
    if (!fromAmt || !toAmt || !fromPrice || !toPrice) return 0
    const fromValue = fromAmt * fromPrice
    const toValue = toAmt * toPrice
    return ((fromValue - toValue) / fromValue) * 100
  })

  const priceImpactTooHigh = computed(() => priceImpact.value > MAX_PRICE_IMPACT)

  const isSwapDisabled = computed(
    () =>
      (swapLoaded.value && !supportedNetwork.value) ||
      !(
        fromAmount.value !== '' &&
        fromAmount.value !== '0' &&
        fromAmountError.value === '' &&
        toAmount.value !== '0'
      ) ||
      (isCrossChain.value && toAddressError.value !== '') ||
      isLoadingQuotes.value ||
      !hasChainBalance.value ||
      isSameToken.value ||
      priceImpactTooHigh.value,
  )

  // --- Helper Methods ---

  const getTokenBalanceParams = (token: NewTokenInfo) => {
    const isMainToken = isMainTokenAddress(token.address)
    const balance = token.balance || '0'
    const baseTokenBalance = walletStore.getTokenBalance(MAIN_TOKEN_CONTRACT)
    const baseNetworkBalance = parseUnits(
      baseTokenBalance?.balance || '0',
      baseTokenBalance?.decimals || 18,
    )

    const baseBalance = isMainToken ? baseNetworkBalance : BigInt(balance)
    // For calculating remaining balance (native logic)
    const totalBalance =
      isMainToken && isWalletConnected.value
        ? baseNetworkBalance
        : BigInt(balance)

    return { baseBalance, totalBalance, baseNetworkBalance }
  }

  const isMainTokenAddress = (address?: string) => {
    return address?.toLowerCase() === MAIN_TOKEN_CONTRACT.toLowerCase()
  }

  const getSwapFee = (): bigint => {
    const feeData = swapGasFeeQuote.value?.fees?.[gasPriceType.value]
    const gasFee = BigInt(feeData?.nativeValue || feeData?.nativeFeeTotal || '0')
    const additionalFees = BigInt(
      selectedQuote.value?.additionalNativeFees?.toString() || '0',
    )
    return gasFee + additionalFees
  }

  const { setMaxAmount, resetMaxState, isInternalWallet, isMaxSelected } =
    useMaxAmount({
      getBalance: () => {
        if (!fromTokenSelected.value) return 0n
        const tokenParams = getTokenBalanceParams(fromTokenSelected.value)
        return tokenParams.totalBalance
      },
      getDecimals: () => fromTokenSelected.value?.decimals ?? 18,
      getEstimatedFee: () => (selectedQuote.value ? getSwapFee() : 0n),
      isNativeToken: () => isMainTokenAddress(fromTokenSelected.value?.address),
      isTokenSelected: () => !!fromTokenSelected.value,
      getAmount: () => fromAmount.value,
      onAmountChange: value => { fromAmount.value = String(value) },
      markFormDirty,
      resetFormPristine: resetPristine,
      getTokenIdentifier: () => fromTokenSelected.value?.address,
      getDependencies: () => [
        fromTokenSelected.value?.balance,
        swapGasFeeQuote.value?.fees?.[gasPriceType.value]?.nativeValue ||
          swapGasFeeQuote.value?.fees?.[gasPriceType.value]?.nativeFeeTotal,
        selectedQuote.value?.additionalNativeFees?.toString(),
      ],
    })

  const handleMaxClick = (): void => {
    if (isMaxSelected.value) return
    // Discard any prior quote/fee so the new max is calculated against the full
    // balance, not against a fee that was estimated for a smaller manual amount.
    selectedQuote.value = undefined
    swapGasFeeQuote.value = undefined
    setMaxAmount()
  }

  const switchGlobalNetwork = (chain: Chain) => {
    globalStore.setSelectedNetwork(chain.name)
  }

  const clearValues = () => {
    resetPristine()
    resetMaxState()
    toAddressError.value = '' // Clear error immediately
    generalError.value = '' // Clear general error
    clearSwapValues()
    fromAmount.value = ''
    toAmount.value = ''
    userToAddress.value = ''
    foundNickName.value = ''
    selectedQuote.value = undefined
    // Reset token selections so setToToken/setFromToken will set defaults
    fromTokenSelected.value = null
    toTokenSelected.value = null
    setFromToken()
    setToToken()
  }

  const validateToAddress = async () => {
    // Skip validation if form is pristine
    if (isPristine.value) {
      toAddressError.value = ''
      return
    }
    if (!userToAddress.value) {
      toAddressError.value = t('swap.error.recipient-required')
      return
    }
    const valid = await toTokenSelected.value?.networkInfo.isAddress(
      userToAddress.value,
    )
    toAddressError.value = valid ? '' : t('swap.error.invalid-address')
  }
  // --- Swap Logic & Transactions ---

  const handleBitcoinTransaction = async (quoteId: string) => {
    const txCtx = wallet.value
    if (!txCtx) return

    const signableTx = await txCtx.getSignableTransaction({
      priority: gasPriceType.value as GasPriceType,
      quoteId: quoteId,
    })

    const isHardware =
      txCtx.getWalletType() !== WalletType.WAGMI &&
      txCtx.getWalletType() !== WalletType.INJECTED

    if (!isHardware) {
      return txCtx.SendTransaction?.(signableTx.serialized as HexPrefixedString)
    } else {
      const signedTx = await txCtx.SignTransaction?.(
        signableTx.serialized as HexPrefixedString,
      )
      return txCtx.broadcastTransaction(
        signedTx?.signed as unknown as HexPrefixedString,
      )
    }
  }

  const handleEvmTransaction = async (quoteId: string) => {
    const txCtx = wallet.value
    if (!txCtx) return

    const txs = await txCtx.getMultipleSignableTransactions?.({
      priority: gasPriceType.value as GasPriceType,
      quoteId: quoteId,
    })

    if (!txs?.serialized?.length) return

    let lastTxPromise

    for (const [index, tx] of txs.serialized.entries()) {
      const isLast = index === txs.serialized.length - 1
      if (!tx) continue

      if (!isSignableWallet(txCtx)) {
        const broadcast = await txCtx.SendTransaction?.(tx as HexPrefixedString)
        if (isLast) lastTxPromise = broadcast
      } else {
        const signedTx = await txCtx.SignTransaction?.(tx as HexPrefixedString)
        const broadcast = txCtx.broadcastTransaction(
          signedTx?.signed as unknown as HexPrefixedString,
        )
        if (isLast) {
          // The caller awaits this one and surfaces its hash.
          lastTxPromise = broadcast
        } else {
          // Awaited so a rejection reaches `proceedWithSwap`'s try/catch instead
          // of becoming an unhandled rejection while the loop moves on, and so
          // the next transaction (the swap) is only submitted after this one (the
          // approval) has been accepted.
          //
          // NOTE: acceptance is not confirmation — `broadcastTransaction`
          // resolves when the node takes the transaction, not when it is mined.
          // The delay below is the existing (crude) allowance for that; a proper
          // fix awaits the receipt.
          await broadcast
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    }
    return lastTxPromise
  }

  const proceedWithSwap = async (quoteId: string) => {
    txProceeding.value = true
    generalError.value = ''
    const analyticsPayload = getAnalyticsShared()
    analytics.trackSwapEvent(SwapEvent.OFFER_PROCEED, analyticsPayload)
    try {
      let txPromise: Promise<string> | undefined

      if (isBitcoinChain.value) {
        txPromise = handleBitcoinTransaction(
          quoteId,
        ) as unknown as Promise<string>
      } else {
        txPromise = handleEvmTransaction(quoteId) as unknown as Promise<string>
      }

      if (txPromise) {
        const hash = await txPromise
        txHash.value = hash as HexPrefixedString
        bestOfferSelectionOpen.value = false
        swapInitiatedOpen.value = true
        //check reward elements availability after transaction is sent
        let canEarnReward: undefined | boolean = undefined

        const fromUsdValue =
          parseFloat(fromAmount.value) * (fromTokenSelected.value?.price || 0)
        if (fromUsdValue > 50) {
          const canEarn =
            await rewardsStore.checkAvailabilityAfterTransaction('swap')
          canEarnReward = canEarn ? true : undefined
        }
        analytics.trackSwapEventStatus(SwapEventStatus.INITIATED, {
          ...analyticsPayload,
          canEarnReward,
          hash: hash,
        })
      }
    } catch (e: unknown) {
      const errorMessage = getErrorMessage(e, t('swap.toast.tx-sign-failed'))
      // Lowercased only for the substring checks below — the original casing is
      // what reaches the user, Sentry and analytics.
      const normalizedError = errorMessage.toLowerCase()

      if (isUserRejectionError(e)) {
        toastStore.addToastMessage({
          type: ToastType.Info,
          text: t('swap.toast.swap-canceled'),
        })
        analytics.trackSwapEventError(SwapEventError.SIGN_ERROR, {
          ...analyticsPayload,
          errorMsg: 'declined_by_user',
        })
        return
      } else {
        if (!isDevMode) {
          analytics.trackSwapEventError(SwapEventError.SIGN_ERROR, {
            ...analyticsPayload,
            errorMsg: errorMessage,
          })
        }
        reportModuleError({
          tag: SENTRY_MODULE_TAGS.SWAP,
          title: 'SWAP: Error proceeding with swap',
          error: e,
          extra: { errorMessage },
        })
        if (
          normalizedError.includes('rejected') ||
          normalizedError.includes('denied') ||
          normalizedError.includes('cancelled')
        ) {
          toastStore.addToastMessage({
            type: ToastType.Info,
            text: t('swap.toast.swap-canceled'),
          })
          return
        }
        generalError.value = errorMessage
        toastStore.addToastMessage({
          type: ToastType.Error,
          text: t('swap.toast.swap-failed'),
          textSecondary: errorMessage,
          duration: 10000,
        })
      }
    } finally {
      txProceeding.value = false
    }
  }

  // --- Pre-Swap & Quotes ---

  const swapFeeError = computed<string | undefined>(() => {
    if (
      !swapGasFeeQuote.value?.fees ||
      !swapGasFeeQuote.value.fees[gasPriceType.value] ||
      fromTokenSelected.value === null
    ) {
      return undefined
    }
    const isMainToken = isMainTokenAddress(fromTokenSelected.value.address)
    const fee = BigInt(
      swapGasFeeQuote.value?.fees[gasPriceType.value]?.nativeValue || '0',
    )
    const mainTokenBalance = BigInt(balanceWei.value)

    if (!isMainToken) {
      if (fee > mainTokenBalance) {
        return 'NOT_ENOUGH_BALANCE'
      }
    } else {
      const totalBalanceNeeded =
        fee +
        BigInt(parseUnits(fromAmount.value, fromTokenSelected.value.decimals))
      if (totalBalanceNeeded > mainTokenBalance) {
        return 'NOT_ENOUGH_BALANCE'
      }
    }
    return undefined
  })
  const swapForBtc = async () => {
    bestSwapLoadingOpen.value = true
    generalError.value = ''
    const analyticsPayload = getAnalyticsShared()
    try {
      await debounceFetchQuotes()

      const res = await generateBTCGasFeeQuote()
      swapGasFeeQuote.value = (res as QuotesResponse) || undefined
      bestOfferSelectionOpen.value = true
    } catch (e: unknown) {
      generalError.value = getErrorMessage(e, t('swap.error.fetching-btc-gas-fees'))
      if (!isDevMode) {
        analytics.trackSwapEventError(SwapEventError.OFFER_ERROR, {
          ...analyticsPayload,
          errorMsg: generalError.value,
        })
      }
      reportModuleError({
        tag: SENTRY_MODULE_TAGS.SWAP,
        title: 'SWAP: Error fetching BTC gas fees',
        error: e,
        extra: { errorMessage: generalError.value },
      })
    } finally {
      bestSwapLoadingOpen.value = false
    }
  }

  const generateBTCGasFeeQuote = async () => {
    const transactions = (
      (swapInfo.value?.transactions as GenericTransaction[]) || []
    ).map(tx => ({ address: tx.to, amount: tx.value }))

    if (transactions.length === 0) return undefined
    const txForm: BitcoinQuotesRequestBody = {
      fromAddresses: [userAddress.value],
      consolidationAddress: userAddress.value,
      outputs: transactions,
    }

    // A P2SH from-address must declare its type and public key so the backend
    // can build the correct redeem script for the quote.
    if (
      wallet.value &&
      isP2shAddress(userAddress.value, wallet.value.getProvider())
    ) {
      const publicKey = await wallet.value.getPublicKey?.()
      if (publicKey) {
        txForm.p2shAddressTypes = [
          {
            address: userAddress.value,
            type: 'P2SH_P2WPKH',
            publicKey,
          },
        ]
      }
    }

    const res = await wallet.value?.getBtcGasFee?.(txForm)
    return res
  }

  const generateEVMGasFeeQuote = async () => {
    // Filter for EVM Transactions
    const transactions = (swapInfo.value?.transactions || []).filter(
      (tx): tx is EVMTransaction => 'gasLimit' in tx && 'data' in tx,
    )

    const parsedTransactions = transactions.map(tx => ({
      address: tx.from,
      to: tx.to,
      data: tx.data,
      value: tx.value || '0x0',
      action: dataTxAction(tx) as EvmTransactionAction,
    }))

    if (parsedTransactions.length === 0) return undefined

    const res = await wallet.value?.getMultipleGasFees?.(parsedTransactions)
    return res
  }

  const swapForEvm = async () => {
    bestSwapLoadingOpen.value = true
    generalError.value = ''
    const analyticsPayload = getAnalyticsShared()
    try {
      await debounceFetchQuotes()
      if (!swapInfo.value) {
        throw new Error(t('swap.error.pair-not-available'))
      }
      const res = await generateEVMGasFeeQuote()

      swapGasFeeQuote.value = res || undefined
      bestOfferSelectionOpen.value = true
    } catch (e: unknown) {
      const errorMessage = getErrorMessage(e, t('swap.error.fetching-gas-fees'))
      generalError.value = errorMessage
      // "Pair not available" is an expected, user-facing condition (the selected
      // pair has no route/quote). Keep the throw so generalError + analytics are
      // handled here as designed, but skip the Sentry report to avoid noise.
      const isPairNotAvailable = errorMessage === t('swap.error.pair-not-available')
      if (!isDevMode) {
        analytics.trackSwapEventError(SwapEventError.OFFER_ERROR, {
          ...analyticsPayload,
          errorMsg: generalError.value,
        })
      }
      reportModuleError({
        tag: SENTRY_MODULE_TAGS.SWAP,
        title: 'SWAP: Error fetching gas fees',
        error: e,
        expected: isPairNotAvailable,
        extra: { errorMessage: generalError.value },
      })
    } finally {
      bestSwapLoadingOpen.value = false
    }
  }

  const swapButton = () => {
    const analyticsPayload = getAnalyticsShared()
    analytics.trackSwapEvent(SwapEvent.CLICK_SWAP, analyticsPayload)
    return isBitcoinChain.value ? swapForBtc() : swapForEvm()
  }

  const cancelSwap = () => {
    bestOfferSelectionOpen.value = false
  }

  const fetchQuotes = async () => {
    if (!fromTokenSelected.value || !toTokenSelected.value || isSameToken.value)
      return
    isLoadingQuotes.value = true
    providers.value = []
    selectedQuote.value = undefined

    generalError.value = ''
    toAmount.value = '0'
    quotesError.value = false
    const analyticsPayload = getAnalyticsShared()
    try {
      const quotes = await getQuote({
        fromToken: fromTokenSelected.value,
        toToken: toTokenSelected.value,
        amount: fromAmount.value,
        fromAddress: userAddress.value,
        toAddress: toAddress.value,
      })

      if (quotes && quotes.length > 0) {
        const fromDecimals = fromTokenSelected.value?.decimals || 18
        const fromAmountBase = parseUnits(fromAmount.value, fromDecimals)

        providers.value = quotes
          .sort((a, b) => {
            const aMin = BigInt(a.minMax.minimumFrom.toString())
            const bMin = BigInt(b.minMax.minimumFrom.toString())
            return aMin > bMin ? 1 : bMin > aMin ? -1 : 0
          })
          .filter(
            quote =>
              BigInt(quote.minMax.minimumFrom.toString()) <= fromAmountBase,
          )
        selectedQuote.value = providers.value[0] || undefined
        if (providers.value.length === 0) {
          quotesError.value = true
          // if no providers were selected after filter minimum
          // fromValue is probably too low
          if (quotes.length > 0) {
            generalError.value = t('swap.error.minimum-amount')
          }
          const event = bestSwapLoadingOpen.value
            ? SwapEventError.OFFER_ERROR
            : SwapEventError.PRELIMINARY_ERROR
          analytics.trackSwapEventError(event, {
            ...analyticsPayload,
            errorMsg: 'No quotes after filtering by minimum from amount',
          })
        } else if (!bestSwapLoadingOpen.value && fromAmountError.value === '') {
          analytics.trackSwapEvent(SwapEvent.PRELIMINARY_SHOWN, {
            ...analyticsPayload,
          })
        }
      } else {
        quotesError.value = true
        const event = bestSwapLoadingOpen.value
          ? SwapEventError.OFFER_ERROR
          : SwapEventError.PRELIMINARY_ERROR
        analytics.trackSwapEventError(event, {
          ...analyticsPayload,
          errorMsg: 'No quotes returned from getQuote',
        })
      }
    } catch (err: unknown) {
      generalError.value = t('swap.error.fetching-quotes')
      reportModuleError({
        tag: SENTRY_MODULE_TAGS.SWAP,
        title: 'SWAP: fetchQuotes Error',
        error: err,
      })
      if (!isDevMode) {
        const event = bestSwapLoadingOpen.value
          ? SwapEventError.OFFER_ERROR
          : SwapEventError.PRELIMINARY_ERROR
        const analyticsPayload = getAnalyticsShared()
        analytics.trackSwapEventError(event, {
          ...analyticsPayload,
          errorMsg: 'No quotes returned from getQuote',
        })
      }
    } finally {
      isLoadingQuotes.value = false
    }
  }

  const debounceFetchQuotes = useDebounceFn(fetchQuotes, 750)

  // --- Token Setup Methods ---

  const setToChain = (chain: Chain) => {
    if (hasSwapValues.value) {
      selectedToChain.value = swapValues.value.toChain
    } else if (chain) {
      selectedToChain.value = chain
    }
    toAmount.value = ''
    setToToken()
  }

  const setToToken = () => {
    const currentToChain = selectedToChain.value
    if (!currentToChain) {
      if (!hasSwapValues.value) return
      generalError.value = t('swap.toast.select-chain')
      return
    }

    const enkryptEnum = supportedSwapEnums[currentToChain.name]
    if (!enkryptEnum) {
      generalError.value = t('swap.toast.unsupported-chain')
      return
    }

    // 1. Prepare Local To Tokens
    const allToTokensRaw =
      toTokens.value?.all[enkryptEnum as keyof typeof toTokens.value.all] || []

    const sameNetworks = currentToChain.name === selectedChain.value?.name
    localToTokens.value = hydrateTokenBalances(allToTokensRaw as TokenType[], {
      balanceSources: tokens.value.map(token => ({
        address: token.contract,
        balance: token.balanceWei,
        price: token.price ?? undefined,
      })),
      mainTokenAddress: MAIN_TOKEN_CONTRACT,
      nativeBalance: balanceWei.value,
      nativePrice: selectedChain.value?.price ?? undefined,
      hydrate:
        sameNetworks && (tokens.value.length > 0 || balanceWei.value !== '0'),
    }) as unknown as NewTokenInfo[]

    // 2. Select Token Logic
    if (hasSwapValues.value) {
      // Deep link / restore values - use stored token
      const match = localToTokens.value.find(
        t =>
          t.address.toLowerCase() ===
          swapValues.value.toToken.address.toLowerCase(),
      )
      if (match) {
        toTokenSelected.value = match
      } else if (localToTokens.value.length > 0) {
        const fallback = localToTokens.value[0]
        toTokenSelected.value = {
          ...fallback,
          balance: formatUnits(
            BigInt(fallback.balance?.toString() ?? '0'),
            fallback.decimals ?? 18,
          ),
        } as NewTokenInfo
      }
    } else if (toTokenSelected.value) {
      // Token already selected and no stored values - keep selection if it exists in list
      const sameNetworks = currentToChain.name === selectedChain.value?.name
      const existsInList = localToTokens.value.find(
        t =>
          t.address.toLowerCase() ===
          toTokenSelected.value?.address?.toLowerCase(),
      )
      const collidesWithFrom =
        sameNetworks &&
        fromTokenSelected.value &&
        toTokenSelected.value.address.toLowerCase() ===
          fromTokenSelected.value.address.toLowerCase()

      if (existsInList && !collidesWithFrom) {
        // Update with fresh data but keep selection
        toTokenSelected.value = existsInList as NewTokenInfo
        return
      }
      // Selected token doesn't exist in new list, fall through to default selection
      if (toTokens.value && allToTokensRaw.length > 0) {
        const allToTop =
          toTokens.value.top[enkryptEnum as keyof typeof toTokens.value.top]
        const candidates = allToTop?.length ? allToTop : allToTokensRaw
        const sameNetworks = currentToChain.name === selectedChain.value?.name

        const defaultToken = sameNetworks
          ? candidates.find(
              t =>
                t.address.toLowerCase() !==
                fromTokenSelected.value?.address.toLowerCase(),
            )
          : candidates[0]
        if (defaultToken) {
          toTokenSelected.value = {
            ...defaultToken,
            balance: formatUnits(
              BigInt(defaultToken.balance?.toString() ?? '0'),
              defaultToken.decimals ?? 18,
            ),
          } as NewTokenInfo
        }
      }
    } else {
      // No token selected, no stored values - use default
      if (toTokens.value && allToTokensRaw.length > 0) {
        const allToTop =
          toTokens.value.top[enkryptEnum as keyof typeof toTokens.value.top]
        const candidates = allToTop?.length ? allToTop : allToTokensRaw
        const sameNetworks = currentToChain.name === selectedChain.value?.name

        const defaultToken = sameNetworks
          ? candidates.find(
              t =>
                t.address.toLowerCase() !==
                fromTokenSelected.value?.address.toLowerCase(),
            )
          : candidates[0]
        if (defaultToken) {
          toTokenSelected.value = {
            ...defaultToken,
            balance: formatUnits(
              BigInt(defaultToken.balance?.toString() ?? '0'),
              defaultToken.decimals ?? 18,
            ),
          } as NewTokenInfo
        }
      }
    }
  }

  const setFromToken = () => {
    if (!fromTokens.value?.length) return

    if (hasSwapValues.value) {
      // Deep link / restore values - use stored token
      const match = fromTokens.value.find(
        t =>
          t.address.toLowerCase() ===
          swapValues.value.fromToken.address?.toLowerCase(),
      )
      fromTokenSelected.value = (match || fromTokens.value[0]) as NewTokenInfo
    } else if (fromTokenSelected.value) {
      // Token already selected and no stored values - keep selection if it exists in list
      const existsInList = fromTokens.value.find(
        t =>
          t.address.toLowerCase() ===
          fromTokenSelected.value?.address?.toLowerCase(),
      )
      if (existsInList) {
        // Update with fresh data but keep selection
        fromTokenSelected.value = existsInList as NewTokenInfo
        return
      }
      // Selected token doesn't exist in new list, fall through to default
      const mewToken = fromTokens.value.find(
        t => t.address.toLowerCase() === MAIN_TOKEN_CONTRACT,
      )
      fromTokenSelected.value = (mewToken || fromTokens.value[0]) as NewTokenInfo
    } else {
      // No token selected, no stored values - use default
      const mewToken = fromTokens.value.find(
        t => t.address.toLowerCase() === MAIN_TOKEN_CONTRACT,
      )
      fromTokenSelected.value = (mewToken || fromTokens.value[0]) as NewTokenInfo
    }
  }

  const connectWalletForSwap = () => {
    if (swapLoaded.value && supportedNetwork.value) {
      storeSwapValues({
        fromToken: fromTokenSelected.value!,
        toToken: toTokenSelected.value!,
        toChain: selectedToChain.value!,
        fromAmount: fromAmount.value,
      })
    }
    const source = isSwapView.value ? 'Swap' : 'Bridge'
    analytics.trackConnectWalletEvent(ConnectWalletEvent.CLICKED, {
      source,
    })
    accessStore.openAccessDialog()
  }

  // --- Watchers ---
  const bestRate = computed(() => {
    if (providers.value.length === 0) return null
    return providers.value[0]
  })
  const swapTokensFeature = useSwapTokens({
    form, setFromToken, setToToken, parsedFromTokens, filteredToTokens,
    parsedToChains, fromChains,
  })
  const swapValidationFeature = useSwapValidation({
    fromAmountError, toAmountError, isSwapDisabled, isSameToken,
    priceImpact, priceImpactTooHigh, swapFeeError,
  })
  const swapQuoteFeature = useSwapQuote({
    form, fetchQuotes, debounceFetchQuotes, bestRate,
  })
  useSwapGasFee({
    generateBTCGasFeeQuote, generateEVMGasFeeQuote, getSwapFee,
    getTokenBalanceParams,
  })
  const swapExecutionFeature = useSwapExecution({
    proceedWithSwap, swapForBtc, swapForEvm, swapButton,
  })

  const bindWatchers = () => {
  // Sync swap/bridge pair to pairStore
  watch(fromTokenSelected, token => {
    if (isSwapView.value) {
      setSwapFromToken(token ?? null)
    } else {
      setBridgeFromToken(token ?? null)
    }
  })

  watch(toTokenSelected, token => {
    if (isSwapView.value) {
      setSwapToToken(token ?? null)
    } else {
      setBridgeToToken(token ?? null)
    }
  })

  watch(selectedToChain, chain => {
    if (!isSwapView.value) {
      setBridgeToChain(
        chain && chain.name !== selectedChain.value?.name ? chain : null,
      )
    }
  })

  // Deep Link / Swap Values Watcher
  watch(
    () => swapValues.value,
    async newVal => {
      if (hasSwapValues.value) {
        markFormDirty() // Restoring values means form is not pristine
        selectedToChain.value = newVal.toChain
        await nextTick()
        setToToken()
        setFromToken()
        fromAmount.value = newVal.fromAmount
        setTimeout(() => clearSwapValues(), 1000)
      }
    },
    { deep: true },
  )

  // Reset state on Swap Success Dialog close
  watch(
    () => swapInitiatedOpen.value,
    isOpen => {
      if (!isOpen) {
        // Add address to book if new
        if (!foundNickName.value && toAddress.value) {
          addAddress(
            {
              address: toAddress.value,
              name: '',
              chainName: selectedToChain.value?.name || '',
              chainType: selectedToChain.value?.type || '',
            },
            selectedToChain.value?.type || '',
          )
        }

        // Cleanup
        txHash.value = '0x'
        providers.value = []
        clearValues()
      }
    },
  )

  // Fetch Quote Trigger
  const prevFromToken = ref<string | null>(null)
  const prevToToken = ref<string | null>(null)
  const prevUserAddress = ref<string | null>(null)
  const prevToAddress = ref<string | null>(null)

  watch(
    () => [
      fromAmount.value,
      fromTokenSelected.value?.address,
      userAddress.value,
      toAddress.value,
      toTokenSelected.value?.address,
    ],
    () => {
      generalError.value = ''
      quotesError.value = false

      const currentFromToken = fromTokenSelected.value?.address || null
      const currentToToken = toTokenSelected.value?.address || null
      const currentUserAddress = userAddress.value || null
      const currentToAddress = toAddress.value || null
      const onlyAmountChanged =
        prevFromToken.value === currentFromToken &&
        prevToToken.value === currentToToken &&
        prevUserAddress.value === currentUserAddress &&
        prevToAddress.value === currentToAddress &&
        prevFromToken.value !== null

      prevFromToken.value = currentFromToken
      prevToToken.value = currentToToken
      prevUserAddress.value = currentUserAddress
      prevToAddress.value = currentToAddress

      if (isSameToken.value) {
        toAmount.value = ''
        return
      }

      const isNativeToken =
        fromTokenSelected.value?.address?.toLowerCase() ===
        MAIN_TOKEN_CONTRACT.toLowerCase()
      if (
        isMaxSelected.value &&
        onlyAmountChanged &&
        isNativeToken &&
        selectedQuote.value
      ) {
        return
      }

      if (
        swapLoaded.value &&
        !BigNumber(fromAmount.value).isNaN() &&
        !BigNumber(fromAmount.value).isZero() &&
        toTokenSelected.value
      ) {
        if (isCrossChain.value && !toAddress.value && !isPristine.value) {
          // Highlight the missing address instead of silently returning
          toAddressError.value = t('swap.error.recipient-required')
          return
        }
        debounceFetchQuotes()
      } else {
        // Clear stale quotes when amount becomes invalid
        providers.value = []
        selectedQuote.value = undefined
        toAmount.value = ''
      }
    },
  )

  watch(
    () => selectedQuote.value,
    async (provider, _prev, onCleanup) => {
      if (!provider) return
      // A newer selectedQuote invalidates this run: flag it so late-resolving
      // getSwap / gas-fee-quote calls don't overwrite state with stale data.
      let cancelled = false
      onCleanup(() => {
        cancelled = true
      })
      const analyticsPayload = getAnalyticsShared()
      // disable proceeding while we fetch swap info for the selected quote to prevent user from clicking "proceed" before we have the necessary transaction data
      txProceeding.value = true
      try {
        const res = await getSwap(provider)
        if (cancelled) return
        swapInfo.value = res
        const quoteRes = await (isBitcoinChain.value
          ? generateBTCGasFeeQuote()
          : generateEVMGasFeeQuote())
        if (cancelled) return
        swapGasFeeQuote.value = (quoteRes as QuotesResponse) || undefined
      } catch (err: unknown) {
        if (cancelled) return
        swapInfo.value = null
        swapGasFeeQuote.value = undefined
        const errorMessage = getErrorMessage(err, 'Error fetching gas fees')
        generalError.value = errorMessage
        const isExpectedQuoteError =
          errorMessage === t('swap.error.pair-not-available') ||
          /insufficient funds/i.test(errorMessage)
        if (!isDevMode) {
          analytics.trackSwapEventError(SwapEventError.OFFER_ERROR, {
            ...analyticsPayload,
            errorMsg: generalError.value,
          })
        }
        reportModuleError({
          tag: SENTRY_MODULE_TAGS.SWAP,
          title: 'SWAP: Error fetching gas fees on quote selection',
          error: err,
          expected: isExpectedQuoteError,
          extra: { errorMessage: generalError.value },
        })
      } finally {
        if (!cancelled) txProceeding.value = false
      }
    },
    { deep: true },
  )

  // Update To Amount Estimate
  watch(
    () => bestRate.value,
    () => {
      if (
        bestRate.value &&
        providers.value.length > 0 &&
        !fromAmountError.value
      ) {
        const val = formatUnits(
          BigInt(bestRate.value.toTokenAmount.toString()),
          toTokenSelected.value?.decimals || 18,
        )

        const BigNumberVal = BigNumber(val)
        if (BigNumberVal.gte(100000)) {
          toAmount.value = BigNumberVal.toFixed(0) // No decimals for very large numbers
          return
        }
        if (BigNumberVal.gte(10)) {
          toAmount.value = BigNumberVal.toFixed(2) // 2 decimals for numbers >= 10
          return
        }
        if (BigNumberVal.gte(1)) {
          toAmount.value = BigNumberVal.toFixed(4) // 4 decimals for numbers between 0 and 10
          return
        }
        toAmount.value = BigNumberVal.toFixed(6) // Limit to 8 decimals for display
      }
    },
  )

  // Watch Chain Name for Nickname lookup
  watch(
    () => toAddress.value,
    addr => {
      foundNickName.value = ''
      if (!addr) return
      const found = inAddressBook(addr, selectedToChain.value?.type || '')
      if (found) foundNickName.value = (found as Address).name
    },
    { immediate: true },
  )

  // Reset toChain and inputs when global chain changes in swap view
  watch(
    () => selectedChain.value?.name,
    (newName, oldName) => {
      if (!newName || !oldName || newName === oldName) return

      if (newName === 'BITCOIN') {
        const eth = chains.value.find(c => c.name === 'ETHEREUM')
        if (eth) selectedToChain.value = eth
      } else {
        if (isSwapView.value) {
          selectedToChain.value = selectedChain.value!
        }
      }
      clearValues()
    },
  )

  // Handle From Tokens Updates
  watch(
    () => fromTokens.value,
    () => setFromToken(),
    { deep: true },
  )

  // When from-token changes on same chain, auto-switch to-token if it matches
  watch(
    () => fromTokenSelected.value?.address,
    () => {
      swapGasFeeQuote.value = undefined
      if (
        fromTokenSelected.value &&
        toTokenSelected.value &&
        selectedChain.value?.name === selectedToChain.value?.name &&
        fromTokenSelected.value.address.toLowerCase() ===
          toTokenSelected.value.address.toLowerCase()
      ) {
        const alt = filteredToTokens.value[0]
        toTokenSelected.value = alt || null
      }
    },
  )

  // Handle To Tokens Updates (e.g. swap re-init on chain change)
  watch(
    () => toTokens.value,
    () => setToToken(),
    { deep: true },
  )

  // Refresh localToTokens balances when wallet balances update
  watch(
    () => [tokens.value, balanceWei.value],
    () => setToToken(),
    { deep: true },
  )
  }

  // --- Lifecycle ---
  const initialize = async () => {
    if (hasSwapValues.value) {
      markFormDirty() // Restoring values means form is not pristine
      selectedToChain.value = swapValues.value.toChain
    }
    if (isSwapView.value && !hasSwapValues.value && !isBitcoinChain.value) {
      selectedToChain.value = selectedChain.value
    }

    // Pre-populate from pairStore so setFromToken/setToToken keep the selection if found in list
    if (!hasSwapValues.value) {
      if (isSwapView.value) {
        if (swapFromToken.value) fromTokenSelected.value = swapFromToken.value
        if (swapToToken.value) toTokenSelected.value = swapToToken.value
      } else {
        if (
          bridgeToChain.value &&
          bridgeToChain.value.name !== selectedChain.value?.name
        ) {
          selectedToChain.value = bridgeToChain.value
        }
        if (bridgeFromToken.value) fromTokenSelected.value = bridgeFromToken.value
        if (bridgeToToken.value) toTokenSelected.value = bridgeToToken.value
      }
    }

    await nextTick()
    await initSwapper()

    setToToken()
    setFromToken()

    if (hasSwapValues.value) {
      fromAmount.value = swapValues.value.fromAmount
    }

    setTimeout(() => clearSwapValues(), 1000)
  }

  return {
    supportedNetwork,
    swapLoaded,
    selectedChain,
    isBitcoinChain,
    isWalletConnected,
    userAddress,
    isWatchOnly,
    hasChainBalance,
    selectedToChain,
    fromTokenSelected,
    toTokenSelected,
    toAddressError,
    generalError,
    fromAmount,
    toAmount,
    userToAddress,
    isPristine,
    foundNickName,
    providers: swapQuoteFeature.providers,
    selectedQuote: swapQuoteFeature.selectedQuote,
    swapInfo,
    swapGasFeeQuote,
    txHash,
    bestSwapLoadingOpen,
    bestOfferSelectionOpen,
    swapInitiatedOpen,
    txProceeding,
    isSwapView,
    isCrossChain,
    parsedFromTokens: swapTokensFeature.parsedFromTokens,
    filteredToTokens: swapTokensFeature.filteredToTokens,
    parsedToChains: swapTokensFeature.parsedToChains,
    isLoading,
    fromChains: swapTokensFeature.fromChains,
    defualtChainWhenNetworkUnsupported,
    blockedClass,
    toAddress,
    toLoadingState,
    fromLoadingState,
    fromAmountError: swapValidationFeature.fromAmountError,
    toAmountError: swapValidationFeature.toAmountError,
    priceImpact: swapValidationFeature.priceImpact,
    priceImpactTooHigh: swapValidationFeature.priceImpactTooHigh,
    isSwapDisabled: swapValidationFeature.isSwapDisabled,
    swapFeeError: swapValidationFeature.swapFeeError,
    isInternalWallet,
    handleMaxClick,
    switchGlobalNetwork,
    clearValues,
    validateToAddress,
    proceedWithSwap: swapExecutionFeature.proceedWithSwap,
    swapButton: swapExecutionFeature.swapButton,
    cancelSwap,
    setToChain,
    connectWalletForSwap,
    bindWatchers,
    initialize,
  }
}
