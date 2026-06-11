<template>
  <div v-if="isWalletConnected && tokenSymbol && chainBalances !== undefined">
    <!--Current Chain balance -->

    <div
      v-if="isWalletConnected && existsOnCurrentChain"
      class="flex flex-wrap items-center gap-2"
      :class="[isOpenSideMenu ? 'lg:px-6 2xl:px-10' : 'lg:px-10', 'px-4 pt-6']"
    >
      <h2
        class="basis-full sm:basis-auto font-bold text-s-20 xs:text-s-28 leading-p-150"
      >
        {{ $t('crypto.your_balance') }}
      </h2>
      <div v-if="!isLoading" class="flex mt-1 xs:items-center">
        <div class="relative">
          <app-token-logo
            :url="tokenIconUrl"
            :symbol="tokenSymbol"
            :is-stock="isStock"
            width="w-9"
            height="h-9"
          />
          <div
            class="absolute bottom-0 right-0 xs:translate-y-1/4 translate-x-1/4"
          >
            <app-token-logo
              v-if="selectedChain"
              :url="selectedChain.icon"
              :symbol="selectedChain.name"
              width="w-4"
              height="h-4"
            />
          </div>
        </div>
        <div class="flex flex-col xs:flex-row xs:items-center ml-3 xs:ml-2">
          <div class="flex items-center">
            <p class="text-s-17 xs:text-s-24 font-bold leading-p-110">
              {{ currentBalance }}
            </p>
            <app-token-symbol
              :symbol="tokenSymbol"
              :is-stock="isStock"
              class="text-s-17 xs:text-s-24 !font-bold !leading-p-110 ml-[2px]"
            />
          </div>

          <p class="xs:ml-3 font-normal text-s-14 xs:text-s-24 text-info">
            ${{ getFormattedFiatValueForChain(currentBalance) }}
          </p>
        </div>
      </div>
      <div
        v-else
        class="h-[42px] animate-pulse bg-surface rounded-xl w-[200px]"
      ></div>
    </div>
    <hr
      v-if="otherChains.length > 0"
      class="h-px bg-grey-10 border-0 w-full mt-6"
    />

    <!-- Balance on other chains -->
    <div
      v-if="otherChains.length > 0 && !isLoading"
      :class="[
        isOpenSideMenu ? 'lg:px-6 2xl:px-10' : 'lg:px-10',
        'px-4 pt-6 max-w-[600px]',
      ]"
    >
      <div class="flex items-center gap-1">
        <h3 class="text-s-17 font-bold">{{ $t('crypto.balance_on_other_chains') }}</h3>
      </div>

      <div class="max-h-[420px] overflow-y-auto pr-2 mew-scrollbar">
        <div
          v-for="(i, index) in otherChains"
          :key="index"
          class="flex items-center justify-between py-3 w-full"
        >
          <div class="flex items-center grow max-w-[360px]">
            <div class="relative mr-4 shrink-0">
              <app-token-logo
                :url="tokenIconUrl"
                :symbol="tokenSymbol"
                :is-stock="isStock"
                width="w-7 xl:w-9"
                height="h-7 xl:h-9"
              />
              <div
                class="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4"
              >
                <app-token-logo
                  :url="getChainIcon(i.chainName)"
                  :symbol="i.chainName"
                  width="w-4 xl:w-5"
                  height="h-4 xl:h-5"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <div class="flex items-center">
                <h4 class="text-s-16 font-bold truncate">
                  {{ i.balance }}
                </h4>
                <app-token-symbol
                  :symbol="tokenSymbol"
                  :is-stock="isStock"
                  class="text-s-16 !font-bold !leading-p-110 ml-[2px]"
                />
              </div>

              <p class="text-info text-s-12 capitalize truncate">
                on {{ i.chainNameLong || i.chainName.toLowerCase() }}
              </p>
            </div>
            <div class="ml-auto sm:mr-10 text-right">
              <p class="text-info text-s-14 font-medium">${{ i.fiatValue }}</p>
            </div>
          </div>
          <app-base-button
            v-if="!isStockView && canBridge(i)"
            size="small"
            class="shrink-0 hidden sm:block"
            @click="bridgeBtn(i)"
          >
            {{ $t('crypto.bridge') }}
          </app-base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
//Components
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
//types
import type { TokenSupportedChain, ChainBalance } from '@/mew_api/types'
import { useWalletStore } from '@/stores/walletStore'
//stores
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
//utils
import BigNumber from 'bignumber.js'
import {
  formatFiatValue,
  formatFloatingPointValue,
} from '@/utils/numberFormatHelper'
import { formatUnits } from 'viem'

const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
    default: true,
  },
  supportedChains: {
    type: Array as PropType<TokenSupportedChain[] | undefined>,
  },
  tokenSymbol: {
    type: String,
  },
  tokenIconUrl: {
    type: String,
  },
  isStock: {
    type: Boolean,
    required: false,
    default: false,
  },
  chainBalances: {
    type: Array as PropType<ChainBalance[] | undefined>,
    required: false,
  },
  currentPrice: {
    type: String,
    required: false,
  },
  tokenId: {
    type: String,
    required: false,
  },
  isStockView: {
    type: Boolean,
    required: false,
    default: false,
  },
})

/** --------------------
 * Stores
 --------------------*/
const walletStore = useWalletStore()
const { walletAddress, isWalletConnected } = storeToRefs(walletStore)

const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)

const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)

const canBridge = (chain: TokenSupportedChain): boolean => {
  return chainsStore.chainHasSwapSupport(chain.chainName)
}

/** --------------------
 * Balances
 --------------------*/

const existsOnCurrentChain = computed(() => {
  if (props.supportedChains && selectedChain.value) {
    return props.supportedChains.some(
      chain => chain.chainName === selectedChain.value?.name,
    )
  }
  return false
})

const otherChains = computed(() => {
  if (props.supportedChains && selectedChain.value) {
    const chains = props.supportedChains
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
  if (props.chainBalances && props.chainBalances.length > 0) {
    const chainData = props.chainBalances.find(
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
        props.tokenId &&
        t.coinId.toLowerCase() === props.tokenId.toLowerCase()
      const matchSymbol =
        t.symbol &&
        props.tokenSymbol &&
        t.symbol.toLowerCase() === props.tokenSymbol.toLowerCase()
      const matchContract =
        t.contract &&
        props.supportedChains?.some(
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

const getFormattedFiatValueForChain = (balance: string) => {
  if (balance === 'N/A' || !props.currentPrice) return 'N/A'
  const price = new BigNumber(props.currentPrice)
  const fiat = new BigNumber(balance).multipliedBy(price)
  return formatFiatValue(fiat).value
}
const getChainIcon = (chainName: string): string | undefined => {
  return chainsStore.getChainIcon(chainName)
}

const emit = defineEmits<{
  bridgeToChain: [chain: TokenSupportedChain]
}>()
const bridgeBtn = (chain: TokenSupportedChain) => {
  emit('bridgeToChain', chain)
}
</script>
