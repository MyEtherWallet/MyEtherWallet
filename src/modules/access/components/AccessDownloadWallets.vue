<template>
  <section class="flex flex-col gap-3">
    <h3 class="text-sm font-semibold">
      {{ t('access_wallet.sign_up.download_official') }}
    </h3>
    <div class="grid grid-cols-1 gap-3 xs:grid-cols-2">
      <AccessCell
        as="button"
        type="button"
        data-testid="download-mew-mobile"
        title="MEW Mobile"
        :description="t('access_wallet.sign_up.ios_android')"
        @click="accessStore.setCurrentView('download_mobile')"
      >
        <template #avatar>
          <AppAvatar type="wallet" size="m" :url="MewLogo" name="MEW Mobile" />
        </template>
        <template #trailing>
          <AppIcon name="qr-code" size="s" class="text-text-subtle" />
        </template>
      </AccessCell>
      <AccessCell
        as="a"
        data-testid="download-enkrypt"
        title="Enkrypt"
        :description="t('access_wallet.sign_up.browser_extension')"
        :href="walletConfigs.enkrypt.downloadUrls?.browserExtension"
        target="_blank"
        rel="noopener noreferrer"
      >
        <template #avatar>
          <AppAvatar type="wallet" size="m" :url="EnkryptLogo" name="Enkrypt" />
        </template>
        <template #trailing>
          <AppIcon
            name="arrow-top-right-on-square"
            size="s"
            class="text-text-subtle"
          />
        </template>
      </AccessCell>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AccessCell from './AccessCell.vue'
import MewLogo from '@/assets/images/access/mew-app.webp'
import EnkryptLogo from '@/assets/images/access/enkrypt.webp'
import { walletConfigs } from '@/modules/access/common/walletConfigs'
import { useAccessStore } from '@/stores/accessStore'

const { t } = useI18n()
const accessStore = useAccessStore()
</script>
