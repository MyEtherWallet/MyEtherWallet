import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import type { MaxOrderSizeResult } from '../sdk/types'
import { perpsClient } from '../configs'
import { usePerpsAuth, usePerpsBalance } from './usePerpsAuth'
import { usePerpsMarkets, usePerpsContracts } from './usePerpsMarkets'
import { usePerpsPositions } from './usePerpsPositions'
import { usePerpsMarkPrices } from './usePerpsMarkPrices'
import { usePerpsToasts } from './usePerpsToasts'
import { formatUsd, hasInvalidPrecision, decimalPlaces } from '../utils/formatters'
import { getCategory, midPrice } from '../utils/market'

type OrderSide = 'buy' | 'sell'
type OrderType = 'market' | 'limit'
export type MarketSortValue = 'name' | 'volume' | 'price' | 'priceChange'
export type SortDirection = 'asc' | 'desc'
export interface MarketSortOption {
  value: MarketSortValue
  label: string
  numeric: boolean
}
interface OrderSideButton {
  label: string
  value: OrderSide
}

// Matches SDK error messages that specifically flag SL/TP as invalid, so
// generic "invalid signature" / "invalid nonce" errors don't mislabel as
// SL/TP validation failures. Revisit if/when the SDK exposes a structured
// error code.
const SL_TP_INVALID_PATTERN =
  /invalid\s+(stop[\s-]?loss|take[\s-]?profit|trigger)/i

export function usePerpsTradeForm() {
  const walletMenuStore = useWalletMenuStore()
  const router = useRouter()
  const { token, login, triggerRefresh } = usePerpsAuth()
  const { balance } = usePerpsBalance()
  const { markets } = usePerpsMarkets()
  const { contracts } = usePerpsContracts()
  const { positions, closePosition } = usePerpsPositions()
  const { markPriceData } = usePerpsMarkPrices()
  const perpsToasts = usePerpsToasts()

  // ── State ──────────────────────────────────────────────────

  const orderSideButtons: OrderSideButton[] = [
    { label: 'Long', value: 'buy' },
    { label: 'Short', value: 'sell' },
  ]

  const orderSide = ref<OrderSide>(
    walletMenuStore.selectedTradeOrderSide ?? 'buy',
  )

  const setOrderSide = (side: OrderSide) => {
    orderSide.value = side
    walletMenuStore.setSelectedTradeOrderSide(side)
  }

  const orderType = ref<OrderType>('market')
  const limitPrice = ref('')
  const activeLimitPill = ref<number | null>(null)
  const inputAmount = ref('')
  const leverage = ref(1)
  const sliderValue = ref(0)

  const isSubmitting = ref(false)
  const maxOrderSize = ref<MaxOrderSizeResult | null>(null)
  const showLeverageModal = ref(false)
  const tempLeverage = ref(1)
  const isSavingLeverage = ref(false)
  const leverageError = ref('')
  const showConfirmModal = ref(false)
  const orderError = ref('')
  const showMarketModal = ref(false)
  const marketSearch = ref('')
  const marketFilter = ref('all')
  const marketSortValue = ref<MarketSortValue>('name')
  const marketSortDirection = ref<SortDirection>('asc')
  // Tracks whether the user has explicitly chosen a sort. While false, the
  // currently-selected market is pinned to the top of filteredMarketList so
  // the user lands on it when reopening the dialog. The first explicit sort
  // pick releases the pin.
  const marketSortIsUserSet = ref(false)
  const manageMode = ref<'add' | 'close'>('add')
  const closeAmount = ref('')
  const closeSliderValue = ref(0)
  const isClosing = ref(false)
  const closeError = ref('')
  const showCloseConfirmModal = ref(false)

  // Auto Close
  const showAutoCloseModal = ref(false)
  const takeProfitPrice = ref<number | null>(null)
  const stopLossPrice = ref<number | null>(null)
  const tempTakeProfitPrice = ref<number | null>(null)
  const tempStopLossPrice = ref<number | null>(null)
  const activeTpPill = ref<number | null>(null)
  const activeSlPill = ref<number | null>(null)

  // ── Market / position lookups ──────────────────────────────
  // When opening perps without a selected market, pick the first available one
  watch(
    contracts,
    val => {
      if (!walletMenuStore.selectedTradeTokenSymbol && val.length > 0) {
        walletMenuStore.setSelectedTradeTokenSymbol(val[0].baseCurrency)
      }
    },
    { immediate: true },
  )

  const activeMarket = computed(
    () => walletMenuStore.selectedTradeTokenSymbol || 'AAPL-USD',
  )
  const displaySymbol = computed(() => activeMarket.value.split('-')[0])
  const fullMarketName = computed(() => {
    const match = markets.value.find(m => m.pair.base === displaySymbol.value)
    return match?.market || activeMarket.value
  })

  const activePosition = computed(
    () => positions.value.find(p => p.market === fullMarketName.value) || null,
  )

  const positionNotionalValue = computed(() => {
    if (!activePosition.value) return 0
    return parseFloat(String(activePosition.value.notionalValue || 0))
  })

  const positionPnl = computed(() => {
    if (!activePosition.value) return 0
    return parseFloat(String(activePosition.value.unrealizedPnl || 0))
  })

  const positionRoe = computed(() => {
    if (!activePosition.value) return 0
    return parseFloat(String(activePosition.value.returnOnEquity || 0))
  })

  const currentPrice = computed(() => {
    const contract = contracts.value.find(
      c => c.market === fullMarketName.value,
    )
    if (contract) return midPrice(contract)
    if (markPriceData.value?.[fullMarketName.value]) {
      return parseFloat(markPriceData.value[fullMarketName.value].price)
    }
    return 0
  })

  const priceChange = computed(() => {
    const contract = contracts.value.find(
      c => c.market === fullMarketName.value,
    )
    if (contract?.priceChangePercent) {
      return parseFloat(contract.priceChangePercent)
    }
    return 0
  })

  const availableMargin = computed(() =>
    parseFloat(balance.value?.availableMargin || '0'),
  )

  // ── Order sizing ───────────────────────────────────────────
  const positionSizeUsd = computed(() => {
    const amt = parseFloat(inputAmount.value) || 0
    return amt * leverage.value
  })

  const estimatedLiquidation = computed(() => {
    if (!positionSizeUsd.value || !currentPrice.value) return 0
    const dir = orderSide.value === 'buy' ? -1 : 1
    return (
      currentPrice.value + dir * (currentPrice.value / leverage.value) * 0.9
    )
  })

  function floorToIncrement(value: number, increment: number): string {
    const floored = Math.floor(value / increment) * increment
    const decimals = Math.max(0, -Math.floor(Math.log10(increment)))
    return floored.toFixed(decimals)
  }

  const activeMarketIncrement = computed(() => {
    const market = markets.value.find(m => m.market === fullMarketName.value)
    return parseFloat(market?.baseIncrement || '0.0001')
  })

  const activeMarketQuoteIncrement = computed(() => {
    const market = markets.value.find(m => m.market === fullMarketName.value)
    return parseFloat(market?.quoteIncrement || '0.01')
  })

  // Decimal-place caps derived from market increments. Used by input-precision
  // validators so values match what the API will accept.
  const quoteDecimals = computed(() => {
    const market = markets.value.find(m => m.market === fullMarketName.value)
    return decimalPlaces(market?.quoteIncrement || '0.01')
  })

  // USDC collateral is stored to 2 decimals across the perps surface (margin
  // and amount-to-close inputs).
  const COLLATERAL_DECIMALS = 2

  // API requires limit/trigger prices to align with quoteIncrement
  // (/v1/markets). Using a hardcoded 2-decimal rounding rejects on markets
  // with finer precision (e.g. quoteIncrement "0.0001").
  const formatQuotePrice = (value: number): string =>
    floorToIncrement(value, activeMarketQuoteIncrement.value)

  const orderSize = computed(() => {
    if (!currentPrice.value) return '0'
    const rawSize = positionSizeUsd.value / currentPrice.value
    return floorToIncrement(rawSize, activeMarketIncrement.value)
  })

  const minOrderAmount = computed(
    () => activeMarketIncrement.value * currentPrice.value,
  )

  // ── Max-order-size helpers ─────────────────────────────────
  const maxBaseSizeForClose = computed(() => {
    if (!maxOrderSize.value || !activePosition.value) return null
    const side =
      activePosition.value.direction === 'long'
        ? 'maxAskBaseSize'
        : 'maxBidBaseSize'
    const leverageScale = leverage.value / 20
    return (
      (parseFloat(maxOrderSize.value.percent100[side]) || 0) * leverageScale
    )
  })

  const maxCloseSizeUsd = computed(() => {
    if (maxBaseSizeForClose.value == null || !currentPrice.value) return null
    return maxBaseSizeForClose.value * currentPrice.value
  })

  const maxBaseSizeForSubmit = computed(() => {
    if (!maxOrderSize.value) return null
    const side = orderSide.value === 'buy' ? 'maxBidBaseSize' : 'maxAskBaseSize'
    const leverageScale = leverage.value / 20
    return (
      (parseFloat(maxOrderSize.value.percent100[side]) || 0) * leverageScale
    )
  })

  function isClosePillDisabled(pct: number) {
    if (pct === 0) return false
    if (maxCloseSizeUsd.value == null || positionNotionalValue.value <= 0)
      return false
    const amt = (positionNotionalValue.value * pct) / 100
    return amt > maxCloseSizeUsd.value
  }

  // ── Close-position helpers ─────────────────────────────────
  const closeDisabled = computed(() => {
    if (closeSliderValue.value <= 0 || isClosing.value) return true
    const amt = parseFloat(closeAmount.value) || 0
    if (amt > 0 && amt < minOrderAmount.value) return true
    if (maxCloseSizeUsd.value !== null && amt > maxCloseSizeUsd.value)
      return true
    if (closeAmountPrecisionError.value) return true
    if (limitPriceHasError.value) return true
    return false
  })

  const closeOrderSize = computed(() => {
    const amt = parseFloat(closeAmount.value) || 0
    if (!currentPrice.value || amt <= 0) return '0'
    const rawSize = amt / currentPrice.value
    return floorToIncrement(rawSize, activeMarketIncrement.value)
  })

  const closeButtonLabel = computed(() => {
    const amt = parseFloat(closeAmount.value) || 0
    if (amt > 0 && amt < minOrderAmount.value) {
      return `Min. amount ${formatUsd(minOrderAmount.value)}`
    }
    if (maxCloseSizeUsd.value !== null && amt > maxCloseSizeUsd.value) {
      return `Exceeds max order size ${formatUsd(maxCloseSizeUsd.value)}`
    }
    if (isClosing.value) return 'Closing...'
    return `Close ${displaySymbol.value} ${activePosition.value?.direction === 'long' ? 'Long' : 'Short'}`
  })

  function setClosePercentage(pct: number) {
    if (!activePosition.value || positionNotionalValue.value <= 0) return
    const amt = (positionNotionalValue.value * pct) / 100
    closeAmount.value = amt.toFixed(2)
    closeSliderValue.value = pct
  }

  function onCloseSliderInput() {
    if (!activePosition.value || positionNotionalValue.value <= 0) return
    const amt = (positionNotionalValue.value * closeSliderValue.value) / 100
    closeAmount.value = amt.toFixed(2)
  }

  async function handleClosePosition() {
    if (!activePosition.value || isClosing.value) return
    isClosing.value = true
    closeError.value = ''
    try {
      const closePct = closeSliderValue.value
      const isLimit = orderType.value === 'limit'
      const closeSide: 'buy' | 'sell' =
        activePosition.value.direction === 'long' ? 'sell' : 'buy'
      let placedSize: string

      if (closePct >= 100 && !isLimit) {
        // Full close via market order
        placedSize = activePosition.value.netQuantity
        await closePosition(activePosition.value)
      } else {
        if (closePct >= 100) {
          // Full close via limit
          placedSize = activePosition.value.netQuantity
        } else {
          const closeUsd = parseFloat(closeAmount.value) || 0
          if (closeUsd <= 0) return
          const rawSize = closeUsd / currentPrice.value
          placedSize = floorToIncrement(rawSize, activeMarketIncrement.value)
        }

        const orderParams: Record<string, unknown> = {
          market: fullMarketName.value,
          side: closeSide,
          type: isLimit ? 'limit' : 'market',
          size: placedSize,
          postOnly: false,
          reduceOnly: false,
        }
        if (isLimit && limitPrice.value) {
          orderParams.price = limitPrice.value
          orderParams.timeInForce = 'GTC'
        }
        await perpsClient.createOrder(orderParams as any)
      }
      const closeMarketMatch = markets.value.find(
        m => m.market === fullMarketName.value,
      )
      const closeDisplayMarket =
        closeMarketMatch?.longName ??
        closeMarketMatch?.displayName ??
        fullMarketName.value
      perpsToasts.toastOrderPlaced({
        side: closeSide,
        size: placedSize,
        category: isLimit ? 'limit' : 'market',
        market: closeDisplayMarket,
        price: isLimit ? (limitPrice.value ?? undefined) : undefined,
      })
      closeAmount.value = ''
      closeSliderValue.value = 0
      triggerRefresh()
    } catch (e: any) {
      closeError.value =
        e?.message || e?.toString() || 'Failed to close position.'
    } finally {
      isClosing.value = false
    }
  }

  async function confirmAndClosePosition() {
    await handleClosePosition()
    if (!closeError.value) {
      showCloseConfirmModal.value = false
    }
  }

  // ── New margin ratio ────────────────────────────────────────
  const newMarginRatio = computed<number | null>(() => {
    const usedMargin = parseFloat(balance.value?.usedMargin || '0')
    const marginBal = parseFloat(balance.value?.marginBalance || '0')
    const additionalMargin = parseFloat(inputAmount.value || '0')
    if (!marginBal || !additionalMargin) return null
    return (usedMargin + additionalMargin) / marginBal
  })

  // ── Precision validation ───────────────────────────────────
  // Each input on the trade form must respect the precision the API enforces.
  // Quote-priced fields (limit price, take-profit, stop-loss) use the market's
  // quoteIncrement; collateral-denominated fields (margin, amount-to-close)
  // use the USDC convention of 2 decimals.
  const limitPricePrecisionError = computed(() => {
    if (orderType.value !== 'limit') return false
    return hasInvalidPrecision(limitPrice.value, quoteDecimals.value)
  })

  const marginPrecisionError = computed(() =>
    hasInvalidPrecision(inputAmount.value, COLLATERAL_DECIMALS),
  )

  const closeAmountPrecisionError = computed(() =>
    hasInvalidPrecision(closeAmount.value, COLLATERAL_DECIMALS),
  )

  const takeProfitPrecisionError = computed(() => {
    if (tempTakeProfitPrice.value == null) return false
    return hasInvalidPrecision(
      String(tempTakeProfitPrice.value),
      quoteDecimals.value,
    )
  })

  const stopLossPrecisionError = computed(() => {
    if (tempStopLossPrice.value == null) return false
    return hasInvalidPrecision(
      String(tempStopLossPrice.value),
      quoteDecimals.value,
    )
  })

  // ── Limit price validation ─────────────────────────────────
  const limitPriceHasError = computed(() => {
    if (orderType.value !== 'limit' || !limitPrice.value) return false
    const price = parseFloat(limitPrice.value)
    if (isNaN(price) || price <= 0 || price >= 10_000_000) return true
    if (limitPricePrecisionError.value) return true
    return false
  })

  // ── Submit validation ──────────────────────────────────────
  const submitDisabled = computed(() => {
    const amt = parseFloat(inputAmount.value)
    if (!amt || amt <= 0 || isSubmitting.value) return true
    if (limitPriceHasError.value) return true
    if (marginPrecisionError.value) return true
    if (takeProfitPrecisionError.value || stopLossPrecisionError.value)
      return true
    if (availableMargin.value * leverage.value < minOrderAmount.value)
      return true
    if (amt > availableMargin.value) return true
    if (positionSizeUsd.value < minOrderAmount.value) return true
    if (
      maxBaseSizeForSubmit.value &&
      parseFloat(orderSize.value) > maxBaseSizeForSubmit.value
    )
      return true
    return false
  })

  const submitButtonLabel = computed(() => {
    const amt = parseFloat(inputAmount.value)
    if (availableMargin.value * leverage.value < minOrderAmount.value) {
      return `Min. margin required ${formatUsd(minOrderAmount.value)}`
    }
    if (positionSizeUsd.value < minOrderAmount.value) {
      return `Min. amount ${formatUsd(minOrderAmount.value)}`
    }
    if (amt > availableMargin.value) {
      return `Not enough margin ${formatUsd(amt)}`
    }
    if (
      maxBaseSizeForSubmit.value &&
      parseFloat(orderSize.value) > maxBaseSizeForSubmit.value
    ) {
      const maxUsd = maxBaseSizeForSubmit.value * currentPrice.value
      return `Exceeds max order size ${formatUsd(maxUsd)}`
    }
    if (activePosition.value) {
      return `Add to ${displaySymbol.value} ${activePosition.value.direction === 'long' ? 'Long' : 'Short'}`
    }
    return `${orderSide.value === 'buy' ? 'Long' : 'Short'} ${displaySymbol.value}`
  })

  // ── Slider / percentage helpers ────────────────────────────
  function getBaseSizeForPercent(pct: number): number | null {
    if (!maxOrderSize.value) return null
    const side = orderSide.value === 'buy' ? 'maxBidBaseSize' : 'maxAskBaseSize'
    const levels: Record<number, keyof MaxOrderSizeResult> = {
      25: 'percent25',
      50: 'percent50',
      75: 'percent75',
      100: 'percent100',
    }
    const leverageScale = leverage.value / 20
    const levelKey = levels[pct]
    if (levelKey) {
      return (
        (parseFloat(maxOrderSize.value[levelKey][side]) || 0) * leverageScale
      )
    }
    const maxBase =
      (parseFloat(maxOrderSize.value.percent100[side]) || 0) * leverageScale
    return maxBase * (pct / 100)
  }

  function setPercentage(pct: number) {
    const baseSize = getBaseSizeForPercent(pct)
    if (baseSize !== null && baseSize > 0 && currentPrice.value > 0) {
      const margin = (baseSize * currentPrice.value) / leverage.value
      inputAmount.value = margin.toFixed(2)
      const maxBase = getBaseSizeForPercent(100) || 1
      sliderValue.value = Math.min((baseSize / maxBase) * 100, 100)
    }
  }

  function onSliderInput() {
    const maxBase = getBaseSizeForPercent(100)
    if (maxBase && maxBase > 0 && currentPrice.value > 0) {
      const baseSize = maxBase * (sliderValue.value / 100)
      const margin = (baseSize * currentPrice.value) / leverage.value
      inputAmount.value = margin.toFixed(2)
    } else if (availableMargin.value > 0) {
      inputAmount.value = (
        (availableMargin.value * sliderValue.value) /
        100
      ).toFixed(2)
    }
  }

  function toggleOrderType() {
    orderType.value = orderType.value === 'market' ? 'limit' : 'market'
  }

  function setOrderType(type: OrderType) {
    orderType.value = type
    if (type === 'limit' && currentPrice.value) {
      limitPrice.value = formatQuotePrice(currentPrice.value)
      activeLimitPill.value = null
    }
  }

  function setLimitPricePct(pct: number) {
    if (!currentPrice.value) return
    activeLimitPill.value = pct
    const price = currentPrice.value * (1 + pct / 100)
    limitPrice.value = formatQuotePrice(price)
  }

  // ── Market selector ────────────────────────────────────────
  const marketFilterTabs = [
    { key: 'all', label: 'All' },
    { key: 'Equities', label: 'Equities' },
    { key: 'Commodities', label: 'Commodities' },
    { key: 'ETFs', label: 'ETFs' },
  ]

  const marketSortOptions: MarketSortOption[] = [
    { value: 'name', label: 'Name', numeric: false },
    { value: 'volume', label: 'Volume', numeric: true },
    { value: 'price', label: 'Price', numeric: true },
    { value: 'priceChange', label: 'Price change', numeric: true },
  ]

  // Re-clicking the active sort flips its direction; a different sort jumps
  // to the option's natural default (numeric → DESC, string → ASC). Mirrors
  // the AppSwapSelectedToken sort popup so behavior is consistent app-wide.
  function setMarketSort(value: MarketSortValue) {
    marketSortIsUserSet.value = true
    if (marketSortValue.value === value) {
      marketSortDirection.value =
        marketSortDirection.value === 'asc' ? 'desc' : 'asc'
      return
    }
    const option = marketSortOptions.find(o => o.value === value)
    marketSortValue.value = value
    marketSortDirection.value = option?.numeric ? 'desc' : 'asc'
  }

  const filteredMarketList = computed(() => {
    let list = [...contracts.value]
    if (marketFilter.value !== 'all') {
      list = list.filter(c => getCategory(c) === marketFilter.value)
    }
    if (marketSearch.value) {
      const q = marketSearch.value.toLowerCase()
      list = list.filter(
        c =>
          c.baseCurrency.toLowerCase().includes(q) ||
          c.market.toLowerCase().includes(q),
      )
    }
    const dir = marketSortDirection.value === 'asc' ? 1 : -1
    const toSafeNumber = (value?: string | number) => {
      const n = typeof value === 'number' ? value : Number(value)
      return Number.isFinite(n) ? n : 0
    }
    list.sort((a, b) => {
      switch (marketSortValue.value) {
        case 'volume':
          return (toSafeNumber(a.usdVolume) - toSafeNumber(b.usdVolume)) * dir
        case 'price':
          return (toSafeNumber(midPrice(a)) - toSafeNumber(midPrice(b))) * dir
        case 'priceChange':
          return (
            (toSafeNumber(a.priceChangePercent) -
              toSafeNumber(b.priceChangePercent)) *
            dir
          )
        case 'name':
        default:
          return a.baseCurrency.localeCompare(b.baseCurrency) * dir
      }
    })
    // Pin the active market on top until the user explicitly picks a sort,
    // so the dialog opens on the row they just left.
    if (!marketSortIsUserSet.value && fullMarketName.value) {
      const idx = list.findIndex(c => c.market === fullMarketName.value)
      if (idx > 0) {
        const [selected] = list.splice(idx, 1)
        list.unshift(selected)
      }
    }
    return list
  })

  function getMarketDisplayName(contract: any): string {
    const match = markets.value.find(m => m.market === contract.market)
    return match?.longName ?? match?.displayName ?? contract.baseCurrency
  }

  function openTokenSelect() {
    marketSearch.value = ''
    marketFilter.value = 'all'
    marketSortValue.value = 'volume'
    marketSortDirection.value = 'desc'
    marketSortIsUserSet.value = false
    showMarketModal.value = true
  }

  function selectMarket(contract: any) {
    walletMenuStore.setSelectedTradeTokenSymbol(contract.baseCurrency)
    showMarketModal.value = false
    router.push({ path: `/perps/perp/${contract.market}` })
  }

  // ── Leverage modal ─────────────────────────────────────────
  function openLeverageModal() {
    tempLeverage.value = leverage.value
    leverageError.value = ''
    showLeverageModal.value = true
  }

  async function saveLeverage() {
    isSavingLeverage.value = true
    leverageError.value = ''
    try {
      if (token.value && markets.value.length) {
        await perpsClient.setLeverage(fullMarketName.value, tempLeverage.value)
      }
      leverage.value = tempLeverage.value
      showLeverageModal.value = false
      fetchMaxOrderSize()
    } catch (e: any) {
      leverageError.value =
        e?.message ||
        e?.toString() ||
        'Failed to save leverage. Please try again.'
    } finally {
      isSavingLeverage.value = false
    }
  }

  // ── API fetchers ───────────────────────────────────────────
  async function fetchLeverage() {
    if (!token.value || !markets.value.length) return
    try {
      const res = await perpsClient.getLeverage(fullMarketName.value)
      if (res.success && res.result?.length) {
        leverage.value = parseInt(res.result[0].leverage) || 1
      }
    } catch (e) {
      console.error('Failed to fetch leverage:', e)
    }
  }

  async function fetchMaxOrderSize() {
    if (!token.value || !markets.value.length) return
    try {
      const res = await perpsClient.getMaxOrderSize(fullMarketName.value)
      if (res.success) {
        maxOrderSize.value = res.result
        setPercentage(10)
      }
    } catch (e) {
      console.error('Failed to fetch max order size:', e)
    }
  }

  // ── Auto Close ─────────────────────────────────────────────

  const takeProfitPct = computed(() => {
    if (takeProfitPrice.value == null || !currentPrice.value) return null
    return (
      ((takeProfitPrice.value - currentPrice.value) / currentPrice.value) * 100
    )
  })

  const stopLossPct = computed(() => {
    if (stopLossPrice.value == null || !currentPrice.value) return null
    return (
      ((stopLossPrice.value - currentPrice.value) / currentPrice.value) * 100
    )
  })

  const projectedProfit = computed(() => {
    if (takeProfitPrice.value == null || !currentPrice.value) return null
    const posSize = activePosition.value
      ? positionNotionalValue.value
      : positionSizeUsd.value
    if (!posSize) return null
    const pctMove =
      (takeProfitPrice.value - currentPrice.value) / currentPrice.value
    return posSize * pctMove
  })

  const projectedLoss = computed(() => {
    if (stopLossPrice.value == null || !currentPrice.value) return null
    const posSize = activePosition.value
      ? positionNotionalValue.value
      : positionSizeUsd.value
    if (!posSize) return null
    const pctMove =
      (stopLossPrice.value - currentPrice.value) / currentPrice.value
    return posSize * pctMove
  })

  const tempProjectedProfit = computed(() => {
    if (tempTakeProfitPrice.value == null || !currentPrice.value) return null
    const posSize = activePosition.value
      ? positionNotionalValue.value
      : positionSizeUsd.value
    if (!posSize) return null
    const pctMove =
      (tempTakeProfitPrice.value - currentPrice.value) / currentPrice.value
    return posSize * pctMove
  })

  const tempProjectedLoss = computed(() => {
    if (tempStopLossPrice.value == null || !currentPrice.value) return null
    const posSize = activePosition.value
      ? positionNotionalValue.value
      : positionSizeUsd.value
    if (!posSize) return null
    const pctMove =
      (tempStopLossPrice.value - currentPrice.value) / currentPrice.value
    return posSize * pctMove
  })

  function openAutoCloseModal() {
    tempTakeProfitPrice.value = takeProfitPrice.value
    tempStopLossPrice.value = stopLossPrice.value
    activeTpPill.value = null
    activeSlPill.value = null

    // Default to +30% TP and -3% SL if nothing is set yet

    showAutoCloseModal.value = true
  }

  function setTakeProfitPct(pct: number) {
    if (!currentPrice.value) return
    const isLong =
      activePosition.value?.direction === 'long' || orderSide.value === 'buy'
    tempTakeProfitPrice.value = isLong
      ? Number((currentPrice.value * (1 + pct / 100)).toFixed(2))
      : Number((currentPrice.value * (1 - pct / 100)).toFixed(2))

    activeTpPill.value = pct
  }

  function setStopLossPct(pct: number) {
    if (!currentPrice.value) return
    const isLong =
      activePosition.value?.direction === 'long' || orderSide.value === 'buy'
    tempStopLossPrice.value = isLong
      ? Number((currentPrice.value * (1 - pct / 100)).toFixed(2))
      : Number((currentPrice.value * (1 + pct / 100)).toFixed(2))
    activeSlPill.value = pct
  }

  function clearTempTakeProfit() {
    tempTakeProfitPrice.value = null
    activeTpPill.value = null
  }

  function clearTempStopLoss() {
    tempStopLossPrice.value = null
    activeSlPill.value = null
  }

  // Reset pill highlight when user manually edits the price input.
  // flush:'sync' ensures the reset fires before setTakeProfitPct/setStopLossPct
  // re-applies the pill value on the very next line after setting the price.
  watch(
    tempTakeProfitPrice,
    () => {
      activeTpPill.value = null
    },
    { flush: 'sync' },
  )
  watch(
    tempStopLossPrice,
    () => {
      activeSlPill.value = null
    },
    { flush: 'sync' },
  )

  function confirmAutoClose() {
    takeProfitPrice.value = tempTakeProfitPrice.value
    stopLossPrice.value = tempStopLossPrice.value
    showAutoCloseModal.value = false
  }

  function clearTakeProfit() {
    takeProfitPrice.value = null
  }

  function clearStopLoss() {
    stopLossPrice.value = null
  }

  // ── Confirm / submit ──────────────────────────────────────
  function showConfirmation() {
    if (submitDisabled.value) return
    orderError.value = ''
    showConfirmModal.value = true
  }

  function showCloseConfirmation() {
    if (closeDisabled.value) return
    closeError.value = ''
    showCloseConfirmModal.value = true
  }

  async function confirmAndSubmitOrder() {
    if (submitDisabled.value) return
    isSubmitting.value = true
    // Snapshot prior SL/TP state BEFORE the SDK call so "prior" reflects what
    // the user was about to change. Reading it afterward would see the new
    // values once positions re-poll.
    const priorPosition = activePosition.value
    const hadPriorStopLoss = !!priorPosition?.stopLossTriggerPrice
    const hadPriorTakeProfit = !!priorPosition?.takeProfitTriggerPrice
    // Capture numeric SL/TP values once up front: used for the API payload,
    // the formatted toast price, and as the null-guard for both branches.
    const slPrice = stopLossPrice.value
    const tpPrice = takeProfitPrice.value
    // Direction describes the POSITION side (LONG/SHORT), not the order side —
    // "LONG 0.5 PERPS: …" matches the position, including when placing a
    // reduce-only counter-order to modify an existing long.
    const positionDirection =
      priorPosition?.direction ?? (orderSide.value === 'buy' ? 'long' : 'short')
    const slTpBase = displaySymbol.value
    const slTpQuote = fullMarketName.value.includes('-')
      ? (fullMarketName.value.split('-')[1] ?? '')
      : ''
    const slTpNetQuantity = priorPosition?.netQuantity ?? orderSize.value
    const buildSlTpArgs = (triggerPrice: number) => ({
      direction: positionDirection,
      netQuantity: slTpNetQuantity,
      base: slTpBase,
      quote: slTpQuote,
      triggerPrice: formatQuotePrice(triggerPrice),
    })
    try {
      const orderParams: Record<string, unknown> = {
        market: fullMarketName.value,
        side: orderSide.value,
        type: orderType.value,
        size: orderSize.value,
        postOnly: false,
        reduceOnly: false,
      }
      if (orderType.value === 'limit') {
        orderParams.timeInForce = 'GTC'
        if (limitPrice.value) {
          orderParams.price = limitPrice.value
        }
      }
      if (tpPrice !== null) {
        orderParams.takeProfit = {
          triggerPrice: formatQuotePrice(tpPrice),
        }
      }
      if (slPrice !== null) {
        orderParams.stopLoss = {
          triggerPrice: formatQuotePrice(slPrice),
        }
      }
      await perpsClient.createOrder(orderParams as any)
      // Fire Order Placed + SL/TP toasts only after the SDK call succeeded.
      const marketMatch = markets.value.find(
        m => m.market === fullMarketName.value,
      )
      const displayMarket =
        marketMatch?.longName ??
        marketMatch?.displayName ??
        fullMarketName.value
      perpsToasts.toastOrderPlaced({
        side: orderSide.value,
        size: orderSize.value,
        category: orderType.value,
        market: displayMarket,
        price: orderType.value === 'limit' ? (limitPrice.value ?? undefined) : undefined,
      })
      if (slPrice !== null) {
        const args = buildSlTpArgs(slPrice)
        if (hadPriorStopLoss) perpsToasts.toastStopLossModified(args)
        else perpsToasts.toastStopLossAdded(args)
      }
      if (tpPrice !== null) {
        const args = buildSlTpArgs(tpPrice)
        if (hadPriorTakeProfit) perpsToasts.toastTakeProfitModified(args)
        else perpsToasts.toastTakeProfitAdded(args)
      }
      showConfirmModal.value = false
      inputAmount.value = ''
      sliderValue.value = 0
      triggerRefresh()
    } catch (error: any) {
      // If SL/TP were part of the request and the API rejected them as
      // invalid, surface dedicated Invalid toasts. These branches are
      // mutually exclusive with the success toasts above (which only run
      // after createOrder resolves). The regex targets SL/TP-scoped messages
      // so generic "invalid signature" / "invalid nonce" errors don't
      // mislabel as SL/TP validation failures.
      const msg = error?.message || error?.toString() || ''
      const match = msg.match(SL_TP_INVALID_PATTERN)
      if (match) {
        // The capture group is one of stop-loss / take-profit / trigger.
        // "trigger" doesn't disambiguate, so fall back to firing both toasts
        // (when both legs are present) to stay safe.
        const kind = match[1].toLowerCase()
        const mentionsSl = /stop/.test(kind)
        const mentionsTp = /take/.test(kind)
        const ambiguous = !mentionsSl && !mentionsTp
        if (slPrice !== null && (mentionsSl || ambiguous)) {
          perpsToasts.toastStopLossInvalid()
        }
        if (tpPrice !== null && (mentionsTp || ambiguous)) {
          perpsToasts.toastTakeProfitInvalid()
        }
      }
      orderError.value =
        error?.message || error?.toString() || 'Order failed. Please try again.'
    } finally {
      isSubmitting.value = false
    }
  }

  // NOTE(perps-toasts): Dedicated remove-stop-loss / remove-take-profit flows
  // are not yet wired in this composable. The SDK client today exposes
  // createOrder / cancelOrder / setLeverage only — SL/TP are created inline
  // via createOrder. When a remove-SL/TP endpoint is added, wire
  // toastStopLossRemoved / toastTakeProfitRemoved / toastFailedToRemoveSlTp
  // into those paths.

  // ── Lifecycle & watchers ───────────────────────────────────
  onMounted(() => {
    fetchLeverage()
    fetchMaxOrderSize()
  })

  watch(
    activePosition,
    pos => {
      if (pos) {
        orderSide.value = pos.direction === 'long' ? 'buy' : 'sell'
      }
    },
    { immediate: true },
  )

  watch(
    () => walletMenuStore.selectedTradeOrderSide,
    side => {
      if (side) {
        orderSide.value = side
        walletMenuStore.setSelectedTradeOrderSide(null)
      }
    },
  )

  watch(
    () => activeMarket.value,
    () => {
      inputAmount.value = ''
      sliderValue.value = 0
      maxOrderSize.value = null
      manageMode.value = 'add'
      closeAmount.value = ''
      closeSliderValue.value = 0
      closeError.value = ''
      takeProfitPrice.value = null
      stopLossPrice.value = null
      fetchLeverage()
      fetchMaxOrderSize()
    },
  )

  watch(
    () => token.value,
    () => {
      if (token.value) {
        fetchLeverage()
        fetchMaxOrderSize()
      }
    },
  )

  watch(
    () => markets.value,
    () => {
      if (markets.value.length && token.value) {
        fetchLeverage()
        fetchMaxOrderSize()
      }
    },
  )

  return {
    // Auth
    token,
    login,
    // Market info
    displaySymbol,
    currentPrice,
    priceChange,
    contracts,
    // Order form
    orderSide,
    orderSideButtons,
    orderType,
    inputAmount,
    leverage,
    sliderValue,
    positionSizeUsd,
    estimatedLiquidation,
    orderSize,
    availableMargin,
    setOrderSide,
    // Position
    activePosition,
    positionNotionalValue,
    positionPnl,
    positionRoe,
    manageMode,
    // Close
    closeAmount,
    closeSliderValue,
    closeDisabled,
    closeOrderSize,
    closeButtonLabel,
    closeError,
    isClosing,
    showCloseConfirmModal,
    isClosePillDisabled,
    setClosePercentage,
    onCloseSliderInput,
    confirmAndClosePosition,
    showCloseConfirmation,
    // Auto Close
    showAutoCloseModal,

    takeProfitPrice,
    stopLossPrice,
    takeProfitPct,
    stopLossPct,
    projectedProfit,
    projectedLoss,
    tempProjectedProfit,
    tempProjectedLoss,
    tempTakeProfitPrice,
    tempStopLossPrice,
    activeTpPill,
    activeSlPill,
    openAutoCloseModal,
    setTakeProfitPct,
    setStopLossPct,
    clearTempTakeProfit,
    clearTempStopLoss,
    confirmAutoClose,
    clearTakeProfit,
    clearStopLoss,
    // Submit
    isSubmitting,
    submitDisabled,
    submitButtonLabel,
    limitPriceHasError,
    limitPricePrecisionError,
    marginPrecisionError,
    closeAmountPrecisionError,
    takeProfitPrecisionError,
    stopLossPrecisionError,
    quoteDecimals,
    newMarginRatio,
    orderError,
    showConfirmModal,
    showConfirmation,
    confirmAndSubmitOrder,
    // Slider
    setPercentage,
    onSliderInput,
    toggleOrderType,
    setOrderType,
    limitPrice,
    activeLimitPill,
    setLimitPricePct,
    // Market selector
    showMarketModal,
    marketSearch,
    marketFilter,
    marketSortValue,
    marketSortDirection,
    marketSortOptions,
    setMarketSort,
    marketFilterTabs,
    filteredMarketList,
    fullMarketName,
    getMarketDisplayName,
    openTokenSelect,
    selectMarket,
    // Leverage
    showLeverageModal,
    tempLeverage,
    isSavingLeverage,
    leverageError,
    openLeverageModal,
    saveLeverage,
  }
}
