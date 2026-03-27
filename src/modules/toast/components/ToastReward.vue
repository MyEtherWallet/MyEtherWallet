<template>
  <div
    v-if="showRewardToast"
    role="alert"
    :class="[
      isXS ? 'w-[95%] mx-auto' : 'w-[400px]',
      'rewards-toast-bg min-h-[60px] rounded-2xl shadow-[0px_12px_32px_-4px_rgba(0,0,0,0.32)] mt-4',
    ]"
  >
    <div class="flex w-full items-center py-3 px-3">
      <img
        :src="peggyUsdc"
        alt=""
        class="w-16 h-16 object-contain shrink-0 -ml-1"
      />
      <div class="flex-1 px-3">
        <p class="font-bold text-s-16">Congratulations!</p>
        <p class="text-s-14 text-info mt-0.5">You received your reward</p>
      </div>
      <app-btn-icon-close @close="toggleRewardToast(false)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toastStore'
import AppBtnIconClose from '@components/AppBtnIconClose.vue'
import { watch, ref, onBeforeUnmount } from 'vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { storeToRefs } from 'pinia'
import peggyUsdc from '@/assets/images/peggy/peggy-holding-usdc.png'

const { isXS } = useAppBreakpoints()
const toastStore = useToastStore()
const { showRewardToast } = storeToRefs(toastStore)
const { toggleRewardToast } = toastStore

const timeout = ref<NodeJS.Timeout | null>(null)

watch(showRewardToast, val => {
  if (timeout.value) {
    clearTimeout(timeout.value)
    timeout.value = null
  }
  if (val) {
    timeout.value = setTimeout(() => {
      toggleRewardToast(false)
    }, 5000)
  }
})

onBeforeUnmount(() => {
  if (timeout.value) {
    clearTimeout(timeout.value)
  }
})
</script>

<style scoped>
.rewards-toast-bg {
  background: linear-gradient(90deg, #c7b8ff 0%, #d1e1ff 100%);
}
</style>
