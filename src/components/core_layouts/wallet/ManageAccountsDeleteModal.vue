<template>
  <app-dialog
    v-model:is-open="isOpen"
    class="w-full sm:max-w-[400px] sm:mx-auto"
  >
    <template #title>
      <div class="flex flex-col gap-1 px-6 pt-6 pr-12">
        <h1 class="text-s-20 font-bold text-black leading-[22px] tracking-[-0.4px]">
          {{ $t('multi_address.remove.title') }}
        </h1>
        <p class="text-s-16 text-[#575757] leading-[22px]">
          {{ $t('multi_address.remove.subtitle', { name: accountName }) }}
        </p>
      </div>
    </template>
    <template #content>
      <!-- AppDialog's title wrapper already contributes pb-2 (8px); pt-6 here
           makes the total header↔content gap 32px per design. -->
      <div class="flex flex-col gap-3 px-6 pt-6 pb-6">
        <button
          data-test="delete-modal-confirm"
          class="h-12 w-full rounded-[24px] bg-[#e40c58] text-white text-s-16 font-semibold transition-colors"
          @click="confirm"
        >
          {{ $t('multi_address.remove.confirm') }}
        </button>
        <button
          data-test="delete-modal-cancel"
          class="h-12 w-full rounded-[24px] bg-[#f5f5f5] text-black text-s-16 font-semibold transition-colors"
          @click="isOpen = false"
        >
          {{ $t('multi_address.remove.cancel') }}
        </button>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import AppDialog from '@/components/AppDialog.vue'

const isOpen = defineModel<boolean>('isOpen', { default: false })
defineProps<{ accountName?: string }>()
const emit = defineEmits<{ confirm: [] }>()

const confirm = (): void => {
  emit('confirm')
  isOpen.value = false
}
</script>
