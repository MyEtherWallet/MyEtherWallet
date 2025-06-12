import { ref, type Ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { WalletInterface } from '@/providers/common/walletInterface'
import { fromWei } from 'web3-utils'
import type { TokenBalance, TokenBalanceRaw } from '@/mew_api/types'
import BigNumber from 'bignumber.js'
export const MAIN_TOKEN_CONTRACT = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'

export const useWalletStore = defineStore('walletStore', () => {
  const wallet: Ref<WalletInterface | null> = ref(null) // allows for falsey
  const walletAddress: Ref<string | null> = ref(null)
  const tokens: Ref<Array<TokenBalance>> = ref([])
  const balance = ref('0')
  const mainTokenBalance = ref<TokenBalance | null>(null) // main token balance, used for sending transactions
  const isLoadingBalances = ref(true)
  const walletCardWasAnimated = ref(false) // used to animate the wallet card on first load

  /** -------------------------------
  * The Wallet
  -------------------------------*/
  const setWallet = (newWallet: WalletInterface) => {
    wallet.value = newWallet
    setAddress()
  }

  const removeWallet = () => {
    wallet.value = {} as WalletInterface
  }

  const isWalletConnected = computed(() => {
    return wallet.value !== null && walletAddress.value !== null
  })

  /** -------------------------------
  * Address
  -------------------------------*/
  const setAddress = async () => {
    if (wallet.value) {
      walletAddress.value = await wallet.value.getAddress()
    }
  }

  /** -------------------------------
  * TOKENS
  -------------------------------*/
  const setIsLoadingBalances = (isLoading: boolean) => {
    isLoadingBalances.value = isLoading
  }
  const setTokens = (newTokens: Array<TokenBalanceRaw>) => {
    const newTokenCopy: Array<TokenBalance> = []
    newTokens.forEach(token => {
      if (token.contract === MAIN_TOKEN_CONTRACT) {
        mainTokenBalance.value = {
          ...token,
          name: token.name ?? 'Ether',
          symbol: token.symbol ?? 'ETH',
          balance: fromWei(token.balance, 'ether'),
        }
        balance.value = fromWei(token.balance, 'ether')
      } else {
        newTokenCopy.push({
          ...token,
          name: token.name ?? 'Unknown',
          symbol: token.symbol ?? 'UNK',
          balance: fromWei(token.balance, 'ether'),
        })
      }
    })
    tokens.value = newTokenCopy
  }

  const removeTokens = () => {
    tokens.value = []
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
  const totalFiatPotfolioValueBN = computed<BigNumber>(() => {
    return totalTokensBalanceFiatBN.value.plus(balanceFiatBN.value)
  })

  /** -------------------------------
  * Formatted Values
  -------------------------------*/
  //TODO: add proper formatting for fiat values

  /**
   * @formattedTotalFiatPortflioValue - the total portfolio value in fiat, formatted .
   */
  const formattedTotalFiatPortflioValue = computed<string>(() => {
    return `$${totalFiatPotfolioValueBN.value.toFormat(2, BigNumber.ROUND_DOWN)}`
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

  return {
    wallet,
    walletAddress,
    setWallet,
    removeWallet,
    setTokens,
    removeTokens,
    tokens,
    balance,
    mainTokenBalance,
    isLoadingBalances,
    walletCardWasAnimated,
    setIsLoadingBalances,
    setAddress,
    // BigNumber total values
    isWalletConnected,
    totalTokensBalanceFiatBN,
    balanceFiatBN,
    totalFiatPotfolioValueBN,
    // Formatted values
    formattedTotalFiatPortflioValue,
    formattedBalance,
    formattedBalanceFiat,
  }
})
