<template>
  <div class="flex flex-col gap-6">
    <section
      v-if="showSocialLogin"
      class="flex flex-col gap-4 rounded-16 bg-background-default p-5"
    >
      <!-- The embedded wallet is Ethereum-only: with Bitcoin selected only
           the wallet row is offered. -->
      <template v-if="!isBitcoinChain">
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
          :error-message="emailError"
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
              type="secondary"
              size="small"
              :disabled="!isValidEmail"
              @click="submitEmail"
            >
              {{ t('access_wallet.sign_up.continue') }}
            </AppBaseButton>
          </template>
        </AppInput>
        <i18n-t
          keypath="access_wallet.social.terms"
          tag="p"
          scope="global"
          class="text-center text-xs text-text-subtle"
        >
          <template #terms>
            <a
              data-testid="terms-link"
              :href="configs.TERMS_OF_SERVICE_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="font-semibold text-text-default underline"
              >{{ t('access_wallet.social.terms_link') }}</a
            >
          </template>
          <template #privacy>
            <a
              data-testid="privacy-link"
              :href="configs.PRIVACY_POLICY_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="font-semibold text-text-default underline"
              >{{ t('access_wallet.social.privacy_link') }}</a
            >
          </template>
        </i18n-t>
      </template>
      <SignUpWalletRow />
      <PrivyProtectedBy v-if="!isBitcoinChain" />
    </section>
    <AccessDownloadWallets />
  </div>
</template>

<script lang="ts">
export type SignUpPayload =
  { method: 'google' } | { method: 'email'; email: string }
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppDivider from '@/components/divider/AppDivider.vue'
import AppInput from '@/components/AppInput.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import GoogleLogo from '@/assets/images/access/google.svg'
import AccessDownloadWallets from './AccessDownloadWallets.vue'
import SignUpWalletRow from './SignUpWalletRow.vue'
import PrivyProtectedBy from './privy/PrivyProtectedBy.vue'
import configs from '@/configs'
import { useAccessStore } from '@/stores/accessStore'

/**
 * Entry screen of the Google / email login (Figma Onboarding, Variant A). It
 * only reports what the user chose; PrivyFlow runs the login.
 */
defineProps<{
  /** Why the code could not be sent, shown under the email field. */
  emailError?: string
}>()
const emit = defineEmits<{ 'sign-up': [payload: SignUpPayload] }>()
const { t } = useI18n()
const showSocialLogin = configs.SHOW_SOCIAL_LOGIN
const accessStore = useAccessStore()
const isBitcoinChain = computed(() => accessStore.isBitcoinChain)

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
