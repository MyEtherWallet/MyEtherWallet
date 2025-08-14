<template>
  <div class="min-h-[76px]">
    <button
      class="hoverNoBG rounded-16 border-1 bg-white border-grey-outline border-solid px-4 py-3 flex justify-between items-center text-sm w-full"
      :class="{
        '!border-error border-2':
          isWalletConnected && gasFeeError && gasFeeError !== '',
      }"
      @click.prevent="openFeeModal"
      :disabled="!hasFees"
    >
      <div class="flex items-center">
        <p>{{ $t('common.fee') }}:</p>
        <div
          :class="[
            { '!bg-grey-10 rounded-2xl animate-pulse min-w-[150px]': !hasFees },
            ' ml-2 h-5 ',
          ]"
        >
          <p v-if="hasFees">
            {{ selectedFeeFiat }}
          </p>
        </div>
      </div>
      <div
        :class="[
          {
            '!bg-grey-10 rounded-2xl animate-pulse !w-full max-w-[100px]':
              !hasFees,
          },
          ' h-5',
        ]"
      >
        <div v-if="hasFees" class="flex items-center cursor-pointer">
          <span class="text-info pr-2">
            {{ selectedFeeNative }}
          </span>
          <chevron-down-icon class="w-4 h-4" />
        </div>
      </div>
    </button>
    <div class="min-h-6 mt-1">
      <transition name="fade" mode="out-in">
        <div
          v-if="isWalletConnected && gasFeeError && gasFeeError !== ''"
          class="text-error text-[10px] xs:text-s-12 leading-[23px] px-5"
        >
          <!-- TODO Add PROPER LINK -->
          <p v-if="isNotEnoughBalance">
            {{
              $t('common.not_enough_balance_to_cover_fee', {
                symbol: selectedChain?.currencyName || 'ETH',
              })
            }}
            <a
              href="https://ccswap.myetherwallet.com/"
              target="_blank"
              class="text-primary cursor-pointer underline underline-offset-2"
              @click="openFeeModal"
              >{{
                $t('common.buy_more', {
                  symbol: selectedChain?.currencyName || 'ETH',
                })
              }}</a
            >
          </p>
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
  EstimatesResponse,
  EstimatesRequestBody,
  GasFeeInfo,
  QuotesResponse,
  EvmGasFees,
} from '@/mew_api/types'
import { useI18n } from 'vue-i18n'

/** ----------------
 * DEFAULTS
 ------------------*/
const DEFAULT_ADR =
  '0x0000000000000000000000000000000000000000' as HexPrefixedString
const DEFAULT_DATA = '0x' as HexPrefixedString
const DEFAULT_VALUE = '0x0' as HexPrefixedString

/** ----------------
 * Props
 ------------------*/
interface Props {
  fees?: QuotesResponse
  isLoadingFees?: boolean
  txRequestBody?: EstimatesRequestBody
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
const { isLoaded: isLoadedChainsData, selectedChain } = storeToRefs(chainStore)
const walletStore = useWalletStore()
const { isWalletConnected, walletAddress, balanceWei } =
  storeToRefs(walletStore)

const txData = computed<EstimatesRequestBody>(() => {
  //EVM CHAINS ONLY
  if (props.txRequestBody) {
    return props.txRequestBody
  }
  const _address =
    isWalletConnected.value && walletAddress.value && walletAddress.value !== ''
      ? (walletAddress.value as HexPrefixedString)
      : DEFAULT_ADR
  return {
    to: DEFAULT_ADR,
    address: _address,
    value: DEFAULT_VALUE,
    data: DEFAULT_DATA,
  }
  //TO DO: BITCOIN HANDLER
})

const fetchURL = computed(() => {
  //EVM CHAINS ONLY
  if (isLoadedChainsData.value && selectedChain.value) {
    return `/v1/evm/chains/${selectedChain.value.chainID}/estimates/?noInjectErrors=false`
  }
  //TO DO: BITCOIN HANDLER
  return ''
})
const feesReady = ref(false)
const feeEstmates = ref<EvmGasFees | undefined>(undefined)

const { useMEWFetch } = useFetchMewApi()

const { data, onFetchResponse, execute, onFetchError } =
  useMEWFetch<EstimatesResponse>(fetchURL, {
    immediate: false,
  })
    .post(JSON.stringify(txData.value))
    .json()

onFetchResponse(() => {
  if (data.value) {
    feeEstmates.value = data.value.fees
    feesReady.value = true

    //Check if user has enough balance to cover gas fees
    const totalBalanceNeeded =
      BigInt(data.value.fees[gasPriceType.value].nativeValue || '0') +
      BigInt(txData.value.value)

    if (BigInt(totalBalanceNeeded) > BigInt(balanceWei.value)) {
      gasFeeError.value = NOT_ENOUGH_BALANCE
    }
  } else {
    throw new Error('No gas fees received in response:' + fetchURL.value)
  }
})

onFetchError(e => {
  if (e.message) {
    gasFeeError.value = e.message.includes('insufficient funds')
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
      execute()
    }
  },
)

onMounted(() => {
  if (isLoadedChainsData.value && selectedChain.value) {
    feesReady.value = false
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

const selectedFeeFiat = computed(() => {
  if (hasFees.value && data.value) {
    const fiatValue = formatFiatValue(
      data.value.fees[gasPriceType.value].fiatValue || 0,
    ).value
    return `${data.value.fees[gasPriceType.value].fiatSymbol} ${fiatValue} `
  }
  return ''
})

//TODO: import proper type form the api
const formatFee = (fee: GasFeeInfo) => {
  const converted = fromWei(fee.nativeValue, 'ether')
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
  const _fees = props.fees ? props.fees.fees : feeEstmates.value
  const a = [
    {
      id: GasPriceType.ECONOMY,
      title: t('select_fee.economy.title'),
      description: t('select_fee.economy.description'),
      fiatValue: `$${formatFiatValue(_fees ? _fees[GasPriceType.ECONOMY].fiatValue || 0 : 0).value}`,
      nativeValue: _fees ? formatFee(_fees[GasPriceType.ECONOMY]) : '0',
    },
    {
      id: GasPriceType.REGULAR,
      title: t('select_fee.regular.title'),
      description: t('select_fee.regular.description'),
      fiatValue: `$${formatFiatValue(_fees ? _fees[GasPriceType.REGULAR].fiatValue || 0 : 0).value}`,
      nativeValue: _fees ? formatFee(_fees[GasPriceType.REGULAR]) : '0',
    },
    {
      id: GasPriceType.FAST,
      title: t('select_fee.fast.title'),
      description: t('select_fee.fast.description'),
      fiatValue: `$${formatFiatValue(_fees ? _fees[GasPriceType.FAST].fiatValue || 0 : 0).value}`,
      nativeValue: _fees ? formatFee(_fees[GasPriceType.FAST]) : '0',
    },
    {
      id: GasPriceType.FASTEST,
      title: t('select_fee.fastest.title'),
      description: t('select_fee.fastest.description'),
      fiatValue: `$${formatFiatValue(_fees ? _fees[GasPriceType.FASTEST].fiatValue || 0 : 0).value}`,
      nativeValue: _fees ? formatFee(_fees[GasPriceType.FASTEST]) : '0',
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
