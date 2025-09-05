<template>
  <div class="min-h-screen space-y-4">
    <div>
      <main class="relative rounded-2xl px-4 pb-4 space-y-3">
        <div class="flex gap-4">
          <div class="flex flex-col gap-2">
            <module-ad-space />
            <module-education-space />
          </div>
          <module-trending />
        </div>
        <module-explore-crypto />
        <div class="flex gap-4">
          <module-education-space :full="true" />
          <module-ad-space-banner />
        </div>
      </main>
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
