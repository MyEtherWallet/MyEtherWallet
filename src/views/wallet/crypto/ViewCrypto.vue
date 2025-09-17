<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-12 w-full gap-6">
      <div class="flex flex-col gap-6 lg:gap-3 col-span-12 lg:col-span-3">
        <module-ad-space />
        <module-trending />
      </div>
      <module-explore-crypto class="col-span-12 lg:col-span-9" />
    </div>
    <div class="grid grid-cols-5 gap-4">
      <module-education-space :full="true" class="col-span-2" />
      <module-ad-space-banner class="col-span-3" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ModuleAdSpace from '@/modules/crypto/ModuleAdSpace.vue'
import ModuleAdSpaceBanner from '@/modules/crypto/ModuleAdSpaceBanner.vue'
import ModuleEducationSpace from '@/modules/crypto/ModuleEducationSpace.vue'
import ModuleTrending from '@/modules/crypto/ModuleTrending.vue'
import ModuleExploreCrypto from '@/modules/crypto/ModuleExploreCrypto.vue'
</script>
