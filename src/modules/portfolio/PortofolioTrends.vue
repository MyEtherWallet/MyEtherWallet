<template>
  <app-sheet
    v-if="isWalletConnected"
    sheet-class=" !px-4 !pt-3 pb-2 overflow-hidden "
  >
    <div class="flex items-center w-full justify-between">
      <h2 class="text-s-18 font-bold mb-4">Top Crypto Gainers & Loosers</h2>
    </div>
    <div
      class="grid grid-cols-4 w-full justify-between text-s-9 uppercase text-info tracking-sp-06 font-bold mb-3 items-end"
    >
      <p class="col-span-2">Token</p>
      <p class="col-span-1">Price</p>
      <p class="text-right col-span-1">Portfolio Gain / Loss</p>
    </div>
    <div v-if="!isLoading" class="min-h-[270px]">
      <TokenRow
        v-for="token in paginatedArray"
        :key="token.contract + token.id"
        class="w-full mb-2"
        :token="token"
      >
      </TokenRow>
    </div>
    <div v-else class="bg-grey-10 rounded-2xl animate-pulse h-[270px]"></div>
    <div
      class="flex items-center justify-center gap-2 order-2 xs:order-2 w-full"
    >
      <app-btn-icon
        :disabled="!isLoading && currentPage === 1"
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
        :disabled="!isLoading && currentPage >= totalPages"
        label="next page"
        @click="nextPage"
      >
        <ChevronRightIcon class="w-4 h-4" />
      </app-btn-icon>
    </div>
  </app-sheet>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppSheet from '@/components/AppSheet.vue'
import TokenRow from './components/trends/TokenRow.vue'
import { useWalletStore } from '@/stores/walletStore'
import { computed } from 'vue'
import { BigNumber } from 'bignumber.js'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import { type TokenGainOrLoss } from '@/modules/portfolio/types'
import { usePaginate } from '@/composables/usePaginate'

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
/**
 * TEMP
 */
const getRandomNumber = () => Math.round((Math.random() * 198 - 99) * 100) / 100

const topTokens = computed<TokenGainOrLoss[]>(() => {
  const _tokens = tokens.value
    .filter(token => token.price !== undefined && token.coinId !== undefined)
    .map(token => {
      const percentChange = getRandomNumber()
      return {
        name: token.name,
        symbol: token.symbol,
        logo_url: token.logo_url,
        price: token.price,
        percentChange: percentChange,
        gainOrLoss: getGainOrLoss(percentChange, token.contract),
        id: token.coinId,
        contract: token.contract,
      }
    }) as TokenGainOrLoss[]
  _tokens.sort((a, b) => b.gainOrLoss.abs().comparedTo(a.gainOrLoss.abs()) || 0)
  return _tokens
})

const { currentPage, paginatedArray, nextPage, prevPage, totalPages } =
  usePaginate<TokenGainOrLoss>(topTokens, 5)
</script>
