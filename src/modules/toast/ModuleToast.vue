<template>
  <!-- z-[2300]: above the app-chrome overlays (multi-address popup + backdrop
       at z-[2100..2120], teleported menus at z-[2200]) so toasts like
       "wallet connected" are never hidden behind a popup's dim backdrop. -->
  <div
    :class="[
      isXS ? 'bottom-2 left-0 w-full' : 'bottom-6 left-10',
      'fixed z-[2300]',
    ]"
  >
    <div class="relative">
      <transition-group name="fadelist">
        <toast-reward key="toast-reward" />
        <component
          :is="i.variant === 'dark' ? ToastTradeStatus : ToastLayout"
          v-for="(i, index) in showToastMessages"
          :key="`${i.text}-${index}`"
          :toast="i"
          :index="index"
        />
      </transition-group>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useToastStore } from '@/stores/toastStore'
import { storeToRefs } from 'pinia'
import ToastLayout from './components/ToastLayout.vue'
import ToastTradeStatus from './components/ToastTradeStatus.vue'
import ToastReward from './components/ToastReward.vue'
import { computed } from 'vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'

const toastStore = useToastStore()
const { messages } = storeToRefs(toastStore)
const { isXS } = useAppBreakpoints()
const showToastMessages = computed(() => {
  return messages.value.slice(0, 4)
})
</script>
