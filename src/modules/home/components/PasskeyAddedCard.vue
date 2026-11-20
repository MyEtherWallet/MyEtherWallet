<template>
  <passkey-floating-card
    v-if="passkeyAdded"
    :title="$t('homePage.passkeyAdded.title')"
    @close="authStore.acknowledgePasskeyAdded()"
  >
    <div class="flex items-center justify-center" aria-hidden="true">
      <span
        class="flex size-12 items-center justify-center rounded-full bg-background-brand-subtle text-text-brand"
      >
        <AppIcon name="device-phone-mobile" size="m" />
      </span>
      <span
        class="relative -ml-2 flex size-12 items-center justify-center rounded-full bg-background-brand-subtle text-text-brand ring-2 ring-background-contrast-default"
      >
        <AppIcon name="face-id" size="m" />
        <AppIcon
          name="check-circle"
          variant="filled"
          size="s"
          class="absolute -bottom-1 -right-1 rounded-full bg-background-contrast-default text-text-success"
        />
      </span>
    </div>

    <p class="text-center text-text-base">
      {{ $t('homePage.passkeyAdded.body') }}
    </p>

    <app-base-button
      class="w-full"
      @click="authStore.acknowledgePasskeyAdded()"
    >
      {{ $t('common.got_it') }}
    </app-base-button>
  </passkey-floating-card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import { useAuthStore } from '@/stores/authStore'
import PasskeyFloatingCard from './PasskeyFloatingCard.vue'

/**
 * Confirms that a passkey was added, wherever the user is when it finishes:
 * from the Home prompt or from Settings.
 */
const authStore = useAuthStore()
const { passkeyAdded } = storeToRefs(authStore)
</script>
