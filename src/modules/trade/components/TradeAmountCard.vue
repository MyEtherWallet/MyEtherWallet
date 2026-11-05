<template>
  <app-transaction-input-card
    ref="cardRef"
    :model-value="side === 'sell' ? amount : displayAmount"
    :input-label="$t(`trade.${side}_label`)"
    :readonly="side === 'buy'"
    :conversion="infoText"
    :info-message="infoText"
    :error="isErrorVisible"
    :loading="isBusy"
    :balance="showBalance ? `${$t('common.balance')}: ${balanceText}` : ''"
    :balance-error="isErrorVisible && side === 'sell' && errorIsBalance"
    :quick-actions="quickActions"
    @update:model-value="amount = $event"
    @quick-action="emit('percent', Number($event))"
    @focus="hasError = false"
    @blur="applyError"
  >
    <template #picker>
      <trade-select-asset-modal
        v-model:selected-token="selectedToken"
        :side="side"
        :external-loading="isLoading"
        :chain-tokens="tokens || []"
        :network-name="networkName"
        :disabled-tokens="disabledTokens"
        @open:select-token="setIsOpenSelectToken"
        @select:token="emit('select:token', $event)"
      >
        <template
          #trigger="{ open, isLoading: tokenLoading, selectedToken: token }"
        >
          <app-picker
            :title="token ? pickerTitle(token) : ''"
            :loading="tokenLoading || !token"
            :avatar="!!token && !tokenLoading"
            size="s"
            :aria-label="$t('select_token.title')"
            @click.stop="open"
          >
            <!-- AppTokenLogo, not AppAvatar: Ondo tokens keep their rainbow ring (MEW-2361) -->
            <template #avatar>
              <app-token-logo
                v-if="token"
                :url="token.logoURI"
                :symbol="token.symbol"
                :address="
                  networkName
                    ? { address: token.address, network: networkName }
                    : undefined
                "
                width="w-6"
                height="h-6"
                no-shadow
              />
            </template>
          </app-picker>
        </template>
      </trade-select-asset-modal>
    </template>
  </app-transaction-input-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import BigNumber from 'bignumber.js'
import { useDebounceFn } from '@vueuse/core'
import AppTransactionInputCard from '@components/AppTransactionInputCard.vue'
import AppPicker from '@components/picker/AppPicker.vue'
import AppTokenLogo from '@components/AppTokenLogo.vue'
import TradeSelectAssetModal from './TradeSelectAssetModal.vue'
import { MAIN_TOKEN_CONTRACT, useWalletStore } from '@/stores/walletStore'
import { useStocksStore } from '@/stores/stocksStore'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { type NewTokenInfo } from '@/stores/swapStore'

const props = withDefaults(
  defineProps<{
    side: 'sell' | 'buy'
    tokens?: NewTokenInfo[] | null
    externalLoading?: boolean
    fiatLoading?: boolean
    balanceError?: boolean
    /** Show the error message below the amount (e.g. "Remove 2 decimals")
     *  instead of the red conversion; the CTA always carries the message. */
    inlineError?: boolean
    showBalance?: boolean
    isPristine?: boolean
    networkName?: string
    disabledTokens?: string[]
    maxDisabled?: boolean
  }>(),
  {
    tokens: () => [],
    externalLoading: false,
    fiatLoading: false,
    balanceError: false,
    inlineError: false,
    showBalance: true,
    isPristine: false,
    networkName: undefined,
    disabledTokens: () => [],
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
// Outputs: let the parent CTA follow the card's spinner and error message.
const busy = defineModel<boolean>('busy', { default: false })
const errorVisible = defineModel<boolean>('errorVisible', { default: false })

const { t } = useI18n()
const walletStore = useWalletStore()
const stocksStore = useStocksStore()
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
const errorIsBalance = ref(false)
const errorIsInline = ref(false)
const isErrorPending = ref(false)
const showError = computed(
  () => hasError.value && !isOpenSelectToken.value && !props.isPristine,
)
const isBusy = computed(
  () => isLoading.value || props.fiatLoading || isErrorPending.value,
)
const isErrorVisible = computed(() => showError.value && !isBusy.value)

watch(isBusy, value => (busy.value = value), { immediate: true })
watch(isErrorVisible, value => (errorVisible.value = value), {
  immediate: true,
})

const applyError = () => {
  hasError.value = error.value !== ''
  errorMessage.value = error.value
  errorIsBalance.value = props.balanceError
  errorIsInline.value = props.inlineError
  isErrorPending.value = false
}

const debouncedValidate = useDebounceFn(applyError, 1000, { maxWait: 5000 })

watch(
  () => [amount.value, error.value],
  () => {
    hasError.value = false
    isErrorPending.value = amount.value !== '' && amount.value !== '0'
    debouncedValidate()
  },
)

const cardRef = ref<InstanceType<typeof AppTransactionInputCard> | null>(null)

const isOpenSelectToken = ref(false)
const setIsOpenSelectToken = (value: boolean) => {
  isOpenSelectToken.value = value
  if (!value && props.side === 'sell') {
    nextTick(() => {
      const root = cardRef.value?.$el as HTMLElement | undefined
      root?.querySelector('input')?.focus()
    })
  }
}

const tokenBalanceRaw = computed(() =>
  walletStore.getTokenBalance(
    selectedToken.value?.address || MAIN_TOKEN_CONTRACT,
  ),
)

// The buy-side amount arrives as a raw decimal string (the quote's output);
// format it for display only. The sell side shows exactly what the user typed.
const displayAmount = computed(() =>
  props.side === 'buy' && amount.value
    ? formatFloatingPointValue(amount.value).value
    : amount.value,
)

const fiatText = computed(() => {
  const numAmount = (amount.value || '').replace(/[^0-9.]/g, '')
  const price = tokenBalanceRaw.value?.price || selectedToken.value?.price || 0
  const value = BigNumber(price).times(numAmount || 0)
  const safeValue = value.isFinite() ? value : BigNumber(0)
  return `${currencySymbol.value}${formatFiat(safeValue.toFixed(2)).value}`
})

// On error the row turns red; it only swaps to the message when the error is
// inline (decimals), otherwise the message lives on the CTA. Empty sell input
// shows the "Enter amount" hint.
const infoText = computed(() => {
  if (showError.value && errorIsInline.value) return errorMessage.value
  if (props.side === 'sell' && !amount.value) return t('trade.enter_amount')
  return `≈ ${fiatText.value}`
})

const balanceText = computed(() => {
  const balance = formatFloatingPointValue(
    tokenBalanceRaw.value?.balance || 0,
  ).value
  return `${balance} ${selectedToken.value?.symbol || ''}`
})

const quickActions = computed(() =>
  props.side === 'sell'
    ? [25, 50, 75, 100].map(pct => ({
        key: pct,
        label: pct === 100 ? t('common.max').toUpperCase() : `${pct}%`,
        disabled: pct === 100 && props.maxDisabled,
      }))
    : [],
)

// Same casing as AppTokenSymbol: ticker uppercase, Ondo "on" suffix lowercase.
const pickerTitle = (token: NewTokenInfo) => {
  const isStock =
    props.side === 'buy' ||
    (!!props.networkName &&
      stocksStore.isStock(token.address, props.networkName))
  const symbol = token.symbol.toUpperCase()
  if (!isStock) return symbol
  return `${symbol.endsWith('ON') ? symbol.slice(0, -2) : symbol}on`
}
</script>
