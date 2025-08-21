<template>
  <div class="min-h-screen -5 md:p-6 lg:p-8 space-y-4">
    <div class="grid grid-cols-1 lg:grid-cols-[400px_minmax(0,1fr)] gap-4">
      <!-- Left Sidebar -->
      <aside class="space-y-4">
        <module-ad-space />
        <module-recent-big-movers />
        <module-top-gainers />
        <module-top-losers />
        <module-education-space />
      </aside>

      <!-- Main Content -->
      <main class="relative rounded-2xl px-4 pb-4 space-y-3">
        <module-trending />
        <module-explore-crypto />

        <module-ad-space-banner />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import ModuleAdSpace from '@/modules/crypto/ModuleAdSpace.vue'
import ModuleAdSpaceBanner from '@/modules/crypto/ModuleAdSpaceBanner.vue'
import ModuleRecentBigMovers from '@/modules/crypto/ModuleRecentBigMovers.vue'
import ModuleTopGainers from '@/modules/crypto/ModuleTopGainers.vue'
import ModuleTopLosers from '@/modules/crypto/ModuleTopLosers.vue'
import ModuleEducationSpace from '@/modules/crypto/ModuleEducationSpace.vue'
import ModuleTrending from '@/modules/crypto/ModuleTrending.vue'
import ModuleExploreCrypto from '@/modules/crypto/ModuleExploreCrypto.vue'
</script>
