<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-12 w-full gap-4">
      <div class="flex flex-col gap-6 lg:gap-3 col-span-12 lg:col-span-3">
        <module-trending />
      </div>
      <module-explore-crypto class="col-span-12 lg:col-span-9" />
    </div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import ModuleTrending from '@/modules/crypto/ModuleTrending.vue'
import ModuleExploreCrypto from '@/modules/crypto/ModuleExploreCrypto.vue'
</script>
