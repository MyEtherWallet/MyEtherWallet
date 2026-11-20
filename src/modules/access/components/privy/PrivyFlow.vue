<template>
  <AccessSignUp
    v-if="state === 'entry'"
    :email-error="emailError ? t(emailError) : undefined"
    @sign-up="onSignUp"
  />

  <!-- Provisional: design has not delivered this prompt yet. -->
  <PrivyScreen
    v-else-if="state === 'existing_login'"
    :title="
      existingEmail
        ? t('access_wallet.social.existing.title', { email: existingEmail })
        : t('access_wallet.social.existing.title_no_email')
    "
    :description="t('access_wallet.social.existing.description')"
    under-modal-title
    private-title
  >
    <template #icon>
      <AppIconContainer icon="user-circle" tone="info" />
    </template>
    <div class="flex w-full flex-col items-center gap-3">
      <AppBaseButton
        data-testid="continue-as"
        class="w-full"
        :disabled="busy"
        @click="continueAsExisting()"
      >
        {{ t('access_wallet.social.existing.continue') }}
      </AppBaseButton>
      <AppBaseButton
        data-testid="different-account"
        type="link"
        :disabled="busy"
        @click="useDifferentAccount()"
      >
        {{ t('access_wallet.social.existing.different') }}
      </AppBaseButton>
      <!-- This screen stands in for the entry screen and its wallet row, so
           it leads to the wallets too. The login is left as it is: someone
           logged in with Google can add a Ledger beside it. Not while one of
           the actions above is under way: it would carry on behind the
           wallet chooser. -->
      <AppBaseButton
        data-testid="existing-other-methods"
        type="link"
        :disabled="busy"
        @click="accessStore.setCurrentView('default')"
      >
        {{ t('access_wallet.social.other_methods') }}
      </AppBaseButton>
    </div>
  </PrivyScreen>

  <PrivyScreen
    v-else-if="state === 'google.verifying' || state === 'google.connected'"
    :title="
      t(
        state === 'google.connected'
          ? 'access_wallet.social.google.connected_title'
          : 'access_wallet.social.google.verifying_title',
      )
    "
    :description="
      t(
        state === 'google.connected'
          ? 'access_wallet.social.google.connected_description'
          : 'access_wallet.social.google.verifying_description',
      )
    "
  >
    <template #icon>
      <img :src="GoogleLogo" alt="" width="32" height="32" />
    </template>
  </PrivyScreen>

  <PrivyEmailCode
    v-else-if="codeStatus"
    :email="email"
    :status="codeStatus"
    :resend-in="resendIn"
    :locked="codeLocked"
    :busy="busy"
    @complete="submitCode"
    @resend="resendCode()"
  />

  <PrivyScreen
    v-else-if="state === 'wallet.setup'"
    :title="t('access_wallet.social.wallet_setup.title')"
    :description="t('access_wallet.social.wallet_setup.description')"
  >
    <template #icon>
      <AppSpinner :size="24" />
    </template>
  </PrivyScreen>

  <PrivyScreen
    v-else-if="state === 'account.ready'"
    :title="t('access_wallet.social.account_ready.title')"
    :description="t('access_wallet.social.account_ready.description')"
  >
    <template #icon>
      <AppIconContainer icon="check-circle" tone="success" />
    </template>
    <div class="flex w-full flex-col gap-3">
      <AppBaseButton
        data-testid="create-account-only"
        type="secondary"
        class="w-full"
        @click="chooseOptIn(false)"
      >
        {{ t('access_wallet.social.account_ready.create_only') }}
      </AppBaseButton>
      <AppBaseButton
        data-testid="get-updates"
        class="w-full"
        @click="chooseOptIn(true)"
      >
        {{ t('access_wallet.social.account_ready.get_updates') }}
      </AppBaseButton>
    </div>
  </PrivyScreen>

  <PrivyScreen
    v-else-if="state === 'error'"
    :title="t(ERROR_TITLE[errorKind ?? 'generic'])"
    :description="t('access_wallet.social.error.description')"
  >
    <template #icon>
      <AppIconContainer icon="exclamation-circle" tone="error" />
    </template>
    <div class="flex w-full flex-col gap-3">
      <AppBaseButton
        data-testid="try-again"
        class="w-full"
        :disabled="busy"
        @click="retry()"
      >
        {{ t('access_wallet.social.error.try_again') }}
      </AppBaseButton>
      <AppBaseButton
        data-testid="use-wallet"
        type="secondary"
        class="w-full"
        @click="useWallet"
      >
        {{ t('access_wallet.social.error.use_wallet') }}
      </AppBaseButton>
    </div>
  </PrivyScreen>
</template>

<script setup lang="ts">
// The Google / email login flow inside the connect modal's sign-up view
// (MEW-2289). One screen per state of usePrivyOnboarding; the entry screen is
// the existing AccessSignUp.
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppIconContainer from '@/components/icon_container/AppIconContainer.vue'
import AppSpinner from '@/components/spinner/AppSpinner.vue'
import GoogleLogo from '@/assets/images/access/google.svg'
import { useWalletFlowRoute } from '@/composables/useWalletFlowRoute'
import type { OnboardingError } from '@/modules/access/common/privyOnboarding'
import { usePrivyOnboarding } from '@/modules/access/composables/usePrivyOnboarding'
import { useAccessStore } from '@/stores/accessStore'
import AccessSignUp, { type SignUpPayload } from '../AccessSignUp.vue'
import PrivyEmailCode from './PrivyEmailCode.vue'
import PrivyScreen from './PrivyScreen.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const accessStore = useAccessStore()
const { hostRouteName } = useWalletFlowRoute()
const {
  state,
  email,
  existingEmail,
  errorKind,
  emailError,
  resendIn,
  codeLocked,
  busy,
  enter,
  continueAsExisting,
  useDifferentAccount,
  chooseGoogle,
  chooseEmail,
  submitCode,
  resendCode,
  chooseOptIn,
  retry,
  cancel,
} = usePrivyOnboarding()

onMounted(() => void enter())

/**
 * The page under the modal, without the modal's own query keys: where the
 * browser comes back to after the Google redirect.
 */
const returnTo = (): string => {
  const query = { ...route.query }
  delete query.type
  delete query.walletTab
  delete query.walletNetwork
  return router.resolve({
    name: hostRouteName.value,
    params: route.params,
    query,
  }).fullPath
}

const onSignUp = (payload: SignUpPayload): void => {
  if (payload.method === 'google') void chooseGoogle(returnTo())
  else void chooseEmail(payload.email)
}

const CODE_STATUS = {
  'email.code': 'default',
  'email.code.error': 'error',
  'email.code.success': 'success',
} as const
const codeStatus = computed(
  () => CODE_STATUS[state.value as keyof typeof CODE_STATUS],
)

const ERROR_TITLE: Record<OnboardingError, string> = {
  google: 'access_wallet.social.error.google_title',
  timeout: 'access_wallet.social.error.timeout_title',
  wallet: 'access_wallet.social.error.wallet_title',
  storage: 'access_wallet.social.error.storage_title',
  generic: 'access_wallet.social.error.generic_title',
}

/** "Continue with a wallet": leave the flow for the wallet chooser. */
const useWallet = (): void => {
  void cancel()
  accessStore.setCurrentView('default')
}
</script>
