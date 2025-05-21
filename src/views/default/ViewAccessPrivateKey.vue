<template>
  <main class="flex justify-center w-full">
    <AppSheet
      :title="$t('access_wallet_private_key.title')"
      :sheet-class="'max-w-[624px]'"
      :title-class="'text-center'"
    >
      <!-- TODO add proper link arrow icon?-->
      <div class="flex justify-center">
        <router-link
          :to="{ name: ROUTES_ACCESS.ACCESS.NAME }"
          class="text-center underline text-sm mb-8 mx-auto"
          >or select another access method
        </router-link>
      </div>
      <ModuleAccessPrivateKey />
    </AppSheet>
  </main>
</template>
<script setup lang="ts">
import AppSheet from '@/components/AppSheet.vue'
import { ROUTES_ACCESS } from '@/router/routeNames'
import ModuleAccessPrivateKey from '@/modules/access/ModuleAccessPrivateKey.vue'
</script>
