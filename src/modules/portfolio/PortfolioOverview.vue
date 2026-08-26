<template>
  <app-sheet
    v-if="isWalletConnected"
    :is-elivated="false"
    sheet-class=" !px-4 sm:!px-5 !pt-4 !pb-5 h-full flex flex-col justify-between overflow-y-auto sm:overflow-hidden"
  >
    <div class="flex items-center w-full justify-between mb-5">
      <h2 class="text-s-20 font-bold leading-tight">{{ t('portfolio.overview.title') }}</h2>
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
            <span class="text-s-15 font-medium truncate">{{ t('portfolio.overview.tokenized_stocks') }}</span>
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
            <span class="text-s-15 font-medium truncate">{{ t('portfolio.overview.stables') }}</span>
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
                >{{ t('portfolio.overview.large_market_cap') }}</span
              >
              <app-tooltip
                :text="t('portfolio.overview.large_market_cap_tooltip')"
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
            <span class="text-s-15 font-medium truncate">{{ t('portfolio.overview.altcoins') }}</span>
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
import { formatPercentageValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { type TokenBalance } from '@/mew_api/types'
import { getTokenCategory, type TokenCategory } from '@/utils/tokenCategories'

const { formatFiat } = useCurrency()

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
const TOP_TOKENS_LIMIT = 3

/**
 * Fiat value of a holding, read off the token itself rather than looked up by
 * contract: a duplicate contract entry can otherwise resolve to another
 * holding's balance, and this keeps the buckets adding up to the store's
 * portfolio total, which is computed the same way.
 */
const tokenFiatValue = (token: TokenBalance): BigNumber => {
  return BigNumber(token.price || 0).times(BigNumber(token.balance || 0))
}

const getTopUsdBalanceTokens = (tokenList: TokenBalance[]): TokenBalance[] => {
  return tokenList
    .map(token => ({ token, value: tokenFiatValue(token) }))
    .sort((tokenA, tokenB) => tokenB.value.comparedTo(tokenA.value) ?? 0)
    .slice(0, TOP_TOKENS_LIMIT)
    .reverse() // reverse to show highest balance token at the back of the stack
    .map(({ token }) => token)
}

/** -------------------------------
 * Categories
 * Every holding lands in exactly one bucket, so the four rows partition the
 * portfolio instead of double counting tokens that match two filters.
 -------------------------------*/
const categorizedTokens = computed<Record<TokenCategory, TokenBalance[]>>(
  () => {
    const groups: Record<TokenCategory, TokenBalance[]> = {
      stocks: [],
      stables: [],
      largeCap: [],
      altcoins: [],
    }
    for (const token of allTokens.value) {
      groups[getTokenCategory(token)].push(token)
    }
    return groups
  },
)

const createCategoryView = (category: TokenCategory) => {
  const tokens = computed<TokenBalance[]>(
    () => categorizedTokens.value[category],
  )
  const value = computed<BigNumber>(() =>
    tokens.value.reduce(
      (total, token) => total.plus(tokenFiatValue(token)),
      new BigNumber(0),
    ),
  )
  const percentage = computed<BigNumber>(() => {
    const total = totalFiatPortfolioValueBN.value
    if (total.isZero()) {
      return new BigNumber(0)
    }
    return value.value.div(total).multipliedBy(100)
  })
  return {
    topTokens: computed<TokenBalance[]>(() =>
      getTopUsdBalanceTokens(tokens.value),
    ),
    tokenCount: computed<number>(() => tokens.value.length),
    formattedValue: computed<string>(() => formatFiat(value.value).display),
    percentageFormatted: computed<string>(
      () => formatPercentageValue(percentage.value).value,
    ),
  }
}

const {
  topTokens: topStocksTokens,
  tokenCount: stocksTokenCount,
  formattedValue: stocksFormattedValue,
  percentageFormatted: stocksPercentageFormatted,
} = createCategoryView('stocks')

const {
  topTokens: topStableTokens,
  tokenCount: stablesTokenCount,
  formattedValue: stablesFormattedValue,
  percentageFormatted: stablesPercentageFormatted,
} = createCategoryView('stables')

const {
  topTokens: topLargeCapTokens,
  tokenCount: largeCapTokenCount,
  formattedValue: largeCapFormattedValue,
  percentageFormatted: largeCapPercentageFormatted,
} = createCategoryView('largeCap')

const {
  topTokens: topAltcoinTokens,
  tokenCount: altcoinsTokenCount,
  formattedValue: altcoinsFormattedValue,
  percentageFormatted: altcoinsPercentageFormatted,
} = createCategoryView('altcoins')
</script>
