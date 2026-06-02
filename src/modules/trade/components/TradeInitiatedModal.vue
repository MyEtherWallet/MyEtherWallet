<template>
  <app-dialog
    v-model:is-open="model"
    class="sm:max-w-[420px] sm:mx-auto"
    :title="$t('trade.initiated_modal.title')"
  >
    <template #content>
      <div class="px-4 lg:px-6 pb-8 pt-2">
        <div class="flex flex-col items-center pt-8 text-center">
          <p class="text-s-13 lg:text-s-14 text-info px-4 leading-p-160">
            {{ $t('trade.initiated_modal.order_submitted') }}
          </p>

          <div class="flex flex-col gap-0 w-full mt-4 lg:mt-8">
            <!-- Progress -->
            <div
              class="flex items-end justify-center rounded-full mb-2 mx-auto"
            >
              <!-- Spinner / Status Icon -->
              <div class="mr-2">
                <svg
                  v-if="notificationStatus === 'pending'"
                  class="w-5 h-5 animate-spin text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="3"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <check-circle-icon
                  v-else-if="notificationStatus === 'filled'"
                  class="w-5 h-5 text-success"
                />
                <x-circle-icon
                  v-else-if="
                    notificationStatus === 'cancelled' ||
                    notificationStatus === 'expired'
                  "
                  class="w-5 h-5 text-error"
                />
              </div>

              <!-- Status Text -->
              <span
                class="text-s-14 font-semibold"
                :class="{
                  'text-primary': notificationStatus === 'pending',
                  'text-success': notificationStatus === 'filled',
                  'text-error':
                    notificationStatus === 'cancelled' ||
                    notificationStatus === 'expired',
                }"
              >
                {{ statusText }}
              </span>
            </div>
            <div class="flex flex-col justify-start bg-mewBg p-4 rounded-20">
              <!-- From Row -->
              <div class="flex items-center gap-4">
                <div class="relative">
                  <app-token-logo
                    :url="fromToken?.logoURI"
                    :symbol="fromToken?.symbol"
                    :address="
                      fromToken && fromChain
                        ? {
                            address: fromToken.address,
                            network: fromChain.name,
                          }
                        : undefined
                    "
                    width="w-9 lg:w-12"
                    height="h-9 lg:h-12"
                  />
                </div>
                <div class="flex flex-col text-left">
                  <p
                    class="text-s-16 lg:text-s-20 font-bold leading-tight flex items-center gap-1 flex-wrap"
                  >
                    {{ fromAmountFormatted.value }}
                    <app-token-symbol
                      :symbol="fromToken?.symbol || 'UNKNOWN'"
                      :address="
                        fromToken && fromChain
                          ? {
                              address: fromToken.address,
                              network: fromChain.name,
                            }
                          : undefined
                      "
                      class="!text-s-16 lg:!text-s-20 !font-bold"
                    />
                    <app-tooltip
                      v-if="fromAmountFormatted.tooltipText"
                      :text="fromAmountFormatted.tooltipText"
                    >
                    </app-tooltip>
                  </p>
                  <p class="text-info text-s-14">${{ fromAmountFiat }}</p>
                </div>
              </div>

              <!-- Divider Arrow -->
              <div class="flex justify-start my-2 lg:my-4 mx-[6px] lg:mx-3">
                <arrow-long-down-icon class="w-6 h-6" />
              </div>

              <!-- To Row -->
              <div class="flex items-center gap-4">
                <div class="relative">
                  <app-token-logo
                    :url="toToken?.logoURI"
                    :symbol="toToken?.symbol"
                    :address="
                      toToken && fromChain
                        ? { address: toToken.address, network: fromChain.name }
                        : undefined
                    "
                    width="w-9 lg:w-12"
                    height="h-9 lg:h-12"
                  />
                </div>
                <div class="flex flex-col text-left">
                  <p
                    class="text-s-16 lg:text-s-20 font-bold leading-tight flex items-center gap-1 flex-wrap"
                  >
                    {{ toAmountFormatted.value }}
                    <app-token-symbol
                      :symbol="toToken?.symbol || 'UNKNOWN'"
                      :address="
                        toToken && fromChain
                          ? {
                              address: toToken.address,
                              network: fromChain.name,
                            }
                          : undefined
                      "
                      class="!text-s-16 lg:!text-s-20 !font-bold"
                    />
                    <app-tooltip
                      v-if="toAmountFormatted.tooltipText"
                      :text="toAmountFormatted.tooltipText"
                    >
                    </app-tooltip>
                  </p>
                  <p class="text-info text-s-14">${{ toAmountFiat }}</p>
                </div>
              </div>
            </div>

            <!-- Order Info -->
            <div class="w-full my-5 px-2 lg:px-4">
              <div class="flex justify-between items-center">
                <span
                  class="text-s-11 uppercase tracking-sp-06 font-bold text-info"
                  >{{ $t('trade.initiated_modal.order_hash') }}</span
                >
                <div class="flex items-center gap-2">
                  <span class="text-s-12 font-mono truncate max-w-[150px]">
                    {{ truncatedHash }}
                  </span>
                  <app-btn-copy :copy-value="orderHash" class="-mr-3" />
                </div>
              </div>
              <div class="flex justify-between items-center mt-4">
                <span
                  class="text-s-11 uppercase tracking-sp-06 font-bold text-info"
                  >{{ $t('trade.initiated_modal.network') }}</span
                >
                <div class="flex items-center gap-2">
                  <app-token-logo
                    v-if="fromChain?.icon"
                    :url="fromChain.icon"
                    :symbol="fromChain.nameLong"
                    width="w-6"
                    height="h-6"
                  />
                  <span class="text-s-14 font-medium">{{
                    fromChain?.nameLong
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 lg:mt-10">
          <p
            class="text-center text-s-13 lg:text-s-14 text-info px-4 leading-p-160"
          >
            {{ $t('trade.initiated_modal.close_window_message') }}
          </p>
          <app-base-button
            class="group border-2 mt-2 w-full"
            @click="openNotifications"
          >
            {{ $t('trade.initiated_modal.track_progress') }}
          </app-base-button>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import AppDialog from '@/components/AppDialog.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnCopy from '@/components/AppBtnCopy.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppTooltip from '@/components/AppTooltip.vue'
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowLongDownIcon,
} from '@heroicons/vue/24/solid'
import type { Chain } from '@/mew_api/types'
import type { NewTokenInfo } from '@/composables/useSwap'
import { useWalletStore } from '@/stores/walletStore'
import { useAppLayoutStore } from '@/stores/appLayoutStore'
import { useTradeOrdersStore } from '@/stores/tradeOrdersStore'
import BigNumber from 'bignumber.js'
import {
  formatFiatValue,
  formatFloatingPointValue,
} from '@/utils/numberFormatHelper'

const { t } = useI18n()

const model = defineModel<boolean>('isOpen', { default: false })

const props = defineProps<{
  orderHash: string
  fromChain?: Chain
  fromToken?: NewTokenInfo | null
  toToken?: NewTokenInfo | null
  fromAmount?: string
  toAmount?: string
}>()

const walletStore = useWalletStore()
const appLayoutStore = useAppLayoutStore()
const tradeOrdersStore = useTradeOrdersStore()
const { walletAddress } = storeToRefs(walletStore)
const { isNotificationsOpen } = storeToRefs(appLayoutStore)

// Open notifications and close modal
const openNotifications = () => {
  model.value = false
  isNotificationsOpen.value = true
}

const truncatedHash = computed(() => {
  if (!props.orderHash) return ''
  if (props.orderHash.length <= 16) return props.orderHash
  return `${props.orderHash.slice(0, 8)}...${props.orderHash.slice(-8)}`
})

// Formatted amounts using formatFloatingPointValue helper
const fromAmountFormatted = computed(() => {
  return formatFloatingPointValue(props.fromAmount ?? '0')
})

const toAmountFormatted = computed(() => {
  return formatFloatingPointValue(props.toAmount ?? '0')
})

// Fiat values
const fromAmountFiat = computed(() => {
  const price = props.fromToken?.price ?? 0
  const amount = props.fromAmount ?? '0'
  return formatFiatValue(BigNumber(amount).multipliedBy(price).toFixed(6)).value
})

const toAmountFiat = computed(() => {
  const price = props.toToken?.price ?? 0
  const amount = props.toAmount ?? '0'
  return formatFiatValue(BigNumber(amount).multipliedBy(price).toFixed(6)).value
})

// Track notification status from store
const notificationStatus = computed(() => {
  if (!walletAddress.value || !props.orderHash) return 'pending'

  const orders = tradeOrdersStore.getOrdersByAddress(walletAddress.value)
  const order = orders.find(o => o.hash === props.orderHash)
  if (order) return order.status

  return 'pending'
})

const statusText = computed(() => {
  switch (notificationStatus.value) {
    case 'pending':
      return t('trade.status.pending')
    case 'filled':
      return t('trade.status.filled')
    case 'cancelled':
      return t('trade.status.cancelled')
    case 'expired':
      return t('trade.status.expired')
    default:
      return t('trade.status.pending')
  }
})
</script>
