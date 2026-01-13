<template>
  <div>
    <!--Current Chain balance -->

    <div
      v-if="
        isWalletConnected && !isLoading && existsOnCurrentChain && tokenData
      "
      class="flex flex-wrap items-center px-3 xs:px-6 md:px-4 lg:px-10 gap-2"
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
      class=""
    >
      <h3 class="text-s-20 font-bold mb-1 px-3 xs:px-6 md:px-4 lg:px-10">
        {{ tokenData.symbol.toUpperCase() }} balance on other chains:
      </h3>
      <div
        class="max-h-[420px] overflow-y-auto pr-2 mew-scrollbar px-3 xs:px-6 md:px-4 lg:px-10"
      >
        <div
          v-for="(i, index) in otherChains"
          :key="index"
          class="flex items-center justify-between py-3 border-b border-grey-5 last:border-0 w-full"
        >
          <div class="flex items-center grow max-w-[360px]">
            <div class="relative mr-4 shrink-0">
              <app-token-logo
                :url="tokenData.iconUrl"
                :symbol="tokenData.symbol"
                width="w-10"
                height="h-10"
              />
              <app-token-logo
                :url="getChainIcon(i.chainName)"
                :symbol="i.chainName"
                width="w-5"
                height="h-5"
                class="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4 border-2 border-white rounded-full bg-white"
              />
            </div>
            <div class="flex flex-col">
              <h4 class="text-s-16 font-bold truncate">
                {{ i.balance }}
                {{ tokenData.symbol.toUpperCase() }}
              </h4>
              <p class="text-info text-s-12 capitalize truncate">
                on {{ i.chainNameLong || i.chainName.toLowerCase() }}
              </p>
            </div>
            <div class="ml-auto sm:mr-10 text-right">
              <p class="text-info text-s-14 font-medium">${{ i.fiatValue }}</p>
            </div>
          </div>
          <app-base-button size="small" class="shrink-0 hidden sm:block">
            Bridge
          </app-base-button>
        </div>
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
import AppBaseButton from '@/components/AppBaseButton.vue'
import BigNumber from 'bignumber.js'
import { formatUnits } from 'viem'

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
  if (
    props.tokenData &&
    props.tokenData.supportedChains &&
    selectedChain.value
  ) {
    return props.tokenData.supportedChains.some(
      chain => chain.chainName === selectedChain.value?.name,
    )
  }
  return false
})

const otherChains = computed(() => {
  if (
    props.tokenData &&
    props.tokenData.supportedChains &&
    selectedChain.value
  ) {
    const chains = props.tokenData.supportedChains
      .filter(
        chain =>
          chain.chainName !== selectedChain.value?.name &&
          selectedChain.value?.type === chain.chainType,
      )
      .map(chain => {
        const balance = getBalanceForChain(chain.chainName)
        const fiatValue = getFormattedFiatValueForChain(balance)
        return {
          ...chain,
          balance,
          fiatValue,
          numericBalance:
            balance === 'N/A' ? -1 : parseFloat(balance.replace(/,/g, '')),
        }
      })
      .filter(chain => chain.numericBalance > 0)

    return chains.sort((a, b) => b.numericBalance - a.numericBalance)
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
      const _rawBalance = _okBalances.find(
        balance =>
          balance.value.owner.toLowerCase() ===
          walletAddress.value?.toLowerCase(),
      )
      if (_rawBalance && _decimals) {
        const _balance = formatUnits(BigInt(_rawBalance.value.value), _decimals)
        return formatFloatingPointValue(_balance).value
      }
    }
  }

  // Fallback to walletStore if it's the current chain
  if (_chainName === selectedChain.value?.name && isWalletConnected.value) {
    const tokenInWallet = walletStore.allTokens.find(t => {
      const matchCoinId =
        t.coinId &&
        props.tokenData?.coinId &&
        t.coinId.toLowerCase() === props.tokenData.coinId.toLowerCase()
      const matchSymbol =
        t.symbol &&
        props.tokenData?.symbol &&
        t.symbol.toLowerCase() === props.tokenData.symbol.toLowerCase()
      const matchContract =
        t.contract &&
        props.tokenData?.supportedChains?.some(
          c =>
            c.contract &&
            c.contract.toLowerCase() === t.contract.toLowerCase() &&
            c.chainName === _chainName,
        )
      return matchCoinId || matchSymbol || matchContract
    })
    if (tokenInWallet) {
      return formatFloatingPointValue(tokenInWallet.balance).value
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
