<template>
  <app-dialog v-model:is-open="model" class="sm:max-w-[420px] sm:mx-auto">
    <template #content>
      <div class="px-6 pb-8 pt-4">
        <div class="flex flex-col items-center pt-8 mb-10 text-center">
          <div
            class="w-16 h-16 bg-[#e6f6f4] rounded-full flex items-center justify-center mb-6"
          >
            <check-circle-icon class="w-10 h-10 text-success" />
          </div>
          <h3 class="text-s-24 font-bold mb-3 text-p-120">
            Trade Order Submitted
          </h3>
          <p class="text-s-16 text-grey-50 px-4 leading-relaxed">
            Your trade order has been submitted to the 1inch Fusion network. The
            order will be filled by market makers.
          </p>
        </div>

        <div class="px-4">
          <div class="bg-mewBg rounded-16 p-4">
            <div class="flex justify-between items-center">
              <span class="text-s-14 text-info">Order Hash</span>
              <div class="flex items-center gap-2">
                <span class="text-s-12 font-mono truncate max-w-[150px]">
                  {{ truncatedHash }}
                </span>
                <app-btn-copy :copy-value="orderHash" />
              </div>
            </div>
            <div class="flex justify-between items-center mt-3">
              <span class="text-s-14 text-info">Network</span>
              <div class="flex items-center gap-2">
                <img
                  v-if="fromChain?.icon"
                  :src="fromChain.icon"
                  :alt="fromChain.nameLong"
                  class="w-5 h-5 rounded-full"
                />
                <span class="text-s-14 font-medium">{{
                  fromChain?.nameLong
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row mt-10 gap-3">
          <app-base-button class="flex-1" @click="close">
            Close
          </app-base-button>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnCopy from '@/components/AppBtnCopy.vue'
import { CheckCircleIcon } from '@heroicons/vue/24/solid'
import type { Chain } from '@/mew_api/types'

const model = defineModel<boolean>('isOpen', { default: false })

const props = defineProps<{
  orderHash: string
  fromChain?: Chain
}>()

const truncatedHash = computed(() => {
  if (!props.orderHash) return ''
  if (props.orderHash.length <= 16) return props.orderHash
  return `${props.orderHash.slice(0, 8)}...${props.orderHash.slice(-8)}`
})

const close = () => {
  model.value = false
}
</script>
