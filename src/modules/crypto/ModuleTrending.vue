<template>
  <!-- Top: Trending -->
  <header class="rounded-2xl pb-4">
    <h2 class="text-s-32 mb-3">Trending</h2>
    <div class="grid grid-flow-col auto-cols-fr gap-3">
      <div
        v-for="n in 6"
        :key="n"
        class="h-7 bg-white border rounded-full bg-grey-8 cursor-pointer"
        :class="{ 'animate-pulse': true }"
      ></div>
    </div>
  </header>
</template>
