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
        @focus="setInFocusInput"
        @keypress="checkIfNumber"
      />
      <app-token-select v-model:selected-token="selectedToken" />
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
          >
            {{ $t('common.balance') }}: {{ balance }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type TokenBalance } from '@/mew_api/types'
import { MAIN_TOKEN_CONTRACT, useWalletStore } from '@/stores/walletStore'
import { defineProps, watch, ref, computed, type PropType } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import BigNumber from 'bignumber.js'
import AppTokenSelect from './AppTokenSelect.vue'
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import {
  formatFloatingPointValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'

const walletStore = useWalletStore()
const { isLoadingBalances: isLoading } = storeToRefs(walletStore)

const props = defineProps({
  validateInput: {
    type: Function as PropType<() => void>,
    default: () => {},
    required: true,
  },
})

//String will be returned when input is cleared --> ''
const amount = defineModel('amount', {
  type: [String, Number] as PropType<string | number>,
  required: true,
})

const selectedToken = defineModel<TokenBalance>('selectedToken')

const error = defineModel('error', {
  type: String,
  required: true,
  default: '',
})

const tokenBalanceRaw = computed(() => {
  return walletStore.getTokenBalance(
    selectedToken.value?.contract || MAIN_TOKEN_CONTRACT,
  )
})

const balanceFiatOrError = computed(() => {
  const _balance = BigNumber(
    BigNumber(tokenBalanceRaw.value?.price || 0).times(
      BigNumber(amount.value || 0),
    ),
  )
  return error.value ? error.value : `$ ${formatFiatValue(_balance).value}`
})

const balance = computed(() => {
  return formatFloatingPointValue(tokenBalanceRaw.value?.balance || 0).value
})

watch(
  () => [amount.value, selectedToken.value],
  useDebounceFn(() => {
    if (isLoading.value) return
    props.validateInput()
  }, 500),
)

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
  props.validateInput()
})

//check if isloading changed and check input if in focus
watch(
  () => isLoading.value,
  () => {
    if (!isLoading.value && inFocusInput.value) {
      props.validateInput()
    }
  },
)

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
