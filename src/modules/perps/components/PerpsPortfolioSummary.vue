<template>
  <app-sheet :is-elivated="false" sheet-class="!p-4 sm:!p-6 lg:!w-[300px]">
    <div class="flex flex-col sm:flex-row lg:flex-col sm:justify-between">
      <div>
        <p class="text-info font-bold tracking-sp-06 uppercase text-s-12">
          Perpetuals account balance
        </p>
        <p class="font-bold text-s-32 lg:text-s-40 mt-1">
          {{ walletBalance }}
        </p>
        <p
          class="text-info font-bold tracking-sp-06 uppercase text-s-11 mt-2 mb-2"
        >
          Realized PnL
        </p>
        <p class="text-s-16 leading-none" :class="pnlColorClass">
          {{ formattedRealizedPnl }}
          <span class="text-s-13 ml-2 leading-[16px]">({{ pnlPercent }})</span>
        </p>
        <div
          v-if="!isOnEthereum"
          class="flex items-center gap-3 justify-start mt-5 -mx-1"
        >
          <AppBaseButton
            @click="onSwitchToEthereum"
            class="w-full"
            size="medium"
          >
            Switch to Ethereum
          </AppBaseButton>
        </div>
        <div
          v-else-if="!watchOnly"
          class="flex items-center gap-3 justify-start mt-5 -mx-1"
        >
          <AppBaseButton @click="$emit('deposit')" class="w-full" size="medium">
            Deposit
          </AppBaseButton>
          <AppBaseButton
            is-outline
            @click="$emit('withdraw')"
            class="w-full"
            size="medium"
          >
            Withdraw
          </AppBaseButton>
        </div>
        <div v-else class="flex items-center gap-3 justify-start mt-5 -mx-1">
          <AppBaseButton @click="onConnectWallet" class="w-full" size="medium">
            Connect your wallet
          </AppBaseButton>
        </div>
      </div>
      <hr class="my-5 border-t-1 border-grey-5 sm:hidden lg:flex" />
      <div class="flex flex-col gap-4 w-full max-w-[300px] lg:max-w-none">
        <div class="flex items-center justify-between gap-4 w-full">
          <p class="text-info font-bold tracking-sp-06 uppercase text-s-11">
            Total Cross-Margin
          </p>
          <p class="ml-2 font-medium">{{ marginBalance }}</p>
        </div>
        <div class="flex items-center justify-between gap-4 w-full">
          <p class="text-info font-bold tracking-sp-06 uppercase text-s-11">
            Available Margin
          </p>
          <p class="ml-2 font-medium">{{ availableMargin }}</p>
        </div>
        <div class="flex items-center justify-between gap-4 w-full">
          <p class="text-info font-bold tracking-sp-06 uppercase text-s-11">
            Used Margin
          </p>
          <p class="ml-2 font-medium">{{ usedMargin }}</p>
        </div>
        <div class="flex items-center justify-between gap-4 w-full">
          <p class="text-info font-bold tracking-sp-06 uppercase text-s-11">
            Margin Ratio
          </p>
          <p :class="marginRatioColorClass" class="ml-2 font-medium">
            {{ marginRatio }}
          </p>
        </div>
        <div class="flex items-start justify-between gap-4 w-full">
          <p class="text-info font-bold tracking-sp-06 uppercase text-s-11">
            Unrealized PnL
          </p>
          <div class="flex justify-end flex-col items-start">
            <p :class="uPnlColorClass" class="font-medium text-right">
              {{ formattedUPnl }}
            </p>
            <p
              :class="uPnlColorClass"
              class="text-s-13 leading-[16px] text-right ml-auto"
            >
              {{ uPnlPercent }}
            </p>
          </div>
        </div>
        <app-btn-text
          class="mt-1 text-s-13 text-primary mr-auto -ml-3"
          @click="showBalanceDialog = true"
        >
          View More
        </app-btn-text>
      </div>
    </div>
  </app-sheet>
  <perps-balance-details-dialog
    :visible="showBalanceDialog"
    @close="showBalanceDialog = false"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import AppSheet from '@/components/AppSheet.vue'
import PerpsBalanceDetailsDialog from './PerpsBalanceDetailsDialog.vue'
import { usePerpsBalance } from '../composables/usePerpsAuth'
import {
  pnlColor,
  marginRatioColor,
  formatPnlPercent,
  formatPnl,
} from '../utils/formatters'
import { formatFiatValue } from '@/utils/numberFormatHelper'
import { useGlobalStore } from '@/stores/globalStore'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import { analytics, ConnectWalletEvent, PerpsEventSource } from '@/analytics'

defineProps({
  watchOnly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  deposit: []
  withdraw: []
  access: []
}>()

const onConnectWallet = () => {
  analytics.trackConnectWalletEvent(ConnectWalletEvent.CLICKED, {
    source: PerpsEventSource.PORTFOLIO,
  })
  emit('access')
}

const globalStore = useGlobalStore()
const { selectedNetwork } = storeToRefs(globalStore)
const toastStore = useToastStore()

const isOnEthereum = computed(() => selectedNetwork.value === 'ETHEREUM')

const onSwitchToEthereum = () => {
  globalStore.setSelectedNetwork('ETHEREUM')
  toastStore.addToastMessage({
    text: 'Switched to Ethereum',
    textSecondary: 'Perpetuals are only available on Ethereum.',
    type: ToastType.Info,
  })
}

const showBalanceDialog = ref(false)

const { balance } = usePerpsBalance()
const marginBalance = computed(
  () => `$${formatFiatValue(balance.value?.marginBalance ?? '0').value}`,
)
const realizedPnl = computed(() => balance.value?.realizedPnl ?? '0')
const formattedRealizedPnl = computed(() =>
  formatPnl(balance.value?.realizedPnl ?? '0'),
)
const walletBalance = computed(
  () => `$${formatFiatValue(balance.value?.walletBalance ?? '0').value}`,
)
const availableMargin = computed(
  () =>
    `$${formatFiatValue(parseFloat(balance.value?.availableMargin ?? '0')).value}`,
)
const usedMargin = computed(
  () =>
    `$${formatFiatValue(parseFloat(balance.value?.usedMargin ?? '0')).value}`,
)
const marginRatio = computed(() => balance.value?.marginRatio ?? '0')

const pnlPercent = computed(() =>
  formatPnlPercent(realizedPnl.value, balance.value?.walletBalance),
)

const pnlColorClass = computed(() => pnlColor(realizedPnl.value))

const uPnlColorClass = computed(() =>
  pnlColor(balance.value?.unrealizedPnl ?? '0'),
)
const formattedUPnl = computed(() =>
  formatPnl(balance.value?.unrealizedPnl ?? '0'),
)
const uPnlPercent = computed(() =>
  formatPnlPercent(
    balance.value?.unrealizedPnl ?? '0',
    balance.value?.walletBalance,
  ),
)
const marginRatioColorClass = computed(() =>
  marginRatioColor(marginRatio.value),
)
</script>
