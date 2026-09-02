<template>
  <app-dialog
    v-model:is-open="model"
    class="w-full sm:w-[480px] sm:mx-auto sm:h-[576px] !rounded-20"
    hide-close
  >
    <template #title>
      <app-btn-icon
        :label="$t('common.close')"
        class="absolute top-6 right-6 bg-bgBase"
        height="h-8"
        width="w-8"
        @click="model = false"
      >
        <x-mark-icon class="w-6 h-6" />
      </app-btn-icon>
    </template>
    <template #content>
      <div
        class="flex flex-col gap-6 items-center justify-center h-full px-6 py-[112px]"
      >
        <div class="flex flex-col gap-2 items-center justify-center w-full">
          <h1
            id="dialogTitle"
            class="text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-black text-center"
          >
            {{ $t('trade.approve_spending.title', { symbol: tokenSymbol }) }}
          </h1>
          <p class="text-s-16 leading-[22px] text-black text-center">
            {{
              $t('trade.approve_spending.subtitle', {
                symbol: tokenSymbol,
                wallet: walletLabel,
              })
            }}
          </p>
        </div>

        <div
          class="flex flex-col items-start w-full max-w-[432px] p-4 rounded-16 bg-bgBase"
        >
          <div class="flex items-center justify-center gap-3 w-full">
            <div class="flex flex-1 min-w-0 items-center gap-1">
              <p
                class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-black"
              >
                {{ $t('trade.approve_spending.network_fee') }}
              </p>
              <app-tooltip
                :text="$t('trade.approve_spending.network_fee_tooltip')"
                theme="dark"
                position="top"
              >
                <information-circle-icon
                  class="w-[18px] h-[18px] text-black cursor-pointer"
                />
              </app-tooltip>
            </div>

            <div
              v-if="isLoading"
              class="flex flex-col items-end gap-1 flex-none"
            >
              <div
                class="h-[18px] w-[88px] rounded-8 bg-neutral-200 animate-pulse"
              />
              <div
                class="h-[14px] w-[56px] rounded-8 bg-neutral-200 animate-pulse"
              />
            </div>
            <div v-else class="flex flex-col items-end flex-none">
              <p
                class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-black whitespace-nowrap"
              >
                {{ nativeFee ? approx(nativeFee) : '-' }}
              </p>
              <p
                v-if="fiatFee"
                class="text-s-14 leading-[20px] text-info whitespace-nowrap"
              >
                {{ approx(fiatFee) }}
              </p>
            </div>

            <app-token-logo
              :url="nativeTokenLogo"
              :symbol="nativeTokenSymbol"
              width="w-10"
              height="h-10"
              no-shadow
              no-ring
              class="flex-none"
            />
          </div>
        </div>

        <app-base-button :is-loading="isSubmitting" @click="emit('approve')">
          <span class="flex items-center gap-2">
            {{ $t('trade.approve_spending.cta', { wallet: walletLabel }) }}
            <arrow-top-right-on-square-icon class="w-5 h-5" />
          </span>
        </app-base-button>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import {
  InformationCircleIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'

import AppDialog from '@/components/AppDialog.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTooltip from '@/components/AppTooltip.vue'

import { useChainsStore } from '@/stores/chainsStore'
import { useWalletStore } from '@/stores/walletStore'
import { useApprovalFee } from '../composables/useApprovalFee'

const props = withDefaults(
  defineProps<{
    tokenSymbol?: string
    tokenAddress?: string
    chainId?: string
    isSubmitting?: boolean
  }>(),
  {
    tokenSymbol: '',
    tokenAddress: '',
    chainId: '',
    isSubmitting: false,
  },
)

const model = defineModel<boolean>('isOpen', { required: true })

const emit = defineEmits<{
  approve: []
}>()

const { t } = useI18n()
const { selectedChain } = storeToRefs(useChainsStore())
const { walletAddress, walletName } = storeToRefs(useWalletStore())
const { isLoading, nativeFee, fiatFee, fetchApprovalFee, reset } =
  useApprovalFee()

const approx = (value: string) =>
  /^[<>]/.test(value.trim()) ? value : `≈ ${value}`

const walletLabel = computed(
  () => walletName.value || t('trade.approve_spending.your_wallet'),
)

const nativeTokenSymbol = computed(
  () => selectedChain.value?.currencyName || '',
)
const nativeTokenLogo = computed(() => selectedChain.value?.icon || '')

watch(model, async isOpen => {
  if (!isOpen) {
    reset()
    return
  }
  await fetchApprovalFee({
    chainId: props.chainId,
    tokenAddress: props.tokenAddress,
    walletAddress: walletAddress.value ?? '',
  })
})
</script>
