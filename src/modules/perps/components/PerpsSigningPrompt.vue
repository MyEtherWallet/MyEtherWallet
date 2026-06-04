<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4"
      >
        <div class="bg-white rounded-20 shadow-2xl w-full max-w-sm flex flex-col gap-5 p-6">

          <!-- Header -->
          <div class="flex flex-col items-center gap-1 text-center">
            <p class="font-bold text-s-20">Confirm Sign In</p>
            <p v-if="isWaitingForConfirm" class="text-info text-s-13">
              Review the message before signing.
            </p>
            <p
              v-else-if="isHardwareWallet"
              class="font-bold text-primary text-s-14 animate-pulse"
            >
              Check your device to approve
            </p>
            <p v-else class="text-info text-s-13 animate-pulse">
              Signing…
            </p>
          </div>

          <!-- Message box -->
          <div class="flex flex-col gap-1">
            <p class="text-s-11 font-bold uppercase tracking-sp-06 text-info">
              Message to sign
            </p>
            <pre
              class="bg-mewBg rounded-12 p-3 text-s-12 text-black font-mono break-all whitespace-pre-wrap max-h-44 overflow-y-auto"
            >{{ message }}</pre>
          </div>

          <!-- Hardware wallet hint -->
          <p
            v-if="isWaitingForConfirm && isHardwareWallet"
            class="text-s-12 text-info text-center -mt-2"
          >
            You will also need to confirm on your device.
          </p>

          <!-- Actions (only while waiting for user click) -->
          <div v-if="isWaitingForConfirm" class="flex gap-3">
            <button
              class="flex-1 rounded-full border border-grey-30 py-2.5 text-s-14 font-medium text-grey-70 hoverOpacity"
              @click="$emit('cancel')"
            >
              Cancel
            </button>
            <button
              class="flex-1 rounded-full bg-primary text-white py-2.5 text-s-14 font-medium hoverOpacity"
              @click="$emit('confirm')"
            >
              Sign
            </button>
          </div>

        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  message: string | null
  isHardwareWallet: boolean
  isWaitingForConfirm: boolean
}>()

defineEmits<{
  confirm: []
  cancel: []
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
