<template>
  <div class="relative px-2 rounded-16 bg-white">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-1">
        <p class="text-info uppercase text-s-9 font-bold">
          {{ $t('notifications_module.bridge') }}
        </p>
        <div
          v-if="!seen"
          class="rounded-full bg-primary w-[9px] h-[9px] flex-shrink-0"
        ></div>
      </div>
      <div
        :class="bridgeStatus.color"
        class="ml-2 px-[10px] py-[3px] rounded-full text-white uppercase text-s-9 tracking-sp-06 font-semibold"
      >
        <div
          v-if="bridgeStatus.key === 'pending'"
          class="bg-white w-[6px] h-[6px] rounded-full inline-flex animate-pulse"
        ></div>
        {{ $t(bridgeStatus.labelKey) }}
      </div>
    </div>

    <!-- From / To with Chain info -->
    <div class="flex items-center gap-3 justify-start mt-4 mb-4">
      <!-- From -->
      <div class="flex items-center gap-3">
        <div class="relative">
          <app-token-logo
            :url="bridge.fromTokenIcon"
            :symbol="bridge.fromSymbol"
            :address="{
              address: bridge.fromTokenAddress,
              network: bridge.fromChainName,
            }"
          />
          <div class="absolute -bottom-1 -right-1">
            <app-token-logo
              v-if="bridge.fromChainIcon"
              :url="bridge.fromChainIcon"
              :symbol="bridge.fromChainName"
              width="w-4"
              height="h-4"
            />
          </div>
        </div>
        <div>
          <p class="text-s-8 text-info uppercase tracking-sp-06 font-bold">
            {{ bridge.fromChainName }}
          </p>
          <p class="font-bold text-s-14">
            {{ formatFloatingPointValue(bridge.fromAmount).value }}
            <app-token-symbol
              :symbol="bridge.fromSymbol"
              :address="{
                address: bridge.fromTokenAddress,
                network: bridge.fromChainName,
              }"
              class="inline-flex !text-s-14 !font-bold"
            />
          </p>
          <p v-if="bridge.fromUsdValue" class="text-s-12 text-info">
            ${{ bridge.fromUsdValue }}
          </p>
        </div>
      </div>
      <arrow-long-right-icon class="w-4 h-4 flex-shrink-0" />
      <!-- To -->
      <div class="flex items-center gap-3">
        <div class="relative">
          <app-token-logo
            :url="bridge.toTokenIcon"
            :symbol="bridge.toSymbol"
            :address="{
              address: bridge.toTokenAddress,
              network: bridge.toChainName,
            }"
          />
          <div class="absolute -bottom-1 -right-1">
            <app-token-logo
              v-if="bridge.toChainIcon"
              :url="bridge.toChainIcon"
              :symbol="bridge.toChainName"
              width="w-4"
              height="h-4"
            />
          </div>
        </div>
        <div>
          <p class="text-s-8 text-info uppercase tracking-sp-06 font-bold">
            {{ bridge.toChainName }}
          </p>
          <p class="font-bold text-s-14">
            {{ formatFloatingPointValue(bridge.toAmount).value }}
            <app-token-symbol
              :symbol="bridge.toSymbol"
              :address="{
                address: bridge.toTokenAddress,
                network: bridge.toChainName,
              }"
              class="inline-flex !text-s-14 !font-bold"
            />
          </p>
          <p v-if="bridge.toUsdValue" class="text-s-12 text-info">
            ${{ bridge.toUsdValue }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex justify-space-between items-center">
      <app-btn-text
        @click="showMoreDetails = !showMoreDetails"
        class="text-s-12 flex items-center -ml-2"
      >
        {{ $t('common.more_details') }}
        <chevron-down-icon
          :class="[
            'transition-transform w-3 h-3 ml-2',
            { 'rotate-180': showMoreDetails },
          ]"
        />
      </app-btn-text>
      <!-- delete Button -->
      <app-btn-icon
        :label="$t('common.delete_notification')"
        @click="$emit('remove', bridge.hash)"
        class="ml-auto -mr-2"
      >
        <trash-icon class="w-4 h-4" />
      </app-btn-icon>
    </div>

    <expand-transition>
      <div v-show="showMoreDetails" class="px-1">
        <!-- Created at -->
        <div class="flex items-center justify-between pt-2">
          <span
            class="text-s-9 text-info uppercase font-semibold tracking-sp-06"
            >{{ $t('common.created_at') }}</span
          >
          <p class="text-s-12">
            {{ formatNotificationDate(bridge.createdAt) }}
          </p>
        </div>

        <!-- Source Transaction -->
        <div class="flex items-center justify-between mt-3">
          <span
            class="text-s-9 text-info uppercase font-semibold tracking-sp-06"
          >
            {{ $t('common.tx_hash') }}</span
          >
          <a
            :href="bridge.blockExplorerUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="font-mono hover:underline flex items-center gap-1 text-s-12"
          >
            {{ truncateHash(bridge.hash) }}
            <arrow-up-right-icon class="w-2 h-2" />
          </a>
        </div>

        <!-- Network Fee -->
        <div
          v-if="bridge.networkFee"
          class="flex items-start justify-between mt-3"
        >
          <span
            class="text-s-9 text-info uppercase font-semibold tracking-sp-06"
            >{{ $t('common.network_fee') }}</span
          >
          <div class="text-right">
            <p class="text-s-13 text-black">
              {{ bridge.networkFee }} {{ bridge.fromChainSymbol }}
            </p>
            <p v-if="bridge.networkFeeUSD" class="text-s-12 text-info ml-1">
              ${{ formatFiatValue(bridge.networkFeeUSD).value }}
            </p>
          </div>
        </div>

        <!-- Destination Address -->
        <div class="flex items-center justify-between mt-3">
          <span
            class="text-s-9 text-info uppercase font-semibold tracking-sp-06"
            >{{ $t('notifications_module.destination_address') }}</span
          >
          <a
            v-if="bridge.destinationBlockExplorerAddressUrl"
            :href="bridge.destinationBlockExplorerAddressUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="font-mono hover:underline flex items-center gap-1 text-s-12"
          >
            <app-blockie
              :address="bridge.toAddress"
              :size="6"
              class="rounded-full inline-block align-middle mr-1"
            />
            {{ truncateHash(bridge.toAddress) }}
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
import type { BridgeNotification } from '@/stores/tradeOrdersStore'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import ExpandTransition from '@/components/transitions/ExpandTransition.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import AppBlockie from '@/components/AppBlockie.vue'
import {
  formatFiatValue,
  formatFloatingPointValue,
} from '@/utils/numberFormatHelper'
import { formatNotificationDate } from '@/utils/dateFormatHelper'

// Props
const props = defineProps<{
  bridge: BridgeNotification
  seen?: boolean
}>()

// Emits
defineEmits<{
  remove: [hash: string]
}>()

const showMoreDetails = ref(false)

// Truncate hash
const truncateHash = (hash: string): string => {
  if (!hash) return ''
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

const bridgeStatus = computed(() => {
  const status = props.bridge.status.toLowerCase()
  const now = Math.floor(Date.now() / 1000)
  const hoursAgo48 = 48 * 60 * 60
  const isOlderThan48Hours = now - props.bridge.createdAt > hoursAgo48

  if (status === 'sent') {
    if (isOlderThan48Hours) {
      return {
        key: 'possibly_dropped',
        labelKey: 'notifications_module.status.possibly_dropped',
        color: 'bg-surface',
      }
    }
    return {
      key: 'pending',
      labelKey: 'notifications_module.status.pending',
      color: 'bg-primary',
    }
  } else if (status === 'failed') {
    return {
      key: 'failed',
      labelKey: 'notifications_module.status.failed',
      color: 'bg-error',
    }
  } else {
    return {
      key: 'successful',
      labelKey: 'notifications_module.status.successful',
      color: 'bg-success',
    }
  }
})
</script>
