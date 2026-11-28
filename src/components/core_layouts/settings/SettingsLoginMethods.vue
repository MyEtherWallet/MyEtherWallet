<template>
  <div class="flex flex-col gap-6">
    <!-- Header: back + centered title -->
    <div class="relative flex min-h-8 items-center justify-center">
      <app-btn-icon
        size="s"
        :label="$t('common.back')"
        class="absolute left-0"
        @click="emit('back')"
      >
        <AppIcon name="chevron-left" size="s" />
      </app-btn-icon>
      <h3 class="text-heading-base text-black">
        {{ $t('settings.login_methods') }}
      </h3>
    </div>

    <section class="flex flex-col gap-2">
      <p class="text-label-sm text-text-subtle">
        {{ $t('settings.how_you_log_in') }}
      </p>
      <!-- data-private: the email must not reach session replay. -->
      <div data-private>
        <app-cell
          surface="alternative"
          size="small"
          :interactive="false"
          :title="method ? $t(`settings.login_method.${method}`) : ''"
          :description="email ?? ''"
        >
          <template #avatar>
            <span class="flex size-7 items-center justify-center">
              <AppIcon name="at-symbol" size="s" />
            </span>
          </template>
        </app-cell>
      </div>
    </section>

    <settings-passkeys />
  </div>
</template>

<script setup lang="ts">
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppCell from '@/components/cell/AppCell.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import SettingsPasskeys from '@/components/core_layouts/settings/SettingsPasskeys.vue'
import type { LoginMethod } from '@/stores/authStore'

/**
 * Settings › Login methods: how the connected Privy account logs in, and the
 * passkeys that guard its wallet.
 */
defineProps<{
  /** How the account logged in; null while it is not known. */
  method: LoginMethod | null
  /** The account's email; null while it is not known. */
  email: string | null
}>()

const emit = defineEmits<{
  back: []
}>()
</script>
