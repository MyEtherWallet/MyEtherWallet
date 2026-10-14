<template>
  <div ref="target" @click="setInFocusInput">
    <AppTransactionInputCard :caption="balanceCaption">
      <AppInputNaked
        :model-value="String(amount)"
        :label="$t('common.amount')"
        :show-currency="false"
        :error="showError"
        :loading="isLoading"
        :info-message="$t('common.enter_amount')"
        :conversion="`≈ ${balanceFiat}`"
        name="amount-input"
        @update:model-value="amount = $event"
        @focus="setInFocusInput"
      />
      <template #picker>
        <slot name="token-select">
          <app-token-select
            v-model:selected-token-contract="selectedToken"
            @open:select-token="setIsOpenSelectToken"
          />
        </slot>
      </template>
      <template #feedback>
        <transition name="fade" mode="out-in">
          <!-- Inside the card padding, so no side inset of its own -->
          <AppInputFeedback
            v-if="showError && !isLoading"
            type="error"
            :message="error"
            class="px-0!"
          />
        </transition>
      </template>
      <template v-if="$slots.footer" #actions>
        <slot name="footer" />
      </template>
    </AppTransactionInputCard>
  </div>
</template>

<script setup lang="ts">
import { type TokenBalance } from '@/mew_api/types'
import { useWalletStore } from '@/stores/walletStore'
import { watch, ref, computed, type PropType, nextTick } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import BigNumber from 'bignumber.js'
import AppTokenSelect from './AppTokenSelect.vue'
import AppTransactionInputCard from './AppTransactionInputCard.vue'
import AppInputNaked from '@/components/input_naked/AppInputNaked.vue'
import AppInputFeedback from '@/components/input_feedback/AppInputFeedback.vue'
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useI18n } from 'vue-i18n'
import { useCurrency } from '@/composables/useCurrency'
import { useInFocusInput } from '@/composables/useInFocusInput'

const walletStore = useWalletStore()
const { isLoadingBalances: isLoading, isWalletConnected } =
  storeToRefs(walletStore)

const { formatFiat } = useCurrency()
const { t } = useI18n()

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
  tokenObj: {
    type: Object as PropType<TokenBalance | null>,
    default: null,
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
  if (props.tokenObj) return props.tokenObj
  if (isLoading.value || !selectedToken.value) return null
  return walletStore.getTokenBalance(selectedToken.value) as TokenBalance | null
})

const balanceFiat = computed(() => {
  const _balance = BigNumber(
    BigNumber(tokenBalanceRaw.value?.price || 0).times(
      BigNumber(amount.value || 0),
    ),
  )
  return formatFiat(_balance).display
})

const balance = computed(() => {
  return tokenBalanceRaw.value?.balance
    ? formatFloatingPointValue(tokenBalanceRaw.value.balance).value
    : '0'
})

const balanceCaption = computed(() =>
  isWalletConnected.value
    ? t('common.balance_amount', {
        amount:
          `${balance.value} ${tokenBalanceRaw.value?.symbol ?? ''}`.trim(),
      })
    : undefined,
)

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
// AppInputNaked owns the <input>; focus goes to it through the card root.
const amountInput = computed<HTMLElement | null>(
  () => target.value?.querySelector('input') ?? null,
)

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

const showError = computed(
  () => !!error.value && !isOpenSelectToken.value && !props.isPristine,
)
</script>
