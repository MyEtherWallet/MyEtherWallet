<template>
  <div class="w-full" v-if="isWalletConnected">
    <div class="flex flex-wrap items-center w-full justify-between mb-2">
      <h2 class="text-s-18 font-bold ml-2 xs:ml-4">{{ title }}</h2>
      <div
        class="flex items-center justify-center gap-2 order-2 xs:order-2 ml-auto"
      >
        <app-btn-icon
          :disabled="!isLoading && currentPage === 0"
          label="previous page"
          @click="prevPage"
        >
          <ChevronLeftIcon class="w-4 h-4" />
        </app-btn-icon>

        <span class="px-2 text-s-12"
          >{{ currentPage + 1 }} of {{ totalPages }}</span
        >
        <app-btn-icon
          class=""
          :disabled="!isLoading && currentPage + 1 >= totalPages"
          label="next page"
          @click="nextPage"
        >
          <ChevronRightIcon class="w-4 h-4" />
        </app-btn-icon>
      </div>
    </div>
    <app-sheet sheet-class="!py-4 !px-2 overflow-hidden ">
      <div
        class="grid grid-cols-4 w-full justify-between text-s-9 uppercase text-info tracking-sp-06 font-bold mb-3 items-end px-3"
      >
        <p class="col-span-2">Token</p>
        <p class="col-span-1">Price</p>
        <p class="text-right col-span-1">Portfolio Gain / Loss</p>
      </div>
      <div v-if="!isLoading" class="min-h-[160px]">
        <TokenRow
          v-for="token in paginatedArray"
          :key="token.contract + token.id"
          class="w-full mb-2"
          :token="token"
        >
        </TokenRow>
      </div>
      <div v-else class="bg-grey-10 rounded-2xl animate-pulse h-[160px]"></div>
    </app-sheet>
    <div class="flex justify-end my-1 items-center">
      <router-link
        :to="{
          name:
            props.type === 'stock'
              ? ROUTES_MAIN.STOCKS.NAME
              : ROUTES_MAIN.CRYPTO.NAME,
        }"
        class="font-bold text-s-14 transition-[background] duration-300 hoverNoBG rounded-full px-3 py-1"
      >
        {{ buttonText }}
        <arrow-long-up-icon class="rotate-90 w-4 h-4 inline-flex ml-1"
      /></router-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppSheet from '@/components/AppSheet.vue'
import TokenRow from './components/gains_or_loss/TokenRow.vue'
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
  tokens,
  isLoadingBalances: isLoading,
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
  const _tokens = tokens.value
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
      }
    }) as TokenGainOrLoss[]
  _tokens.sort((a, b) => b.gainOrLoss.abs().comparedTo(a.gainOrLoss.abs()) || 0)
  return _tokens
})

const { currentPage, paginatedArray, nextPage, prevPage, totalPages } =
  usePaginate<TokenGainOrLoss>(topTokens, 3)
</script>
