<template>
  <main class="w-[650px] mx-auto">
    <img
      src="@/assets/images/backgrounds/bg-404.svg"
      alt="404"
      class="h-96 mx-auto mt-10"
      height="847"
      width="1666"
      aria-label=""
    />
    <h1 class="text-7xl my-10 text-center">{{ $t('not_found_page.title') }}</h1>
    <h2 class="text-2xl mt-5 text-center text-success">
      {{ $t('not_found_page.subtitle') }}
    </h2>
    <router-link
      :to="{ name: ROUTES_MAIN.HOME.NAME }"
      class="bg-success rounded-md w-40 mx-auto text-fg-on-fill py-5 block text-center mt-5"
    >
      {{ $t('not_found_page.go_home') }}
    </router-link>
  </main>
</template>
<script setup lang="ts">
import { ROUTES_MAIN } from '@/router/routeNames'
</script>
