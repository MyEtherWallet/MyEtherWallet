<template>
  <div
    ref="target"
    class="w-full rounded-[20px] box-border border border-1 border-grey-30 bg-white p-[17px] transition-colors"
    :class="{
      'border-primary border-2 !p-4': inFocusInput && !error,
      '!border-error border-2 !p-4': !!error,
    }"
    v-ripple
    @click="setInFocusInput"
  >
    <div class="flex justify-between items-center w-full">
      <input
        class="py-2 w-full text-3xl focus:outline-none focus:ring-0 !border-transparent !appearance-none -ml-3"
        :class="{ 'text-error': !!error }"
        name="amount-input"
        type="number"
        placeholder="0.0"
        required
        v-model.number="amount"
      />
      <app-token-select v-model:selected-token="selectedToken" />
    </div>
    <div :class="{ 'animate-pulse': isLoading }">
      <transition name="fade" mode="out-in">
        <div
          v-if="isLoading"
          class="h-5 mt-2 flex bg-grey-10 rounded-full"
        ></div>
        <div v-else class="flex justify-between pt-2">
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
            Balance: {{ balance }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWalletStore, type Token } from '@/stores/walletStore'
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

const selectedToken = defineModel('selectedToken', {
  type: Object as () => Token,
  required: true,
})

const error = defineModel('error', {
  type: String,
  required: true,
  default: '',
})

const balanceFiatOrError = computed(() => {
  const _balance = BigNumber(
    BigNumber(selectedToken.value.price || 0).times(
      BigNumber(amount.value || 0),
    ),
  )
  return error.value ? error.value : `$ ${formatFiatValue(_balance).value}`
})

const balance = computed(() => {
  return selectedToken.value.balance
    ? formatFloatingPointValue(selectedToken.value.balance).value
    : '0'
})

watch(
  () => amount.value,
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
</script>
