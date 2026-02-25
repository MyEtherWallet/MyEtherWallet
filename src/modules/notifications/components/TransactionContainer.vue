<template>
  <div class="relative px-1 rounded-16 bg-white">
    <div class="flex items-center justify-between gap-2">
      <div>
        <p class="text-info uppercase text-s-9 tracking-sp-06 font-bold">
          transaction
        </p>
      </div>
      <div
        :class="txStatus.color"
        class="ml-2 px-[10px] py-[3px] rounded-full text-white uppercase text-s-9 tracking-sp-06 font-semibold"
      >
        <div
          v-if="txStatus.label === 'Pending'"
          class="bg-white w-[6px] h-[6px] rounded-full inline-flex animate-pulse"
        ></div>
        {{ txStatus.label }}
      </div>
    </div>

    <!-- Amount and Recipient -->
    <div class="flex items-center gap-2 justify-between mt-3 mb-4">
      <div class="flex items-center gap-2">
        <app-token-logo
          :url="transaction.tokenIcon"
          :symbol="transaction.symbol"
        />
        <div>
          <p class="font-bold text-s-14">
            {{ formatFloatingPointValue(transaction.amount).value }}
            {{ transaction.symbol }}
          </p>
          <p v-if="transaction.usdValue" class="text-s-12 text-info">
            ${{ formatFiatValue(transaction.usdValue).value }}
          </p>
        </div>
      </div>
      <arrow-long-right-icon class="w-4 h-4 flex-shrink-0" />
      <div class="flex gap-2 text-right">
        <app-blockie
          :address="transaction.toAddress"
          :size="isXsAndUp ? 6 : 8"
        />
        <a
          :href="transaction.blockExplorerAddrUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-s-12 hover:underline flex items-center justify-end gap-1"
        >
          {{ truncateHash(transaction.toAddress) }}
          <arrow-up-right-icon class="w-2 h-2" />
        </a>
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
            'transition-transform w-3 h-3  ml-2',
            { 'rotate-180': showMoreDetails },
          ]"
        />
      </app-btn-text>
      <!-- delete Button -->
      <app-btn-icon
        label="delete notification"
        @click="$emit('remove', transaction.hash)"
        class="ml-auto -mr-2"
      >
        <trash-icon class="w-4 h-4" />
      </app-btn-icon>
    </div>

    <expand-transition>
      <div v-show="showMoreDetails" class="px-1">
        <!-- Chain -->
        <div class="flex items-center justify-between pt-2">
          <span
            class="text-s-9 text-info uppercase font-semibold tracking-sp-06"
            >Chain</span
          >
          <div class="flex items-center gap-1">
            <app-token-logo
              :url="transaction.chainIcon"
              :symbol="transaction.chainName"
              width="w-5"
              height="h-5"
            />
            <span class="text-s-13">{{ transaction.chainName }}</span>
          </div>
        </div>
        <!-- Created at -->
        <div class="flex items-center justify-between mt-3">
          <span
            class="text-s-9 text-info uppercase font-semibold tracking-sp-06"
            >Created at</span
          >
          <p class="text-s-12">
            {{ formatTime(transaction.createdAt) }}
          </p>
        </div>
        <!-- Transaction -->
        <div class="flex items-center justify-between mt-3">
          <span
            class="text-s-9 text-info uppercase font-semibold tracking-sp-06"
            >Tx hash</span
          >
          <a
            :href="transaction.blockExplorerUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="font-mono hover:underline flex items-center gap-1 text-s-12"
          >
            {{ truncateHash(transaction.hash) }}
            <arrow-up-right-icon class="w-2 h-2" />
          </a>
        </div>

        <!-- Network Fee -->
        <div
          v-if="transaction.networkFee"
          class="flex items-start justify-between mt-3"
        >
          <span
            class="text-s-9 text-info uppercase font-semibold tracking-sp-06"
            >Network Fee</span
          >
          <div class="text-right">
            <p class="text-s-13 text-black">
              {{ transaction.networkFee }} {{ transaction.chainSymbol }}
            </p>
            <p
              v-if="transaction.networkFeeUSD"
              class="text-s-12 text-info ml-1"
            >
              ${{ formatFiatValue(transaction.networkFeeUSD).value }}
            </p>
          </div>
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
import type { TransactionNotification } from '@/stores/tradeOrdersStore'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppBlockie from '@/components/AppBlockie.vue'
import ExpandTransition from '@/components/transitions/ExpandTransition.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import {
  formatFiatValue,
  formatFloatingPointValue,
} from '@/utils/numberFormatHelper'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
// Props
const props = defineProps<{
  transaction: TransactionNotification
}>()

// Emits
defineEmits<{
  remove: [hash: string]
}>()

const { isXsAndUp } = useAppBreakpoints()

const showMoreDetails = ref(false)
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

const txStatus = computed(() => {
  const status = props.transaction.status.toLowerCase()
  const now = Math.floor(Date.now() / 1000)
  const hoursAgo48 = 48 * 60 * 60
  const isOlderThan48Hours = now - props.transaction.createdAt > hoursAgo48

  if (status === 'sent') {
    if (isOlderThan48Hours) {
      return { label: 'Possibly Dropped', color: 'bg-surface' }
    }
    return { label: 'Pending', color: 'bg-primary' }
  } else if (status === 'failed') {
    return { label: 'Failed', color: 'bg-error' }
  } else {
    return { label: 'Successful', color: 'bg-success' }
  }
})
</script>
