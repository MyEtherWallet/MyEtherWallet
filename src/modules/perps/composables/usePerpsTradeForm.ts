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

export function usePerpsTradeForm() {
  const walletMenuStore = useWalletMenuStore()
  const router = useRouter()
  const { token, login } = usePerpsAuth()
  const { balance } = usePerpsBalance()
  const { markets } = usePerpsMarkets()
  const { contracts } = usePerpsContracts()
  const { positions, closePosition } = usePerpsPositions()
  const { markPriceData } = usePerpsMarkPrices()

  // ── State ──────────────────────────────────────────────────
  const orderSide = ref<OrderSide>(
    walletMenuStore.selectedTradeOrderSide ?? 'buy',
  )
  const orderType = ref<OrderType>('market')
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

  // ── Close-position helpers ─────────────────────────────────
  const closeDisabled = computed(() => {
    if (closeSliderValue.value <= 0 || isClosing.value) return true
    const amt = parseFloat(closeAmount.value) || 0
    return amt > 0 && amt < minOrderAmount.value
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
      if (closePct >= 100) {
        await closePosition(activePosition.value)
      } else {
        const closeUsd = parseFloat(closeAmount.value) || 0
        if (closeUsd <= 0) return
        const rawSize = closeUsd / currentPrice.value
        const roundedSize = floorToIncrement(
          rawSize,
          activeMarketIncrement.value,
        )
        await perpsClient.createOrder({
          market: fullMarketName.value,
          side: activePosition.value.direction === 'long' ? 'sell' : 'buy',
          type: 'market',
          size: roundedSize,
          postOnly: false,
          reduceOnly: true,
        } as any)
      }
      closeAmount.value = ''
      closeSliderValue.value = 0
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
    return positionSizeUsd.value < minOrderAmount.value
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
      }
      await perpsClient.createOrder(orderParams as any)
      showConfirmModal.value = false
      inputAmount.value = ''
      sliderValue.value = 0
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
    orderType,
    inputAmount,
    leverage,
    sliderValue,
    positionSizeUsd,
    estimatedLiquidation,
    orderSize,
    availableMargin,
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
    setClosePercentage,
    onCloseSliderInput,
    confirmAndClosePosition,
    showCloseConfirmation,
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
