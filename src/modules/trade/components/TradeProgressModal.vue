<template>
  <app-dialog
    v-model:is-open="model"
    hide-close
    class="w-full sm:w-[480px] sm:mx-auto !rounded-20"
  >
    <template #content>
      <div
        class="relative h-[600px] w-full flex flex-col items-center justify-center gap-6 p-6 text-center"
      >
        <div class="relative w-[116px] h-10" aria-hidden="true">
          <div
            class="absolute top-0 transition-all duration-300 motion-reduce:transition-none"
            :class="isSettled ? 'left-[38px] opacity-0 scale-75' : 'left-0'"
          >
            <app-token-logo
              :url="fromToken?.logoURI"
              :symbol="fromToken?.symbol"
              :address="tokenAddress(fromToken)"
              width="w-10"
              height="h-10"
              no-shadow
            />
          </div>
          <arrows-right-left-icon
            class="absolute left-[48px] top-[10px] w-5 h-5 transition-transform duration-300 motion-reduce:transition-none"
            :class="isSettled ? 'scale-0' : 'motion-safe:animate-pulse'"
          />
          <div
            class="absolute top-0 transition-all duration-300 motion-reduce:transition-none"
            :class="isSettled ? 'left-[38px]' : 'left-[76px]'"
          >
            <app-token-logo
              :url="toToken?.logoURI"
              :symbol="toToken?.symbol"
              :address="tokenAddress(toToken)"
              width="w-10"
              height="h-10"
              no-shadow
            />
          </div>
          <span
            class="absolute left-[60px] top-[-5px] w-[22px] h-[22px] rounded-full border border-white flex items-center justify-center transition-transform duration-300 delay-300 motion-reduce:transition-none"
            :class="[
              isFailed ? 'bg-error' : 'bg-success-600',
              isSettled ? 'scale-100' : 'scale-0',
            ]"
          >
            <x-mark-icon v-if="isFailed" class="w-3.5 h-3.5 text-white" />
            <check-icon v-else class="w-3.5 h-3.5 text-white" />
          </span>
        </div>

        <div class="flex flex-col gap-1 w-full">
          <h2 class="text-s-20 font-bold leading-[22px] tracking-[-0.4px]">
            {{ title }}
          </h2>
          <p class="text-s-16 leading-[22px] text-info">
            {{ subtitle }}
          </p>
        </div>

        <app-base-button
          theme="neutral"
          class="!bg-bgBase !text-primary !font-semibold !py-[13px] !px-6 text-s-16 leading-[22px] tracking-[-0.32px]"
          @click="model = false"
        >
          {{ $t('trade.progress_modal.close_screen') }}
        </app-base-button>

        <p
          v-if="status === 'pending'"
          class="absolute bottom-6 left-1/2 -translate-x-1/2 w-[392px] max-w-full text-s-12 leading-[18px] text-info whitespace-pre-line"
        >
          {{ $t('trade.progress_modal.background_note') }}
        </p>
        <a
          v-else-if="status === 'filled' && explorerLink"
          :href="explorerLink"
          target="_blank"
          rel="noopener"
          class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-[13px] rounded-24 text-s-16 font-semibold leading-[22px] tracking-[-0.32px] whitespace-nowrap"
        >
          {{ $t('trade.progress_modal.show_in_etherscan') }}
          <arrow-top-right-on-square-icon class="w-5 h-5" />
        </a>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import {
  ArrowsRightLeftIcon,
  ArrowTopRightOnSquareIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/vue/24/solid'
import AppDialog from '@/components/AppDialog.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useTradeOrdersStore } from '@/stores/tradeOrdersStore'
import { getTradeExplorerLink } from '@/modules/trade/composables/tradeExplorerLink'
import type { NewTokenInfo } from '@/composables/useSwap'
import type { Chain } from '@/mew_api/types'

const { t } = useI18n()
const model = defineModel<boolean>('isOpen', { default: false })

const props = defineProps<{
  orderHash: string
  fromToken: NewTokenInfo | null
  toToken: NewTokenInfo | null
  fromChain?: Chain
}>()

const walletStore = useWalletStore()
const { walletAddress } = storeToRefs(walletStore)
const tradeOrdersStore = useTradeOrdersStore()

const tokenAddress = (token: NewTokenInfo | null) =>
  token && props.fromChain
    ? { address: token.address, network: props.fromChain.name }
    : undefined

const order = computed(() => {
  if (!walletAddress.value || !props.orderHash) return null
  return (
    tradeOrdersStore
      .getOrdersByAddress(walletAddress.value)
      .find(o => o.hash === props.orderHash) ?? null
  )
})

const status = computed(() => order.value?.status ?? 'pending')
const isFailed = computed(
  () => status.value === 'cancelled' || status.value === 'expired',
)
const isSettled = computed(() => status.value === 'filled' || isFailed.value)

// finalToAmount is stored already display-formatted by the notifications
// poller — formatting it again would parse strings like "1,234.5" as NaN.
const receivedText = computed(() => {
  if (!order.value?.finalToAmount) return ''
  return `${order.value.finalToAmount} ${order.value.toSymbol}`
})

const title = computed(() => {
  if (status.value === 'filled') return t('trade.progress_modal.completed_title')
  if (isFailed.value) return t('trade.progress_modal.failed_title')
  return t('trade.progress_modal.processing_title')
})

const subtitle = computed(() => {
  if (status.value === 'filled')
    return t('trade.progress_modal.received', { amount: receivedText.value })
  if (status.value === 'cancelled')
    return t('trade.progress_modal.cancelled_subtitle')
  if (status.value === 'expired')
    return t('trade.progress_modal.expired_subtitle')
  return t('trade.progress_modal.processing_subtitle')
})

const explorerLink = computed(() => {
  if (!order.value || order.value.fills.length === 0) return ''
  return getTradeExplorerLink(order.value.chainId, order.value.fills[0].txHash)
})
</script>
