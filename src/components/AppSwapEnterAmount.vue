<template>
  <div ref="target" @click="setInFocusInput">
    <AppTransactionInputCard :caption="caption">
      <template v-if="$slots.header" #header>
        <slot name="header" />
      </template>
      <AppInputNaked
        v-model="amount"
        :label="$t('common.amount')"
        :show-currency="false"
        :readonly="readonly"
        :error="showError"
        :loading="isLoading"
        :info-message="isFromView ? $t('common.enter_amount') : conversion"
        :conversion="conversion"
        name="amount-input"
        @focus="setInFocusInput"
      />
      <template #picker>
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
      </template>
      <template #feedback>
        <transition name="fade" mode="out-in">
          <!-- Inside the card padding, so no side inset of its own -->
          <AppInputFeedback
            v-if="showError && !isLoading"
            type="error"
            :message="errorMessage"
            class="px-0!"
          />
        </transition>
      </template>
      <template v-if="$slots.actions" #actions>
        <slot name="actions" />
      </template>
    </AppTransactionInputCard>
  </div>
</template>

<script setup lang="ts">
import { MAIN_TOKEN_CONTRACT, useWalletStore } from '@/stores/walletStore'
import { ref, computed, type PropType, watch, nextTick } from 'vue'
import BigNumber from 'bignumber.js'
import AppSwapTokenSelect from './AppSwapSelectedToken.vue'
import AppTransactionInputCard from './AppTransactionInputCard.vue'
import AppInputNaked from '@/components/input_naked/AppInputNaked.vue'
import AppInputFeedback from '@/components/input_feedback/AppInputFeedback.vue'
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { type NewTokenInfo } from '@/stores/swapStore'
import { useDebounceFn } from '@vueuse/core'
import { useInFocusInput } from '@/composables/useInFocusInput'
import { useI18n } from 'vue-i18n'

const walletStore = useWalletStore()
const { isLoadingBalances: storeLoading, isWalletConnected } =
  storeToRefs(walletStore)

const { formatFiat, currencySymbol } = useCurrency()
const { t } = useI18n()

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

// Figma prefixes every fiat estimate with "≈"; the to-side already carries it.
const conversion = computed(() =>
  props.isEstimate
    ? balanceFiatOrError.value
    : `≈ ${balanceFiatOrError.value}`,
)

const caption = computed(() =>
  props.showBalance && props.isFromView
    ? `${t('common.balance')}: ${balance.value} ${selectedToken.value?.symbol ?? ''}`.trim()
    : `${t('common.price')}: ${currencySymbol.value}${tokenPrice.value}`,
)

const showError = computed(
  () => hasError.value && !isOpenSelectToken.value && !props.isPristine,
)

/**------------------------
 * Focus State
 -------------------------*/
const target = ref<HTMLElement | null>(null)
const targetValue = ref<HTMLElement | null>(null)
// AppInputNaked owns the <input>; focus goes to it through the card root.
const amountInput = computed<HTMLElement | null>(
  () => target.value?.querySelector('input') ?? null,
)

const { setInFocusInput: setInFocusInputElement, startOutOfFocusTimeout } =
  useInFocusInput(amountInput)

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
</script>
