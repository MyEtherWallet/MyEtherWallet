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
    <h1 class="text-7xl my-10 text-center">Oops! Page not found.</h1>
    <h2 class="text-2xl mt-5 text-center text-mew-green-text">
      We can't seem to find the page you are looking for.
    </h2>
    <router-link
      :to="{ name: ROUTES_MAIN.HOME.NAME }"
      class="bg-mew-green-text rounded-md w-40 mx-auto text-white py-5 block text-center mt-5"
    >
      Go back to home
    </router-link>
  </main>
</template>
<script setup lang="ts">
import { ROUTES_MAIN } from '@/router/routeNames'
</script>
