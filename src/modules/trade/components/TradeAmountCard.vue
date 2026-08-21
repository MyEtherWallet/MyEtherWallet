<template>
  <div
    ref="cardEl"
    :class="[
      isActive
        ? 'bg-white border-grey-10'
        : side === 'sell'
          ? 'bg-bgBase border-transparent hover:border-grey-subtle'
          : 'bg-bgBase border-transparent',
      side === 'sell' ? 'pb-6' : 'pb-4',
      'w-full rounded-20 flex flex-col gap-5 px-4 pt-4 border-1 transition-colors',
    ]"
    @click="focusInput"
  >
    <p class="text-s-11 font-bold leading-[15px] tracking-sp-06 uppercase">
      {{ $t(`trade.${side}_label`) }}
    </p>

    <div class="w-full flex flex-col gap-2">
      <div class="w-full flex items-center justify-between gap-2">
        <input
          v-if="side === 'sell'"
          ref="amountDisplayElement"
          :value="amount"
          name="trade-amount-input"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          placeholder="0"
          :aria-invalid="showError"
          :aria-describedby="`trade-amount-message-${side}`"
          :class="[
            amountColorClass,
            amountSizeClass,
            'min-w-0 grow bg-transparent text-s-32 font-bold leading-[36px] tracking-[-0.96px] placeholder:text-grey-subtle focus:outline-none focus:ring-0',
          ]"
          @focus="focusInput"
          @keypress="checkIfNumber"
          @input="onAmountInput"
        />
        <p
          v-else
          ref="amountDisplayElement"
          :class="[
            amount ? amountColorClass : 'text-grey-subtle',
            amountSizeClass,
            'min-w-0 grow truncate text-s-32 font-bold leading-[36px] tracking-[-0.96px]',
          ]"
        >
          {{ amount || '0' }}
        </p>

        <app-swap-selected-token
          v-model:selected-token="selectedToken"
          :external-loading="isLoading"
          :chain-tokens="tokens || []"
          :is-from-view="side === 'sell'"
          :network-name="networkName"
          :sort-context="sortContext"
          :disabled-tokens="disabledTokens"
          :disabled-group-title="disabledGroupTitle"
          @open:select-token="setIsOpenSelectToken"
          @select:token="emit('select:token', $event)"
        >
          <template
            #trigger="{ open, isLoading: tokenLoading, selectedToken: token }"
          >
            <div
              v-if="tokenLoading || !token"
              class="h-10 w-[120px] shrink-0 rounded-20 bg-grey-10 animate-pulse"
            />
            <button
              v-else
              type="button"
              :aria-label="$t('select_token.title')"
              :class="[
                isActive ? 'bg-bgBase' : 'bg-white',
                'flex items-center gap-2 p-2 rounded-20 shrink-0 transition-colors hoverNoBG',
              ]"
              @click.stop="open"
            >
              <app-token-logo
                :url="token.logoURI"
                :symbol="token.symbol"
                :address="
                  networkName
                    ? { address: token.address, network: networkName }
                    : undefined
                "
                width="w-6"
                height="h-6"
              />
              <span
                class="text-s-14 font-semibold leading-[20px] tracking-[-0.28px]"
              >
                {{ token.symbol }}
              </span>
              <chevron-right-icon class="w-5 h-5" />
            </button>
          </template>
        </app-swap-selected-token>
      </div>

      <div class="w-full flex items-center justify-between gap-2">
        <app-spinner v-if="isLoading" class="text-black" />
        <p
          v-else
          :id="`trade-amount-message-${side}`"
          :role="showError ? 'alert' : undefined"
          aria-live="polite"
          :class="[
            showError ? 'text-error' : 'text-info',
            'text-s-12 leading-[18px] truncate',
          ]"
        >
          {{ showError ? errorMessage : fiatText }}
        </p>
        <p
          v-if="showBalance"
          :class="[
            showError && side === 'sell' ? 'text-error' : 'text-info',
            'text-s-12 leading-[18px] whitespace-nowrap',
          ]"
        >
          {{ $t('common.balance') }}: {{ balanceText }}
        </p>
      </div>
    </div>

    <div v-if="side === 'sell'" class="w-full flex items-center gap-1">
      <button
        v-for="pct in [25, 50, 75, 100]"
        :key="pct"
        type="button"
        :disabled="pct === 100 && maxDisabled"
        :class="[
          isActive ? 'bg-bgBase' : 'bg-white',
          pct === 100 && maxDisabled ? 'opacity-40 cursor-not-allowed' : '',
          'flex-1 h-8 flex items-center justify-center px-3 rounded-8 text-s-11 font-bold leading-[15px] tracking-sp-06 uppercase transition-colors hoverNoBG',
        ]"
        @click.stop="emit('percent', pct)"
      >
        {{ pct === 100 ? $t('common.max') : `${pct}%` }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import BigNumber from 'bignumber.js'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import { onClickOutside, useDebounceFn, useElementSize } from '@vueuse/core'
import AppSpinner from '@/components/AppSpinner.vue'
import AppSwapSelectedToken from '@/components/AppSwapSelectedToken.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import { MAIN_TOKEN_CONTRACT, useWalletStore } from '@/stores/walletStore'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { sanitizeDecimal } from '@/utils/sanitizeDecimal'
import { type NewTokenInfo } from '@/composables/useSwap'
import { useInFocusInput } from '@/composables/useInFocusInput'
import { useTextScaler, type TextScale } from '@/composables/useTextScaler'

const props = withDefaults(
  defineProps<{
    side: 'sell' | 'buy'
    tokens?: NewTokenInfo[] | null
    externalLoading?: boolean
    showBalance?: boolean
    isPristine?: boolean
    networkName?: string
    sortContext?: 'trade' | 'swap'
    disabledTokens?: string[]
    disabledGroupTitle?: string
    maxDisabled?: boolean
  }>(),
  {
    tokens: () => [],
    externalLoading: false,
    showBalance: true,
    isPristine: false,
    networkName: undefined,
    sortContext: undefined,
    disabledTokens: () => [],
    disabledGroupTitle: undefined,
    maxDisabled: false,
  },
)

const emit = defineEmits<{
  percent: [pct: number]
  'select:token': [token: NewTokenInfo]
}>()

const amount = defineModel<string>('amount', { required: true })
const selectedToken = defineModel<NewTokenInfo>('selectedToken')
const error = defineModel<string>('error', { default: '' })

const walletStore = useWalletStore()
const { formatFiat, currencySymbol } = useCurrency()
const { isLoadingBalances: storeLoading, isWalletConnected } =
  storeToRefs(walletStore)

const isLoading = computed(() => {
  if (isWalletConnected.value) {
    return props.externalLoading || storeLoading.value
  }
  return props.externalLoading
})

const hasError = ref(false)
const errorMessage = ref('')
const showError = computed(
  () => hasError.value && !isOpenSelectToken.value && !props.isPristine,
)

const debouncedValidate = useDebounceFn(
  () => {
    hasError.value = error.value !== ''
    errorMessage.value = error.value
  },
  1000,
  { maxWait: 5000 },
)

watch(
  () => [amount.value, error.value],
  () => {
    hasError.value = false
    debouncedValidate()
  },
)

const isOpenSelectToken = ref(false)
const setIsOpenSelectToken = (value: boolean) => {
  isOpenSelectToken.value = value
  if (!value) focusInput()
}

const tokenBalanceRaw = computed(() =>
  walletStore.getTokenBalance(
    selectedToken.value?.address || MAIN_TOKEN_CONTRACT,
  ),
)

const fiatText = computed(() => {
  const numAmount = (amount.value || '').replace(/[^0-9.]/g, '')
  const price =
    tokenBalanceRaw.value?.price || selectedToken.value?.price || 0
  const value = BigNumber(price).times(numAmount || 0)
  const safeValue = value.isFinite() ? value : BigNumber(0)
  return `${currencySymbol.value}${formatFiat(safeValue.toFixed(2)).value}`
})

const balanceText = computed(() => {
  const balance = formatFloatingPointValue(
    tokenBalanceRaw.value?.balance || 0,
  ).value
  return `${balance} ${selectedToken.value?.symbol || ''}`
})

const amountColorClass = computed(() =>
  showError.value && !inFocusInput.value ? 'text-error' : 'text-black',
)

const cardEl = ref<HTMLElement | null>(null)
const activeCard = ref<HTMLElement | null>(null)
const amountDisplayElement = ref<HTMLElement | null>(null)
const { width: amountDisplayWidth } = useElementSize(amountDisplayElement)

const AMOUNT_SCALES: ReadonlyArray<TextScale> = [
  { size: 32, lineHeight: 36, tracking: -0.96 },
  { size: 28, lineHeight: 36, tracking: -0.84 },
  { size: 20, lineHeight: 36, tracking: -0.6 },
  { size: 16, lineHeight: 36, tracking: -0.48 },
]

const AMOUNT_SCALE_CLASSES: Record<number, string> = {
  32: '',
  28: '!text-s-28 !tracking-[-0.84px]',
  20: '!text-s-20 !tracking-[-0.6px]',
  16: '!text-s-16 !tracking-[-0.48px]',
}

const { scale: amountScale } = useTextScaler(() => amount.value || '0', {
  scales: AMOUNT_SCALES,
  containerWidthPx: amountDisplayWidth,
})

const amountSizeClass = computed(
  () => AMOUNT_SCALE_CLASSES[amountScale.value.size] ?? '',
)

const {
  inFocusInput,
  setInFocusInput: setInFocusInputElement,
  startOutOfFocusTimeout,
} = useInFocusInput(amountDisplayElement)

const isActive = computed(
  () =>
    (inFocusInput.value || isOpenSelectToken.value) && props.side === 'sell',
)

const focusInput = () => {
  if (props.side !== 'sell') return
  hasError.value = false
  activeCard.value = cardEl.value
  nextTick(() => {
    setInFocusInputElement()
  })
}

onClickOutside(activeCard, () => {
  startOutOfFocusTimeout()
  activeCard.value = null
  hasError.value = error.value !== ''
  errorMessage.value = error.value
})

const checkIfNumber = (e: KeyboardEvent) => {
  const key = e.key
  if (key >= '0' && key <= '9') return
  if (key === '.' && !(amount.value || '').includes('.')) return
  e.preventDefault()
}

const onAmountInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const sanitized = sanitizeDecimal(input.value)
  if (input.value !== sanitized) {
    input.value = sanitized
  }
  amount.value = sanitized
}
</script>
