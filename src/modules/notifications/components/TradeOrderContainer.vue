<template>
  <div class="relative px-2 rounded-16 bg-white">
    <div class="flex items-center justify-between gap-2">
      <div class="basis-1/4">
        <p class="text-info uppercase text-s-9 tracking-sp-06 font-bold">
          trade order
        </p>
      </div>
      <span
        v-if="order.status === 'pending'"
        class="text-s-12 font-mono text-primary ml-auto"
      >
        {{ formatCountdown(remainingTime) }}
      </span>
      <div
        :class="statusBadgeClass"
        class="ml-2 px-[10px] py-[3px] rounded-full text-white uppercase text-s-9 tracking-sp-06 font-semibold"
      >
        <div
          v-if="order.status === 'pending'"
          class="bg-white w-[6px] h-[6px] rounded-full inline-flex animate-pulse"
        ></div>
        {{ order.status }}
      </div>
    </div>

    <!-- From / To -->
    <div class="flex items-center gap-3 justify-start mt-3 mb-4">
      <div class="flex items-center gap-2">
        <app-token-logo
          v-if="order.fromTokenIcon"
          :url="order.fromTokenIcon"
          :symbol="order.fromSymbol"
          :address="
            order.fromTokenAddress
              ? { address: order.fromTokenAddress, network: order.chainName }
              : undefined
          "
        />
        <div>
          <p class="font-bold text-s-14">
            {{ formatFloatingPointValue(order.fromAmount).value }}
            <app-token-symbol
              :symbol="order.fromSymbol"
              :address="
                order.fromTokenAddress
                  ? {
                      address: order.fromTokenAddress,
                      network: order.chainName,
                    }
                  : undefined
              "
              class="inline-flex !text-s-14 !font-bold"
            />
          </p>
        </div>
      </div>
      <arrow-long-right-icon class="w-4 h-4 flex-shrink-0" />
      <div class="flex items-center gap-2">
        <app-token-logo
          v-if="order.toTokenIcon"
          :url="order.toTokenIcon"
          :symbol="order.toSymbol"
          :address="
            order.toTokenAddress
              ? { address: order.toTokenAddress, network: order.chainName }
              : undefined
          "
        />
        <div>
          <p
            v-if="order.status === 'filled' && order.finalToAmount"
            class="flex flex-col"
          >
            <span class="text-s-12 text-info">
              <span class="uppercase text-s-9 mr-1 opacity-80">est:</span>
              <span class="opacity-70"
                >{{ formatFloatingPointValue(order.expectedToAmount).value }}
                <app-token-symbol
                  :symbol="order.toSymbol"
                  :address="
                    order.toTokenAddress
                      ? {
                          address: order.toTokenAddress,
                          network: order.chainName,
                        }
                      : undefined
                  "
                  :has-gradient="false"
                  class="inline-flex !text-s-12 opacity-70"
              /></span>
            </span>
            <span class="font-bold text-s-14 text-success"
              >{{ formatFloatingPointValue(order.finalToAmount).value }}
              <app-token-symbol
                :symbol="order.toSymbol"
                :address="
                  order.toTokenAddress
                    ? {
                        address: order.toTokenAddress,
                        network: order.chainName,
                      }
                    : undefined
                "
                :has-gradient="false"
                class="inline-flex !text-s-14 !font-bold text-success"
            /></span>
          </p>
          <p v-else class="font-bold text-s-14">
            ~
            {{ formatFloatingPointValue(order.expectedToAmount).value }}
            <app-token-symbol
              :symbol="order.toSymbol"
              :address="
                order.toTokenAddress
                  ? { address: order.toTokenAddress, network: order.chainName }
                  : undefined
              "
              class="inline-flex !text-s-14 !font-bold"
            />
          </p>
          <p v-if="order.usdValue" class="text-s-12 text-info">
            ${{ order.usdValue }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex justify-space-between items-center">
      <app-btn-text
        @click="showMoreDetails = !showMoreDetails"
        class="text-s-12 flex items-center -ml-2"
      >
        More details
        <chevron-down-icon
          :class="[
            'transition-transform w-3 h-3 ml-2',
            { 'rotate-180': showMoreDetails },
          ]"
        />
      </app-btn-text>
      <!-- delete Button -->
      <app-btn-icon
        label="delete notification"
        @click="$emit('remove', order.hash)"
        class="ml-auto -mr-2"
      >
        <trash-icon class="w-4 h-4" />
      </app-btn-icon>
    </div>

    <expand-transition>
      <div v-show="showMoreDetails" class="px-1">
        <!-- Percentage Diff (for filled orders) -->
        <div
          v-if="order.status === 'filled' && order.percentageDiff"
          class="flex items-center justify-between pt-2"
        >
          <span
            class="text-s-9 text-info uppercase font-semibold tracking-sp-06"
            >Price difference</span
          >
          <span
            :class="[
              'text-s-13',
              order.percentageDiff > 0 ? 'text-success' : 'text-error',
            ]"
          >
            {{ order.percentageDiff > 0 ? '+' : ''
            }}{{ order.percentageDiff.toFixed(2) }}%
          </span>
        </div>

        <!-- Created at -->
        <div class="flex items-center justify-between mt-3">
          <span
            class="text-s-9 text-info uppercase font-semibold tracking-sp-06"
            >Created at</span
          >
          <p class="text-s-12">
            {{ formatTime(order.createdAt) }}
          </p>
        </div>

        <!-- Order Hash -->
        <div class="flex items-center justify-between mt-3">
          <span
            class="text-s-9 text-info uppercase font-semibold tracking-sp-06"
            >Order hash</span
          >
          <span class="font-mono text-s-12">
            {{ truncateHash(order.hash) }}
          </span>
        </div>

        <!-- Filled Transaction -->
        <div
          v-if="order.status === 'filled' && order.fills.length > 0"
          class="flex items-center justify-between mt-3"
        >
          <span
            class="text-s-9 text-info uppercase font-semibold tracking-sp-06"
            >Filled in tx</span
          >
          <a
            :href="explorerLink"
            target="_blank"
            rel="noopener noreferrer"
            class="font-mono hover:underline flex items-center gap-1 text-s-12"
          >
            {{ truncateHash(order.fills[0].txHash) }}
            <arrow-up-right-icon class="w-2 h-2" />
          </a>
        </div>
      </div>
    </expand-transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ArrowLongRightIcon,
  ArrowUpRightIcon,
  ChevronDownIcon,
  TrashIcon,
} from '@heroicons/vue/24/solid'
import { SUPPORTED_CHAINS } from '@/modules/trade/providers/oneinch_fusion/configs'
import type { SavedTradeOrder } from '@/stores/tradeOrdersStore'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import ExpandTransition from '@/components/transitions/ExpandTransition.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'

// Props
const props = defineProps<{
  order: SavedTradeOrder
  remainingTime: number
}>()

// Emits
defineEmits<{
  remove: [hash: string]
}>()

const showMoreDetails = ref(false)

// Computed classes
const statusBadgeClass = computed(() => {
  switch (props.order.status.toLowerCase()) {
    case 'filled':
      return 'bg-success'
    case 'pending':
      return 'bg-primary'
    case 'cancelled':
    case 'expired':
      return 'bg-error'
    default:
      return 'bg-grey-30'
  }
})

const explorerLink = computed(() => {
  if (props.order.fills.length === 0) return ''
  const chainConfig = SUPPORTED_CHAINS.find(
    c => c.chainId === props.order.chainId,
  )
  const blockExplorer = chainConfig?.chain.blockExplorers?.default?.url || ''
  return `${blockExplorer}/tx/${props.order.fills[0].txHash}`
})

// Format countdown time
const formatCountdown = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Format time
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Truncate hash
const truncateHash = (hash: string): string => {
  if (!hash) return ''
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}
</script>
