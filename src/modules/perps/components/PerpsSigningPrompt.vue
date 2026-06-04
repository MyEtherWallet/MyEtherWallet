<template>
  <transition name="fade">
    <div
      v-if="show"
      class="absolute inset-0 z-20 flex items-center justify-center bg-black/50 rounded-20"
    >
      <div
        class="bg-white rounded-20 shadow-xl mx-6 p-6 max-w-sm w-full flex flex-col gap-4"
      >
        <p class="font-bold text-s-18 text-center">Confirm Sign In</p>
        <p
          v-if="isHardwareWallet"
          class="font-bold text-primary text-center animate-pulse"
        >
          Check your device to approve
        </p>
        <div class="flex flex-col gap-1">
          <p class="text-s-11 font-bold uppercase tracking-sp-06 text-info">
            Message to sign
          </p>
          <pre
            class="bg-mewBg rounded-12 p-3 text-s-12 text-black font-mono break-all whitespace-pre-wrap max-h-40 overflow-y-auto"
          >{{ message }}</pre>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  message: string | null
  isHardwareWallet: boolean
}>()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
