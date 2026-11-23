<template>
  <!-- Footer from AppModal's `buttons`: a Button Group (equal widths) under the
       centred header, with the design-library danger tone on the confirm. -->
  <app-modal
    v-model="isOpen"
    :title="$t('multi_address.remove.title', { name: displayName })"
    :subtitle="$t('multi_address.remove.subtitle', { name: displayName })"
    :buttons="{
      primary: {
        label: $t('multi_address.remove.confirm'),
        tone: 'danger',
        onClick: confirm,
      },
      tertiary: {
        label: $t('multi_address.remove.cancel'),
        onClick: () => (isOpen = false),
      },
    }"
  />
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
