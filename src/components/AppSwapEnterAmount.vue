<template>
  <div
    ref="target"
    class="w-full rounded-20 shadow-button shadow-button-elevated bg-white p-5 transition-all min-h-[120px] flex flex-col justify-between"
    :class="{
      'ring-2 ring-primary': (inFocusInput || isOpenSelectToken) && !readonly,
    }"
    @click="setInFocusInput"
  >
    <slot name="header" />
    <div class="flex items-center w-full gap-2">
      <p
        v-if="!isFromView && !isLoading && amount"
        :class="{
          'text-error': hasError && !isOpenSelectToken && !isPristine,
          'animate-pulse text-info': isLoading,
          '!text-s-24':
            amount &&
            amount.toString().length > 7 &&
            amount.toString().length <= 10,
          '!text-s-16':
            amount &&
            amount.toString().length > 10 &&
            amount.toString().length <= 15,
          '!text-s-12': amount && amount.toString().length > 15,
        }"
      >
        ≈
      </p>
      <input
        ref="amountInput"
        class="grow py-1 text-s-28 font-medium focus:outline-none focus:ring-0 !border-transparent !appearance-none bg-transparent min-w-0 h-9"
        :class="{
          'text-error': hasError && !isOpenSelectToken && !isPristine,
          'animate-pulse text-info': isLoading,
          '!text-s-24':
            amount &&
            amount.toString().length > 7 &&
            amount.toString().length <= 10,
          '!text-s-16':
            amount &&
            amount.toString().length > 10 &&
            amount.toString().length <= 15,
          '!text-s-12': amount && amount.toString().length > 15,
        }"
        name="amount-input"
        type="text"
        autoComplete="off"
        placeholder="0"
        :aria-label="$t('common.amount')"
        v-model="amount"
        :readonly="readonly"
        @focus="setInFocusInput"
        @keypress="checkIfNumber"
      />
      <app-swap-token-select
        v-model:selected-token="selectedToken"
        :external-loading="isLoading"
        :chain-tokens="tokens || []"
        :is-from-view="isFromView"
        :network-name="networkName"
        :sort-context="sortContext"
        :disabled-tokens="disabledTokens"
        :disabled-group-title="disabledGroupTitle"
        @open:select-token="setIsOpenSelectToken"
        @select:token="emit('select:token', $event)"
      />
    </div>
    <div :class="{ 'animate-pulse': isLoading }" class="mt-3">
      <transition name="fade" mode="out-in">
        <div
          v-if="isLoading"
          class="h-5 flex bg-grey-10 rounded-full w-1/2"
        ></div>
        <div v-else class="flex justify-between items-center">
          <div
            class="text-sm"
            :class="[
              hasError && !isOpenSelectToken && !isPristine
                ? 'text-error'
                : 'text-info',
            ]"
          >
            {{ balanceFiatOrError }}
          </div>
          <div
            v-if="showBalance && isFromView"
            class="flex items-baseline gap-2 whitespace-nowrap"
          >
            <div
              class="text-s-12 leading-p-120 text-info transition-colors"
              :class="{
                'text-primary':
                  (inFocusInput || isOpenSelectToken) &&
                  (!hasError || isPristine),
              }"
            >
              {{ $t('common.balance') }}:
              <span class="text-black">{{ balance }}</span>
            </div>
            <slot name="balance-action" />
          </div>
          <div v-else class="text-s-12 text-info transition-colors h-5">
            {{ $t('common.price') }}:
            <span>{{ currencySymbol }}{{ tokenPrice }}</span>
          </div>
        </div>
      </transition>
      <transition name="fade" mode="out-in">
        <p
          v-if="hasError && !isLoading && !isOpenSelectToken && !isPristine"
          class="text-error text-s-12 leading-p-130 mt-1"
        >
          {{ errorMessage }}
        </p>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MAIN_TOKEN_CONTRACT, useWalletStore } from '@/stores/walletStore'
import { ref, computed, type PropType, watch, nextTick } from 'vue'
import BigNumber from 'bignumber.js'
import AppSwapTokenSelect from './AppSwapSelectedToken.vue'
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { type NewTokenInfo } from '@/composables/useSwap'
import { useDebounceFn } from '@vueuse/core'
import { useInFocusInput } from '@/composables/useInFocusInput'

const walletStore = useWalletStore()
const { isLoadingBalances: storeLoading, isWalletConnected } =
  storeToRefs(walletStore)

const { formatFiat, currencySymbol } = useCurrency()

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
  isFromView: {
    type: Boolean,
    default: true,
  },
  networkName: {
    type: String,
    required: false,
  },
  isPristine: {
    type: Boolean,
    default: false,
  },
  sortContext: {
    type: String as () => 'trade' | 'swap' | undefined,
    default: undefined,
  },
  disabledTokens: {
    type: Array as () => string[],
    default: () => [],
  },
  disabledGroupTitle: {
    type: String,
    required: false,
  },
})

//String will be returned when input is cleared --> ''
const amount = defineModel('amount', {
  type: String as PropType<string>,
  required: true,
})

const selectedToken = defineModel<NewTokenInfo>('selectedToken')

// Forwarded from the token-select child: fires only on an explicit user pick,
// unlike v-model:selected-token which also updates on programmatic defaulting.
const emit = defineEmits<{
  'select:token': [token: NewTokenInfo]
}>()

const hasError = ref(false)
const errorMessage = ref('')
const error = defineModel('error', {
  type: String,
  required: true,
  default: '',
})

const isOpenSelectToken = ref(false)
const setIsOpenSelectToken = (value: boolean) => {
  isOpenSelectToken.value = value
  if (!isOpenSelectToken.value) {
    setInFocusInput()
  }
}

const debouncedValidate = useDebounceFn(
  () => {
    if (error.value !== '') {
      hasError.value = true
      errorMessage.value = error.value
    } else {
      hasError.value = false
      errorMessage.value = ''
    }
  },
  1000,
  { maxWait: 5000 },
)

watch(
  () => [amount.value, error.value],
  () => {
    validateAmount()
  },
)

const validateAmount = () => {
  hasError.value = false
  debouncedValidate()
}
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

const tokenPrice = computed(() => {
  return formatFiat(selectedToken.value?.price || 0).value
})
const balanceFiatOrError = computed(() => {
  // handles the case where toAmount has the ≈ sign
  if (
    hasError.value &&
    !isLoading.value &&
    !props.isFromView &&
    !props.isPristine
  ) {
    return formatFiat(0).display
  }
  const numAmount =
    typeof amount.value === 'string'
      ? amount.value.replace(/[^0-9.-]/g, '')
      : amount.value
  if (!props.showBalance) {
    const val = BigNumber(selectedToken.value?.price || 0)
      .times(numAmount || 0)
      .toFixed(2)
    const formattedVal = formatFiat(val).display
    return `${props.isEstimate ? '≈ ' : ''}${formattedVal}`
  }
  const _balance = BigNumber(
    BigNumber(tokenBalanceRaw.value?.price || 0).times(
      BigNumber(numAmount || 0),
    ),
  )
  return `${props.isEstimate ? '≈ ' : ''}${formatFiat(_balance).display}`
})

const balance = computed(() => {
  return formatFloatingPointValue(tokenBalanceRaw.value?.balance || 0).value
})

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
  if (props.isFromView) {
    hasError.value = false
    targetValue.value = target.value
    nextTick(() => {
      setInFocusInputElement()
    })
  }
}

onClickOutside(targetValue, () => {
  startOutOfFocusTimeout()
  targetValue.value = null

  if (error.value !== '') {
    hasError.value = true
    errorMessage.value = error.value
  } else {
    hasError.value = false
    errorMessage.value = ''
  }
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
