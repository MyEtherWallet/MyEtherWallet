<template>
  <section v-if="canAdd || passkeys.length > 0" class="flex flex-col gap-2">
    <p class="text-label-sm text-text-subtle">
      {{ $t('settings.passkeys') }}
    </p>

    <p v-if="passkeys.length === 0" class="text-text-sm text-text-subtle">
      {{ $t('settings.passkeys_empty') }}
    </p>
    <div v-else class="flex flex-col gap-2">
      <app-cell
        v-for="passkey in passkeys"
        :key="passkey.credentialId"
        surface="alternative"
        size="small"
        :interactive="false"
        :title="passkey.name ?? $t('settings.passkey')"
        :description="addedOn(passkey)"
      >
        <template #avatar>
          <span class="flex size-7 items-center justify-center">
            <AppIcon name="key" size="s" />
          </span>
        </template>
        <template #action>
          <app-btn-icon
            size="s"
            :label="$t('settings.remove_passkey')"
            :disabled="busy"
            @click="remove(passkey.credentialId)"
          >
            <AppIcon name="trash" size="s" />
          </app-btn-icon>
        </template>
      </app-cell>
    </div>

    <!-- Removing the only passkey turns the check off: ask first. -->
    <div
      v-if="confirmingLast"
      class="flex flex-col gap-2 rounded-12 bg-background-default p-3"
    >
      <p class="text-text-sm text-text-default">
        {{ $t('settings.remove_last_passkey') }}
      </p>
      <div class="flex justify-end gap-4">
        <app-base-button type="link" @click="confirmingLast = null">
          {{ $t('common.cancel') }}
        </app-base-button>
        <app-base-button type="link" tone="danger" @click="confirmRemove">
          {{ $t('settings.remove') }}
        </app-base-button>
      </div>
    </div>

    <!-- A passkey that was made but is not yet the check protects nothing. -->
    <div
      v-if="hasInactive"
      class="flex items-center justify-between gap-3 rounded-12 bg-background-default p-3"
    >
      <p class="text-text-sm text-text-default">
        {{ $t('settings.passkey_not_active') }}
      </p>
      <app-base-button type="link" :disabled="busy" @click="activate">
        {{ $t('settings.activate_passkey') }}
      </app-base-button>
    </div>

    <p v-if="failed" role="alert" class="text-text-sm text-text-error">
      {{ $t('settings.passkey_error') }}
    </p>

    <app-base-button
      v-if="canAdd"
      class="w-full"
      :is-loading="adding"
      :disabled="busy"
      @click="add"
    >
      {{ $t('settings.add_passkey') }}
    </app-base-button>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppCell from '@/components/cell/AppCell.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import type { PasskeyEntry } from '@/providers/privy/passkeyList'
import { passkeySupported } from '@/providers/privy/passkeySupport'
import { useAuthStore } from '@/stores/authStore'
import { isUserRejectionError } from '@/utils/walletUtils'

/**
 * Settings › Login methods › Passkeys: the Privy account's passkeys, with
 * adding and removing them. A passkey here is the check Privy asks for before
 * the wallet is used, not a way to log in. An account may hold several.
 *
 * Credential ids stay in script: they are never rendered, in text or in an
 * attribute.
 */
const authStore = useAuthStore()
const { passkeys } = storeToRefs(authStore)
const { t, locale } = useI18n()

const canAdd = passkeySupported()

const busy = ref(false)
const adding = ref(false)
const failed = ref(false)
/** The credential waiting for the user to confirm removing their last passkey. */
const confirmingLast = ref<string | null>(null)

const hasInactive = computed(() =>
  passkeys.value.some(passkey => !passkey.active),
)

const addedOn = (passkey: PasskeyEntry): string =>
  passkey.addedAt === null
    ? ''
    : t('settings.passkey_added_on', {
        date: new Date(passkey.addedAt * 1000).toLocaleDateString(locale.value),
      })

/**
 * Run one passkey operation. A prompt the user dismissed, whether the
 * browser's own or Privy's passkey check, is not a failure to report.
 */
const run = async (operation: () => Promise<unknown>): Promise<void> => {
  busy.value = true
  failed.value = false
  try {
    await operation()
  } catch (error) {
    failed.value = !isUserRejectionError(error)
  } finally {
    busy.value = false
  }
}

const add = async (): Promise<void> => {
  adding.value = true
  await run(() => authStore.addPasskey('settings'))
  adding.value = false
}

const remove = (credentialId: string): void => {
  if (passkeys.value.length === 1) {
    confirmingLast.value = credentialId
    return
  }
  void run(() => authStore.removePasskey(credentialId))
}

const confirmRemove = (): void => {
  const credentialId = confirmingLast.value
  confirmingLast.value = null
  if (credentialId) void run(() => authStore.removePasskey(credentialId))
}

const activate = (): Promise<void> =>
  run(() => authStore.activatePasskeys('settings'))
</script>
