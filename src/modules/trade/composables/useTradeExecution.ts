import { ref, type Ref } from 'vue'
import { parseUnits, formatUnits } from 'viem'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useToastStore } from '@/stores/toastStore'
import { useTradeOrdersStore } from '@/stores/tradeOrdersStore'
import { ToastType } from '@/types/notification'
import type { NewTokenInfo } from '@/composables/useSwap'
import type { Chain } from '@/mew_api/types'

interface QuoteData {
  startAmount: bigint
  endAmount?: bigint
  avgAmount?: bigint
}

interface UseTradeExecutionOptions {
  fromTokenSelected: Ref<NewTokenInfo | null>
  toTokenSelected: Ref<NewTokenInfo | null>
  fromAmount: Ref<string>
  walletAddress: Ref<string | null | undefined>
  wallet: Ref<any>
  selectedFromChain: Ref<Chain | undefined>
  currentQuote: Ref<QuoteData | null>
  needsApproval: Ref<boolean>
}

export function useTradeExecution(options: UseTradeExecutionOptions) {
  const {
    fromTokenSelected,
    toTokenSelected,
    fromAmount,
    walletAddress,
    wallet,
    selectedFromChain,
    currentQuote,
    needsApproval,
  } = options

  const toastStore = useToastStore()
  const tradeOrdersStore = useTradeOrdersStore()

  const isApproving = ref(false)
  const txProceeding = ref(false)
  const quoteModalOpen = ref(false)
  const tradeInitiatedOpen = ref(false)
  const orderHash = ref<string>('')

  const handleApprove = async () => {
    if (!fromTokenSelected.value || !walletAddress.value || !wallet.value) {
      return
    }

    isApproving.value = true

    try {
      const { default: OneInchFusion } =
        await import('../providers/oneinch_fusion/oneInchFusion')

      const chainId = parseInt(selectedFromChain.value?.chainID || '1')
      const fusion = new OneInchFusion(wallet.value, chainId)

      await fusion.setApproval(
        walletAddress.value,
        fromTokenSelected.value.address,
      )

      needsApproval.value = false

      toastStore.addToastMessage({
        text: 'Approval successful! ',
        textSecondary: `You can now trade ${fromTokenSelected.value.symbol}.`,
        type: ToastType.Success,
      })
    } catch (e) {
      const errorMessage =
        e instanceof Error && e.message
          ? e.message.toLowerCase()
          : (e as any).details
            ? (e as any).details
            : typeof e === 'string'
              ? e
              : 'Could not approve token'
      if (errorMessage.includes('user rejected')) {
        toastStore.addToastMessage({
          text: 'Approval cancelled by user',
          type: ToastType.Info,
        })
        return
      }
      toastStore.addToastMessage({
        text: 'Could not approve token',
        textSecondary: errorMessage,
        type: ToastType.Error,
      })
    } finally {
      isApproving.value = false
    }
  }

  const openTradeModal = () => {
    if (!currentQuote.value) {
      toastStore.addToastMessage({
        text: 'Please wait for quote to load',
      })
      return
    }
    quoteModalOpen.value = true
  }

  const confirmTrade = async () => {
    if (!fromTokenSelected.value || !toTokenSelected.value || !wallet.value) {
      return
    }

    txProceeding.value = true

    try {
      const { default: OneInchFusion } =
        await import('../providers/oneinch_fusion/oneInchFusion')

      const chainId = parseInt(selectedFromChain.value?.chainID || '1')
      const fusion = new OneInchFusion(wallet.value, chainId)

      const decimals = fromTokenSelected.value.decimals || 18
      const amountInBaseUnits = parseUnits(
        fromAmount.value,
        decimals,
      ).toString()

      const result = await fusion.submitOrder({
        fromTokenAddress: fromTokenSelected.value.address,
        toTokenAddress: toTokenSelected.value.address,
        amount: amountInBaseUnits,
        fromAddress: walletAddress.value!,
        fromTokenDecimals: fromTokenSelected.value.decimals || 18,
        toTokenDecimals: toTokenSelected.value.decimals || 18,
      })

      orderHash.value = result.hash
      quoteModalOpen.value = false
      tradeInitiatedOpen.value = true

      // Add order to store
      const toDecimals = toTokenSelected.value.decimals || 18
      const expectedToAmount = formatFloatingPointValue(
        formatUnits(
          currentQuote.value?.avgAmount ||
            currentQuote.value?.startAmount ||
            0n,
          toDecimals,
        ),
      ).value

      tradeOrdersStore.addOrder({
        hash: result.hash,
        status: 'pending',
        fromAmount: fromAmount.value,
        fromSymbol: fromTokenSelected.value.symbol,
        fromDecimals: fromTokenSelected.value.decimals || 18,
        fromTokenIcon: fromTokenSelected.value.logoURI,
        expectedToAmount,
        toSymbol: toTokenSelected.value.symbol,
        toDecimals: toTokenSelected.value.decimals || 18,
        toTokenIcon: toTokenSelected.value.logoURI,
        createdAt: Math.floor(Date.now() / 1000),
        duration: 180,
        fills: [],
        usdValue: fromTokenSelected.value.price
          ? (
              parseFloat(fromAmount.value) * fromTokenSelected.value.price
            ).toFixed(2)
          : undefined,
        chainId,
        fromAddress: walletAddress.value!,
        seen: false,
      })
      //Show Success Toast
      const amount =
        currentQuote.value?.avgAmount || currentQuote.value?.startAmount || 0n
      const formattedTo = formatFloatingPointValue(
        formatUnits(amount, toTokenSelected.value.decimals || 18),
      ).value
      const formattedFrom = formatFloatingPointValue(fromAmount.value).value
      toastStore.addToastMessage({
        text: 'Trade order submitted:',
        type: ToastType.Success,
        duration: 10000,
        tradeInfo: {
          fromToken: fromTokenSelected.value.symbol,
          fromtTokenIcon: fromTokenSelected.value.logoURI,
          fromTokenIsStock: false,
          fromAmount: formattedFrom,
          toToken: toTokenSelected.value.symbol,
          toTokenIcon: toTokenSelected.value.logoURI,
          toTokenIsStock: false,
          toAmount: formattedTo,
        },
      })
    } catch (e) {
      const errorMessage =
        e instanceof Error && e.message
          ? e.message.toLowerCase()
          : (e as any).details
            ? (e as any).details
            : typeof e === 'string'
              ? e
              : 'Failed to submit trade order'
      if (errorMessage.includes('user rejected')) {
        toastStore.addToastMessage({
          text: 'Trade cancelled by user',
          type: ToastType.Info,
        })
        return
      }
      toastStore.addToastMessage({
        text: 'Failed to submit trade order',
        textSecondary: errorMessage,
        type: ToastType.Error,
      })
    } finally {
      txProceeding.value = false
    }
  }

  return {
    isApproving,
    txProceeding,
    quoteModalOpen,
    tradeInitiatedOpen,
    orderHash,
    handleApprove,
    openTradeModal,
    confirmTrade,
  }
}
