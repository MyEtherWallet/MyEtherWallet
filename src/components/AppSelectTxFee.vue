<template>
  <button
    class="hoverNoBG rounded-16 border-1 bg-white border-grey-outline border-solid px-4 py-3 flex justify-between items-center my-4 text-sm w-full"
    @click.prevent="openFeeModal"
    :disabled="!hasFees"
  >
    <div class="flex items-center">
      <p>Fee:</p>
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

  <app-dialog
    title="Choose transaction fee"
    v-model:is-open="openModal"
    class="max-w-[560px] sm:mx-auto"
  >
    <template #content>
      <div class="mx-6 mb-6">
        <p class="text-info sm:mx-3 mb-5">
          This fee is charged by the Ethereum network and fluctuates depending
          on network traffic. MEW does not profit from this fee.
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
                :class="[{ ' text-primary': gasPriceType === fee.id }, 'mr-4']"
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
              <div class="text-right ml-auto min-w-[140px]">
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
  GetEVMGasFeesResponse,
  EVMGasFeeInfo,
} from '@/mew_api/types'

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
  txData?: HexPrefixedString
  txValue?: HexPrefixedString
  txToAdr?: HexPrefixedString
}

const props = defineProps<Props>()

/** ----------------
 * Fetch Fees
 ------------------*/

const chainStore = useChainsStore()
const { isLoaded: isLoadedChainsData, selectedChain } = storeToRefs(chainStore)
const walletStore = useWalletStore()
const { isWalletConnected, walletAddress } = storeToRefs(walletStore)

const txData = computed(() => {
  //EVM CHAINS ONLY
  const _address =
    isWalletConnected.value && walletAddress.value && walletAddress.value !== ''
      ? (walletAddress.value as HexPrefixedString)
      : DEFAULT_ADR
  return {
    to: props.txToAdr ? props.txToAdr : DEFAULT_ADR,
    address: _address,
    value: props.txValue ? props.txValue : DEFAULT_VALUE,
    data: props.txData ? props.txData : DEFAULT_DATA,
  }
  //TO DO: BITCOIN HANDLER
})

const fetchURL = computed(() => {
  if (isLoadedChainsData.value && selectedChain.value) {
    //EVM CHAINS ONLY
    return `/v1/evm/${selectedChain.value.chainID}/estimates/?noInjectErrors=false`
    //TO DO: BITCOIN HANDLER
  }
  return ''
})
const feesReady = ref(false)

const { data, onFetchResponse, execute } =
  useFetchMewApi<GetEVMGasFeesResponse>(fetchURL, 'POST', txData.value, {
    immediate: false,
  })
onFetchResponse(() => {
  if (data.value && data.value.fees) {
    const keys = Object.keys(data.value.fees) as GasPriceType[]

    for (const key of keys) {
      const fee = data.value.fees[key] as EVMGasFeeInfo
      const index = displayFees.findIndex(f => f.id === key)
      displayFees[index].fiatValue =
        `$${formatFiatValue(fee.fiatValue || 0).value} ${fee.fiatSymbol}`
      displayFees[index].nativeValue = formatFee(fee)
    }

    feesReady.value = true
  }
})

onMounted(() => {
  if (fetchURL.value !== '') {
    feesReady.value = false
    console.log('Fetching fees on Mounted', fetchURL.value)
    execute()
  }
})

watch(
  () => fetchURL.value,
  () => {
    if (fetchURL.value !== '') {
      feesReady.value = false
      console.log('Fetching fees on watch', fetchURL.value)
      execute()
    }
  },
)

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
const formatFee = (fee: EVMGasFeeInfo) => {
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

const displayFees: DisplayFee[] = [
  {
    id: GasPriceType.ECONOMY,
    title: 'Economy',
    description: 'Will likely go through unless activity increases',
    fiatValue: '0',
    nativeValue: '0',
  },
  {
    id: GasPriceType.REGULAR,
    title: 'Recommended',
    description: 'Will reliably go through in most scenarios',
    fiatValue: '0',
    nativeValue: '0',
  },
  {
    id: GasPriceType.FAST,
    title: 'Higher Priority',
    description: 'Will go through even if there is a sudden activity increase',
    fiatValue: '0',
    nativeValue: '0',
  },
  {
    id: GasPriceType.FASTEST,
    title: 'Highest Priority',
    description: 'Will go through, fast, in 99.99% of the cases',
    fiatValue: '0',
    nativeValue: '0',
  },
]

const hasFees = computed<boolean>(() => {
  return (
    feesReady.value &&
    data.value !== null &&
    Object.keys(data.value.fees).length > 0
  )
})
</script>
