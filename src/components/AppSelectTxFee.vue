<template>
  <div>
    <button
      class="hoverNoBG rounded-20 bg-white shadow-button shadow-button-elevated border-none px-5 h-[58px] flex justify-between items-center text-sm w-full transition-all"
      @click.prevent="openFeeModal"
      :disabled="!hasFees"
    >
      <div class="flex items-center gap-2">
        <p class="text-info font-medium">{{ $t('common.fee') }}:</p>
        <div
          v-if="!hasFees"
          class="bg-grey-10 rounded-full animate-pulse min-w-[80px] h-4"
        ></div>
        <p v-else-if="hasFiatEstimates" class="font-medium text-black">
          {{ selectedFeeFiat }}
        </p>
        <p v-else class="font-medium text-black">{{ selectedFeeNative }}</p>
      </div>

      <div class="flex items-center gap-2">
        <div
          v-if="!hasFees"
          class="bg-grey-10 rounded-full animate-pulse w-24 h-4"
        ></div>
        <template v-else-if="hasFiatEstimates">
          <span class="text-info font-medium">
            {{ selectedFeeNative }}
          </span>
          <chevron-down-icon class="w-4 h-4 text-info" />
        </template>
      </div>
    </button>
    <div
      v-if="!(isLoadingFees || isLoadingBalances) && isLoadedChainsData"
      class="min-h-6 flex items-center px-4 mt-1"
    >
      <transition name="fade" mode="out-in">
        <div
          v-if="isWalletConnected && gasFeeError && gasFeeError !== ''"
          class="text-error text-s-12 leading-tight"
        >
          <!-- TODO Add PROPER LINK -->
          <div v-if="isNotEnoughBalance">
            <p v-if="hasChainBalance">
              {{
                $t('common.not_enough_balance_to_cover_fee', {
                  symbol: selectedChain?.currencyName || 'ETH',
                })
              }}
              <button
                class="text-primary cursor-pointer underline underline-offset-2"
                @click="openBuyPanel"
              >
                {{
                  $t('common.buy_more', {
                    symbol: selectedChain?.currencyName || 'ETH',
                  })
                }}
              </button>
            </p>
          </div>
          <p v-else>{{ gasFeeError }}</p>
        </div>
      </transition>
    </div>

    <app-dialog
      :title="$t('select_fee.title')"
      v-model:is-open="openModal"
      class="max-w-[560px] sm:mx-auto"
    >
      <template #content>
        <div class="mx-2 xs:mx-6 mb-6">
          <p class="text-info mx-4 sm:mx-3 mb-5">
            {{ $t('select_fee.description') }}
          </p>
          <!-- fee options -->
          <div class="grid grid-cols-1 sm:p-3 gap-2 xs:gap-3">
            <button
              v-for="fee in displayFees"
              :key="fee.id"
              :class="[
                gasPriceType === fee.id
                  ? 'border-primary outline outline-primary bg-grey-5'
                  : ' border-grey-outline',
                'border-1 w-full  rounded-2xl hoverNoBG p-2 xs:p-4 min-h-[90px] ',
              ]"
              @click="setFee(fee.id)"
            >
              <div class="flex items-center">
                <div
                  :class="[
                    { 'text-primary': gasPriceType === fee.id },
                    ' mr-2 xs:mr-4',
                  ]"
                >
                  <currency-dollar-icon
                    v-if="fee.id === GasPriceType.ECONOMY"
                    class="w-5 h-5"
                  />
                  <check-icon
                    v-else-if="fee.id === GasPriceType.REGULAR"
                    class="w-5 h-5"
                  />
                  <div v-else class="flex">
                    <arrow-long-up-icon class="w-5 h-5" />
                    <arrow-long-up-icon
                      v-if="fee.id === GasPriceType.FASTEST"
                      class="w-5 h-5 -mx-2"
                    />
                  </div>
                </div>
                <div class="flex flex-col text-left">
                  <span class="text-[16px] font-medium">{{ fee.title }}</span>

                  <span class="text-info text-xs mt-1">{{
                    fee.description
                  }}</span>
                </div>
                <div class="text-right ml-auto min-w-[100px] xs:min-w-[140px]">
                  <p class="font-medium">
                    {{ fee.fiatValue }}
                  </p>
                  <span class="text-info text-xs"> {{ fee.nativeValue }}</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </template>
    </app-dialog>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon, ArrowLongUpIcon } from '@heroicons/vue/24/solid'
import { CurrencyDollarIcon, CheckIcon } from '@heroicons/vue/24/outline'
import { ref, computed, watch, onMounted } from 'vue'
import { GasPriceType } from '@/providers/types'
import AppDialog from '@/components/AppDialog.vue'
import { fromWei } from 'web3-utils'
import type { HexPrefixedString } from '@/providers/types'
import {
  formatFloatingPointValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { useGlobalStore } from '@/stores/globalStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import type {
  FeePriority,
  EstimatesRequestBody,
  GasFeeInfo,
  QuotesResponse,
  BtcGasFees,
  FeeOption,
  GetBtcTransactionEstimateBody,
} from '@/mew_api/types'
import { useI18n } from 'vue-i18n'
import { formatUnits } from 'viem'
import { P2WPKH_DUST } from '@/providers/common/btcInfo'
import { analytics, ClickTokenTradeEvent } from '@/analytics'
import { useWalletMenuStore } from '@/stores/walletMenuStore'

const walletMenu = useWalletMenuStore()

const openBuyPanel = () => {
  analytics.trackClickTokenTradeEvent(ClickTokenTradeEvent.BUY, {
    location: 'select_fee',
    token: selectedChain?.value?.currencyName || 'ETH',
  })
  walletMenu.openPanel('purchase')
}

/** ----------------
 * DEFAULTS
 ------------------*/
const DEFAULT_EVM_ADDR =
  '0x0000000000000000000000000000000000000000' as HexPrefixedString
const DEFAULT_DATA = '0x' as HexPrefixedString
const DEFAULT_VALUE = '0x0' as HexPrefixedString

/** ----------------
 * Props
 ------------------*/
interface Props {
  fees?: QuotesResponse
  isLoadingFees?: boolean
  txRequestBody?: EstimatesRequestBody | GetBtcTransactionEstimateBody
}

const props = defineProps<Props>()

/** ----------------
 * Fee Error
 ------------------*/
const gasFeeError = defineModel<string>('gasFeeError', {
  type: String,
  default: '',
})

const NOT_ENOUGH_BALANCE = 'NOT_ENOUGH_BALANCE'
const isNotEnoughBalance = computed(() => {
  return gasFeeError.value === NOT_ENOUGH_BALANCE
})

/** ----------------
 * Fetch Fees
 ------------------*/

const chainStore = useChainsStore()
const {
  isLoaded: isLoadedChainsData,
  selectedChain,
  isEvmChain,
  isBitcoinChain,
} = storeToRefs(chainStore)
const walletStore = useWalletStore()
const {
  isWalletConnected,
  walletAddress,
  balanceWei,
  hasChainBalance,
  isLoadingBalances,
} = storeToRefs(walletStore)

const txData = computed<EstimatesRequestBody | GetBtcTransactionEstimateBody>(
  (): EstimatesRequestBody | GetBtcTransactionEstimateBody => {
    // EVM CHAINS ONLY
    if (selectedChain.value?.type === 'EVM') {
      if (props.txRequestBody) {
        return props.txRequestBody
      }
      const _address =
        isWalletConnected.value &&
        walletAddress.value &&
        walletAddress.value !== ''
          ? (walletAddress.value as HexPrefixedString)
          : DEFAULT_EVM_ADDR
      return {
        to: DEFAULT_EVM_ADDR,
        address: _address,
        value: DEFAULT_VALUE,
        data: DEFAULT_DATA,
      }
    }
    // For unsupported or disconnected cases, return a default object instead of null
    if (
      !isWalletConnected.value &&
      (!walletAddress.value ||
        walletAddress.value === '' ||
        walletAddress.value === null ||
        walletAddress.value === undefined)
    ) {
      // Return a default BTC estimate body
      return {} as unknown as
        | EstimatesRequestBody
        | GetBtcTransactionEstimateBody
    }
    /**
     * Right now bitcoin wallets are only fetched when the user is logged in.
     */
    return {
      fromAddresses: [walletAddress.value!],
      consolidationAddress: walletAddress.value!,
    }
  },
)

const fetchURL = computed(() => {
  //EVM CHAINS ONLY
  if (isLoadedChainsData.value && selectedChain.value && isEvmChain.value) {
    return `/v1/evm/chains/${selectedChain.value.chainID}/estimates/?noInjectErrors=false`
  }
  //TO DO: SOL and DOT HANDLER
  return `/v2/btc/${selectedChain.value?.name}/estimates/?noInjectErrors=false`
})
const feesReady = ref(false)
const feeEstmates = ref<FeeOption | undefined>(undefined)

const { useMEWFetch } = useFetchMewApi()

const { data, onFetchResponse, execute, onFetchError, isFetching, aborted } =
  useMEWFetch(fetchURL, {
    immediate: false,
  })
    .post(JSON.stringify(txData.value))
    .json<QuotesResponse>()

onFetchResponse(() => {
  if (data.value) {
    feeEstmates.value = data.value.fees as FeeOption
    feesReady.value = true
    const _gasPriceType = gasPriceType.value as GasPriceType
    const nativeFeeValue =
      feeEstmates.value[_gasPriceType].nativeValue ||
      feeEstmates.value[_gasPriceType].nativeFeeTotal ||
      0
    const txDataValue =
      (txData.value as EstimatesRequestBody).value ?? P2WPKH_DUST
    //Check if user has enough balance to cover gas fees
    const totalBalanceNeeded = BigInt(nativeFeeValue) + BigInt(txDataValue)

    if (
      BigInt(totalBalanceNeeded) > BigInt(balanceWei.value) &&
      isWalletConnected.value
    ) {
      gasFeeError.value = NOT_ENOUGH_BALANCE
    }
  } else {
    throw new Error('No gas fees received in response:' + fetchURL.value)
  }
})

onFetchError(e => {
  if (e.message) {
    if (aborted.value || e.message.toLowerCase().includes('abort')) {
      return
    }
    gasFeeError.value = e.message.toLowerCase().includes('insufficient funds')
      ? NOT_ENOUGH_BALANCE
      : e.message
  } else {
    gasFeeError.value = t('send.toast.failed_to_fetch_gas_fees')
  }
})

watch(
  () => [isLoadedChainsData.value, txData.value],
  () => {
    if (isLoadedChainsData.value && selectedChain.value) {
      feesReady.value = false
      if (isBitcoinChain.value && !isWalletConnected.value) {
        // bitcoin fees are fetched only when user is logged in
        feesReady.value = true
        return
      }
      execute()
    }
  },
)

const emit = defineEmits<{
  (e: 'fee-is-loading', isFetching: boolean): void
}>()

watch(
  () => isFetching.value,
  () => {
    emit('fee-is-loading', isFetching.value)
  },
)
onMounted(() => {
  if (isLoadedChainsData.value && selectedChain.value) {
    feesReady.value = false
    if (isBitcoinChain.value && !isWalletConnected.value) {
      // bitcoin fees are fetched only when user is logged in
      feesReady.value = true
      return
    }
    execute()
  }
})

/** ----------------
 * Modal
 ------------------*/
const openModal = ref(false)
const openFeeModal = () => {
  openModal.value = true
}

const closeFeeModal = () => {
  openModal.value = false
}

/** ----------------
 * Current Selected Fee
 ------------------*/
const globalStore = useGlobalStore()
const { gasPriceType } = storeToRefs(globalStore)

const setFee = (fee: FeePriority) => {
  gasPriceType.value = fee
  closeFeeModal()
  //TODO: add amplitude
}

const selectedFeeNative = computed(() => {
  if (hasFees.value && data.value) {
    return formatFee(data.value.fees[gasPriceType.value])
  }
  return ''
})
const usedFeeToDisplay = computed<FeeOption | undefined>(() => {
  return props.fees ? props.fees.fees : feeEstmates.value
})

const hasFiatEstimates = computed(() => {
  return (
    usedFeeToDisplay.value &&
    usedFeeToDisplay.value[gasPriceType.value] &&
    (usedFeeToDisplay.value[gasPriceType.value].fiatValue !== undefined ||
      usedFeeToDisplay.value[gasPriceType.value].fiatFeeTotal !== undefined)
  )
})
const selectedFeeFiat = computed(() => {
  if (hasFees.value && usedFeeToDisplay.value) {
    const fiatValue = formatFiatValue(
      usedFeeToDisplay.value[gasPriceType.value].fiatValue ||
        usedFeeToDisplay.value[gasPriceType.value].fiatFeeTotal ||
        0,
    ).value
    return `${usedFeeToDisplay.value[gasPriceType.value].fiatSymbol} ${fiatValue} `
  }
  return ''
})

//TODO: import proper type form the api
const formatFee = (fee: GasFeeInfo | BtcGasFees) => {
  const converted = isEvmChain.value
    ? fromWei((fee as GasFeeInfo).nativeValue || '0', 'ether')
    : formatUnits(BigInt((fee as BtcGasFees).nativeFeeTotal || '0'), 8)
  return `${formatFloatingPointValue(converted).value} ${fee.nativeSymbol}`
}

/** ----------------
 * Fee Options
 ------------------*/

interface DisplayFee {
  id: FeePriority
  title: string
  description: string
  fiatValue: string
  nativeValue: string
}
const { t } = useI18n()
const displayFees = computed<DisplayFee[]>(() => {
  const economy = usedFeeToDisplay.value
    ? (usedFeeToDisplay.value[GasPriceType.ECONOMY].fiatFeeTotal ??
      usedFeeToDisplay.value[GasPriceType.ECONOMY].fiatValue)
    : undefined
  const regular = usedFeeToDisplay.value
    ? (usedFeeToDisplay.value[GasPriceType.REGULAR].fiatFeeTotal ??
      usedFeeToDisplay.value[GasPriceType.REGULAR].fiatValue)
    : undefined
  const fast = usedFeeToDisplay.value
    ? (usedFeeToDisplay.value[GasPriceType.FAST].fiatFeeTotal ??
      usedFeeToDisplay.value[GasPriceType.FAST].fiatValue)
    : undefined
  const fastest = usedFeeToDisplay.value
    ? (usedFeeToDisplay.value[GasPriceType.FASTEST].fiatFeeTotal ??
      usedFeeToDisplay.value[GasPriceType.FASTEST].fiatValue)
    : undefined
  const a = [
    {
      id: GasPriceType.ECONOMY,
      title: t('select_fee.economy.title'),
      description: t('select_fee.economy.description'),
      fiatValue: `$${formatFiatValue(economy || 0).value}`,
      nativeValue: usedFeeToDisplay.value
        ? formatFee(usedFeeToDisplay.value[GasPriceType.ECONOMY])
        : '0',
    },
    {
      id: GasPriceType.REGULAR,
      title: t('select_fee.regular.title'),
      description: t('select_fee.regular.description'),
      fiatValue: `$${formatFiatValue(regular || 0).value}`,
      nativeValue: usedFeeToDisplay.value
        ? formatFee(usedFeeToDisplay.value[GasPriceType.REGULAR])
        : '0',
    },
    {
      id: GasPriceType.FAST,
      title: t('select_fee.fast.title'),
      description: t('select_fee.fast.description'),
      fiatValue: `$${formatFiatValue(fast || 0).value}`,
      nativeValue: usedFeeToDisplay.value
        ? formatFee(usedFeeToDisplay.value[GasPriceType.FAST])
        : '0',
    },
    {
      id: GasPriceType.FASTEST,
      title: t('select_fee.fastest.title'),
      description: t('select_fee.fastest.description'),
      fiatValue: `$${formatFiatValue(fastest || 0).value}`,
      nativeValue: usedFeeToDisplay.value
        ? formatFee(usedFeeToDisplay.value[GasPriceType.FASTEST])
        : '0',
    },
  ]
  return a
})

const hasFees = computed(() => {
  return (
    feesReady.value &&
    data.value &&
    Object.keys(data.value.fees).length > 0 &&
    !props.isLoadingFees
  )
})
</script>
