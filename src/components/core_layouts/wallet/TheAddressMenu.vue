<template>
  <div class="relative">
    <address-trigger-pill
      v-if="isWalletConnected && walletAddress"
      ref="triggerRef"
      @click="setOpenDialog(true)"
    />
    <the-manage-accounts v-model:open-dialog="openDialog" :anchor="anchorEl" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type ComponentPublicInstance } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '@/stores/walletStore'
import TheManageAccounts from '@/components/core_layouts/wallet/TheManageAccounts.vue'
import AddressTriggerPill from '@/components/core_layouts/wallet/AddressTriggerPill.vue'

const store = useWalletStore()
const { isWalletConnected, walletAddress } = storeToRefs(store)

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
 * Dialog
 -------------------------------*/
const openDialog = ref(false)
const triggerRef = ref<ComponentPublicInstance | HTMLElement | null>(null)
const anchorEl = computed<HTMLElement | null>(() => {
  const el = triggerRef.value
  if (!el) return null
  return ((el as ComponentPublicInstance).$el as HTMLElement) ?? (el as HTMLElement)
})
const setOpenDialog = (value: boolean) => {
  openDialog.value = value
}
</script>
