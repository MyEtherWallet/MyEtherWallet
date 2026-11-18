<template>
  <passkey-floating-card
    v-if="isVisible"
    :title="$t('homePage.passkeyPrompt.title')"
    @close="onDismiss"
  >
    <div
      class="flex items-center gap-3 rounded-12 bg-background-contrast-hover p-3"
    >
      <AppIcon name="shield-check" size="s" class="shrink-0" />
      <p class="text-label-sm">{{ $t('homePage.passkeyPrompt.benefit') }}</p>
    </div>

    <p v-if="failed" role="alert" class="text-center text-text-sm">
      {{ $t('homePage.passkeyPrompt.error') }}
    </p>

    <app-base-button class="w-full" :is-loading="adding" @click="add">
      {{ $t('homePage.passkeyPrompt.add') }}
    </app-base-button>
  </passkey-floating-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { analytics } from '@/analytics'
import { AccountSecurityEvent } from '@/analytics/events'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import { useAuthStore } from '@/stores/authStore'
import { usePasskeyPrompt } from '../composables/usePasskeyPrompt'
import PasskeyFloatingCard from './PasskeyFloatingCard.vue'

/**
 * Home's invitation to add a passkey, shown to a Privy account once its
 * wallet holds funds. A passkey guards the wallet's actions; it does not log
 * the user in, so the card promises no login.
 */
const authStore = useAuthStore()
const { isVisible, awaitsActivation, dismiss } = usePasskeyPrompt()

const adding = ref(false)
const failed = ref(false)

watch(
  isVisible,
  visible => {
    if (visible) {
      void analytics.trackAccountSecurityEvent(
        AccountSecurityEvent.PASSKEY_PROMPT_VIEWED,
      )
    }
  },
  { immediate: true },
)

// Once a passkey protects the wallet the prompt is no longer due, and the
// card goes by itself; a dismissed browser prompt resolves and leaves the card
// as it was. A passkey that was made but could not be made the check keeps
// the card, with the error, and the next press finishes that passkey.
const add = async (): Promise<void> => {
  adding.value = true
  failed.value = false
  try {
    if (awaitsActivation.value) await authStore.activatePasskeys('home_prompt')
    else await authStore.addPasskey('home_prompt')
  } catch {
    failed.value = true
  } finally {
    adding.value = false
  }
}

const onDismiss = (): void => {
  dismiss()
  void analytics.trackAccountSecurityEvent(
    AccountSecurityEvent.PASSKEY_PROMPT_DISMISSED,
  )
}
</script>
