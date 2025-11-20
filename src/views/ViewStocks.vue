<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-12 w-full gap-4">
      <module-stock-indexes class="col-span-12" />
    </div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import ModuleStockIndexes from '@/modules/stocks/ModuleStockIndexes.vue'
</script>
