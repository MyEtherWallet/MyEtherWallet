<template>
  <!-- Title centred in the header bar, on the close button's line; the
       description reads as left-aligned body copy. Footer from AppModal's
       `buttons`: equal-width Button Group, danger tone on the confirm. -->
  <app-modal
    v-model="isOpen"
    :title="$t('multi_address.remove.title', { name: displayName })"
    :buttons="{
      primary: {
        label: $t('multi_address.remove.confirm'),
        tone: 'danger',
        onClick: confirm,
      },
      secondary: {
        label: $t('multi_address.remove.cancel'),
        onClick: () => (isOpen = false),
      },
    }"
  >
    <!-- Content Group L supporting style. -->
    <p
      data-test="delete-modal-description"
      class="px-4 text-text-base text-text-subtle sm:px-6"
    >
      {{ $t('multi_address.remove.subtitle', { name: displayName }) }}
    </p>
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
