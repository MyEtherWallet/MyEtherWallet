import { ref, type Ref, computed, watch, reactive } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import type { WalletInterface } from '@/providers/common/walletInterface'
import type { TokenBalance, TokenBalanceRaw } from '@/mew_api/types'
import BigNumber from 'bignumber.js'
export const MAIN_TOKEN_CONTRACT = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useCurrencyStore } from './currencyStore'
import { getCurrencySymbol } from '@/utils/currencySymbols'
import { useChainsStore } from './chainsStore'
import { storeToRefs } from 'pinia'
import { formatUnits } from 'viem'
import WatchOnlyWallet from '@/providers/common/watchOnlyWallet'
import { useWatchOnlyStore } from './watchOnlyStore'
import { isAddressChainTypeMismatch } from '@/utils/addressUtils'
import { useToastStore } from './toastStore'
import { ToastType } from '@/types/notification'
import type BaseEvmWallet from '@/providers/ethereum/baseEvmWallet'
import type { WalletType } from '@/providers/types'
import { checkAddressRestriction } from '@/modules/trade/providers/ondoHelpers'
import {
  analytics,
  WalletStatus,
  BalanceBracket,
  type UserProperties,
} from '@/analytics'
import { type WalletConfigType } from '@/modules/access/common/walletConfigs'
import * as Sentry from '@sentry/vue'
import { useGlobalStore } from './globalStore'
import { useStocksStore } from './stocksStore'
import useBalanceHandler from '@/utils/balanceHandler'
import i18n from '@/i18n'

const PARTNER = 'ondo-finance'

export const useWalletStore = defineStore('walletStore', () => {
  const wallet: Ref<WalletInterface | null> = ref(null) // allows for falsey
  const walletAddress: Ref<string | null> = ref(null)
  const tokens: Ref<Array<TokenBalance>> = ref([])
  const balance = ref('0')
  const balanceWei = ref('0')
  const mainTokenBalance = ref<TokenBalance | null>(null)
  const isLoadingBalances = ref(true)
  const walletCardWasAnimated = ref(false) // used to animate the wallet card on first load
  const isWatchOnly = ref(false)
  const detectedAddress = ref<string | null>(null)
  const setDetectedAddress = (addr: string | null): void => {
    detectedAddress.value = addr
  }
  const clearDetectedAddress = (): void => {
    detectedAddress.value = null
  }
  const hasMissingBalances = ref(false)
  const walletName = ref<string>('')
  // Remember the last active address per chain type so a reload restores the
  // address that was active, not just the last one added to the list.
  const lastActiveAddress = useLocalStorage<Record<string, string>>(
    'lastActiveAddress',
    {},
  )
  const userProperties = reactive<UserProperties>({})
  const { isTradingRestrictedInRegion } = storeToRefs(useGlobalStore())
  const stocksStore = useStocksStore()

  /** -------------------------------
  * The Wallet
  -------------------------------*/
  const setWallet = async (
    newWallet: WalletInterface,
    _walletName: string = '',
    _walletType: WalletConfigType,
  ): Promise<void> => {
    const _address = await newWallet.getAddress()
    // A failed restriction check (network hiccup, unsupported address format)
    // must not abort the connection and leave the user with no wallet — treat an
    // error as not-restricted. A genuine restriction still redirects to /blocked.
    let isRestricted = false
    try {
      isRestricted = await checkAddressRestriction(_address)
    } catch {
      isRestricted = false
    }
    const tradingRestricted = isTradingRestrictedInRegion.value
    const canTrade = !tradingRestricted && !isRestricted
    userProperties.canTrade = canTrade
    analytics.setUserProperties({ ...userProperties, canTrade: canTrade })
    if (!isRestricted) {
      if (newWallet instanceof WatchOnlyWallet) {
        isWatchOnly.value = true
        analytics.setWalletStatus(WalletStatus.WATCH_ONLY)
        userProperties.walletStatus = WalletStatus.WATCH_ONLY
        Sentry.setTag('wallet_status', 'watch_only')
      } else {
        isWatchOnly.value = false
        analytics.setWalletStatus(WalletStatus.CONNECTED)
        userProperties.walletStatus = WalletStatus.CONNECTED
        Sentry.setTag('wallet_status', 'connected')
      }
      wallet.value = newWallet
      setAddress()
      if (_walletName !== '') {
        walletName.value = _walletName
        analytics.setWalletName(_walletName)
        userProperties.walletName = _walletName
        Sentry.setTag('wallet_name', _walletName)
      }
      if (_walletType) {
        analytics.setWalletType(_walletType)
        userProperties.walletType = _walletType
      }
    }
  }

  const setWatchOnlyIfExist = () => {
    const { watchOnlyAddresses } = useWatchOnlyStore()
    const type = selectedChain.value?.type || 'EVM'
    const currentRecentAddressList = watchOnlyAddresses[type]
    // Skip stale entries whose address format does not match their chain type
    // (e.g. legacy localStorage with an EVM `0x` address under BITCOIN), which
    // would otherwise rebuild a wallet that hits an invalid balance endpoint
    // (MEW-2043). This is the read-side root-cause guard / self-heal.
    const validEntries = currentRecentAddressList.filter(
      item =>
        !isAddressChainTypeMismatch(item.address, item.type, item.chain.name),
    )
    if (validEntries.length > 0) {
      // Restore the address that was active before reload; fall back to the most
      // recently added one if the remembered address is no longer saved.
      const remembered = lastActiveAddress.value[type]
      const entry =
        validEntries.find(
          e => e.address.toLowerCase() === remembered?.toLowerCase(),
        ) ?? validEntries[validEntries.length - 1]
      const newWallet = new WatchOnlyWallet(
        entry.address,
        entry.chain,
        entry.walletType as WalletType,
        entry.type,
        entry.walletName,
      )
      // Don't null the wallet first: setWallet replaces it once ready. Nulling
      // here briefly flips isWalletConnected to false, which unmounts the header
      // address menu (v-if) and tears the popup down mid-switch.
      setWallet(newWallet, entry.walletName, entry.walletType as WalletConfigType)
    } else {
      wallet.value = null
      walletAddress.value = null
      removeTokens()
      analytics.setWalletStatus(WalletStatus.NOT_CONNECTED)
      userProperties.walletStatus = WalletStatus.NOT_CONNECTED
      Sentry.setTag('wallet_status', 'not_connected')
    }
  }

  const disconnectWallet = () => {
    if (!(wallet.value instanceof WatchOnlyWallet)) {
      isWatchOnly.value = true
      wallet.value?.disconnect()
    }
    setWatchOnlyIfExist()
  }

  const isWalletConnected = computed(() => {
    return wallet.value !== null && walletAddress.value !== null
  })

  const isWalletUnlocked = computed(() => {
    return isWalletConnected.value && !isWatchOnly.value
  })

  /** -------------------------------
  * Address
  -------------------------------*/
  const setAddress = async () => {
    if (wallet.value) {
      const watchOnlyStore = useWatchOnlyStore()
      const { selectedChain } = storeToRefs(useChainsStore())
      const type = selectedChain.value!.type
      walletAddress.value = await wallet.value.getAddress()
      watchOnlyStore.addWallet(
        walletAddress.value,
        selectedChain.value!,
        wallet.value.getWalletType(),
        type,
        walletName.value,
      )
      // Watch-only views (address selection) must never reorder or warn.
      if (isWatchOnly.value) return
      const addr = walletAddress.value.toLowerCase()
      const saved = (watchOnlyStore.watchOnlyAddresses[type] ?? []).some(
        e => e.address.toLowerCase() === addr,
      )
      if (saved) {
        // A real connection floats the address to the top of its manage-accounts
        // group (connection-recency stack) and keeps it there.
        watchOnlyStore.recordConnection(walletAddress.value, type)
      } else {
        // The address couldn't be saved → the 20-address cap was hit (addWallet
        // silently drops it). Surface a persistent info toast, distinct from the
        // connect-success toast, so the user knows it wasn't saved.
        useToastStore().addToastMessage({
          type: ToastType.Info,
          text: i18n.global.t('multi_address.cap_toast_title'),
          textSecondary: i18n.global.t('multi_address.cap_toast_description'),
          isInfinite: true,
        })
      }
    }
  }

  /** -------------------------------
  * TOKENS
  -------------------------------*/
  const setIsLoadingBalances = (isLoading: boolean) => {
    isLoadingBalances.value = isLoading
  }
  const chainStore = useChainsStore()
  const { selectedChain, isEvmChain } = storeToRefs(chainStore)

  // Persist the active address per chain type on every (non-null) change so a
  // reload can restore the same one. Guarded against the transient null set in
  // setWatchOnlyIfExist.
  watch(walletAddress, addr => {
    if (addr) lastActiveAddress.value[selectedChain.value?.type || 'EVM'] = addr
  })

  const hasChainBalance = computed(() => {
    const balanceBN = new BigNumber(balanceWei.value || '0')
    return balanceBN.gt(0)
  })
  // Watch for chain changes and call changeNetwork on the wallet for EVM chains
  watch(selectedChain, async (newChain, oldChain) => {
    if (newChain && newChain.type !== oldChain?.type) {
      setWatchOnlyIfExist()
    }
    if (newChain && isEvmChain.value && wallet.value && !isWatchOnly.value) {
      if ((wallet.value as BaseEvmWallet).changeNetwork) {
        const networkChangeStatus = await (
          wallet.value as BaseEvmWallet
        ).changeNetwork(Number(newChain.chainID))
        if (!networkChangeStatus) {
          const toastStore = useToastStore()
          toastStore.addToastMessage({
            text: i18n.global.t('common.network_change_failed'),
            textSecondary: i18n.global.t(
              'common.network_change_failed_description',
              { network: newChain.nameLong },
            ),
            type: ToastType.Error,
          })
        }
      }
    }
  })

  const safeMainTokenBalance = computed<TokenBalance | null>(() => {
    if (!mainTokenBalance.value && selectedChain.value) {
      // TODO: fetch the main token price from an API
      return {
        contract: MAIN_TOKEN_CONTRACT,
        decimals: 18, // Default for Ether
        logo_url: selectedChain.value.icon,
        name: selectedChain.value.currencyNameLong,
        symbol: selectedChain.value.currencyName,
        price: selectedChain.value.price ?? 0,
        balance: balance.value,
        balanceWei: balanceWei.value,
      }
    }
    if (mainTokenBalance.value) {
      return mainTokenBalance.value
    }
    return null
  })
  const setTokens = async (newTokens: Array<TokenBalanceRaw>) => {
    const newTokenCopy: Array<TokenBalance> = []
    hasMissingBalances.value = false
    removeTokens()
    newTokens.forEach(token => {
      if (token.contract === MAIN_TOKEN_CONTRACT) {
        const _balance = formatUnits(
          BigInt(token.balance),
          token.decimals || 18,
        )
        mainTokenBalance.value = {
          ...token,
          name:
            token.name ?? (selectedChain.value?.currencyNameLong || 'Ether'),
          symbol:
            token.symbol ?? (selectedChain.value?.currencyNameLong || 'ETH'),
          balance: _balance,
          balanceWei: token.balance,
        }
        balance.value = _balance
        balanceWei.value = token.balance
      } else {
        if (token.decimals !== undefined) {
          newTokenCopy.push({
            ...token,
            name: token.name ?? 'Unknown',
            symbol: token.symbol ?? 'UNK',
            balanceWei: token.balance,
            balance: formatUnits(BigInt(token.balance), token.decimals),
          })
        } else {
          hasMissingBalances.value = true
        }
      }
    })
    // Case when coingecko id is missing from Ondo api
    const missingOndoTokens = newTokenCopy.filter(
      token =>
        !token.ondo &&
        stocksStore.isStock(
          token.contract || '',
          selectedChain.value?.name || '',
        ),
    )
    for (const token of missingOndoTokens) {
      const ondoData = await stocksStore.fetchMissingStockData(
        token.symbol,
        token.contract || '',
        selectedChain.value?.name || '',
      )
      if (ondoData) {
        token.ondo = {
          stockAlias: ondoData.stockAlias,
          iconPngUrl: ondoData.iconPngUrl,
          iconSvgUrl: ondoData.iconSvgUrl,
          primaryMarket: {
            symbol: token.symbol,
          },
          underlyingMarket: {
            name: ondoData.underlyingMarket?.name,
          },
        }
        //fill missing data from ondo if not present
        if (
          token.price === undefined &&
          ondoData?.primaryMarket?.price !== undefined
        ) {
          token.price = Number(ondoData.primaryMarket.price)
        }

        if (
          token.market_cap === undefined &&
          ondoData?.underlyingMarket?.marketCap !== undefined
        ) {
          token.market_cap = Number(ondoData.underlyingMarket.marketCap)
        }
        if (
          token.price_change_percentage_24h === undefined &&
          ondoData?.primaryMarket?.priceChangePercentage24h !== undefined
        ) {
          token.price_change_percentage_24h = Number(
            ondoData.primaryMarket.priceChangePercentage24h,
          )
        }

        const tokenHasNoSparkline =
          token.sparkline_in_7d === undefined ||
          token.sparkline_in_7d === null ||
          token.sparkline_in_7d.length === 0
        if (
          tokenHasNoSparkline &&
          ondoData?.primaryMarket?.priceChart24h !== undefined
        ) {
          token.sparkline_in_7d = ondoData.primaryMarket.priceChart24h.map(
            price => Number(price),
          )
        }
      }
    }

    tokens.value = newTokenCopy
    //Analytics: hasBalance
    const raw = [...newTokenCopy]
    if (mainTokenBalance.value) {
      raw.push(mainTokenBalance.value)
    }
    const all = raw.filter(token => token.price && token.market_cap)
    const hasBalances = all.length > 0 || balanceWei.value !== '0'
    analytics.setHasBalance(hasBalances)
    //Analytics: isRWAHolder,
    const rwas = all.filter(token => token.ondo !== undefined)
    const hasRwas = rwas.length > 0
    analytics.setIsRWAHolder(hasRwas)
    //Analytics: isCryptoHolder
    const otherCryptoTokens = all.filter(
      token =>
        token.contract !== MAIN_TOKEN_CONTRACT && token.ondo === undefined, // Exclude RWAs
    )
    const hasOtherCryptoTokens = otherCryptoTokens.length > 0
    analytics.setIsCryptoHolder(hasOtherCryptoTokens)
    //Analytics: isStablecoinHolder
    const stables = all.filter(token => token.is_stablecoin)
    const hasStables = stables.length > 0
    analytics.setIsStablecoinHolder(hasStables)
    //Analytics: isPartnerHolder
    const partnerTokens = all.filter(token => token.coinId === PARTNER)
    const hasPartnerTokens = partnerTokens.length > 0
    analytics.setIsPartnerHolder(hasPartnerTokens)
    //Analytics: Bracket
    const totalBalanceFiat = all.reduce((total, token) => {
      const tokenBalance = new BigNumber(token.balance || 0)
      const tokenFiatValue = new BigNumber(token.price || 0)
      const tokenValue = tokenBalance.multipliedBy(tokenFiatValue)
      return total.plus(tokenValue)
    }, new BigNumber(0))
    let balanceBracket: BalanceBracket
    if (totalBalanceFiat.isLessThan(50)) {
      balanceBracket = BalanceBracket.UNDER_50
    } else if (totalBalanceFiat.isLessThan(100)) {
      balanceBracket = BalanceBracket.BRACKET_50
    } else if (totalBalanceFiat.isLessThan(250)) {
      balanceBracket = BalanceBracket.BRACKET_100
    } else if (totalBalanceFiat.isLessThan(500)) {
      balanceBracket = BalanceBracket.BRACKET_250
    } else if (totalBalanceFiat.isLessThan(2500)) {
      balanceBracket = BalanceBracket.BRACKET_500
    } else if (totalBalanceFiat.isLessThan(10000)) {
      balanceBracket = BalanceBracket.BRACKET_2500
    } else if (totalBalanceFiat.isLessThan(50000)) {
      balanceBracket = BalanceBracket.BRACKET_10K
    } else if (totalBalanceFiat.isLessThan(100000)) {
      balanceBracket = BalanceBracket.BRACKET_50K
    } else if (totalBalanceFiat.isLessThan(500000)) {
      balanceBracket = BalanceBracket.BRACKET_100K
    } else {
      balanceBracket = BalanceBracket.OVER_500K
    }
    analytics.setBalanceBracket(balanceBracket)
    Object.assign(userProperties, {
      hasBalance: hasBalances,
      isRWAHolder: hasRwas,
      isCryptoHolder: hasOtherCryptoTokens,
      isStablecoinHolder: hasStables,
      isPartnerHolder: hasPartnerTokens,
      balanceBracket,
    })
  }

  const allTokens = computed<Array<TokenBalance>>(() => {
    const all = []
    if (mainTokenBalance.value) {
      all.push(mainTokenBalance.value)
    }
    all.push(...tokens.value)
    return all
  })

  const removeTokens = () => {
    tokens.value = []
    mainTokenBalance.value = null
    balance.value = '0'
    balanceWei.value = '0'
  }

  /**
   * @totalTokensBalanceFiatBN the total balance of all tokens in fiat in BigNumber.
   */
  const totalTokensBalanceFiatBN = computed<BigNumber>(() => {
    if (isWalletConnected.value === false || tokens.value.length === 0) {
      return BigNumber(0)
    }
    return tokens.value.reduce((total, token) => {
      const tokenBalance = new BigNumber(token.balance || 0)
      const tokenFiatValue = new BigNumber(token.price || 0)
      const tokenValue = tokenBalance.multipliedBy(tokenFiatValue)
      return total.plus(tokenValue)
    }, new BigNumber(0))
  })

  /**
   * @alanceFiatBN the balance of the main token in fiat in BigNumber.
   */
  const balanceFiatBN = computed<BigNumber>(() => {
    if (isWalletConnected.value === false) {
      return BigNumber(0)
    }
    const balanceBN = new BigNumber(balance.value)
    const price = new BigNumber(mainTokenBalance.value?.price || 0)
    return balanceBN.multipliedBy(price)
  })

  /**
   * @totalFiatBalanceBN - the total balance of the wallet in fiat, including the main token and all other tokens. Value in BigNumber.
   */
  const totalFiatPortfolioValueBN = computed<BigNumber>(() => {
    return totalTokensBalanceFiatBN.value.plus(balanceFiatBN.value)
  })

  const getTokenBalance = (contract: string): TokenBalance | null => {
    if (contract.toLowerCase() === MAIN_TOKEN_CONTRACT.toLowerCase()) {
      return safeMainTokenBalance.value
    }
    if (!tokens.value || tokens.value.length === 0) {
      return null
    }
    const token = tokens.value.find(
      t => t.contract.toLowerCase() === contract.toLowerCase(),
    )

    return token || null
  }

  /** -------------------------------
  * Stock Values
  -------------------------------*/
  const allStocks = computed<Array<TokenBalance>>(() => {
    return tokens.value.filter(token => token.ondo !== undefined)
  })

  /**
   * @totalStockBalanceFiatBN the total balance of all stocks in fiat in BigNumber.
   */
  const totalStockBalanceFiatBN = computed<BigNumber>(() => {
    if (isWalletConnected.value === false || allStocks.value.length === 0) {
      return BigNumber(0)
    }
    return allStocks.value.reduce((total, token) => {
      const tokenBalance = new BigNumber(token.balance || 0)
      const tokenFiatValue = new BigNumber(token.price || 0)
      const tokenValue = tokenBalance.multipliedBy(tokenFiatValue)
      return total.plus(tokenValue)
    }, new BigNumber(0))
  })

  /** -------------------------------
  * Formatted Values
  -------------------------------*/

  //TODO: add proper formatting for fiat values

  /**
   * Converts a USD BigNumber into the app-wide selected display currency.
   * The currency store is accessed lazily here (not at store setup) to avoid a
   * store-instantiation cycle: walletStore → currencyStore → purchaseStore → walletStore.
   */
  const toDisplayCurrency = (usdValue: BigNumber) => {
    const currencyStore = useCurrencyStore()
    return {
      symbol: getCurrencySymbol(currencyStore.selectedCurrency),
      converted: usdValue.multipliedBy(currencyStore.rate),
    }
  }

  /**
   * @formattedTotalFiatPortfolioValue - the total portfolio value in fiat, formatted .
   */
  const formattedTotalFiatPortfolioValue = computed<string>(() => {
    const { symbol, converted } = toDisplayCurrency(totalFiatPortfolioValueBN.value)
    return `${symbol}${converted.toFormat(2, BigNumber.ROUND_DOWN)}`
  })

  /**
   * @formattedStockFiatPortfolioValue - the total stock portfolio value in fiat, formatted .
   */
  const formattedStockFiatPortfolioValue = computed<string>(() => {
    const { symbol, converted } = toDisplayCurrency(totalStockBalanceFiatBN.value)
    return `${symbol}${converted.toFormat(2, BigNumber.ROUND_DOWN)}`
  })

  /**
   * @formattedBalance - the balance of the main token in fiat, formatted.
   */
  const formattedBalance = computed<string>(() => {
    return formatFloatingPointValue(balance.value).value
  })

  const formattedBalanceFiat = computed<string>(() => {
    const { converted } = toDisplayCurrency(balanceFiatBN.value)
    return `${converted.toFormat(2, BigNumber.ROUND_DOWN)}`
  })

  const hasBalances = computed(() => {
    return (
      allTokens.value.length > 0 &&
      allTokens.value.some(token =>
        BigNumber(token.balanceWei || 0).isGreaterThan(0),
      )
    )
  })

  /** -------------------------------
  * Stock Values
  -------------------------------*/

  /**
   * Re-fetch the connected wallet's balances (same logic as the home wallet
   * card's refresh): flips the loading flag and updates tokens via setTokens.
   */
  const refreshBalances = async (): Promise<void> => {
    if (!wallet.value) return
    setIsLoadingBalances(true)
    try {
      const balances = await wallet.value.getBalance()
      await useBalanceHandler(balances, setTokens, setIsLoadingBalances)
    } catch (err) {
      Sentry.captureException(err)
      setIsLoadingBalances(false)
    }
  }

  return {
    wallet,
    refreshBalances,
    walletAddress,
    walletName,
    setWatchOnlyIfExist,
    setWallet,
    disconnectWallet,
    setTokens,
    removeTokens,
    tokens,
    balance,
    balanceWei,
    mainTokenBalance,
    safeMainTokenBalance,
    isLoadingBalances,
    walletCardWasAnimated,
    setIsLoadingBalances,
    setAddress,
    getTokenBalance,
    // BigNumber total values
    isWalletConnected,
    totalTokensBalanceFiatBN,
    totalStockBalanceFiatBN,
    balanceFiatBN,
    totalFiatPortfolioValueBN,
    // Formatted values
    formattedTotalFiatPortfolioValue,
    formattedStockFiatPortfolioValue,
    formattedBalance,
    formattedBalanceFiat,
    isWatchOnly,
    detectedAddress,
    setDetectedAddress,
    clearDetectedAddress,
    allTokens,
    hasMissingBalances,
    hasBalances,
    allStocks,
    hasChainBalance,
    userProperties,
    isWalletUnlocked,
  }
})
