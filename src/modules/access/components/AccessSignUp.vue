<template>
  <div class="flex flex-col gap-6">
    <section class="flex flex-col gap-4 rounded-16 bg-background-default p-5">
      <AppBaseButton
        data-testid="google"
        class="w-full"
        @click="emit('sign-up', { method: 'google' })"
      >
        <span class="flex items-center justify-center gap-2">
          <span
            class="flex size-6 items-center justify-center rounded-full bg-white"
          >
            <img :src="GoogleLogo" alt="" width="16" height="16" />
          </span>
          {{ t('access_wallet.sign_up.google') }}
        </span>
      </AppBaseButton>
      <div class="flex items-center gap-3 text-xs text-text-subtle">
        <AppDivider class="grow" />
        <span>{{ t('access_wallet.sign_up.or') }}</span>
        <AppDivider class="grow" />
      </div>
      <AppInput
        v-model="email"
        type="email"
        surface="alternative"
        :label="t('access_wallet.sign_up.email_label')"
        :placeholder="t('access_wallet.sign_up.email_placeholder')"
        :submit-disabled="!isValidEmail"
        @enter="submitEmail"
      >
        <template #leading>
          <AppAvatar type="icon" size="m">
            <template #icon><AppIcon name="envelope" size="xs" /></template>
          </AppAvatar>
        </template>
        <template #trailing>
          <AppBaseButton
            data-testid="email-continue"
            theme="secondary"
            size="small"
            :disabled="!isValidEmail"
            @click="submitEmail"
          >
            {{ t('access_wallet.sign_up.continue') }}
          </AppBaseButton>
        </template>
      </AppInput>
      <p
        class="flex items-center justify-center gap-1 text-xs text-text-subtle"
      >
        {{ t('access_wallet.sign_up.protected_by') }}
        <img :src="PrivyLogo" alt="Privy" class="h-3" />
      </p>
    </section>
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
  </div>
</template>

<script lang="ts">
export type SignUpPayload =
  | { method: 'google' }
  | { method: 'email'; email: string }
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppDivider from '@/components/divider/AppDivider.vue'
import AppInput from '@/components/AppInput.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AccessCell from './AccessCell.vue'
import GoogleLogo from '@/assets/images/access/google.svg'
import PrivyLogo from '@/assets/images/access/privy.svg'
import MewLogo from '@/assets/images/access/mew-app.webp'
import EnkryptLogo from '@/assets/images/access/enkrypt.webp'
import { walletConfigs } from '@/modules/access/common/walletConfigs'
import { useAccessStore } from '@/stores/accessStore'

/** Google / email sign-up is handed to Privy by MEW-2289; nothing listens yet. */
const emit = defineEmits<{ 'sign-up': [payload: SignUpPayload] }>()
const { t } = useI18n()
const accessStore = useAccessStore()

const email = ref('')
// Shape check only; Privy validates the address for real.
const isValidEmail = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()),
)
const submitEmail = () => {
  if (!isValidEmail.value) return
  emit('sign-up', { method: 'email', email: email.value.trim() })
}
</script>
