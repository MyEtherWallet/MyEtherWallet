<template>
  <div class="flex flex-col items-center gap-1.5 w-full">
    <p class="text-[10px] leading-4 text-info text-center">
      {{ $t('purchase.payment_methods_list') }}
    </p>
    <div class="flex items-center gap-1">
      <img
        v-for="icon in icons"
        :key="icon.alt"
        :src="icon.src"
        :alt="icon.alt"
        class="h-[18px] w-auto"
        height="18"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PAYMENT_METHOD_BANNER_ICONS as icons } from '../helpers/purchaseProviders'
</script>
