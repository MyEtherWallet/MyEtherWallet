<template>
  <app-dialog
    v-model:is-open="isOpen"
    class="w-full max-w-sm mx-auto"
    has-content-gutter
    @close-dialog="$emit('cancel')"
  >
    <template #title>
      <div class="flex flex-col items-center gap-1 text-center pt-5 w-full">
        <p class="font-bold text-s-20">
          {{ $t('perps.banner.confirm-sign-in-title') }}
        </p>
        <p v-if="isWaitingForConfirm" class="text-fg-subtle text-s-13">
          {{ $t('perps.banner.review-message') }}
        </p>
        <p
          v-else-if="isHardwareWallet"
          class="font-bold text-brand text-s-14 animate-pulse"
        >
          {{ $t('perps.banner.check-device') }}
        </p>
        <p v-else class="text-fg-subtle text-s-13 animate-pulse">
          {{ $t('perps.banner.signing') }}
        </p>
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-5 pb-6">
        <!-- Message box -->
        <div class="flex flex-col gap-1">
          <p class="text-s-11 font-bold uppercase tracking-sp-06 text-fg-subtle">
            {{ $t('perps.banner.message-to-sign-label') }}
          </p>
          <pre
            class="bg-brand-subtle rounded-12 p-3 text-s-12 text-fg font-mono break-all whitespace-pre-wrap max-h-44 overflow-y-auto"
            >{{ message }}</pre
          >
        </div>

        <!-- Hardware wallet hint -->
        <p
          v-if="isWaitingForConfirm && isHardwareWallet"
          class="text-s-12 text-fg-subtle text-center -mt-2"
        >
          {{ $t('perps.banner.hardware-confirm-hint') }}
        </p>

        <!-- Actions (only while waiting for user click) -->
        <div v-if="isWaitingForConfirm" class="flex gap-3">
          <AppBaseButton
            class="flex-1 rounded-full border border-fg-muted py-2.5 text-s-14 font-medium text-fg-subtle hoverOpacity"
            is-outline
            @click="$emit('cancel')"
          >
            {{ $t('perps.confirm.cancel') }}
          </AppBaseButton>
          <AppBaseButton
            class="flex-1 rounded-full bg-brand text-fg-on-fill py-2.5 text-s-14 font-medium hoverOpacity"
            @click="$emit('confirm')"
          >
            {{ $t('perps.banner.sign-button') }}
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
