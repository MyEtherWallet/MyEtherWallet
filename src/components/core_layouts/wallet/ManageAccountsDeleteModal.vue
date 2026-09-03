<template>
  <app-dialog
    v-model:is-open="isOpen"
    class="w-full max-w-[400px] mx-auto"
  >
    <template #title>
      <div class="flex flex-col gap-1 px-6 pt-6 pr-12">
        <h1 class="text-s-20 font-bold text-black leading-[22px] tracking-[-0.4px] break-words">
          {{ $t('multi_address.remove.title', { name: displayName }) }}
        </h1>
        <p class="text-s-16 text-[#575757] leading-[22px] break-words">
          {{ $t('multi_address.remove.subtitle', { name: displayName }) }}
        </p>
      </div>
    </template>
    <template #content>
      <!-- AppDialog's title wrapper already contributes pb-2 (8px); pt-10 here
           makes the total description↔buttons gap 48px per design. -->
      <div class="flex items-center justify-end gap-4 px-6 pt-10 pb-6">
        <button
          data-test="delete-modal-cancel"
          class="h-12 px-4 text-s-16 font-semibold text-black"
          @click="isOpen = false"
        >
          {{ $t('multi_address.remove.cancel') }}
        </button>
        <button
          data-test="delete-modal-confirm"
          class="h-12 px-6 rounded-full bg-[#e40c58] text-white text-s-16 font-semibold transition-colors"
          @click="confirm"
        >
          {{ $t('multi_address.remove.confirm') }}
        </button>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import { truncate } from '@/utils/filters'

const isOpen = defineModel<boolean>('isOpen', { default: false })
const props = defineProps<{ accountName?: string }>()
const emit = defineEmits<{ confirm: [] }>()

// Cap absurdly long custom names so the modal stays readable; break-words on the
// text then wraps whatever remains instead of overflowing the dialog.
const displayName = computed(() => truncate(props.accountName ?? '', 32))

const confirm = (): void => {
  emit('confirm')
  isOpen.value = false
}
</script>
