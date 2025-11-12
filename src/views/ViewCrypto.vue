<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-12 w-full gap-4">
      <module-crypto-overview class="col-span-12" />
      <module-explore-crypto class="col-span-12" />
    </div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import ModuleExploreCrypto from '@/modules/crypto/ModuleExploreCrypto.vue'
import ModuleCryptoOverview from '@/modules/crypto/ModuleCryptoOverview.vue'
</script>
