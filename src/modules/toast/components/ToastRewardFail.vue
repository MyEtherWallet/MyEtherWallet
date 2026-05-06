<template>
  <div
    v-if="showRewardFailToast"
    role="alert"
    :class="[
      isXS ? 'w-[95%] mx-auto' : 'w-[400px]',
      'relative flex gap-5 items-start p-5 overflow-hidden bg-[#ffdbe3] rounded-[20px] shadow-[0px_3px_12px_-6px_rgba(0,0,0,0.3)] mt-4',
    ]"
  >
    <img :src="usdcTokens" alt="" class="w-12 shrink-0 object-contain" />
    <div class="flex flex-col gap-5 flex-1 min-w-0">
      <div class="flex flex-col gap-2">
        <p
          class="font-bold text-[20px] leading-[22px] tracking-[-0.4px] text-[#e40c58]"
        >
          No rewards left
        </p>
        <p class="text-[16px] leading-[22px]">
          You weren't among the first 10 users. Try again next hour.
        </p>
      </div>
      <button
        class="flex items-center gap-2 font-semibold text-s-14 tracking-[-0.28px] leading-5 w-fit"
        @click="toggleRewardFailToast(false)"
      >
        All about rewards
        <ArrowRightIcon class="w-4 h-4 shrink-0" />
      </button>
    </div>
    <app-btn-icon-close
      class="absolute top-2 right-2 shrink-0"
      @close="toggleRewardFailToast(false)"
    />
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toastStore'
import AppBtnIconClose from '@components/AppBtnIconClose.vue'
import { ArrowRightIcon } from '@heroicons/vue/16/solid'
import { watch, ref, onBeforeUnmount } from 'vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { storeToRefs } from 'pinia'
import usdcTokens from '@/assets/images/rewards/usdc-coin.png'

const { isXS } = useAppBreakpoints()
const toastStore = useToastStore()
const { showRewardFailToast } = storeToRefs(toastStore)
const { toggleRewardFailToast } = toastStore

const timeout = ref<NodeJS.Timeout | null>(null)

watch(showRewardFailToast, val => {
  if (timeout.value) {
    clearTimeout(timeout.value)
    timeout.value = null
  }
  if (val) {
    timeout.value = setTimeout(() => {
      toggleRewardFailToast(false)
    }, 5000)
  }
})

onBeforeUnmount(() => {
  if (timeout.value) clearTimeout(timeout.value)
})
</script>
