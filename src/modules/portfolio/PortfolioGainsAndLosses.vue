<template>
  <div class="w-full" v-if="isWalletConnected">
    <div class="flex flex-wrap items-center w-full justify-between mb-3 px-1">
      <h2 class="text-s-18 font-bold">{{ title }}</h2>
      <div class="flex items-center justify-center gap-1 order-2 ml-auto">
        <app-btn-icon
          :disabled="!isLoading && currentPage === 0"
          label="previous page"
          @click="prevPage"
          height="h-8"
          width="w-8"
        >
          <ChevronLeftIcon class="w-4 h-4" />
        </app-btn-icon>

        <span class="px-2 text-s-12 text-info font-medium"
          >{{ currentPage + 1 }} of {{ totalPages }}</span
        >
        <app-btn-icon
          :disabled="!isLoading && currentPage + 1 >= totalPages"
          label="next page"
          @click="nextPage"
          height="h-8"
          width="w-8"
        >
          <ChevronRightIcon class="w-4 h-4" />
        </app-btn-icon>
      </div>
    </div>
    <app-sheet
      :is-elivated="false"
      sheet-class="!pt-5 !pb-2 !px-2 overflow-hidden"
    >
      <div
        class="grid grid-cols-4 w-full justify-between text-s-11 uppercase text-info tracking-sp-06 mb-4 items-end pl-4 pr-3 font-bold"
      >
        <p class="col-span-2">Token</p>
        <p class="col-span-1">Price / 24h</p>
        <p class="text-right col-span-1">Gain / Loss</p>
      </div>
      <div v-if="!isLoading" class="min-h-[181px]">
        <TokenRow
          v-for="token in paginatedArray"
          :key="token.contract + token.id"
          class="w-full last:mb-0"
          :token="token"
        >
        </TokenRow>
        <div
          v-if="type === 'stock' && allStocks.length === 0"
          class="flex flex-col items-center justify-center p-6 text-center"
        >
          <p class="text-s-14 text-info mb-4">You don't have any stock</p>
          <app-base-button
            @click="$router.push({ name: ROUTES_MAIN.STOCKS.NAME })"
          >
            Buy Stock
          </app-base-button>
        </div>
        <div v-if="!hasBalances && type !== 'stock'" class="text-center"></div>
      </div>
      <div v-else class="flex flex-col gap-3 w-full min-h-[181px]">
        <div
          v-for="token in 3"
          :key="`loading-gains-and-losses-${token}`"
          class="bg-grey-10 animate-pulse flex items-end justify-between rounded-16 w-full h-[51px]"
        ></div>
      </div>
    </app-sheet>
    <div class="flex justify-end mt-2 mb-1 items-center">
      <router-link
        :to="{
          name:
            props.type === 'stock'
              ? ROUTES_MAIN.STOCKS.NAME
              : ROUTES_MAIN.CRYPTO.NAME,
        }"
        class="font-bold text-s-14 transition-colors duration-300 hover:text-primary flex items-center px-1"
      >
        {{ buttonText }}
        <arrow-long-up-icon class="rotate-90 w-4 h-4 ml-1.5"
      /></router-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppSheet from '@/components/AppSheet.vue'
import TokenRow from './components/gains_or_loss/TokenRow.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { useWalletStore } from '@/stores/walletStore'
import { computed } from 'vue'
import { BigNumber } from 'bignumber.js'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLongUpIcon,
} from '@heroicons/vue/24/solid'
import { type TokenGainOrLoss } from '@/modules/portfolio/types'
import { usePaginate } from '@/composables/usePaginate'
import { ROUTES_MAIN } from '@/router/routeNames'
type GainOrLossType = 'all' | 'stock'

const props = withDefaults(
  defineProps<{
    type: GainOrLossType
  }>(),
  {
    type: 'all',
  },
)

const title = computed(() => {
  switch (props.type) {
    case 'stock':
      return 'Stock Gains & Losses'
    default:
      return 'All Gains & Losses'
  }
})

const buttonText = computed(() => {
  switch (props.type) {
    case 'stock':
      return 'All stock trends'
    default:
      return 'All crypto trends'
  }
})
const walletStore = useWalletStore()
const {
  isWalletConnected,
  allTokens,
  isLoadingBalances: isLoading,
  hasBalances,
  allStocks,
} = storeToRefs(walletStore)

/**
 *
 * @param contract - token contract address
 * @returns BigNumber - token balance in fiat value
 */
const getTokenBalance = (contract: string) => {
  const tokenBalanceRaw = walletStore.getTokenBalance(contract)
  if (!tokenBalanceRaw) {
    return new BigNumber(0)
  }
  return BigNumber(tokenBalanceRaw.price || 0).times(
    BigNumber(tokenBalanceRaw.balance),
  )
}

const getGainOrLoss = (percent: number, contract: string) => {
  const newBalance = BigNumber(getTokenBalance(contract))
  const oldBalance = newBalance.dividedBy(
    BigNumber(1).plus(BigNumber(percent).dividedBy(100)),
  )
  return newBalance.minus(oldBalance)
}

const topTokens = computed<TokenGainOrLoss[]>(() => {
  const sourceArray = props.type === 'stock' ? allStocks.value : allTokens.value
  const _tokens = sourceArray
    .filter(
      token =>
        token.price !== undefined &&
        token.coinId !== undefined &&
        token.price_change_percentage_24h !== undefined,
    )
    .map(token => {
      return {
        name: token.name,
        symbol: token.symbol,
        logo_url: token.logo_url,
        price: token.price,
        percentChange: token.price_change_percentage_24h,
        gainOrLoss: getGainOrLoss(
          token.price_change_percentage_24h || 0,
          token.contract,
        ),
        id: token.coinId,
        contract: token.contract,
        is_stock: token.is_rwa,
      }
    }) as TokenGainOrLoss[]
  _tokens.sort((a, b) => b.gainOrLoss.abs().comparedTo(a.gainOrLoss.abs()) || 0)
  return _tokens
})

const { currentPage, paginatedArray, nextPage, prevPage, totalPages } =
  usePaginate<TokenGainOrLoss>(topTokens, 3)
</script>
