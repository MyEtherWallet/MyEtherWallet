<template>
  <div
    ref="target"
    class="w-full rounded-20 shadow-button shadow-button-elevated bg-white p-5 transition-all min-h-[120px] flex flex-col justify-between"
    :class="{
      'ring-2 ring-primary': inFocusInput || isOpenSelectToken,
    }"
    @click="setInFocusInput"
  >
    <div class="flex justify-between items-center w-full gap-2">
      <input
        ref="amountInput"
        class="grow py-1 text-3xl font-medium focus:outline-none focus:ring-0 !border-transparent !appearance-none bg-transparent min-w-0"
        :class="{ 'text-error': !!error && !isOpenSelectToken && !isPristine }"
        name="amount-input"
        type="text"
        autoComplete="off"
        placeholder="0"
        v-model="amount"
        @focus="setInFocusInput"
        @keypress="checkIfNumber"
      />
      <app-token-select
        v-model:selected-token-contract="selectedToken"
        @open:select-token="setIsOpenSelectToken"
      />
    </div>
    <div :class="{ 'animate-pulse': isLoading }" class="mt-2">
      <transition name="fade" mode="out-in">
        <div
          v-if="isLoading"
          class="h-5 flex bg-grey-10 rounded-full w-1/2"
        ></div>
        <div v-else class="flex justify-between items-center gap-2">
          <div
            :class="[
              !!error && !isOpenSelectToken && !isPristine
                ? 'text-error'
                : 'text-info',
              'text-s-14',
            ]"
          >
            {{ balanceFiat }}
          </div>
          <div
            v-if="isWalletConnected"
            class="flex items-baseline gap-2 text-s-12 leading-p-120 text-info font-medium whitespace-nowrap"
          >
            <div>
              {{ $t('common.balance') }}:
              <span class="text-black">{{ balance }}</span>
            </div>
            <slot name="balance-action" />
          </div>
        </div>
      </transition>
      <transition name="fade" mode="out-in">
        <p
          v-if="!!error && !isLoading && !isOpenSelectToken && !isPristine"
          class="text-error text-s-12 leading-p-130 mt-1"
        >
          {{ error }}
        </p>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type TokenBalance } from '@/mew_api/types'
import { useWalletStore } from '@/stores/walletStore'
import { watch, ref, computed, type PropType, nextTick } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import BigNumber from 'bignumber.js'
import AppTokenSelect from './AppTokenSelect.vue'
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import {
  formatFloatingPointValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import { useInFocusInput } from '@/composables/useInFocusInput'

const walletStore = useWalletStore()
const { isLoadingBalances: isLoading, isWalletConnected } =
  storeToRefs(walletStore)

const props = defineProps({
  validateInput: {
    type: Function as PropType<() => void>,
    default: () => {},
    required: true,
  },
  isPristine: {
    type: Boolean,
    default: false,
  },
})

//String will be returned when input is cleared --> ''
const amount = defineModel('amount', {
  type: [String, Number] as PropType<string | number>,
  required: true,
})

const selectedToken = defineModel<string>('selectedToken')

const error = defineModel('error', {
  type: String,
  required: true,
  default: '',
})

const tokenBalanceRaw = computed(() => {
  if (isLoading.value || !selectedToken.value) return null
  return walletStore.getTokenBalance(selectedToken.value) as TokenBalance | null
})

const balanceFiat = computed(() => {
  const _balance = BigNumber(
    BigNumber(tokenBalanceRaw.value?.price || 0).times(
      BigNumber(amount.value || 0),
    ),
  )
  return `$${formatFiatValue(_balance).value}`
})

const balance = computed(() => {
  return tokenBalanceRaw.value?.balance
    ? formatFloatingPointValue(tokenBalanceRaw.value.balance).value
    : '0'
})

const isOpenSelectToken = ref(false)
const setIsOpenSelectToken = (value: boolean) => {
  isOpenSelectToken.value = value
  if (!isOpenSelectToken.value) {
    setInFocusInput()
  }
}

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
const targetValue = ref<HTMLElement | null>(null)
const amountInput = ref<HTMLElement | null>(null)

const {
  inFocusInput,
  setInFocusInput: setInFocusInputElement,
  startOutOfFocusTimeout,
} = useInFocusInput(amountInput)

const setInFocusInput = () => {
  nextTick(() => {
    setInFocusInputElement()
  })
  targetValue.value = target.value
  nextTick(() => {
    setInFocusInputElement()
  })
}

onClickOutside(targetValue, () => {
  targetValue.value = null
  startOutOfFocusTimeout()
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

watch(
  () => selectedToken.value,
  () => {
    if (isLoading.value) return
    props.validateInput()
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
