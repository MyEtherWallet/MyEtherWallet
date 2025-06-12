<template>
  <div class="h-[290px] overflow-y-auto">
    <div
      v-if="!isLoading && tokens.length"
      class="flex flex-col px-2 pt-1 pb-2"
    >
      <button
        v-for="token in displayTokens"
        :key="token.contract"
        class="flex items-center justify-between p-2 cursor-pointer hoverNoBG rounded-12"
        @click="viewTokensPage(token)"
      >
        <div class="flex justify-between items-center w-full">
          <div class="flex items-center">
            <img
              class="mr-3 w-7 h-7 rounded-full overflow-hidden shadow-token"
              :src="imageReplacer(token)"
              alt="token icon"
            />
            <div class="text-left max-w-[120px]">
              <p class="truncate text-s-14 font-medium">{{ token.name }}</p>
              <p class="text-info text-s-12">
                {{ getBalance(token.balance) }}
                <span class="uppercase text-s-12">
                  {{ truncate(token.symbol, 7) }}</span
                >
              </p>
            </div>
          </div>
          <div v-if="token.price !== 0" class="text-right">
            <p class="text-s-14 text-medium">
              $ {{ formatUsdBalance(token.usd_balance) }}
            </p>
            <p class="text-info text-s-12">
              @ ${{ formatFiatValue(token.price || 0).value }}
            </p>
          </div>
        </div>
      </button>
    </div>
    <div
      v-else-if="isLoading"
      class="flex flex-col justify-center items-center p-3 gap-3"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="h-[50px] w-full bg-grey-10 rounded-16 animate-pulse"
      ></div>
    </div>
    <div v-else class="flex flex-col justify-start p-5">
      <div class="text-s-14 mb-2 text-center">
        <p>Welcome!</p>
        <p class="text-info">Add funds to start using your portfolio.</p>
      </div>
      <button
        class="shadow-button shadow-button-elevated rounded-16 p-2 mt-3 hoverNoBG"
      >
        <div class="flex items-center justify-startphead gap-3">
          <icon-buy class="w-7 h-7 text-primary" />
          <div class="text-left">
            <p class="text-s-14">Buy Crypto</p>
            <p class="text-info text-s-12">Buy crypto with credit card</p>
          </div>
        </div>
      </button>
      <button
        class="shadow-button shadow-button-elevated rounded-16 p-2 mt-3 hoverNoBG"
      >
        <div class="flex items-center justify-start gap-3">
          <icon-send class="w-7 h-7 text-primary" />
          <div class="text-left">
            <p class="text-s-14">Transfer from another wallet</p>
            <p class="text-info text-s-12">Move funds from another wallet</p>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MAIN_TOKEN_CONTRACT, useWalletStore } from '@/stores/walletStore'
import { type TokenBalance } from '@/mew_api/types'
import { computed } from 'vue'
import BigNumber from 'bignumber.js'
import { storeToRefs } from 'pinia'
import eth from '@/assets/icons/tokens/eth.svg'
import { truncate } from '@/utils/filters'
import {
  formatFloatingPointValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import { sortObjectArrayNumber } from '@/utils/sortArray'
import IconSend from '@/assets/icons/core_menu/icon-send.vue'
import IconBuy from '@/assets/icons/core_menu/icon-buy.vue'

const store = useWalletStore()
const { isLoadingBalances: isLoading, tokens } = storeToRefs(store)

const defaultImg = computed(() => {
  const img = tokens.value.find(
    (token: TokenBalance) => token.contract === MAIN_TOKEN_CONTRACT,
  )
  return img ? img.logo_url : eth
})

interface TokenBalanceWithUsd extends TokenBalance {
  usd_balance: number
}
const displayTokens = computed<TokenBalanceWithUsd[]>(() => {
  const items = tokens.value.map(token => {
    const usdBalance = BigNumber(
      BigNumber(token.price || 0).times(BigNumber(token.balance)),
    ).toNumber()
    return {
      ...token,
      usd_balance: usdBalance, // Add usd_balance to each token
      price: token.price || 0, // Ensure price is defined
    }
  })
  return sortObjectArrayNumber(items, 'usd_balance', 'desc')
})

const viewTokensPage = (token: TokenBalance) => {
  console.log('viewTokensPage', token)
}

const imageReplacer = (token: TokenBalance) => {
  if (
    !token.logo_url ||
    token.logo_url === 'https://img.mewapi.io/?image=null'
  ) {
    return defaultImg.value
  }
  return token.logo_url
}

const formatUsdBalance = (_value: number) => {
  return formatFiatValue(_value).value
}

const getBalance = (_value: string) => {
  return formatFloatingPointValue(_value).value
}
</script>
