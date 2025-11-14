import { ref, type Ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { WalletInterface } from '@/providers/common/walletInterface'
import type { TokenBalance, TokenBalanceRaw } from '@/mew_api/types'
import BigNumber from 'bignumber.js'
export const MAIN_TOKEN_CONTRACT = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useChainsStore } from './chainsStore'
import { storeToRefs } from 'pinia'
import { fromBase } from '@/utils/unit'
import WatchOnlyWallet from '@/providers/common/watchOnlyWallet'
import { useRecentAddressStore } from './recentAddressStore'

export const useWalletStore = defineStore('walletStore', () => {
  const wallet: Ref<WalletInterface | null> = ref(null) // allows for falsey
  const walletAddress: Ref<string | null> = ref(null)
  const tokens: Ref<Array<TokenBalance>> = ref([])
  const balance = ref('0')
  const balanceWei = ref('0')
  const mainTokenBalance = ref<TokenBalance | null>(null)
  const isLoadingBalances = ref(true)
  const walletCardWasAnimated = ref(false) // used to animate the wallet card on first load
  const isWatchOnly = ref(false);
  const hasMissingBalances = ref(false)

  /** -------------------------------
  * The Wallet
  -------------------------------*/
  const setWallet = (newWallet: WalletInterface) => {
    if (newWallet instanceof WatchOnlyWallet) {
      isWatchOnly.value = true;
    } else {
      isWatchOnly.value = false;
    }
    wallet.value = newWallet
    setAddress()
  }

  const removeWallet = () => {
    const { selectedChain } = storeToRefs(useChainsStore())
    if (!(wallet.value instanceof WatchOnlyWallet)) {
      isWatchOnly.value = true;
      wallet.value?.disconnect()
      const address = walletAddress.value;
      const walletType = wallet.value?.getWalletType();
      wallet.value = null
      walletAddress.value = null
      const watchOnlyWallet = new WatchOnlyWallet(address as string, selectedChain.value!, walletType!)
      setWallet(watchOnlyWallet)
    } else {
      wallet.value = null
      walletAddress.value = null
      removeTokens()
    }
  }

  const isWalletConnected = computed(() => {
    return wallet.value !== null && walletAddress.value !== null
  })

  /** -------------------------------
  * Address
  -------------------------------*/
  const setAddress = async () => {
    if (wallet.value) {
      const { addWallet: _addWallet } = useRecentAddressStore();
      const { selectedChain } = storeToRefs(useChainsStore())
      walletAddress.value = await wallet.value.getAddress()
      _addWallet(walletAddress.value, selectedChain.value!, wallet.value.getWalletType());
    }
  }

  /** -------------------------------
  * TOKENS
  -------------------------------*/
  const setIsLoadingBalances = (isLoading: boolean) => {
    isLoadingBalances.value = isLoading
  }
  const chainStore = useChainsStore()
  const { selectedChain } = storeToRefs(chainStore)

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
    newTokens.forEach(token => {
      if (token.contract === MAIN_TOKEN_CONTRACT) {
        const _balance = fromBase(BigNumber(token.balance).toString(), token.decimals || 18);
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
            balance: fromBase(
              BigNumber(token.balance).toFixed(),
              token.decimals,
            ),
          })
        } else {
          hasMissingBalances.value = true
        }
      }
    })
    tokens.value = newTokenCopy
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
   * @formattedBalance - the balance of the main token in fiat, formatted.
   */
  const formattedBalance = computed<string>(() => {
    return formatFloatingPointValue(balance.value).value
  })

  const formattedBalanceFiat = computed<string>(() => {
    return `$${balanceFiatBN.value.toFormat(2, BigNumber.ROUND_DOWN)}`
  })

  const hasBalances = computed(() => {
    return (
      allTokens.value.length > 1 &&
      BigNumber(safeMainTokenBalance.value?.balanceWei || 0).isGreaterThan(0)
    )
  })

  return {
    wallet,
    walletAddress,
    setWallet,
    removeWallet,
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
    balanceFiatBN,
    totalFiatPortfolioValueBN,
    // Formatted values
    formattedTotalFiatPortfolioValue,
    formattedBalance,
    formattedBalanceFiat,
    isWatchOnly,
    allTokens,
    hasMissingBalances,
    hasBalances,
  }
})
