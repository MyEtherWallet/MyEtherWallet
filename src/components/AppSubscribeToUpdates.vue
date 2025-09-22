<template>
  <div class="flex flex-col justify-center max-w-[490px] w-full">
    <app-input
      v-model="email"
      placeholder="Enter your email"
      type="email"
      :error-message="emailErrorMessage"
    />
    <app-base-button
      variant="primary"
      class="max-w-[200px] mx-auto"
      @click="subscribe"
      :is-loading="isLoading"
      is-required
    >
      Notify me
    </app-base-button>
  </div>
</template>
<script setup lang="ts">
import AppInput from '@/components/AppInput.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { useEmailSubscription } from '@/composables/useEmailSubscription'
const emit = defineEmits<{
  (e: 'subscribed'): void
}>()
const { email, subscribeToUpdates, isLoading, emailErrorMessage } =
  useEmailSubscription()

const subscribe = async () => {
  const resp = await subscribeToUpdates()
  if (resp) {
    emit('subscribed')
  }
}
</script>
