<template>
  <div>
    <!--Current Chain balance -->

    <div
      v-if="
        isWalletConnected && !isLoading && exhistsOnCurrentChain && tokenData
      "
      class="flex flex-wrap items-center mt-2 sm:mt-5 px-3 xs:px-6 md:px-4 md:px-4 lg:px-10"
    >
      <h2 class="basis-full xs:basis-auto font-bold text-s-17 xs:text-s-24">
        Your Balance:
      </h2>
      <div class="flex mt-1 items-center">
        <div class="relative xs:ml-4">
          <app-token-logo
            :url="tokenDataTemp.logoUrl"
            :symbol="tokenData.symbol"
            width=" w-9 xs:w-[28px]"
            height="h-9 xs:h-[28px]"
          />
          <app-token-logo
            v-if="selectedChain"
            :url="selectedChain.icon"
            :symbol="selectedChain.name"
            width="w-3"
            height="h-3"
            class="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4"
          />
        </div>
        <div class="flex flex-col xs:flex-row xs:items-center ml-3 xs:ml-2">
          <p class="text-s-17 xs:text-s-24 font-bold leading-p-110">
            {{ currentBalance }}
            {{ tokenData.symbol.toUpperCase() }}
          </p>
          <p class="xs:ml-2 font-medium text-s-14 xs:text-s-24 text-info">
            ${{ formatFiatValue(tokenDataTemp.balance).value }}
          </p>
        </div>
      </div>
    </div>

    <hr class="h-px bg-grey-10 border-0 w-full my-5" />
    <!-- Balance on other chains -->
    <div
      v-if="
        isWalletConnected && !isLoading && tokenData && otherChains.length > 0
      "
      class="px-3 xs:px-6 md:px-4 md:px-4 lg:px-10"
    >
      <h3 class="text-s-20 font-bold mb-1">
        {{ tokenData.symbol.toUpperCase() }} balance on other chains:
      </h3>
      <div
        v-for="(i, index) in otherChains"
        :key="index"
        class="flex items-center justify-start py-2 xs:max-w-[250px]"
      >
        <div class="relative mr-4">
          <app-token-logo
            :url="tokenDataTemp.logoUrl"
            :symbol="tokenData.symbol"
            width="w-[24px]"
            height="h-[24px]"
          />
          <app-token-logo
            v-if="selectedChain"
            :url="selectedChain.icon"
            :symbol="i.chainName"
            width="w-3"
            height="h-3"
            class="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4"
          />
        </div>
        <div>
          <p class="text-s-16 font-medium">
            {{ getBalanceForChain(i.chainName) }}
            {{ tokenData.symbol.toUpperCase() }}
          </p>
          <p class="text-info text-s-12 leading-p-110 capitalize">
            on {{ i.chainName.toLowerCase() }}
          </p>
        </div>
        <p class="text-right ml-auto text-info text-s-14 leading-p-110">
          ${{ formatFiatValue(35.67).value }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import {
  formatFiatValue,
  formatFloatingPointValue,
} from '@/utils/numberFormatHelper'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import { type GetWebTokenInfo } from '@/mew_api/types'
import { useWalletStore } from '@/stores/walletStore'
import { fromBase } from '@/utils/unit'

const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
    default: true,
  },
  tokenData: {
    type: Object as PropType<GetWebTokenInfo | null>,
    required: false,
  },
})

const walletStore = useWalletStore()
const { walletAddress, isWalletConnected } = storeToRefs(walletStore)

/** --------------------
 * Balances
 --------------------*/
const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)

const exhistsOnCurrentChain = computed(() => {
  if (props.tokenData && selectedChain.value) {
    return props.tokenData.supportedChains.some(
      chain => chain.chainName === selectedChain.value?.name,
    )
  }
  return false
})

const otherChains = computed(() => {
  if (props.tokenData && selectedChain.value) {
    return props.tokenData.supportedChains.filter(
      chain => chain.chainName !== selectedChain.value?.name,
    )
  }
  return []
})

const getBalanceForChain = (_chainName: string) => {
  if (
    props.tokenData?.chainBalances &&
    props.tokenData.chainBalances.length > 0
  ) {
    const chainData = props.tokenData.chainBalances.find(
      chain => chain.chainName === _chainName,
    )
    if (
      chainData &&
      chainData.result.ok &&
      chainData.result.value.balances.length > 0
    ) {
      const _okBalances = chainData.result.value.balances.filter(
        balance => balance.ok,
      )
      const _rawBalance = _okBalances.filter(
        balance =>
          balance.value.owner.toLowerCase() ===
          walletAddress.value?.toLowerCase(),
      )
      if (_rawBalance && _rawBalance.length > 0) {
        const _balance = fromBase(
          BigInt(_rawBalance[0].value.value).toString(),
          6,
        )
        return formatFloatingPointValue(_balance).value
      }
    }
  }
  return 'N/A'
}
const currentBalance = computed(() => {
  return getBalanceForChain(selectedChain.value?.name || '')
})

const tokenDataTemp = {
  balance: 1.2345,
  balanceInFiat: 1234.56,
  coinId: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'btc',
  price: 117344,
  priceChangePercentage1h: -0.1973938102015114,
  priceChangePercentage24h: 1.13026,
  priceChangePercentage7d: 2.571203116739959,
  marketCap: 2339230573449,
  addresses: {},
  logoUrl:
    'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400',
  totalVolume: 46494511169,
}
</script>
