<template>
  <app-dialog v-model:is-open="model" class="sm:max-w-[420px] sm:mx-auto">
    <template #content>
      <div class="px-6 pb-8 pt-4">
        <div class="flex flex-col items-center pt-8 mb-10 text-center">
          <div
            class="w-16 h-16 bg-[#e6f6f4] rounded-full flex items-center justify-center mb-6"
          >
            <img
              :src="swapInitiatedIcon"
              alt="Swap Initiated Icon"
              class="w-8 h-8"
            />
          </div>
          <h3 class="text-s-24 font-bold mb-3 text-p-120">
            {{ title }}
          </h3>
          <p class="text-s-16 text-info px-4 leading-p-160">
            {{ completedNote }}
            <app-blockie
              v-if="isBridge"
              :address="props.toAddress"
              :size="5"
              class="inline-block mx-2 align-middle"
            />
            <a
              v-if="isBridge && toChain?.blockExplorerAddr"
              :href="`${toChain.blockExplorerAddr}${props.toAddress}`"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:underline cursor-pointer font-mono text-black text-s-14 pr-1"
            >
              {{ truncateHash(props.toAddress) }}
              <arrow-up-right-icon
                class="w-3 h-3 inline-block align-middle text-black"
            /></a>
            <span
              v-if="isBridge && !toChain?.blockExplorerAddr"
              class="font-mono text-s-14"
            >
              {{ truncateHash(props.toAddress) }}
            </span>

            on {{ toTokenChain }}
          </p>
        </div>

        <div class="flex flex-col gap-0 px-4">
          <!-- From Row -->
          <div class="flex items-center gap-4">
            <div class="relative">
              <app-token-logo
                :url="fromTokenIcon"
                :symbol="fromTokenSymbol"
                width="w-12"
                height="h-12"
              />
              <div class="absolute -bottom-1 -right-1">
                <app-token-logo
                  :url="fromTokenChainImg"
                  :symbol="fromTokenChain"
                  width="w-5"
                  height="h-5"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <p
                v-if="isBridge"
                class="text-s-9 font-bold tracking-sp-06 uppercase text-info"
              >
                from {{ fromTokenChain }}
              </p>
              <p class="text-s-20 font-bold leading-tight">
                {{ formatFloatingPointValue(fromTokenAmount).value }}
                {{ fromTokenSymbol }}
              </p>
              <p class="text-info text-s-14">${{ fromTokenAmountFiat }}</p>
            </div>
          </div>

          <!-- Divider Arrow -->
          <div class="flex justify-start ml-[22px] my-1">
            <arrow-down-icon class="w-4 h-4 text-grey-40" />
          </div>

          <!-- To Row -->
          <div class="flex items-center gap-4">
            <div class="relative">
              <app-token-logo
                :url="toTokenIcon"
                :symbol="toTokenSymbol"
                width="w-12"
                height="h-12"
              />
              <div class="absolute -bottom-1 -right-1">
                <app-token-logo
                  :url="toTokenChainImg"
                  :symbol="toTokenChain"
                  width="w-5"
                  height="h-5"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <p
                v-if="isBridge"
                class="text-s-9 font-bold tracking-sp-06 uppercase text-info"
              >
                to {{ toTokenChain }}
              </p>
              <p class="text-s-20 font-bold leading-tight">
                {{ formatFloatingPointValue(toTokenAmount).value }}
                {{ toTokenSymbol }}
              </p>
              <p class="text-info text-s-14">${{ toTokenAmountFiat }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row mt-10 gap-3">
          <app-base-button
            class="flex-1 order-2 sm:order-1"
            @click="openProgress"
          >
            {{ t('swap.initiated.view-progress') }}
          </app-base-button>
          <app-base-button
            class="flex-1 order-1 sm:order-2"
            :is-outline="true"
            @click="close"
          >
            {{ t('common.close') }}
          </app-base-button>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import AppBlockie from '@/components/AppBlockie.vue'
import swapInitiatedIcon from '@/assets/icons/swap-initiated-icon.svg'
import ethSvg from '@/assets/icons/tokens/eth.svg'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import { ArrowUpRightIcon } from '@heroicons/vue/24/solid'
import { ArrowDownIcon } from '@heroicons/vue/24/solid'
import { type Chain } from '@/mew_api/types'
import { type ProviderQuoteResponse } from '@enkryptcom/swap'
import { type HexPrefixedString } from '@/providers/types'
import { formatUnits } from 'viem'
import { useI18n } from 'vue-i18n'
import {
  useTradeOrdersStore,
  type NotificationBaseSwapBridge,
} from '@/stores/tradeOrdersStore'
import BigNumber from 'bignumber.js'
import {
  formatFiatValue,
  formatFloatingPointValue,
} from '@/utils/numberFormatHelper'

const { t } = useI18n()
const tradeOrdersStore = useTradeOrdersStore()

const props = defineProps<{
  fromChain: Chain | undefined
  toChain: Chain | undefined
  selectedQuote: ProviderQuoteResponse | undefined
  txHash: HexPrefixedString
  toAddress: string
  fromAddress: string
}>()

const model = defineModel<boolean>('swapInitiatedOpen', {
  default: false,
  required: true,
})

const close = () => {
  model.value = false
}

const toTokenSymbol = computed(() => {
  return props.selectedQuote?.quote.options.toToken.symbol || 'Unknown Token'
})

const toTokenAmount = computed(() => {
  return formatUnits(
    BigInt(props.selectedQuote?.toTokenAmount.toString() || '0'),
    props.selectedQuote?.quote.options.toToken.decimals ?? 18,
  )
})

const toTokenAmountFiat = computed(() => {
  const price = props.selectedQuote?.quote.options.toToken.price ?? 0
  return formatFiatValue(
    BigNumber(toTokenAmount.value).multipliedBy(price).toFixed(6),
  ).value
})

const toTokenIcon = computed(() => {
  return props.selectedQuote?.quote.options.toToken.logoURI || ethSvg // Fallback to ETH icon if no token icon is available
})

const toTokenChain = computed(() => {
  return props.toChain?.nameLong || 'Unknown Chain'
})

const toTokenChainImg = computed(() => {
  return props.toChain?.icon || ethSvg // Fallback to ETH icon if no chain icon is available
})

const fromTokenSymbol = computed(() => {
  return props.selectedQuote?.quote.options.fromToken.symbol || 'Unknown Token'
})
const fromTokenAmount = computed(() => {
  return formatUnits(
    BigInt(props.selectedQuote?.fromTokenAmount.toString() || '0'),
    props.selectedQuote?.quote.options.fromToken.decimals ?? 18,
  )
})
const fromTokenAmountFiat = computed(() => {
  const price = props.selectedQuote?.quote.options.fromToken.price ?? 0
  return formatFiatValue(
    BigNumber(fromTokenAmount.value).multipliedBy(price).toFixed(6),
  ).value
})

const fromTokenChain = computed(() => {
  return props.fromChain?.name || 'Unknown Chain'
})
const fromTokenIcon = computed(() => {
  return props.selectedQuote?.quote.options.fromToken.logoURI || ethSvg // Fallback to ETH icon if no token icon is available
})

const fromTokenChainImg = computed(() => {
  return props.fromChain?.icon || ethSvg // Fallback to ETH icon if no chain icon is available
})

const openProgress = () => {
  // Logic to view progress can be added here
  window.open(
    `${props.fromChain?.blockExplorerTX.replace('[[txHash]]', props.txHash)}`,
    '_blank',
  )
  close()
}

const isBridge = computed(() => {
  const fromChainId = props.fromChain?.chainID
  const toChainId = props.toChain?.chainID
  return (
    fromChainId !== undefined &&
    toChainId !== undefined &&
    fromChainId !== toChainId
  )
})

const title = computed(() => {
  return isBridge.value
    ? t('swap.initiated.bridge-initiated')
    : t('swap.initiated.swap-initiated')
})

const completedNote = computed(() => {
  const symbol = toTokenSymbol.value || 'the token'
  return isBridge.value
    ? t('swap.initiated.bridge-completed-note', { symbol })
    : t('swap.initiated.swap-completed-note', { symbol })
})

// Truncate hash
const truncateHash = (hash: string): string => {
  if (!hash) return ''
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

watch(
  () => model.value,
  (newValue: boolean) => {
    if (newValue && props.selectedQuote) {
      // Add swap or bridge notification based on cross-chain status
      const fromChain = props.fromChain
      const toChain = props.toChain
      const isBridge = fromChain?.chainID !== toChain?.chainID

      if (fromChain && toChain) {
        const createdAt = Math.floor(Date.now() / 1000)
        const hashLink = `${fromChain.blockExplorerTX.replace('[[txHash]]', props.txHash)}`
        const addressLink = `${toChain.blockExplorerAddr.replace('[[address]]', props.toAddress)}`
        const shared: NotificationBaseSwapBridge = {
          status: 'sent',
          hash: props.txHash,
          fromAddress: props.fromAddress,
          toAddress: props.toAddress,
          fromAmount: fromTokenAmount.value,
          fromUsdValue: fromTokenAmountFiat.value,
          fromSymbol: fromTokenSymbol.value,
          fromTokenIcon: fromTokenIcon.value,
          toAmount: toTokenAmount.value,
          toUsdValue: toTokenAmountFiat.value,
          toSymbol: toTokenSymbol.value,
          toTokenIcon: toTokenIcon.value,
          blockExplorerUrl: hashLink,
          fromChainId: fromChain.chainID || '',
          fromChainName: fromChain.nameLong,
          fromChainIcon: fromChain.icon,
          fromChainSymbol: fromChain.currencyName,
          createdAt,
        }
        if (isBridge) {
          // Add bridge notification (cross-chain)
          tradeOrdersStore.addBridge({
            ...shared,
            type: 'bridge',
            toChainId: toChain.chainID || '',
            toChainName: toChain.nameLong,
            toChainIcon: toChain.icon,
            toChainSymbol: toChain.currencyName,
            destinationBlockExplorerAddressUrl: addressLink,
          })
        } else {
          // Add swap notification (same chain)
          tradeOrdersStore.addSwap({
            ...shared,
            type: 'swap',
          })
        }
      }
    }
  },
)
</script>
