<template>
  <div class="flex flex-col gap-3">
    <AccessCell :title="t('common.dont_have_wallet')">
      <template #avatar>
        <button
          type="button"
          data-testid="create-wallet-toggle"
          :aria-expanded="expanded"
          :aria-controls="expanded ? listId : undefined"
          :aria-label="t('access_wallet.sign_up.create_options')"
          class="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white transition-colors hover:bg-background-default-hover"
          @click="expanded = !expanded"
        >
          <AppIcon :name="expanded ? 'minus' : 'plus'" size="xs" />
        </button>
      </template>
      <template #trailing>
        <button
          type="button"
          data-testid="sign-up-cta"
          class="shrink-0 text-base font-semibold text-text-brand cursor-pointer"
          @click="accessStore.setCurrentView('sign_up')"
        >
          {{ t('access_wallet.sign_up.cta') }}
        </button>
      </template>
    </AccessCell>
    <AccessDownloadWallets v-if="expanded" :id="listId" hide-heading />
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/icon/AppIcon.vue'
import AccessCell from './AccessCell.vue'
import AccessDownloadWallets from './AccessDownloadWallets.vue'
import { useAccessStore } from '@/stores/accessStore'

/**
 * "Don't have a wallet?" row under the wallet chooser. Its + unfolds the two
 * MEW wallets a newcomer can create (MEW Mobile, Enkrypt); Sign Up opens the
 * Google / email login instead.
 *
 * `expanded` can be bound by the parent, so the list is still open when the
 * user comes back from the MEW Mobile download step.
 */
const expanded = defineModel<boolean>('expanded', { default: false })

const { t } = useI18n()
const accessStore = useAccessStore()
const listId = useId()
</script>
