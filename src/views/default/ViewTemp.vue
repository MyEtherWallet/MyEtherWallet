<template>
  <div class="flex items-center flex-col text-center">
    <h1 class="mt-10 title3 pt-10">Coming soon</h1>
    <p class="text-s-16 mt-6">This is an Alpha Version of MyEtherWallet V7.</p>
    <p class="text-s-16 mt-1">
      We are working hard to bring you the best experience possible.
    </p>
    <p class="text-s-16 mt-1 mb-10">Stay tuned for updates!</p>
    <div class="flex flex-col justify-center max-w-[490px] w-full">
      <app-input
        placeholder="Enter your email"
        type="email"
        name="email"
        id="email"
        autocomplete="email"
      />
      <app-base-button variant="primary" class="max-w-[200px] mx-auto">
        Notify me
      </app-base-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import AppInput from '@/components/AppInput.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
</script>
