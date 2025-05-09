<template>
  <div class="grid grid-cols-1">
    <div class="border border-grey-outline rounded-2xl p-1 xs:p-4">
      <div v-for="i in 5" :key="i">
        <button
          v-if="!isLoading"
          :class="[
            walletList[i - 1].index === model ? 'bg-grey-5' : 'hoverNoBG',
            'flex px-2 xs:px-4 py-2 items-center gap-1 xs:gap-2 xs:gap-5 w-full rounded-2xl  min-h-12',
          ]"
          @click="model = walletList[i - 1].index"
          v-ripple
        >
          <div class="hidden xs:block text-xs text-info min-w-5">
            {{ walletList[i - 1].index }}
          </div>
          <app-blockie
            :address="walletList[i - 1].address"
            class="mx-1 xs:mx-0"
          />
          <div class="text-start">
            <div class="flex items-center">
              <p class="text-sm xs:text-base">
                {{ truncateAddress(walletList[i - 1].address, 7) }}
              </p>
              <app-btn-copy
                :copyValue="walletList[i - 1].address"
                class="hidden xs:block text-primary ml-4"
                @click.stop
              />
              <app-btn-icon
                :href="`https://ethvm.com/address/${walletList[i - 1].address}`"
                label="view address in explorer"
                class="text-primary ml-1 xs:ml-0"
                @click.stop
              >
                <arrow-top-right-on-square-icon class="w-5 h-5" />
              </app-btn-icon>
            </div>
            <!--TODO: add balance-->
            <p class="text-xs text-info">0 Eth</p>
          </div>
          <div
            :class="[
              {
                'bg-primary': walletList[i - 1].index === model,
              },
              'border border-primary border-2 w-5 h-5 ml-auto rounded-full flex items-center justify-center transition-colors',
            ]"
          >
            <check-icon
              v-if="walletList[i - 1].index === model"
              class="text-white w-3 h-3"
            />
          </div>
        </button>
        <div
          v-else
          class="min-h-12 animate-pulse bg-grey-5 my-2 rounded-2xl"
        ></div>
      </div>
    </div>
    <div class="mt-2 flex items-center justify-center gap-2">
      <app-btn-icon
        @click="emit('prevpage')"
        label="previous page"
        :disabled="isDisabled"
      >
        <chevron-left-icon class="w-5 h-5" />
      </app-btn-icon>
      <app-btn-icon
        @click="emit('nextpage')"
        label="next page"
        :disabled="isLoading"
      >
        <chevron-right-icon class="w-5 h-5" />
      </app-btn-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import AppBlockie from '@/components/AppBlockie.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppBtnCopy from '@/components/AppBtnCopy.vue'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import { CheckIcon } from '@heroicons/vue/24/solid'
import { ChevronLeftIcon } from '@heroicons/vue/24/solid'
import { ChevronRightIcon } from '@heroicons/vue/24/solid'
import { truncateAddress } from '@/utils/filters'
import { type SelectAddress } from '../types/selectAddress'
/**
 * Select Address List Component
 * Used In Access Mnemonic and Hardware Wallet
 *
 * @model - The selected index of the list
 * @emits prevpage
 * @emits nextpage
 */

const props = defineProps({
  /**
   * @wallet - The selected index
   */
  walletList: {
    type: Array as PropType<SelectAddress[]>,
    required: true,
  },
  /**
   * @isLoading - Whether the list is loading
   */
  isLoading: {
    type: Boolean,
    required: true,
    default: true,
  },
})

const model = defineModel<number>()

const emit = defineEmits(['prevpage', 'nextpage'])

const isDisabled = computed(() => {
  return props.isLoading ? true : props.walletList[0].index === 0
})
</script>
