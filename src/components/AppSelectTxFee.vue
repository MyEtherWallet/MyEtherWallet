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
              model === fee.id
                ? 'border-primary outline outline-primary bg-grey-5'
                : ' border-grey-outline',
              'border-1 w-full  rounded-2xl hoverNoBG p-2 xs:p-4 min-h-[90px] ',
            ]"
            @click="setFee(fee.id)"
          >
            <div class="flex items-center">
              <div :class="[{ ' text-primary': model === fee.id }, 'mr-4']">
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
import { ref, computed, defineModel, watch } from 'vue'
import { GasPriceType, type GasFeeType } from '@/providers/types'
import AppDialog from '@/components/AppDialog.vue'
import { fromWei } from 'web3-utils'

import {
  formatFloatingPointValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'

/** ----------------
 * Props
 ------------------*/
interface Props {
  fees: GasFeeType
  isLoading: boolean
}
const props = defineProps<Props>()

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
const model = defineModel<GasPriceType>({
  required: true,
})

const setFee = (fee: GasPriceType) => {
  model.value = fee
  closeFeeModal()
  //TODO: add amplitude
}

const selectedFeeNative = computed(() => {
  if (hasFees.value) {
    const converted = fromWei(props.fees[model.value].nativeValue, 'ether')
    return `${formatFloatingPointValue(converted).value} ${props.fees[model.value].nativeSymbol}`
  }
  return ''
})

const selectedFeeFiat = computed(() => {
  if (hasFees.value) {
    const fiatValue = formatFiatValue(props.fees[model.value].fiatValue).value
    return `$${fiatValue} ${props.fees[model.value].fiatSymbol}`
  }
  return ''
})

/** ----------------
 * Fee Options
 ------------------*/

interface DisplayFee {
  id: GasPriceType
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

const feesReady = ref(false)

watch(
  () => props.isLoading,
  () => {
    if (!props.isLoading) {
      feesReady.value = false
      const keys = Object.keys(props.fees) as GasPriceType[]
      keys.forEach(key => {
        const fee = props.fees[key]
        const index = displayFees.findIndex(f => f.id === key)
        displayFees[index].fiatValue =
          `$${formatFiatValue(fee.fiatValue).value} ${fee.fiatSymbol}`
        displayFees[index].nativeValue =
          `${fromWei(fee.nativeValue, 'ether')} ${fee.nativeSymbol}`
      })
      feesReady.value = true
    } else {
      feesReady.value = false
    }
  },
)

const hasFees = computed(() => {
  return feesReady.value && props.fees && Object.keys(props.fees).length > 0
})
</script>
