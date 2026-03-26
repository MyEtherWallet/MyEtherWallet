<template>
  <app-sheet
    v-if="isWalletConnected"
    :is-elivated="false"
    sheet-class=" !px-4 sm:!px-5 !pt-4 !pb-5 h-full flex flex-col justify-between overflow-y-auto sm:overflow-hidden"
  >
    <div class="flex items-center w-full justify-between mb-5">
      <h2 class="text-s-20 font-bold leading-tight">Overview</h2>
    </div>

    <div v-if="!isLoading" class="flex flex-col gap-4">
      <!-- Tokenized Stocks -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3 min-w-0">
          <div class="flex items-center shrink-0">
            <div
              v-for="index in 3 - topStocksTokens.length"
              :key="`placeholder-stocks-${index}`"
              :class="[
                index === 1 ? '' : '-ml-[13px]',
                'w-[22px] h-[22px] rounded-full flex-none bg-surface-light border border-grey-5 shadow-token',
              ]"
            ></div>
            <app-token-logo
              v-for="(token, index) in topStocksTokens"
              :key="`${token.contract}-${index}`"
              :url="token.logo_url"
              :symbol="token.symbol"
              :is-stock="Boolean(token.ondo)"
              width="w-6"
              height="h-6"
              :class="[
                topStocksTokens.length === 3 && index === 0 ? '' : '-ml-[13px]',
              ]"
            />
          </div>
          <div class="flex flex-col min-w-0">
            <span class="text-s-15 font-medium truncate">Tokenized Stocks</span>
            <span class="text-s-12 text-info">{{
              t('common.token_count', stocksTokenCount)
            }}</span>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-s-15 font-medium">{{ stocksFormattedValue }}</span>
          <span class="text-s-12 text-info">{{
            stocksPercentageFormatted
          }}</span>
        </div>
      </div>

      <!-- Stables -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3 min-w-0">
          <div class="flex items-center shrink-0">
            <div
              v-for="index in 3 - topStableTokens.length"
              :key="`placeholder-stables-${index}`"
              :class="[
                index === 1 ? '' : '-ml-[13px]',
                'w-[22px] h-[22px] rounded-full flex-none bg-surface-light border border-grey-5 shadow-token',
              ]"
            ></div>
            <app-token-logo
              v-for="(token, index) in topStableTokens"
              :key="`${token.contract}-${index}`"
              :url="token.logo_url"
              :symbol="token.symbol"
              :is-stock="Boolean(token.ondo)"
              width="w-6"
              height="h-6"
              :class="[
                topStableTokens.length === 3 && index === 0 ? '' : '-ml-[13px]',
              ]"
            />
          </div>
          <div class="flex flex-col min-w-0">
            <span class="text-s-15 font-medium truncate">Stables</span>
            <span class="text-s-12 text-info">{{
              t('common.token_count', stablesTokenCount)
            }}</span>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-s-15 font-medium">{{ stablesFormattedValue }}</span>
          <span class="text-s-12 text-info">{{
            stablesPercentageFormatted
          }}</span>
        </div>
      </div>

      <!-- Large Cap -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3 min-w-0">
          <div class="flex items-center shrink-0">
            <div
              v-for="index in 3 - topLargeCapTokens.length"
              :key="`placeholder-largecap-${index}`"
              :class="[
                index === 1 ? '' : '-ml-[13px]',
                'w-[22px] h-[22px] rounded-full flex-none bg-surface-light border border-grey-5 shadow-token',
              ]"
            ></div>
            <app-token-logo
              v-for="(token, index) in topLargeCapTokens"
              :key="`${token.contract}-${index}`"
              :url="token.logo_url"
              :symbol="token.symbol"
              :is-stock="Boolean(token.ondo)"
              width="w-6"
              height="h-6"
              :class="[
                topLargeCapTokens.length === 3 && index === 0
                  ? ''
                  : '-ml-[13px]',
              ]"
            />
          </div>
          <div class="flex flex-col min-w-0">
            <div class="flex items-center gap-1">
              <span class="text-s-15 font-medium truncate"
                >Large Market Cap</span
              >
              <app-tooltip
                text="Tokens with market caps above $10B, excluding tokenized stocks and stablecoins."
              />
            </div>
            <span class="text-s-12 text-info">{{
              t('common.token_count', largeCapTokenCount)
            }}</span>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-s-15 font-medium">{{
            largeCapFormattedValue
          }}</span>
          <span class="text-s-12 text-info">{{
            largeCapPercentageFormatted
          }}</span>
        </div>
      </div>

      <!-- Altcoins -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3 min-w-0">
          <div class="flex items-center shrink-0">
            <div
              v-for="index in 3 - topAltcoinTokens.length"
              :key="`placeholder-${index}`"
              :class="[
                index === 1 ? '' : '-ml-[13px]',
                'w-[22px] h-[22px] rounded-full flex-none bg-surface-light border border-grey-5 shadow-token',
              ]"
            ></div>
            <app-token-logo
              v-for="(token, index) in topAltcoinTokens"
              :key="`${token.contract}-${index}`"
              :url="token.logo_url"
              :symbol="token.symbol"
              :is-stock="Boolean(token.ondo)"
              :id="`${token.contract}-${index}`"
              width="w-6"
              height="h-6"
              :class="[
                topAltcoinTokens.length === 3 && index === 0
                  ? ''
                  : '-ml-[13px]',
              ]"
            />
          </div>
          <div class="flex flex-col min-w-0">
            <span class="text-s-15 font-medium truncate">Altcoins</span>
            <span class="text-s-12 text-info">{{
              t('common.token_count', altcoinsTokenCount)
            }}</span>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-s-15 font-medium">{{
            altcoinsFormattedValue
          }}</span>
          <span class="text-s-12 text-info">{{
            altcoinsPercentageFormatted
          }}</span>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col gap-4">
      <div
        v-for="i in 4"
        :key="`loading-overview-${i}`"
        class="bg-grey-10 animate-pulse rounded-16 w-full h-[41px]"
      ></div>
    </div>
  </app-sheet>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppSheet from '@/components/AppSheet.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTooltip from '@/components/AppTooltip.vue'

import { useWalletStore } from '@/stores/walletStore'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
import { BigNumber } from 'bignumber.js'
import {
  formatFiatValue,
  formatPercentageValue,
} from '@/utils/numberFormatHelper'
import { type TokenBalance } from '@/mew_api/types'

const walletStore = useWalletStore()
const {
  isWalletConnected,
  allTokens,
  totalFiatPortfolioValueBN,
  isLoadingBalances: isLoading,
} = storeToRefs(walletStore)

/** -------------------------------
 * Helpers
 -------------------------------*/
const getTokenBalance = (contract: string) => {
  const tokenBalanceRaw = walletStore.getTokenBalance(contract)
  if (!tokenBalanceRaw) {
    return new BigNumber(0)
  }
  return BigNumber(tokenBalanceRaw.price || 0).times(
    BigNumber(tokenBalanceRaw.balance),
  )
}

const getTopUsdBalanceTokens = (tokenList: TokenBalance[]): TokenBalance[] => {
  return [...tokenList]
    .sort((tokenA, tokenB) => {
      return (
        getTokenBalance(tokenB.contract).comparedTo(
          getTokenBalance(tokenA.contract),
        ) ?? 0
      )
    })
    .slice(0, 3)
    .reverse() // reverse to show highest balance token at the back of the stack
}

/** -------------------------------
 * Tokenized Stocks
 -------------------------------*/
const stocksValue = computed<BigNumber>(() => {
  const stocks = allTokens.value.filter(token => token.ondo !== undefined)
  if (stocks.length === 0) {
    return new BigNumber(0)
  }
  return stocks.reduce((total, token) => {
    const tokenBalanceFiatBN = getTokenBalance(token.contract)
    return total.plus(tokenBalanceFiatBN)
  }, new BigNumber(0))
})

const stocksFormattedValue = computed<string>(() => {
  return `$${formatFiatValue(stocksValue.value).value}`
})

const topStocksTokens = computed<TokenBalance[]>(() => {
  return getTopUsdBalanceTokens(
    allTokens.value.filter(token => token.ondo !== undefined),
  )
})

const stocksTokenCount = computed<number>(() => {
  return allTokens.value.filter(token => token.ondo !== undefined).length
})

/** -------------------------------
 * Stables
 -------------------------------*/
const stablesValue = computed<BigNumber>(() => {
  const stables = allTokens.value.filter(token => token.is_stablecoin)
  if (stables.length === 0) {
    return new BigNumber(0)
  }
  return stables.reduce((total, token) => {
    const tokenBalanceFiatBN = getTokenBalance(token.contract)
    return total.plus(tokenBalanceFiatBN)
  }, new BigNumber(0))
})

const stablesFormattedValue = computed<string>(() => {
  return `$${formatFiatValue(stablesValue.value).value}`
})

const topStableTokens = computed<TokenBalance[]>(() => {
  return getTopUsdBalanceTokens(
    allTokens.value.filter(token => token.is_stablecoin),
  )
})

const stablesTokenCount = computed<number>(() => {
  return allTokens.value.filter(token => token.is_stablecoin).length
})

/** -------------------------------
 * Large Market Cap
 -------------------------------*/
const largeCapValue = computed<BigNumber>(() => {
  const largeCapTokens = allTokens.value.filter(
    token =>
      !token.is_stablecoin &&
      token.ondo === undefined &&
      token.market_cap &&
      BigNumber(token.market_cap).isGreaterThan(10000000000), // $10B+
  )
  if (largeCapTokens.length === 0) {
    return new BigNumber(0)
  }
  return largeCapTokens.reduce((total, token) => {
    const tokenBalanceFiatBN = getTokenBalance(token.contract)
    return total.plus(tokenBalanceFiatBN)
  }, new BigNumber(0))
})

const largeCapFormattedValue = computed<string>(() => {
  return `$${formatFiatValue(largeCapValue.value).value}`
})

const topLargeCapTokens = computed<TokenBalance[]>(() => {
  return getTopUsdBalanceTokens(
    allTokens.value.filter(
      token =>
        !token.is_stablecoin &&
        token.ondo === undefined &&
        token.market_cap != null &&
        BigNumber(token.market_cap).isGreaterThan(10000000000),
    ),
  )
})

const largeCapTokenCount = computed<number>(() => {
  return allTokens.value.filter(
    token =>
      !token.is_stablecoin &&
      token.ondo === undefined &&
      token.market_cap &&
      BigNumber(token.market_cap).isGreaterThan(10000000000),
  ).length
})

/** -------------------------------
 * Altcoins
 -------------------------------*/
const altcoinsValue = computed<BigNumber>(() => {
  const altcoins = allTokens.value.filter(
    token =>
      !token.is_stablecoin &&
      token.ondo === undefined &&
      (!token.market_cap ||
        BigNumber(token.market_cap).isLessThan(10000000000)), // < $10B
  )
  if (altcoins.length === 0) {
    return new BigNumber(0)
  }
  return altcoins.reduce((total, token) => {
    const tokenBalanceFiatBN = getTokenBalance(token.contract)
    return total.plus(tokenBalanceFiatBN)
  }, new BigNumber(0))
})

const altcoinsFormattedValue = computed<string>(() => {
  return `$${formatFiatValue(altcoinsValue.value).value}`
})

const topAltcoinTokens = computed<TokenBalance[]>(() => {
  return getTopUsdBalanceTokens(
    allTokens.value.filter(
      token =>
        !token.is_stablecoin &&
        token.ondo === undefined &&
        (!token.market_cap ||
          BigNumber(token.market_cap).isLessThan(10000000000)),
    ),
  )
})

const altcoinsTokenCount = computed<number>(() => {
  return allTokens.value.filter(
    token =>
      !token.is_stablecoin &&
      token.ondo === undefined &&
      (!token.market_cap ||
        BigNumber(token.market_cap).isLessThan(10000000000)),
  ).length
})

/** -------------------------------
 * Percentage Calculations
 -------------------------------*/
const totalPortfolioValue = computed<BigNumber>(() => {
  return totalFiatPortfolioValueBN.value
})

const stocksPercentage = computed<BigNumber>(() => {
  if (totalPortfolioValue.value.isZero()) {
    return new BigNumber(0)
  }
  return stocksValue.value.div(totalPortfolioValue.value).multipliedBy(100)
})

const stocksPercentageFormatted = computed<string>(() => {
  return formatPercentageValue(stocksPercentage.value).value
})

const stablesPercentage = computed<BigNumber>(() => {
  if (totalPortfolioValue.value.isZero()) {
    return new BigNumber(0)
  }
  return stablesValue.value.div(totalPortfolioValue.value).multipliedBy(100)
})

const stablesPercentageFormatted = computed<string>(() => {
  return formatPercentageValue(stablesPercentage.value).value
})

const largeCapPercentage = computed<BigNumber>(() => {
  if (totalPortfolioValue.value.isZero()) {
    return new BigNumber(0)
  }
  return largeCapValue.value.div(totalPortfolioValue.value).multipliedBy(100)
})

const largeCapPercentageFormatted = computed<string>(() => {
  return formatPercentageValue(largeCapPercentage.value).value
})

const altcoinsPercentage = computed<BigNumber>(() => {
  if (totalPortfolioValue.value.isZero()) {
    return new BigNumber(0)
  }
  return altcoinsValue.value.div(totalPortfolioValue.value).multipliedBy(100)
})

const altcoinsPercentageFormatted = computed<string>(() => {
  return formatPercentageValue(altcoinsPercentage.value).value
})
</script>
