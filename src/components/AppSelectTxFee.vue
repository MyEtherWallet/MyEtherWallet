<template>
  <div
    class="rounded-lg border-1 bg-white border-grey-30 border-solid px-4 py-2 flex justify-between items-center my-4"
  >
    <div>
      Fee: <span> {{ selectedFeeFiat }} </span>
      <span class="text-grey-30 pl-2"> {{ selectedFeeNative }} </span>
    </div>
    <div class="flex items-center cursor-pointer" @click="openFeeModal">
      <clock-icon class="w-4 h-4" />
      <span class="mx-2"> {{ gasForTime }} </span>
      <chevron-down-icon class="w-4 h-4" />
    </div>
  </div>

  <app-dialog
    title="Choose transaction fee"
    v-model:is-open="openModal"
    class="sm:max-w-[800px] sm:mx-auto"
  >
    <template #content>
      <div>
        <!-- current selected fee -->
        <div class="flex justify-between items-center mb-4 py-4 px-2">
          <div class="flex flex-col">
            <div>
              <span class="text-[21px]"> {{ selectedFiatCurrencyF }} </span>
              <span class="text-grey-30 pl-1"> {{ selectedFeeNative }} </span>
            </div>
            <div class="text-grey-30">This fee is charged by the network.</div>
          </div>
          <div class="flex items-center">
            <clock-icon class="w-4 h-4" />
            <span class="ml-2">{{ gasForTime }}</span>
          </div>
        </div>
        <!-- fee options -->
        <!-- Economy -->
        <div
          :class="{ '!bg-grey-5': isEconomy }"
          class="flex justify-between items-center my-2 bg-white rounded-lg hover:bg-grey-5 cursor-pointer py-4 px-2"
          @click="setFee(GasPriceType.ECONOMY)"
        >
          <div class="flex items-center">
            <currency-dollar-icon class="w-6 h-6 mr-3" />
            <div class="flex flex-col w-[250px]">
              <span class="text-[16px]">Economy</span>
              <span class="text-grey-30 text-[14px]"
                >Will likely go through unless activity increases</span
              >
            </div>
          </div>
          <div
            v-if="!isEconomy"
            :class="{
              'text-mew-green-text': getDiff(GasPriceType.ECONOMY).isPositive,
            }"
            class="text-[16px] text-grey-30"
          >
            ${{ getDiff(GasPriceType.ECONOMY).value }}
          </div>
        </div>
        <!-- Recommended -->
        <div
          :class="{ '!bg-grey-5': isRegular }"
          class="flex justify-between items-center my-2 bg-white rounded-lg hover:bg-grey-5 cursor-pointer py-4 px-2"
          @click="setFee(GasPriceType.REGULAR)"
        >
          <div class="flex items-center">
            <check-icon class="w-6 h-6 mr-3" />
            <div class="flex flex-col w-[250px]">
              <span class="text-[16px]">Recommended</span>
              <span class="text-grey-30 text-[14px]"
                >Will reliably go through in most scenarios</span
              >
            </div>
          </div>
          <div
            v-if="!isRegular"
            :class="{
              'text-mew-green-text': getDiff(GasPriceType.REGULAR).isPositive,
            }"
            class="text-[16px] text-grey-30"
          >
            ${{ getDiff(GasPriceType.REGULAR).value }}
          </div>
        </div>
        <!-- Higher priority -->
        <div
          :class="{ '!bg-grey-5': isFast }"
          class="flex justify-between items-center my-2 bg-white rounded-lg hover:bg-grey-5 cursor-pointer py-4 px-2"
          @click="setFee(GasPriceType.FAST)"
        >
          <div class="flex items-center">
            <arrow-up-icon class="w-6 h-6 mr-3" />
            <div class="flex flex-col w-[250px]">
              <span class="text-[16px]">Higher Priority</span>
              <span class="text-grey-30 text-[14px]"
                >Will go through even if there is a sudden activity
                increase</span
              >
            </div>
          </div>
          <div
            v-if="!isFast"
            :class="{
              'text-mew-green-text': getDiff(GasPriceType.FAST).isPositive,
            }"
            class="text-[16px] text-grey-30"
          >
            ${{ getDiff(GasPriceType.FAST).value }}
          </div>
        </div>
        <div
          :class="{ '!bg-grey-5': isFastest }"
          class="flex justify-between items-center my-2 bg-white rounded-lg hover:bg-grey-5 cursor-pointer py-4"
          @click="setFee(GasPriceType.FASTEST)"
        >
          <div class="flex items-center">
            <div class="flex">
              <arrow-long-up-icon class="w-6 h-6" />
              <arrow-long-up-icon class="w-6 h-6 mr-3" />
            </div>
            <div class="flex flex-col w-[250px]">
              <span class="text-[16px]">Highest Priority</span>
              <span class="text-grey-30 text-[14px]"
                >Will go through, fast, in 99.99% of the cases</span
              >
            </div>
          </div>
          <div
            v-if="!isFastest"
            :class="{
              'text-mew-green-text': getDiff(GasPriceType.FASTEST).isPositive,
            }"
            class="text-[16px] text-grey-30"
          >
            ${{ getDiff(GasPriceType.FASTEST).value }}
          </div>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import {
  ChevronDownIcon,
  ArrowUpIcon,
  ArrowLongUpIcon,
} from '@heroicons/vue/24/solid'
import {
  ClockIcon,
  CurrencyDollarIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'
import { ref, computed, defineModel } from 'vue'
import { GasPriceType } from '@/providers/types'

import AppDialog from '@/components/AppDialog.vue'
import { fromWei } from 'web3-utils'
import BigNumber from 'bignumber.js'

const model = defineModel({
  required: true,
})

const props = defineProps({
  fees: {
    type: Object,
    required: true,
  },
})

const openModal = ref(false)

const isEconomy = computed(() => model.value === GasPriceType.ECONOMY)
const isRegular = computed(() => model.value === GasPriceType.REGULAR)
const isFast = computed(() => model.value === GasPriceType.FAST)
const isFastest = computed(() => model.value === GasPriceType.FASTEST)
const gasForTime = computed(() => {
  switch (model.value) {
    case GasPriceType.ECONOMY:
      return '5 mins'
    case GasPriceType.REGULAR:
      return '2 mins'
    case GasPriceType.FAST:
      return '1 mins'
    case GasPriceType.FASTEST:
      return '30 secs'
    default:
      return '2 mins'
  }
})

const hasFee = computed(() => {
  return props.fees && Object.keys(props.fees).length > 0
})

const selectedFeeNative = computed(() => {
  if (hasFee.value) {
    return `${fromWei(props.fees[model.value as keyof typeof props.fees].nativeValue, 'ether')} ${props.fees[model.value as keyof typeof props.fees].nativeSymbol}`
  }

  return ''
})

const selectedFeeFiat = computed(() => {
  if (hasFee.value) {
    return `${props.fees[model.value as keyof typeof props.fees].fiatValue} ${props.fees[model.value as keyof typeof props.fees].fiatSymbol}`
  }

  return 'Loading...'
})

const selectedFiatCurrencyF = computed(() => {
  if (hasFee.value) {
    return `$${props.fees[model.value as keyof typeof props.fees].fiatValue}`
  }

  return 'Loading...'
})

const getDiff = (fee: string) => {
  const selectedFeeValue = props.fees[fee as keyof typeof props.fees].fiatValue
  const diffValue = BigNumber(selectedFeeValue).minus(
    props.fees[model.value as keyof typeof props.fees].fiatValue,
  )
  return {
    value: diffValue.toString(),
    isPositive: diffValue.isPositive(),
  }
}

const openFeeModal = () => {
  openModal.value = true
}

const closeFeeModal = () => {
  openModal.value = false
}

const setFee = (fee: string) => {
  model.value = fee
  closeFeeModal()
}
</script>
