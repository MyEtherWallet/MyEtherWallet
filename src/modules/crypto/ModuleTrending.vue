<template>
  <!-- Top: Trending -->
  <header class="bg-white border rounded-2xl p-4 shadow-sm">
    <h2 class="font-semibold mb-3">Trending</h2>
    <div class="grid grid-flow-col auto-cols-fr gap-3">
      <span v-for="n in 6" :key="n" class="h-7 rounded-full bg-indigo-100" />
    </div>
  </header>
</template>
