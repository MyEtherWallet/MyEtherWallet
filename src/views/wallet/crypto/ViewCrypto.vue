<template>
  <div class="min-h-screen md:px-6 lg:px-8 space-y-4">
    <!-- <div class="flex flex-col gap-2">
      <div class="flex gap-2">
        <div class="flex flex-col gap-2">
          <module-ad-space />
          <module-education-space />
        </div>
      </div>
    </div> -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-2">
      <main class="relative rounded-2xl px-4 pb-4 space-y-3 col-span-4">
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
      <!-- <aside class="space-y-4 col-span-1">
        <module-ad-space v-if="false" />
        <module-recent-big-movers />
        <module-top-changes />
        <module-top-changes :losers="true" />
        <module-education-space />
      </aside> -->
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
