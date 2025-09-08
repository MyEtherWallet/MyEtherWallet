<template>
  <app-dialog
    v-model:is-open="openWelcomeDialog"
    class="max-w-screen xs:max-w-[500px] mx-auto !min-h-[300px] rounded-32"
    title="Welcome to  version 7!"
  >
    <template #content>
      <div class="pl-6 sm:pl-8 pb-10 pt-2 welcome-gradient">
        <div class="flex flex-row mb-4">
          <div class="xs:min-w-[320px] max-w-[400px]">
            <p class="text-s-16 max-w-[600px] text-info">
              You are among the first to explore our Alpha version of the
              platform. Please keep in mind that this is an early version—some
              features may be incomplete or not working as expected. We are
              constantly improving.
            </p>
            <p class="text-s-16 mt-1 mb-6 text-info">Stay tuned for updates!</p>
          </div>
          <div class="max-w-[156px] rounded-16 flex items-center justify-end">
            <img
              src="@/assets/images/peggy/peggy.webp"
              alt=""
              width="135px"
              height="330px"
              class="scale-x-[-1] w-full"
            />
          </div>
        </div>
        <AppSubscribeToUpdates
          class="pr-6 sm:pr-8"
          @subscribed="openWelcomeDialog = false"
        />
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import AppDialog from '@/components/AppDialog.vue'
import AppSubscribeToUpdates from '@/components/AppSubscribeToUpdates.vue'

import { ref, onMounted } from 'vue'

const openWelcomeDialog = ref(false)

onMounted(() => {
  setTimeout(() => {
    openWelcomeDialog.value = true
  }, 1000)
})
</script>

<style scoped>
.welcome-gradient {
  background: linear-gradient(
    0deg,
    rgba(44, 91, 255, 0.24) 0%,
    rgba(0, 152, 166, 0) 100%
  );
}
</style>
