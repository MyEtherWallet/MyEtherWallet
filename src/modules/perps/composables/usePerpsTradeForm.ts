import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import type { MaxOrderSizeResult } from '../sdk/types'
import { perpsClient } from '../configs'
import { usePerpsAuth, usePerpsBalance } from './usePerpsAuth'
import { usePerpsMarkets, usePerpsContracts } from './usePerpsMarkets'
import { usePerpsPositions } from './usePerpsPositions'
import { usePerpsMarkPrices } from './usePerpsMarkPrices'
import { formatUsd } from '../utils/formatters'
import { getCategory, midPrice } from '../utils/market'

type OrderSide = 'buy' | 'sell'
type OrderType = 'market' | 'limit'
interface OrderSideButton {
  label: string
  value: OrderSide
}

export function usePerpsTradeForm() {
  const walletMenuStore = useWalletMenuStore()
  const router = useRouter()
  const { token, login, triggerRefresh } = usePerpsAuth()
  const { balance } = usePerpsBalance()
  const { markets } = usePerpsMarkets()
  const { contracts } = usePerpsContracts()
  const { positions, closePosition } = usePerpsPositions()
  const { markPriceData } = usePerpsMarkPrices()

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
  const showOrderTypeDropdown = ref(false)
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
  const marketSortAsc = ref(true)
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

      if (closePct >= 100 && !isLimit) {
        // Full close via market order
        await closePosition(activePosition.value)
      } else {
        let size: string
        if (closePct >= 100) {
          // Full close via limit
          size = activePosition.value.netQuantity
        } else {
          const closeUsd = parseFloat(closeAmount.value) || 0
          if (closeUsd <= 0) return
          const rawSize = closeUsd / currentPrice.value
          size = floorToIncrement(rawSize, activeMarketIncrement.value)
        }

        const orderParams: Record<string, unknown> = {
          market: fullMarketName.value,
          side: activePosition.value.direction === 'long' ? 'sell' : 'buy',
          type: isLimit ? 'limit' : 'market',
          size,
          postOnly: false,
          reduceOnly: false,
        }
        if (isLimit && limitPrice.value) {
          orderParams.price = limitPrice.value
          orderParams.timeInForce = 'GTC'
        }
        await perpsClient.createOrder(orderParams as any)
      }
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

  // ── Submit validation ──────────────────────────────────────
  const submitDisabled = computed(() => {
    const amt = parseFloat(inputAmount.value)
    if (!amt || amt <= 0 || isSubmitting.value) return true
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
    showOrderTypeDropdown.value = false
    if (type === 'limit' && currentPrice.value) {
      limitPrice.value = currentPrice.value.toFixed(2)
      activeLimitPill.value = null
    }
  }

  function setLimitPricePct(pct: number) {
    if (!currentPrice.value) return
    activeLimitPill.value = pct
    const price = currentPrice.value * (1 + pct / 100)
    limitPrice.value = price.toFixed(2)
  }

  // ── Market selector ────────────────────────────────────────
  const marketFilterTabs = [
    { key: 'all', label: 'All' },
    { key: 'Equities', label: 'Equities' },
    { key: 'Commodities', label: 'Commodities' },
    { key: 'ETFs', label: 'ETFs' },
  ]

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
    list.sort((a, b) => {
      const cmp = a.baseCurrency.localeCompare(b.baseCurrency)
      return marketSortAsc.value ? cmp : -cmp
    })
    return list
  })

  function getMarketDisplayName(contract: any): string {
    const match = markets.value.find(m => m.market === contract.market)
    return match?.displayName ?? contract.baseCurrency
  }

  function openTokenSelect() {
    marketSearch.value = ''
    marketFilter.value = 'all'
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
  const hasAutoClose = computed(
    () => takeProfitPrice.value !== null || stopLossPrice.value !== null,
  )

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
    if (tempTakeProfitPrice.value == null && currentPrice.value) {
      setTakeProfitPct(30)
    }
    if (tempStopLossPrice.value == null && currentPrice.value) {
      setStopLossPct(3)
    }

    showAutoCloseModal.value = true
  }

  function setTakeProfitPct(pct: number) {
    if (!currentPrice.value) return
    const isLong =
      activePosition.value?.direction === 'long' || orderSide.value === 'buy'
    tempTakeProfitPrice.value = isLong
      ? currentPrice.value * (1 + pct / 100)
      : currentPrice.value * (1 - pct / 100)
    activeTpPill.value = pct
  }

  function setStopLossPct(pct: number) {
    if (!currentPrice.value) return
    const isLong =
      activePosition.value?.direction === 'long' || orderSide.value === 'buy'
    tempStopLossPrice.value = isLong
      ? currentPrice.value * (1 - pct / 100)
      : currentPrice.value * (1 + pct / 100)
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
      if (takeProfitPrice.value !== null) {
        orderParams.takeProfit = {
          triggerPrice: takeProfitPrice.value.toFixed(2),
        }
      }
      if (stopLossPrice.value !== null) {
        orderParams.stopLoss = {
          triggerPrice: stopLossPrice.value.toFixed(2),
        }
      }
      await perpsClient.createOrder(orderParams as any)
      showConfirmModal.value = false
      inputAmount.value = ''
      sliderValue.value = 0
      triggerRefresh()
    } catch (error: any) {
      orderError.value =
        error?.message || error?.toString() || 'Order failed. Please try again.'
    } finally {
      isSubmitting.value = false
    }
  }

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
    hasAutoClose,
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
    orderError,
    showConfirmModal,
    showConfirmation,
    confirmAndSubmitOrder,
    // Slider
    setPercentage,
    onSliderInput,
    toggleOrderType,
    setOrderType,
    showOrderTypeDropdown,
    limitPrice,
    activeLimitPill,
    setLimitPricePct,
    // Market selector
    showMarketModal,
    marketSearch,
    marketFilter,
    marketSortAsc,
    marketFilterTabs,
    filteredMarketList,
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
