<template>
  <div
    ref="target"
    class="w-full rounded-16 box-border border border-1 border-grey-outline bg-white p-[17px] transition-colors"
    :class="{
      'border-primary border-2 !p-4': inFocusInput && !error,
      '!border-error border-2 !p-4': !!error,
    }"
    @click="setInFocusInput"
  >
    <div class="flex justify-between items-center w-full">
      <input
        class="pl-3 py-2 w-full text-3xl focus:outline-none focus:ring-0 !border-transparent !appearance-none -ml-3"
        :class="{ 'text-error': !!error }"
        name="amount-input"
        type="text"
        autoComplete="off"
        placeholder="0.0"
        v-model.number="amount"
        :readonly="readonly"
        @focus="setInFocusInput"
        @keypress="checkIfNumber"
      />
      <app-swap-token-select
        v-model:selected-token="selectedToken"
        :external-loading="isLoading"
        :chain-tokens="tokens || []"
      />
    </div>
    <div :class="{ 'animate-pulse': isLoading }">
      <transition name="fade" mode="out-in">
        <div v-if="isLoading" class="h-5 flex bg-grey-10 rounded-full"></div>
        <div v-else class="flex justify-between">
          <div
            class="text-sm"
            :class="{ 'text-error': !!error, 'text-info': !error }"
          >
            {{ balanceFiatOrError }}
          </div>
          <div
            :class="[
              'text-sm text-info transition-colors',
              { 'text-primary': inFocusInput },
            ]"
            v-if="showBalance"
          >
            {{ $t('common.balance') }}: {{ balance }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MAIN_TOKEN_CONTRACT, useWalletStore } from '@/stores/walletStore'
import { defineProps, ref, computed, type PropType } from 'vue'
import BigNumber from 'bignumber.js'
import AppSwapTokenSelect from './AppSwapSelectedToken.vue'
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import {
  formatFloatingPointValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import { type NewTokenInfo } from '@/composables/useSwap'

const walletStore = useWalletStore()
const { isLoadingBalances: storeLoading, isWalletConnected } =
  storeToRefs(walletStore)

const props = defineProps({
  externalLoading: {
    type: Boolean,
    default: false,
  },
  tokens: {
    type: Array as () => NewTokenInfo[] | null,
    default: () => [],
  },
  showBalance: {
    type: Boolean,
    default: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  isEstimate: {
    type: Boolean,
    default: false,
  },
})

//String will be returned when input is cleared --> ''
const amount = defineModel('amount', {
  type: [String, Number] as PropType<string | number>,
  required: true,
})

const selectedToken = defineModel<NewTokenInfo>('selectedToken')

const error = defineModel('error', {
  type: String,
  required: true,
  default: '',
})

const tokenBalanceRaw = computed(() => {
  return walletStore.getTokenBalance(
    (selectedToken.value as NewTokenInfo)?.address || MAIN_TOKEN_CONTRACT,
  )
})

const isLoading = computed(() => {
  if (isWalletConnected.value) {
    return props.externalLoading || storeLoading.value
  }
  return props.externalLoading
})

const balanceFiatOrError = computed(() => {
  if (!props.showBalance) {
    const val = BigNumber(selectedToken.value?.price || 0)
      .times(BigNumber(amount.value).gt(0) ? amount.value : 1)
      .toFixed(2)
    return error.value ? error.value : `${props.isEstimate ? '≈' : ''}$ ${val}`
  }
  const _balance = BigNumber(
    BigNumber(tokenBalanceRaw.value?.price || 0).times(
      BigNumber(amount.value || 0),
    ),
  )

  return error.value
    ? error.value
    : `${props.isEstimate ? '≈ ' : ''}$ ${formatFiatValue(_balance).value}`
})

const balance = computed(() => {
  return formatFloatingPointValue(tokenBalanceRaw.value?.balance || 0).value
})

/**------------------------
 * Focus State
 -------------------------*/
const target = ref<HTMLElement | null>(null)
const inFocusInput = ref(false)
const targetValue = ref<HTMLElement | null>(null)

const setInFocusInput = () => {
  inFocusInput.value = true
  targetValue.value = target.value
}

onClickOutside(targetValue, () => {
  targetValue.value = null
  inFocusInput.value = false
})

const checkIfNumber = (e: KeyboardEvent) => {
  const key = e.key
  // Numeric
  if (key >= '0' && key <= '9') {
    return
  }
  // Only allow a single period
  if (key === '.') {
    const input = amount.value.toString()
    if (!input.includes('.')) {
      return
    }
  }
  // Alphabetical (/non-numeric) or multiple periods. Don't propagate change
  e.preventDefault()
}
</script>
