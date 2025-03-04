<template>
  <div :class="[isXS ? 'bottom-2 left-0 w-full' : 'bottom-6 left-10', 'fixed']">
    <div class="relative">
      <transition-group name="fadelist">
        <toast-layout
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
import { computed } from 'vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'

const toastStore = useToastStore()
const { messages } = storeToRefs(toastStore)
const { isXS } = useAppBreakpoints()
const showToastMessages = computed(() => {
  return messages.value.slice(0, 4)
})
</script>
