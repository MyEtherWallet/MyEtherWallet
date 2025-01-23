<template>
  <div
    class="rounded-lg border-1 bg-white border-grey-30 border-solid px-4 py-2 flex justify-between items-center my-4"
  >
    <div>
      Fee: <span> 0.80 USD </span>
      <span class="text-grey-30 pl-2"> 0.000247 ETH </span>
    </div>
    <div class="flex items-center cursor-pointer" @click="openFeeModal">
      <clock-icon class="w-4 h-4" />
      <span class="mx-2"> 2 mins </span>
      <chevron-down-icon class="w-4 h-4" />
    </div>
  </div>

  <fwb-modal size="xl" v-if="openModal" @close="closeFeeModal">
    <template #header>
      <div class="w-full">
        <div class="items-center text-xl">Choose transaction fee</div>
      </div>
    </template>
    <template #body>
      <div>
        <!-- current selected fee -->
        <div class="flex justify-between items-center mb-4 py-4 px-2">
          <div class="flex flex-col">
            <div>
              <span class="text-[21px]"> $0.80 </span>
              <span class="text-grey-30 pl-1"> 0.000247 ETH </span>
            </div>
            <div class="text-grey-30">This fee is charged by the network.</div>
          </div>
          <div class="flex items-center">
            <clock-icon class="w-4 h-4" />
            <span class="ml-2">2 mins</span>
          </div>
        </div>
        <!-- fee options -->
        <!-- Economy -->
        <div
          class="flex justify-between items-center my-2 bg-white rounded-lg hover:bg-grey-5 cursor-pointer py-4 px-2"
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
          <div class="text-[16px] text-grey-30">-$0.2214</div>
        </div>
        <!-- Recommended -->
        <div
          class="flex justify-between items-center my-2 bg-white rounded-lg hover:bg-grey-5 cursor-pointer py-4 px-2"
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
          <!-- <div class="text-[16px] text-grey-30">-$0.2214</div> -->
        </div>
        <!-- Higher priority -->
        <div
          class="flex justify-between items-center my-2 bg-white rounded-lg hover:bg-grey-5 cursor-pointer py-4 px-2"
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
          <div class="text-[16px] text-grey-30">+$0.1298</div>
        </div>
        <div
          class="flex justify-between items-center my-2 bg-white rounded-lg hover:bg-grey-5 cursor-pointer py-4"
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
          <div class="text-[16px] text-grey-30">+$0.2905</div>
        </div>
      </div>
    </template>
  </fwb-modal>
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
import { FwbModal } from 'flowbite-vue'
import { ref } from 'vue'

// const currentSelected = ref('low')

const openModal = ref(false)

const openFeeModal = () => {
  openModal.value = true
}

const closeFeeModal = () => {
  openModal.value = false
}
</script>
