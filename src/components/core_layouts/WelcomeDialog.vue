<template>
  <app-dialog
    v-model:is-open="openWelcomeDialog"
    class="max-w-screen xs:max-w-[500px] mx-auto !min-h-[300px] rounded-32"
    title="Welcome to the new MEW Portfolio!"
  >
    <template #content>
      <div class="pl-6 sm:pl-8 pb-10 pt-2 welcome-gradient">
        <div class="flex flex-row mb-4">
          <div class="xs:min-w-[320px] max-w-[400px]">
            <p class="text-s-16 max-w-[600px] text-info">
              Now you can manage all your crypto, tokenized stocks, and ETFs in
              one place, no brokerage required.
            </p>
            <p class="text-s-16 max-w-[600px] text-info mt-2">
              We hope you will love the new dashboard and features. Meanwhile,
              if you're feeling nostalgic, you can still find the previous
              version of MEW
              <a
                :href="configs.VINATGE"
                target="_blank"
                class="underline hover:text-black transition-colors"
                >here</a
              >.
            </p>
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
import { ref, onMounted, watch } from 'vue'
import configs from '@/configs'
const openWelcomeDialog = ref(false)
const emit = defineEmits<{
  (e: 'close-welcome-dialog'): void
}>()
onMounted(() => {
  setTimeout(() => {
    openWelcomeDialog.value = true
  }, 1000)
})

watch(openWelcomeDialog, newVal => {
  if (!newVal) {
    emit('close-welcome-dialog')
  }
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
