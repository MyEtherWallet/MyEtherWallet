<template>
  <!-- z-[2300]: above the app-chrome overlays (multi-address popup + backdrop
       at z-[2100..2120], teleported menus at z-[2200]) so toasts like
       "wallet connected" are never hidden behind a popup's dim backdrop.
       min-w-90 (the toast width): a leaving toast goes position: absolute, and
       without it the last one would squeeze to min-content as it fades out. -->
  <div
    :class="[
      isXS ? 'bottom-2 left-0 w-full' : 'bottom-6 left-10 min-w-90',
      'fixed z-[2300]',
    ]"
  >
    <div class="relative">
      <transition-group name="fadelist">
        <toast-reward key="toast-reward" />
        <template v-for="(toast, index) in showToastMessages" :key="toast.id">
          <toast-layout
            v-if="isLegacyToast(toast)"
            :toast="toast"
            :index="index"
          />
          <toast-message v-else :toast="toast" />
        </template>
      </transition-group>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useToastStore } from '@/stores/toastStore'
import { storeToRefs } from 'pinia'
import ToastLayout from './components/ToastLayout.vue'
import ToastMessage from './components/ToastMessage.vue'
import ToastReward from './components/ToastReward.vue'
import { isLegacyToast } from './toastMapping'
import { computed } from 'vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'

const toastStore = useToastStore()
const { messages } = storeToRefs(toastStore)
const { isXS } = useAppBreakpoints()
const showToastMessages = computed(() => {
  return messages.value.slice(0, 4)
})
</script>
