<template>
  <app-view-as-dialog>
    <template #title>
      <h2 class="text-lg font-medium">Token Information</h2>
    </template>
    <template #content>
      <div class="my-10 flex flex-col gap-6">
        <p>hello</p>
      </div>
    </template>
  </app-view-as-dialog>
</template>

<script setup lang="ts">
import AppViewAsDialog from '@/components/AppViewAsDialog.vue'
import { onMounted } from 'vue'

defineProps({
  networkId: {
    type: String,
    required: true,
  },
  tokenId: {
    type: String,
    required: true,
  },
})
onMounted(() => {
  console.log('Mounted ViewTokenInfo.vue')
})
</script>
