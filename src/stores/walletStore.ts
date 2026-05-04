import { ref, type Ref, computed, watch, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { WalletInterface } from '@/providers/common/walletInterface'
import type { TokenBalance, TokenBalanceRaw } from '@/mew_api/types'
import BigNumber from 'bignumber.js'
export const MAIN_TOKEN_CONTRACT = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useChainsStore } from './chainsStore'
import { storeToRefs } from 'pinia'
import { formatUnits } from 'viem'
import WatchOnlyWallet from '@/providers/common/watchOnlyWallet'
import { useWatchOnlyStore } from './watchOnlyStore'
import { useToastStore } from './toastStore'
import { ToastType } from '@/types/notification'
import type BaseEvmWallet from '@/providers/ethereum/baseEvmWallet'
import type { WalletType } from '@/providers/types'
import { checkAddressRestriction, isTradingRestricted } from '@/modules/trade/providers/ondoHelpers'
import {
  analytics,
  WalletStatus,
  BalanceBracket,
  type UserProperties,
} from '@/analytics'
import { type WalletConfigType } from '@/modules/access/common/walletConfigs'
import * as Sentry from '@sentry/vue'

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
  const hasMissingBalances = ref(false)
  const walletName = ref<string>('')
  const userProperties = reactive<UserProperties>({})

  /** -------------------------------
  * The Wallet
  -------------------------------*/
  const setWallet = async (
    newWallet: WalletInterface,
    _walletName: string = '',
    _walletType: WalletConfigType,
  ): Promise<void> => {
    const _address = await newWallet.getAddress()
    const isRestricted = await checkAddressRestriction(_address)
    const tradingRestricted = await isTradingRestricted()
    userProperties.canTrade = tradingRestricted && !isRestricted
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
    const currentRecentAddressList =
      watchOnlyAddresses[selectedChain.value?.type || 'EVM']
    if (currentRecentAddressList.length > 0) {
      const newWallet = new WatchOnlyWallet(
        currentRecentAddressList[currentRecentAddressList.length - 1].address,
        currentRecentAddressList[currentRecentAddressList.length - 1].chain,
        currentRecentAddressList[currentRecentAddressList.length - 1]
          .walletType as WalletType,
        currentRecentAddressList[currentRecentAddressList.length - 1].type,
        currentRecentAddressList[currentRecentAddressList.length - 1]
          .walletName,
      )
      wallet.value = null
      walletAddress.value = null
      setWallet(
        newWallet,
        currentRecentAddressList[currentRecentAddressList.length - 1]
          .walletName,
        currentRecentAddressList[currentRecentAddressList.length - 1]
          .walletType as WalletConfigType,
      )
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

  /** -------------------------------
  * Address
  -------------------------------*/
  const setAddress = async () => {
    if (wallet.value) {
      const { addWallet: _addWallet } = useWatchOnlyStore()
      const { selectedChain } = storeToRefs(useChainsStore())
      walletAddress.value = await wallet.value.getAddress()
      _addWallet(
        walletAddress.value,
        selectedChain.value!,
        wallet.value.getWalletType(),
        selectedChain.value!.type,
        walletName.value,
      )
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
            text: 'Network change failed',
            textSecondary: `Check if your wallet supports the ${newChain.nameLong} network`,
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
  const setTokens = (newTokens: Array<TokenBalanceRaw>) => {
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
    if (totalBalanceFiat.isLessThan(500)) {
      balanceBracket = BalanceBracket.UNDER_500
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
   * @formattedTotalFiatPortfolioValue - the total portfolio value in fiat, formatted .
   */
  const formattedTotalFiatPortfolioValue = computed<string>(() => {
    return `$${totalFiatPortfolioValueBN.value.toFormat(2, BigNumber.ROUND_DOWN)}`
  })

  /**
   * @formattedStockFiatPortfolioValue - the total stock portfolio value in fiat, formatted .
   */
  const formattedStockFiatPortfolioValue = computed<string>(() => {
    return `$${totalStockBalanceFiatBN.value.toFormat(2, BigNumber.ROUND_DOWN)}`
  })

  /**
   * @formattedBalance - the balance of the main token in fiat, formatted.
   */
  const formattedBalance = computed<string>(() => {
    return formatFloatingPointValue(balance.value).value
  })

  const formattedBalanceFiat = computed<string>(() => {
    return `${balanceFiatBN.value.toFormat(2, BigNumber.ROUND_DOWN)}`
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
  return {
    wallet,
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
    allTokens,
    hasMissingBalances,
    hasBalances,
    allStocks,
    hasChainBalance,
    userProperties,
  }
})
