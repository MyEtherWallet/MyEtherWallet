<template>
  <div class="flex items-center flex-col">
    <router-view />
    <h1 class="mt-10 title3 pt-10 text-center">{{ $t('common.coming_soon') }}</h1>
    <p class="text-s-16 mt-6 text-center">{{ $t('coming_soon_page.pardon') }}</p>
    <p class="text-s-16 mt-1 text-center">
      {{ $t('coming_soon_page.working_on') }}
    </p>
    <p class="text-s-16 mt-1 mb-10 text-center">
      {{ $t('coming_soon_page.access_staked') }}
      <a :href="configs.VINATGE" target="_blank" rel="noopener noreferrer" class="underline group"
        >{{ $t('coming_soon_page.previous_version') }}
        <arrow-long-right-icon
          class="w-5 h-5 text-black inline-block group-hover:translate-x-1 transition-transform"
      /></a>
    </p>
    <AppSubscribeToUpdates />
  </div>
</template>
<script setup lang="ts">
import AppSubscribeToUpdates from '@/components/AppSubscribeToUpdates.vue'
import { ArrowLongRightIcon } from '@heroicons/vue/24/solid'

import configs from '@/configs'
</script>
