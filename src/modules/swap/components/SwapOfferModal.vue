<template>
  <app-dialog v-model:is-open="model" title="Swap">
    <template #content>
      <div>
        <!-- Placeholder for provider name -->
        <h3>Best offer from *Provider Name*</h3>
        <p>
          for
          <!-- Placeholder for token details -->
          <img :src="ethSvg" alt="ETH" class="inline-block w-4 h-4" />
          <span class="font-bold">*TokenAmount* *TokenSymbol*</span> you will
          get:
        </p>
      </div>
    </template>
  </app-dialog>
</template>

<script lang="ts" setup>
import AppDialog from '@/components/AppDialog.vue'
import ethSvg from '@/assets/icons/tokens/eth.svg' // Placeholder for token icon

const model = defineModel('swapOfferOpen', {
  type: Boolean,
  required: true,
  default: false,
})
</script>
