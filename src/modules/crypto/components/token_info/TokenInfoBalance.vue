<template>
  <div>
    <!--Current Chain balance -->

    <div
      v-if="
        isWalletConnected && !isLoading && existsOnCurrentChain && tokenData
      "
      class="flex flex-wrap items-center px-3 xs:px-6 md:px-4 md:px-4 lg:px-10 gap-2"
    >
      <h2
        class="basis-full xs:basis-auto font-bold text-s-20 xs:text-s-24 leading-p-150"
      >
        Your Balance:
      </h2>
      <div class="flex mt-1 items-center">
        <div class="relative">
          <app-token-logo
            :url="tokenData.iconUrl"
            :symbol="tokenData.symbol"
            width="w-9 xs:w-8"
            height="h-9 xs:h-8"
          />
          <app-token-logo
            v-if="selectedChain"
            :url="selectedChain.icon"
            :symbol="selectedChain.name"
            width="w-4"
            height="h-4"
            class="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4"
          />
        </div>
        <div class="flex flex-col xs:flex-row xs:items-center ml-3 xs:ml-2">
          <p class="text-s-17 xs:text-s-24 font-bold leading-p-110">
            {{ currentBalance }}
            {{ tokenData.symbol.toUpperCase() }}
          </p>
          <p class="xs:ml-3 font-normal text-s-14 xs:text-s-24 text-info">
            ${{ getFormattedFiatValueForChain(currentBalance) }}
          </p>
        </div>
      </div>
    </div>

    <hr
      v-if="
        isWalletConnected && !isLoading && tokenData && otherChains.length > 0
      "
      class="h-px bg-grey-10 border-0 w-full my-5"
    />
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
        class="flex items-center justify-between py-2 w-full gap-4"
      >
        <div class="flex w-full items-center justify-between xs:max-w-[300px]">
          <div class="relative mr-4">
            <app-token-logo
              :url="tokenData.iconUrl"
              :symbol="tokenData.symbol"
            />
            <app-token-logo
              v-if="selectedChain"
              :url="getChainIcon(i.chainName)"
              :symbol="i.chainName"
              width="w-4"
              height="h-4"
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
            ${{
              getFormattedFiatValueForChain(getBalanceForChain(i.chainName))
            }}
          </p>
        </div>

        <app-base-button size="small" class="hidden xs:block ml-auto">
          Bridge</app-base-button
        >
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
import AppBaseButton from '@/components/AppBaseButton.vue'
import BigNumber from 'bignumber.js'

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

const existsOnCurrentChain = computed(() => {
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
      chain =>
        chain.chainName !== selectedChain.value?.name &&
        selectedChain.value?.type === chain.chainType,
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
      const _decimals = chainData.result.value.decimals
      const _okBalances = chainData.result.value.balances.filter(
        balance => balance.ok,
      )
      const _rawBalance = _okBalances.filter(
        balance =>
          balance.value.owner.toLowerCase() ===
          walletAddress.value?.toLowerCase(),
      )
      if (_rawBalance && _rawBalance.length > 0 && _decimals) {
        const _balance = fromBase(
          BigInt(_rawBalance[0].value.value).toString(),
          _decimals,
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

const getChainIcon = (_chainName: string) => {
  if (!props.tokenData) return ''
  const chain = props.tokenData.chainBalances.find(
    c => c.chainName === _chainName,
  )

  return chain ? chain.iconUrl : ''
}

const getFormattedFiatValueForChain = (balance: string) => {
  if (balance === 'N/A' || !props.tokenData?.currentPrice) return 'N/A'
  const fiat = new BigNumber(balance).multipliedBy(
    props.tokenData?.currentPrice || 0,
  )
  return formatFiatValue(fiat).value
}
</script>
