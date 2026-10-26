<template>
  <app-modal
    v-model="isOpen"
    :title="$t('multi_address.remove.title', { name: displayName })"
    :subtitle="$t('multi_address.remove.subtitle', { name: displayName })"
  >
    <!-- The modal header already pads its bottom (16px, 24px from sm); pt-8
         sm:pt-6 here keeps the description↔buttons gap at 48px per design. -->
    <div class="flex items-center justify-end gap-4 px-6 pt-8 sm:pt-6 pb-6">
      <button
        data-test="delete-modal-cancel"
        class="h-12 px-4 text-s-16 font-semibold text-black"
        @click="isOpen = false"
      >
        {{ $t('multi_address.remove.cancel') }}
      </button>
      <button
        data-test="delete-modal-confirm"
        class="h-12 px-6 rounded-full bg-background-error text-white text-s-16 font-semibold transition-colors"
        @click="confirm"
      >
        {{ $t('multi_address.remove.confirm') }}
      </button>
    </div>
  </app-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppModal from '@/components/modal/AppModal.vue'
import { truncate } from '@/utils/filters'

const isOpen = defineModel<boolean>('isOpen', { default: false })
const props = defineProps<{ accountName?: string }>()
const emit = defineEmits<{ confirm: [] }>()

// Cap absurdly long custom names so the modal header stays readable.
const displayName = computed(() => truncate(props.accountName ?? '', 32))

const confirm = (): void => {
  emit('confirm')
  isOpen.value = false
}
</script>
