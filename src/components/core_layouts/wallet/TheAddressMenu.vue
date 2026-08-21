<template>
  <div class="relative">
    <address-trigger-pill
      ref="triggerRef"
      @click="isManageAccountsOpen = true"
    />
    <the-manage-accounts v-model:open-dialog="isManageAccountsOpen" :anchor="anchorEl" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type ComponentPublicInstance } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppLayoutStore } from '@/stores/appLayoutStore'
import TheManageAccounts from '@/components/core_layouts/wallet/TheManageAccounts.vue'
import AddressTriggerPill from '@/components/core_layouts/wallet/AddressTriggerPill.vue'

// Popup open state lives in the layout store so it survives header re-renders
// caused by network changes (a local ref would reset and close the popup).
const { isManageAccountsOpen } = storeToRefs(useAppLayoutStore())

defineProps({
  isBtnGroup: {
    type: Boolean,
    default: false,
  },
  hasLabel: {
    type: Boolean,
    default: true,
  },
})

/** -------------------------------
 * Dialog anchor
 -------------------------------*/
const triggerRef = ref<ComponentPublicInstance | HTMLElement | null>(null)
const anchorEl = computed<HTMLElement | null>(() => {
  const el = triggerRef.value
  if (!el) return null
  return ((el as ComponentPublicInstance).$el as HTMLElement) ?? (el as HTMLElement)
})
</script>
