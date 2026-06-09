<template>
  <app-dialog
    v-model:is-open="isOpen"
    class="w-full max-w-sm mx-auto"
    has-content-gutter
    @close-dialog="$emit('cancel')"
  >
    <template #title>
      <div class="flex flex-col items-center gap-1 text-center pt-5 w-full">
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
        <p v-else class="text-info text-s-13 animate-pulse">Signing…</p>
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-5 pb-6">
        <!-- Message box -->
        <div class="flex flex-col gap-1">
          <p class="text-s-11 font-bold uppercase tracking-sp-06 text-info">
            Message to sign
          </p>
          <pre
            class="bg-mewBg rounded-12 p-3 text-s-12 text-black font-mono break-all whitespace-pre-wrap max-h-44 overflow-y-auto"
            >{{ message }}</pre
          >
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
          <AppBaseButton
            class="flex-1 rounded-full border border-grey-30 py-2.5 text-s-14 font-medium text-grey-70 hoverOpacity"
            is-outline
            @click="$emit('cancel')"
          >
            Cancel
          </AppBaseButton>
          <AppBaseButton
            class="flex-1 rounded-full bg-primary text-white py-2.5 text-s-14 font-medium hoverOpacity"
            @click="$emit('confirm')"
          >
            Sign
          </AppBaseButton>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'

const props = defineProps<{
  show: boolean
  message: string | null
  isHardwareWallet: boolean
  isWaitingForConfirm: boolean
}>()

defineEmits<{
  confirm: []
  cancel: []
}>()

const isOpen = ref(props.show)

watch(
  () => props.show,
  val => {
    isOpen.value = val
  },
)
</script>
