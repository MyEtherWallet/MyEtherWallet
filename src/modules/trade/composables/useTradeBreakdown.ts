import { computed, type Ref } from 'vue'
import BigNumber from 'bignumber.js'
import { formatUnits } from 'viem'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import type { NewTokenInfo } from '@/stores/swapStore'
import type { QuoteOutputType } from '@/modules/trade/providers/oneinch_fusion/oneInchTypes'

const EMPTY_VALUE = '—'

interface UseTradeBreakdownOptions {
  quote: Ref<QuoteOutputType | null>
  fromToken: Ref<NewTokenInfo | null>
  toToken: Ref<NewTokenInfo | null>
  fromAmount: Ref<string>
}

export const useTradeBreakdown = ({
  quote,
  fromToken,
  toToken,
  fromAmount,
}: UseTradeBreakdownOptions) => {
  const { formatFiat, currencySymbol } = useCurrency()

  const toDecimals = computed(() => toToken.value?.decimals || 18)

  const executionAmount = computed(() => {
    if (!quote.value) return null
    return quote.value.avgAmount || quote.value.startAmount
  })

  const minReceive = computed(() => {
    if (!quote.value?.endAmount) return EMPTY_VALUE
    const human = formatUnits(quote.value.endAmount, toDecimals.value)
    return formatFloatingPointValue(human).value
  })

  const rate = computed(() => {
    if (!executionAmount.value || !fromAmount.value) return EMPTY_VALUE
    const toAmount = new BigNumber(
      formatUnits(executionAmount.value, toDecimals.value),
    )
    if (toAmount.isZero()) return EMPTY_VALUE
    const value = new BigNumber(fromAmount.value).dividedBy(toAmount)
    return `1 ${toToken.value?.symbol} ≈ ${formatFloatingPointValue(value.toString()).value} ${fromToken.value?.symbol}`
  })

  const txFee = computed(() => {
    const tokenFee = quote.value?.tokenFee
    const usdPrices = quote.value?.usdPrices
    if (tokenFee === undefined || !usdPrices?.toToken) return EMPTY_VALUE
    const feeHuman = formatUnits(tokenFee, toDecimals.value)
    const fiat = new BigNumber(feeHuman).multipliedBy(usdPrices.toToken)
    return `${currencySymbol.value}${formatFiat(fiat.toString()).value}`
  })

  // 1inch reports impact as a positive percentage for a worse rate; the UI
  // shows it signed, so a 0.43 loss renders as "-0.43%".
  const priceImpact = computed(() => {
    const impact = quote.value?.priceImpact
    if (impact === undefined || impact === null) return EMPTY_VALUE
    const pct = new BigNumber(impact)
    if (!pct.isFinite()) return EMPTY_VALUE
    return `${pct.negated().decimalPlaces(2).toString()}%`
  })

  const maxSlippage = computed(() => {
    const slippage = quote.value?.slippage
    if (slippage === undefined || slippage === null) return EMPTY_VALUE
    return `${new BigNumber(slippage).decimalPlaces(2).toString()}%`
  })

  return { minReceive, rate, txFee, priceImpact, maxSlippage }
}
